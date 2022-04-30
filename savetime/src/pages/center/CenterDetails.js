import React, { useState, useEffect } from 'react'
import './centerdetails.css'
import { useSelector, useDispatch } from 'react-redux'
import { workerSchedules, openWorkerModel, setWorkerDefaultSchedule, setNewWorkerData, setStarttime, setEndtime, setSelectedCategory, setWorkerCustomSchedule, setLoginData, setWorkerLoginStatus } from '../../redux/actions/actions'
import { workerInput } from '../../redux/actions/actions'
import { makeStyles } from '@material-ui/core'
import { Container, Typography, TextField, FormGroup, Grid, FormControlLabel, Checkbox, Avatar, Button } from '@material-ui/core'
import { Link, Redirect, useHistory, withRouter } from "react-router-dom";
import { loadCSS } from 'fg-loadcss';
import Icon from '@material-ui/core/Icon';

import Map from '../../Modal/MapModal'
import WorkerModal from '../../Modal/WorkerModal'
import Schedule from './Schedule'
import instance from '../../axios'
import { useToasts } from 'react-toast-notifications';
import requests from '../../requests'
import Header from '../../components/Header';
import CenterAdminHeader from '../center-admin/CenterAdminHeader/CenterAdminHeader';
import Footer from '../../components/Footer'
import {
  successToaster,
  errorToaster
} from '../../common/common'
import { Decrypt, Encrypt } from '../../common/Encrypt'
import { borderBottom } from '@material-ui/system'
import { useTranslation } from 'react-i18next'

const category = ["Esteticon", "Animales", "Oficinas", "Saluty Binesar", "Automocian", "otos"]


const useStyles = makeStyles((theme) => ({
  root: {
    '& > .fa': {
      margin: theme.spacing(2),
      maxWidth: "100%"
    },
  },
  TextField:{
    margin:'8px',
    borderBottom:'2px solid #00ad22'
  }
}));
const ImageUpload = (
  {
    onChange,
    src
  }

) => {
  return (
    <>
      <label for="photo-upload" className="custom-file-upload fas">
        <div className="img-wrap img-upload" >
          <Avatar size="150" facebook-id="invalidfacebookusername" src={src}
            style={{ width: "152px", height: "152px" }}
            className="avatar-image"
            round={true}
          />
        </div>
        <input id="photo-upload" style={{ display: "none" }} type="file" onChange={onChange} />
      </label>
    </>
  )
}

function CenterDetails(props) {
  const {t} = useTranslation();
  const centerAdminLoginStatus = useSelector((state) => state.centerAdminLoginStatus);
  const language = useSelector(state => state.language)
  const [centerAdminHeaderVisible, setCenterAdminHeaderVisible] = useState(false);
  const [open, setOpen] = useState(false)
  const [url, setURL] = React.useState("");
  const [openMap, setOpenMap] = useState(false)
  const [category, setCategory] = useState([])
  const [selectcategory, setSelectCategory] = useState([])
  const [activate, setActivate] = useState(false)
  const [type, setType] = useState("center")
  const [data, setData] = useState([])
  const [i, setIndex] = useState(null)
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [updateworker, setUpdate] = useState()
  const [isUpdate, setIsUpdate] = useState(false)
  const [input, setInput] = useState({})
  const token = useSelector(state => state.token)
  const logincenterToken = useSelector(state => state.selectedLoginCenter.token)
  const history = useHistory()
  const centerdata = useSelector((state) => state.centerdata)
  const openworkermodel = useSelector((state) => state.openworkermodel)
  const center = useSelector((state) => state.loginData)
  const [TimeTable, setTimeTable] = useState([])
  const selectedcategorySelector = useSelector(state => state.selectedcategory)
  const hadnleOpen = async () => {
    setOpen(true)
  }
  const photoupload = async (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    const fd = new FormData();
    fd.append("image", file)
    const response = await instance.post(`${requests.fetchImageUpload}?lang=${language}`, fd,
      {
        headers: {
          "Content-type": "multipart/form-data",
        }
      },
    )
      .catch(
        (error) => {
          let errorMessage = error.response.data.message
          errorToaster(errorMessage)
        }
      )
    if (response && response.data) {
      setURL(response.data.data.file)
    }
  }
  const handleInput = async (e) => {

    e.preventDefault();


    setInput({ ...input, [e.target.name]: e.target.value })

  }
  const hadleOpenMap = (e) => {
    e.preventDefault();
    setOpenMap(true)
  }
  const updateCenter = async (e) => {

    if(e?.target.innerHTML=="Following" || e?.target.innerHTML=="Siguiente" || e?.target.innerHTML=="Seguint" || e?.target.innerHTML=="Suivant" || e?.target.innerHTML=="Seguindo"){
      
      history.push("/center/services")

    }

if(input?.name){
  input.name=input.name
  
}
if(input?.phonenumber){
  input.phonenumber=input.phonenumber
}
    let a = []

    selectcategory.map((data) => {
      a.push({ id: data })

    })


    input.categoryId = a
    input.image = url
    input.emailAddress = center.emailAddress
    input.type = undefined
    input.status = undefined
    input.verified = undefined
    input.fcm_registration_token = undefined
    input.stripe_customer = undefined
    input.createdAt = undefined
    input._id = undefined
    const response = await instance.post(`${requests.fetchUpdateCenter}/${center._id}?lang=${language}`, input,
      {
        headers: {
          Authorization: logincenterToken
        }
      }
    ).catch(
      (error) => {
        let errorMessage = error.response.data.message
        errorToaster(errorMessage)
      }
    )

    if (response && response.data) {
      successToaster(t("Center Updated !"))
      dispatch(setSelectedCategory(response.data.data.user.categoryId))
      dispatch(setLoginData(response.data.data.user))
      // if(e?.target.innerHTML=="Following"){
      //   console.log(e.target.innerHTML)
      //   history.push("/center/services")

      // }
    }


  }
  const handleWorker = async (workerdata) => {
    setData(workerdata)
  }
  const handleBackToHome = () => {
    history.push("/")
  }
  const handleChange = (e, data, index) => {
    e.preventDefault();
    let catarray = [...selectcategory]

    if (selectcategory.includes(data.uniqueId)) {
      catarray = selectcategory.filter((id) => id !== data.uniqueId)


      setSelectCategory([...catarray])
    } else {
      catarray[index] = e.target.value;
      setIndex(data.uniqueId)
      setSelectCategory([...catarray])
    }

  }
  const handleActivate = async () => {
    setActivate(true)
    setIsUpdate(false)
  }



  const handleUpdateActivate = (e, row) => {
    e.preventDefault();
    dispatch(workerInput(row))
    setUpdate(row)
    setIsUpdate(true)
    setActivate(true)
  }
  const closeActivate = async () => {
    dispatch(openWorkerModel(false))
    // dispatch(setWorkerDefaultSchedule([]))
    dispatch(setWorkerCustomSchedule([]))
    // dispatch(workerInput({}))
    // dispatch(workerSchedules({}))
    setActivate(false)
  }

  const handleRedirect = async () => {
    history.push("/customcalendar")
  }
  const handleCloseMap = async () => {
    // e.preventDefault();
    setOpenMap(false)

  }

  const handleMapValue = async () => {

  }




  const handleClose = async () => {
    setOpen(false)
  }
  const getWorkers = async () => {

    const response = await instance.get(`${requests.fetchGetWorkers}/${center._id}?lang=${language}`, {
      headers: {
        Authorization: logincenterToken
      }
    }).catch(
      (error) => {
        let errorMessage = ""
        if (error?.response?.data && error?.response?.data?.error) {
          errorMessage = error?.response?.data?.error.message
        } else {
          errorMessage = error?.response?.data?.message
        }
        errorToaster(errorMessage)
      }
    )

    if (response && response.data) {

      setData(response.data.data)
      // handleWorker(response.data.data)

      // props.onDeactive();


      // addToast("worker created", { appearance: 'success', autoDismiss: true })

    }


  }
  React.useEffect(() => {
    const path = history.location.pathname;
    const path_array = path.split("/");
    if (path_array[2] === "admin") {
      setCenterAdminHeaderVisible(true);
    }

    if (openworkermodel) {
      setActivate(true)
    }
    getWorkers();

    // if (props.workersData && Object.keys(props.workersData).length > 0) {
    //   setInput(props.workersData)
    // }



    const node = loadCSS(
      'https://use.fontawesome.com/releases/v5.12.0/css/all.css',
      document.querySelector('#font-awesome-css'),
    );

    const setCategoryList = () => {
      let catarray = [...selectcategory]
      // let catarray = [...selectedcategorySelector]

      // const cat = center.categoryId
      const cat = selectedcategorySelector.length > 0 ? selectedcategorySelector : center.categoryId;
      if (cat && cat.length > 0) {

        for (let i = 0; i < cat.length; i++) {
          catarray[i] = cat[i].id
        }
      }
      setSelectCategory([...catarray])




    }
    setCategoryList();

    const setUser = () => {

      input.name = center.name
      input.phonenumber = center.phonenumber

      setInput(input)



    }
    setUser();

    const listCategory = async () => {
      const response = await instance.get(`${requests.fetchCategoryList}?lang=${language}`)

      if (response.data && response.data.data) {
        setCategory(response.data.data)
        // dispatch(setSelectedCategory(response.data.data))
      }
    }
    listCategory();
    return async () => {
      node.parentNode.removeChild(node);

    };

  }, []);
  useEffect(() => {
    // dispatch(setWorkerDefaultSchedule([]))
    // dispatch(setWorkerCustomSchedule([]))
    dispatch(setWorkerLoginStatus(false))
    dispatch(setNewWorkerData({}))
    dispatch(setStarttime(""))
    dispatch(setEndtime(""))
    // dispatch(workerInput({}))
  }, [])
  const classes = useStyles();


  return (
    <>
   
      <div className="center-container" >
        {
          centerAdminLoginStatus === true && centerAdminHeaderVisible === true ?
            <CenterAdminHeader title={t("Center Data")} />
            :
            <Header title={t("Fill in the center details")} className="center-header" />
        }

        <Grid container className="centerDetail_container" >
          <Grid item xs={0} sm={0} md={1} lg={1} xl={1}></Grid>
          <Grid className="div-1" item xs={12} sm={12} md={5} lg={5} xl={5} >
            <div className="center-form" >
              <Typography variant="h6" className="form-title">
              {t("Center Data")}
              </Typography>
              <TextField
                id="standard-full-width"
                label={t("Name")}
                // style={{ margin: 8 }}
                name="name"
                onChange={(e) => handleInput(e)}
                value={input.name}
                placeholder="Name"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                className={classes.TextField}
              />
              <TextField
                id="standard-full-width"
                name="phonenumber"
                label={t("Phone")}
                // style={{ margin: 8,borderBottom:'1px solid green' }}
                // placeholder="Phone number"
                onChange={(e) => handleInput(e)}
                value={input.phonenumber}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                className={classes.TextField}
              />
              <Typography variant="h6" className="form-title">
                {t("Downtown Sector")}
              </Typography>
              <FormGroup row>
                {
                  category.length > 0 && category.map((data, index) => {
                    return (
                      <>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectcategory.includes(data.uniqueId) ? true : false}
                              onChange={(e) => handleChange(e, data, index)}
                              value={data.uniqueId}
                            />
                          }
                          label={t(data.categoryName)}
                        />
                      </>
                    )
                  })
                }
              </FormGroup>
              <div className="workers-head" >
                <Typography variant="h6"
                  onClick={() => handleActivate()}
                  className="form-title">
                  {t("Create workers")}
                </Typography>
                <Icon
                  className="fa fa-plus-circle"
                  style={{ margin: "7px 12px", fontSize: "26px", cursor:'pointer', color:'#d61c38' }}
                  color="secondary"
                  onClick={() => handleActivate()}
                />

              </div>
              <div className="worker" >

                {
                  data && data.length > 0 && data.map((row) => {
                    return (<>
                      <div className={(row.active==true ? "worker-box" : "worker-box-red")}

                        onClick={(e) => handleUpdateActivate(e, row)}

                      >

                        <Avatar alt="Remy Sharp" src={row.image ? row.image : "https://savetime-image.s3.eu-west-3.amazonaws.com/Person-b5c47224-332f-4862-8268-1e822350ff51.png"} />

                        <span style={{
                          padding: "10px"
                        }} >{row.name}</span>
                      </div>

                    </>)

                  })
                }
              </div>
            </div>
          </Grid>
          <Grid className="div-2" item xs={12} sm={12} md={5} lg={5} xl={5}  >
            <Schedule type={"center"} data={{ typeOfSchedule: "default" }}

              TimeTable={TimeTable}
              handleRedirect={handleRedirect}
              updateCenter={updateCenter}
              />
          </Grid>
          <Grid item xs={0} sm={0} md={1} lg={1} xl={1}></Grid>
        </Grid>
        <Grid container style={{marginTop:'6rem',width:'100%'}}>
        <Grid item xs={0} sm={0} md={1} lg={1} xl={1}></Grid>
        <Grid item xs={12} sm={12} md={5} lg={5} xl={5} className="centerDetails_return_item" >
        <Button
            variant="contained"
            className="centerDetails_returnBtn"
            onClick={(e) => handleBackToHome(e)}
          >
            {t("Return")}
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={5} lg={5} xl={5} className="centerDetails_following_item" >
        <Button
            variant="contained"
            className="centerDetails_following"
            onClick={(e)=>updateCenter(e)}
          >
            {t("Following")}
          </Button>
        </Grid>
        <Grid item xs={0} sm={0} md={1} lg={1} xl={1}></Grid>
        </Grid>
        {/* <div className="worker-btn" >
         
        </div> */}
        <Footer className="center-footer" />
      </div>
      {activate && <WorkerModal activate={activate} handleWorker={handleWorker}
        updateworker={updateworker}
        isUpdate={isUpdate}
        onDeactive={closeActivate} />}
    </>
  )

}
export default CenterDetails;
