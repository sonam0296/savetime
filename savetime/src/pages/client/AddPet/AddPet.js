import DateFnsUtils from "@date-io/date-fns";
import { Avatar, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import instance from "../../../axios";
import { errorToaster, successToaster } from "../../../common/common";
import { setSelectedPet } from "../../../redux/actions/actions";
import requests from "../../../requests";
import "./addPet.css";
const ProfileUpload = ({ onChange, src }) => {
  return (
    <>
      <label for="photo-upload" className="custom-file-upload fas">
        <div className="img-wrap img-upload">
          <Avatar
            size="150"
            facebook-id="invalidfacebookusername"
            src={src}
            className="avatar-image"
            round={true}
          />
        </div>
        <input
          id="photo-upload"
          style={{ display: "none" }}
          type="file"
          onChange={onChange}
        />
      </label>
    </>
  );
};

function AddPet() {
  const { t } = useTranslation();
  const language = useSelector((state) => state.language);
  const history = useHistory();
  const [profileURL, setProfileURL] = useState("");
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const petDetails = useSelector(state => state.selectedPet)
  const [input, setInput] = useState({});
  const userDetails = useSelector((state) => state.loginData);
  const [profileFlag, setprofileFlag] = useState(false);
  const [animalProps, setAnimalProps] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchingDate, setSerchingDate] = useState(
    moment(selectedDate).format("DD-MM-YYYY")
  );
const [animalID, setAnimalID] = useState('')
  let animals = [
    {
      name: "Dog",
      value: "Dog",
    },
    {
      name: "Cat",
      value: "Cat",
    },
    {
      name: "Rabbit",
      value: "Rabbit",
    },
    {
      name: "Bird",
      value: "Bird",
    },
    {
      name: "Fish",
      value: "Fish",
    },
    {
      name: "Cow",
      value: "Cow",
    },
    {
      name: "Horse",
      value: "Horse",
    },
    {
      name: "Snake",
      value: "Snake",
    },
    {
      name: "Park",
      value: "Park",
    },
  ];
  useEffect(() => {
    // let animalDataOption = [];
    // //   let res = response.data.data;
    // animals.map((animal) => {
    //   let animalData = {
    //     title: animal.name,
    //     value: animal.name,
    //   };
    //   animalDataOption.push(animalData);
    // });
    // const animalsOptions = {
    //   options: animalDataOption,
    //   getOptionLabel: (option) => option.title,
    // };
    // setAnimalProps(animalsOptions);
    // console.log("call")
  }, []);

  

  useEffect(() => {
      if(Object.keys(petDetails).length>0){

          input.name=petDetails.petsName;
          setProfileURL(petDetails.image)
          setSelectedAnimal(petDetails.petsType) 
          let date = moment(petDetails.petsDOB,'DD-MM-YYYY').format('MM-DD-YYYY')
          console.log(date,'ddd')
          let newDate=new Date(date)
          setSelectedDate(newDate)
          setAnimalID(petDetails._id)
      }
   
      
  }, [petDetails])

 
  const imageupload = async (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    const fd = new FormData();
    fd.append("image", file);
    const response = await instance
      .post(`${requests.fetchImageUpload}?lang=${language}`, fd, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.message;
        errorToaster(errorMessage);
      });
    if (response && response.data) {
      setProfileURL(response.data.data.file);
      setprofileFlag(true);
    }
  };

  const handelChange = async (e) => {
    e.preventDefault();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleReturnBack = () => {
    history.push("/client/profile-update");
    dispatch(setSelectedPet({}))
  };

  const handleDateChange = (date) => {
      console.log(date,"date")
    let tempDate = new Date(date);
    setSelectedDate(date);
    let finalDate = moment(tempDate).format("DD-MM-YYYY");
    setSerchingDate(finalDate);
  }

  const handleCreate = async () =>{
      let a=0;
    // input.image = profileURL;
    let obj ={
        petsName:input?.name,
        image: profileURL ,
        petsType:selectedAnimal,
        petsDOB:searchingDate
    }
    const response = animalID ?
    await instance
    .put(`${requests.fetchUpdatePets}/${petDetails._id}`,
    obj,
    {
        headers: {
          Authorization: token,
        },
      }
    ).catch((error) =>{
        let errorMessage = error.response.data.message;
        errorToaster(errorMessage);
        console.log(error); 
    }).then(()=>{
        a=1;
        successToaster("Update Pet Registration!!")
    })

    :
     await instance
      .post(`${requests.fetchCreatePet}`, obj,
       {
        headers: {
          Authorization: token,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.message;
        errorToaster(errorMessage);
        console.log(error);
      })
      .then(()=>{
          a=2;
        successToaster(t("Registration Sucsess"));
      })
    if (response && response.data) {
      console.log(response,'main')
    //   if(a==1){
    //     successToaster("Update Pet Registration!!")
    //   }else if(a==2){
    //         successToaster(t("Registration Sucsess"));

    //   }
    }
  }

  const handleChangeAnimal = (e) =>{
setSelectedAnimal(e.target.value)
  }

  return (
    <div>
        {console.log(selectedDate,"selectedDate")}
      <Grid container>
        <Grid item xs={0} sm={0} md={3} lg={3} xl={3}></Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <div className="paper-form">
            <div>
              <h2 style={{ color: "red", textAlign: "center" }}>
                {t("Animal Registration")}
              </h2>
              <hr style={{ fontWeight: "15px", color: "red" }} />
            </div>
            <div>
                <h4>Fill in the details of your pet..!!</h4>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ProfileUpload
                onChange={(e) => imageupload(e)}
                src={
                  profileURL?.length > 0
                    ? profileURL
                    : "http://assets.stickpng.com/images/584abf102912007028bd9332.png"
                }
              />
            </div>

            <FormControl  style={{marginTop:"2rem"}}>
            <InputLabel htmlFor='selected-language'>Animals</InputLabel>
                <Select
               
                // fullWidth
                  placeholder="Animals"
                  value={selectedAnimal}
                  onChange={(e)=>handleChangeAnimal(e)}
                  displayEmpty
                  
                  inputProps={{ "aria-label": "Without label" }}
                >
                 
                  {animals.map((item) => (
                    <MenuItem  style={{width:"150",minWidth:'150'}} value={item.name}>{item.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

            {/* <Autocomplete
              fullWidth
              {...animalProps}
              id="selectedAnimals"
             defaultValue={animalProps.find(v=>v.label==petDetails.petsType)}
              onChange={(event, newValue) => {
                setSelectedAnimal(newValue?.value);
              }}
              renderInput={(params) => (
                <TextField {...params} value={selectedAnimal} label={t("Animals")} margin="normal" />
              )}
            /> */}
            <TextField
              id="standard-start-adornment"
              name="name"
              value={input.name}
              onChange={(e) => handelChange(e)}
              className="name-field-pet"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {t("Name and Surname")}
                  </InputAdornment>
                ),
              }}
            />
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label={t("Date")}
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
          </div>
        </Grid>
        <Grid item xs={0} sm={0} md={3} lg={3} xl={3}></Grid>
      </Grid>
      <Grid container style={{marginTop:'10rem'}}>
        <Grid item xs={0} sm={0} md={3} lg={3} xl={3}></Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          
          
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              marginTop: "2rem",
            }}
          >
            <div>
              <button
                style={{
                    width: "9rem",
                    height: "3rem",
                    borderRadius: "30px",
                    borderWidth: "thin",
                    backgroundColor: "#d61c38",
                    cursor:'pointer',
                    fontSize:'18px',
                    color:'white',
                  }}
                onClick={() => handleReturnBack()}
              >
                {t("To Return")}
              </button>
            </div>
            <div>
              <button
                style={{
                    width: "9rem",
                    height: "3rem",
                    borderRadius: "30px",
                    borderWidth: "thin",
                    backgroundColor: "#00ad22",
                    cursor:'pointer',
                    fontSize:'18px',
                    color:'white',
                  }}
                onClick={()=>handleCreate()}
              >
                {t("To Register")}
              </button>
            </div>
          </div>
        </Grid>
        <Grid item xs={0} sm={0} md={3} lg={3} xl={3}></Grid>
      </Grid>
    </div>
  );
}

export default AddPet;
