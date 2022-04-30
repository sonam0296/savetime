import { Grid, InputAdornment, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import "./userprofile.css";
import { useSelector, useDispatch } from "react-redux";
import instance from "../../axios";
import requests from "../../requests";
import { successToaster, errorToaster } from "../../common/common";
import { destroySession, setLoginData, setSelectedPet, setUserId } from "../../redux/actions/actions";

//Dilog Box
import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

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

function UserProfile() {
  const {t} = useTranslation();
  const language = useSelector(state => state.language)
  const history = useHistory();
  const [profileURL, setProfileURL] = useState("");
  const [reason, setReason] = useState("");
  const [input, setInput] = useState({});
  const userID = useSelector((state) => state.loginData._id);
  const userDetails = useSelector((state) => state.loginData);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('sm');
  const [profileFlag, setprofileFlag] = useState(false)
  const [allPets, setAllPets] = useState([])


  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getAllPets = async () =>{
    const response = await instance
    .get(`${requests.fetchAllPets}`, 
     {
      headers: {
        Authorization: token,
      },
    })
    .catch((error) => {
      let errorMessage = error.response.data.message;
      errorToaster(errorMessage);
      console.log(error);
    });
  if (response && response.data) {
    console.log(response,'main')
    setAllPets(response.data.data)
    
  }
  }

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
      setprofileFlag(true)
     
    }
   
  };

  const handelChange = async (e) => {
    e.preventDefault();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    input.image = profileURL;
    const response = await instance
      .post(`${requests.fetchUpdateUser}/${userID}?lang=${language}`, input, {
        headers: {
          Authorization: token,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.message;
        errorToaster(errorMessage);
        console.log(error);
      });
    if (response && response.data) {
      console.log(response,'main')
      dispatch(setLoginData(response.data.data.user))
      dispatch(setUserId(response.data.data.user._id));
      successToaster(t("Profile Updated"));
    }
  };

  const handleReturnBack = () =>{
    history.push("/client/maindashboard")
  }

  const handleDeleteUser = async () =>{
    console.log("call")
    // debugger
    let obj ={
      emailAddress:userDetails.emailAddress,
      name:userDetails.name,
      reason:reason,
    }

    const response = await instance.delete(`${requests.fetchDeleteUser}?lang=${language}`,obj,{
      headers: {
        Authorization: token,
      },
    })
    .catch((error) => {
      let errorMessage = error.response.data.message;
      errorToaster(errorMessage);
    });
    if (response && response.data) {
      dispatch(setLoginData({}));
      history.push("/")
      dispatch(destroySession());
      successToaster(t("Account Deleted"));
    }
  }

  useEffect(() => {
    if(Object.keys(userDetails).length>0){
      setProfileURL(userDetails.image)
    }
    getAllPets();
  
  }, [])
  useEffect(() => {
    if(profileFlag==true){

      handleUpdate();
    }
  
  }, [profileFlag])

  const handleAddPet = () =>{
    history.push('/client/add-pet')
  }

  const handleUpdateActivate = (e, row) => {
    e.preventDefault();
    dispatch(setSelectedPet(row))
    history.push('/client/add-pet')
    // setUpdate(row)
    // setIsUpdate(true)
    // setActivate(true)
  }

  return (
    <div>
     
      {/* <div className="worker-papers"> */}
      {/* <div> */}
      <Grid container>
        <Grid item xs={0} sm={0} md={3} lg={3} xl={3}></Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <div className="paper-form">
            <div>
              <h2 style={{ color: "red", textAlign: "center" }}>
                {t("Edit Profile")}
              </h2>
              <hr style={{ fontWeight: "15px", color: "red" }} />
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
                  profileURL.length > 0
                    ? profileURL
                    : "https://savetime-image.s3.eu-west-3.amazonaws.com/Person-b5c47224-332f-4862-8268-1e822350ff51.png"
                }
              />
            </div>
            <TextField
              id="standard-start-adornment"
              name="name"
              value={input.name ? input.name : userDetails.name}
              onChange={(e) => handelChange(e)}
              className="name-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {t("Name and Surname")}
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              id="standard-start-adornment"
              name="phonenumber"
              // {input.lastname}
              value={input.phonenumber ? input.phonenumber : userDetails.phonenumber}
              onChange={(e) => handelChange(e)}
              className="name-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">{t("Phone")}</InputAdornment>
                ),
              }}
            />
            <TextField
              id="standard-start-adornment"
              name="idCard"
              value={input.idCard ? input.idCard : userDetails.idCard}
              onChange={(e) => handelChange(e)}
              className="name-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {t("ID Card Or Passport")}
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              id="standard-start-adornment"
              name="emailAddress"
              value={input.emailAddress ? input.emailAddress : userDetails.emailAddress}
              onChange={(e) => handelChange(e)}
              className="name-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">{t("Email")}</InputAdornment>
                ),
              }}
            />
            <TextField
              id="standard-start-adornment"
              name="emailAddress"
              value={input.emailAddress}
              onChange={(e) => handelChange(e)}
              className="name-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">{t("Change Email")}</InputAdornment>
                ),
              }}
            />
            <TextField
              id="standard-start-adornment"
              name="password"
              value={input.password}
              onChange={(e) => handelChange(e)}
              className="name-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {t("Change Password")}
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              id="standard-start-adornment"
              name="lastname"
              value=""
              // {input.lastname}
              // value={input.lastname}
              // onChange={(e) => handelChange(e)}
              className="name-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">{t("Language")}</InputAdornment>
                ),
              }}
            />
          </div>
        </Grid>
        <Grid item xs={0} sm={0} md={3} lg={3} xl={3}></Grid>
      </Grid>
      <Grid container>
        <Grid item xs={0} sm={0} md={3} lg={3} xl={3}></Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <div style={{display:'flex',justifyContent:'start'}}>
            <i
              class="fas fa-paw pawicon"
              style={{ fontSize: "2rem", margin: "1rem" }}
            ></i>
            <i
              class="fas fa-plus-circle plusicon"
              onClick={()=>handleAddPet()}
              style={{ fontSize: "2rem", margin: "1rem", color: "#d61c38",cursor:'pointer' }}
            ></i>
          </div>
          <div className="animals">
          {
                  allPets && allPets.length > 0 && allPets.map((row) => {
                    return (<>
                      <div className= "animal-box" 

                        onClick={(e) => handleUpdateActivate(e, row)}

                      >
                        <img height="40" width="40" src={row.image ? row.image : "https://savetime-image.s3.eu-west-3.amazonaws.com/Person-b5c47224-332f-4862-8268-1e822350ff51.png"}/>

                        {/* <Avatar alt="Remy Sharp" className="" src={row.image ? row.image : "https://savetime-image.s3.eu-west-3.amazonaws.com/Person-b5c47224-332f-4862-8268-1e822350ff51.png"} /> */}

                        <span style={{
                          padding: "10px"
                        }} >{row.petsType}</span>
                      </div>

                    </>)

                  })
                }
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "2rem",
            }}
          >
            <button
              style={{
                width: "14rem",
                height: "3rem",
                borderRadius: "30px",
                borderWidth: "thin",
                backgroundColor: "#d61c38",
                cursor:'pointer',
                fontSize:'18px',
                color:'white',
              }}
              onClick={()=>handleClickOpen()}
            >
              {t("Delete Account")}
            </button>
          </div>
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
                  width: "8rem",
                  height: "3rem",
                  borderRadius: "30px",
                  borderWidth: "thin",
                  backgroundColor: "#d61c38",
                  cursor:'pointer',
                  fontSize:'18px',
                  color:'white',
                }}
                onClick={()=>handleReturnBack()}
              >
                {t("To Return")}
              </button>
            </div>
            <div>
              <button
                style={{
                  width: "8rem",
                  height: "3rem",
                  borderRadius: "30px",
                  borderWidth: "thin",
                  backgroundColor: "#00ad22",
                  cursor:'pointer',
                  fontSize:'18px',
                  color:'white',
                }}
                onClick={()=>handleUpdate()}
              >
                {t("To Register")}
              </button>
            </div>
          </div>
        </Grid>
        <Grid item xs={0} sm={0} md={3} lg={3} xl={3}></Grid>
      </Grid>
      {/* </div> */}
      <div>
        <Dialog
         fullWidth={fullWidth}
         maxWidth={maxWidth}
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{t("Confirm Delete")}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={t("Why You Want To Delete Your Account")}
              type="text"
              value={reason}
              onChange={(e)=>setReason(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              {t("Cancel")}
            </Button>
            <Button
              onClick={ handleDeleteUser}
              color="primary"
            >
              {t("Submit")}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      {/* </div> */}
      {/* </div> */}
    </div>
  );
}

export default UserProfile;
