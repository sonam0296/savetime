import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Card, Container, CardActionArea, TextField, Typography, InputBase, IconButton, MenuItem, CardActions, CardContent, CardMedia, Button, Grid } from '@material-ui/core';
import PhoneIcon from '@material-ui/icons/Phone';
import SearchIcon from '@material-ui/icons/Search';
import {useHistory} from "react-router-dom";
import './maindashboard.css'
import { useSelector,useDispatch } from 'react-redux'
import 'react-multi-carousel/lib/styles.css';
import Carousel from 'react-multi-carousel';

import requests from '../../requests';
import instance from '../../axios';
import Appointment from '../../Modal/Appointment'
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useToasts } from 'react-toast-notifications';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import moment from 'moment';
import {
  successToaster,
  errorToaster
} from '../../common/common'
import { setUserId } from '../../redux/actions/actions';
import { setSelectedCenter } from '../../redux/actions/actions';
import { useTranslation } from 'react-i18next';

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 7
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 7
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 5
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 5
  }
};

const useStyles = makeStyles((theme) => ({

  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  root: {
    maxWidth: 345,

  },
  media: {
    height: 140,
    width: 300
  }
}));

function MainDashboard() {
  const {t} = useTranslation();
  const language = useSelector(state => state.language)
  const history = useHistory();
  const classes = useStyles();
  const [category, setCategory] = useState([])
  const [searchresult, setSearchResult] = useState([])
  const [search, setSearch] = useState(null)
  const [open, setOpen] = useState(false)
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [centerData, setCenterData] = useState({})
  const [selectDate, setDate] = useState(new Date())
  const [timeTable, setTimeTable] = useState({})
  const [state, setState] = useState(null)

  const token = useSelector(state => state.token)

//change >> place this in userUpdate
  // const getUserId = async () =>{
  //   const response  = await instance.get(`${requests.fetchUserId}`,{
  //     headers: {
  //       Authorization: token
  //     }
  //   }).catch((error)=>{
  //     let errorMessage = ""
  //     if (error.response.data && error.response.data.error) {
  //       errorMessage = error.response.data.error.message
  //     } else {
  //       errorMessage = error.response.data.message
  //     }
  //     errorToaster(errorMessage)
  //   })
  //   if(response){
  //     dispatch(setUserId(response.data))
  //     console.log(response)
  //   }
  // }

  const getCenter = async () => {
    const response = await instance.post(`${requests.fetchCenter}?search=&lang=${language}`, {},
      {
        headers: {
          Authorization: token
        }
      }
    ).catch(
      (error) => {
        let errorMessage = ""
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error.message
        } else {
          errorMessage = error.response.data.message
        }

        errorToaster(errorMessage)
      }
    )
    console.log(response,"response")
    setSearchResult(response.data.data)
  }
  const getTimeTable = async (id) => {

    const response = await instance.get(`${requests.fetchTimeTable}/${id}?lang=${language}`,
      {
        headers: {
          authorization: token
        }
      }
    ).catch(
      (error) => {
        let errorMessage = ""
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error.message
        } else {
          errorMessage = error.response.data.message
        }

      }
    )
    if (response && response.data) {
      setTimeTable(response.data.data)
    }
  }
  useEffect(() => {
    // if (token) {
    getCenter();
    // addToast("Successfully Submited", { appearance: 'success', autoDismiss: true })
    // }
    // getUserId();

  }, [])

  const onCategorySearch = async (e, data) => {
    e.preventDefault();
    const obj = {
      categoryId: data.uniqueId,
      type: "center"
    }


    const response = await instance.post(`${requests.fetchCenter}?search=&lang=${language}`, obj,
      {
        headers: {
          Authorization: token
        }
      }

    ).catch(
      (error) => {
        let errorMessage = ""
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error.message
        } else {
          errorMessage = error.response.data.message
        }

        errorToaster(errorMessage)
      }
    )
    if (response.data && response.data.data) {
      setSearchResult(response.data.data)
    }


  }
  const handleSearch = async (e) => {
    try {

      e.preventDefault();

      setSearch(e.target.value)
      // if (e.target.value.length > 2) {
      const response = await instance.post(`${requests.fetchCenter}?search=${e.target.value}&lang=${language}`, {},
        {
          headers: {
            Authorization: token
          }
        }

      ).catch(
        (error) => {
          let errorMessage = ""
          if (error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error.message
          } else {
            errorMessage = error.response.data.message
          }

          errorToaster(errorMessage)
        }
      )


      setSearchResult(response.data.data)
      // }

    } catch (error) {




    }
  }
  const handleBooking = async (row) => {


if(row?.isExternalUrl==true){
  window.location.href=`${row.externalUrl}`
 
}else if(row?.centerUrl?.length>0){
  let nameArray = row.centerUrl.split("/");
  let centerName=nameArray[nameArray.length-1]
  
centerName.replace(/\s{2,}/g, '').trim()
dispatch(setSelectedCenter(row))
history.push(`/centers/${centerName}`)
setCenterData(row)
getTimeTable(row._id)
}
else{

  dispatch(setSelectedCenter(row))
  history.push("/client/appointment")
  
  setCenterData(row)

  getTimeTable(row?._id)
}

    // setOpen(true)
  }
  const onSearchByDate = async (date) => {

    setDate(date)


    const ND = moment(date[0]).format("DD-MM-YYYY")

    const TD = moment(date[0]).format("HH:mm")


    const obj = {
      "Date": ND,
      "Time": TD
    }
    const response = await instance.post(`${requests.fetchCenterByDate}?lang=${language}`, obj, {
      headers: {
        Authorization: token
      }
    }).catch(
      (error) => {
        let errorMessage = ""
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error.message
        } else {
          errorMessage = error.response.data.message
        }

        errorToaster(errorMessage)
      }
    )
    if (response.data.data.length > 0) {

      const dataArray = response.data.data
      const arr = []

      for (let i = 0; i < dataArray.length; i++) {
        arr[i] = dataArray[i].centerData[0]
      }
      setSearchResult(arr)
    } else {
      errorToaster(t("No center available on this date or time"))
      getCenter();
    }






  }
  const closeBooking = async (e) => {
    setTimeTable({})
    setOpen(false)
  }

  useEffect(() => {

    const categoryList = async () => {
      const response = await instance.get(`${requests.fetchCategoryList}?lang=${language}`).catch(
        (error) => {
          let errorMessage = ""
          if (error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error.message
          } else {
            errorMessage = error.response.data.message
          }

          errorToaster(errorMessage)
        }
      )
      if (response.data && response.data.data) {
        setCategory(response.data.data)
      }
    }
    categoryList();

  }, [])





  return (
    <>

      <div className="dash-container">
        <Header className="container-header" />
        <div className="carousel" >
          <Carousel
            responsive={responsive}
            swipeable={false}
            draggable={false}
            showDots={false}
            ssr={true} // means to render carousel on server-side.
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
          // itemClass="carousel-item-padding-40-px"
          >

            {
              category.map((data,index) => {
                return (
                  <>
                    <div className="category"   >
                      <div className={(index===state? "category-text2" : "category-text")} onClick={()=>setState(index)} >
                        <img
                          src={data?.image}
                          onClick={(e) => onCategorySearch(e, data)}
                          className="category-image"
                        />
                        <p className="category-name" onClick={(e) => onCategorySearch(e, data)} >{data?.categoryName}</p>
                      </div>
                    </div>
                  </>
                )
              })
            }

          </Carousel>
        </div>
        <div className="searchbar" >

          <Paper component="form" className="root" elevation={6}>
            <IconButton className={classes.iconButton} aria-label="menu">
              {/* <MenuIcon /> */}
            </IconButton>
            <InputBase
              className={classes.input}
              onChange={(e) => handleSearch(e)}
              value={search}
              placeholder={t("Search nearby center")}
              inputProps={{ 'aria-label': 'search google maps' }}
            />
            <IconButton type="submit" className={classes.iconButton} aria-label="search">
              <SearchIcon />
            </IconButton>
            {/* <Divider className={classes.divider} orientation="vertical" /> */}
            <IconButton color="primary" className={classes.iconButton} aria-label="directions">
              {/* <DirectionsIcon /> */}
            </IconButton>
          </Paper>
          <Grid className="calendar-date" >
            <Grid>
              <Typography className="calendar-text" >
                {t("Search By Date and Time")}
              </Typography>
              <Flatpickr
                data-enable-time
                options={{ minDate: "today" }}
                value={selectDate}
                onChange={date => onSearchByDate(date)}
              // onChange={date => setDate({ date })}
              />
            </Grid>
          </Grid>





        </div>
        <div className="search-result" >
          <Grid container>
            {

              searchresult.length > 0 && searchresult.map((data) => {
                return (
                  <>
                    <Grid xs={12} sm={6} lg={3} xl={3} md={4} className="card-container" >
                      <Card className="card-root">
                        <CardActionArea>
                          <CardMedia
                            className={classes.media}
                            image={data?.image}
                            title="Contemplative Reptile"
                          />
                          <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                              {data?.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                              <div className="contact" >
                                <PhoneIcon />
                                {data?.phonenumber}
                              </div>
                              {/* Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                            across all continents except Antarctica */}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                        <CardActions>
                          {/* <Link to ="/client/appointment"> */}
                          <Button variant="outlined" color="secondary"
                            onClick={() => handleBooking(data)}>
                            {t("Book Appointment")}
                          </Button>
                          {/* </Link> */}
                          
                          {/* <Button size="small" color="primary">
                            Learn More
                        </Button> */}
                        </CardActions>
                      </Card>
                    </Grid>

                  </>
                )
              })
            }


          </Grid>
        </div>
        <Footer className="container-footer" />
      </div>
      {/* <Appointment open={open} data={centerData} timeTable={timeTable} closeBooking={closeBooking} /> */}
    </>
  );
}

export default MainDashboard;