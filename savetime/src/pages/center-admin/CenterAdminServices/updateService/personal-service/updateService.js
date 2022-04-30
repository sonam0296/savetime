import React, { useState, useEffect, useRef } from "react";

//material-ui
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import { Grid, Avatar } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Link, Redirect, useHistory, withRouter } from "react-router-dom";
import {
  setCollectiveService,
  setCollectiveServiceModel,
  setPersonalService,
} from "../../../../../redux/actions/actions";
import instance from "../../../../../axios";
import requests from "../../../../../requests";

import { successToaster, errorToaster } from "../../../../../common/common";
import "./updateServices.css";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  body: {
    boxSizing: "borderBox",
  },
  root: {
    "& > *": {
      margin: theme.spacing(3),
    },
  },
  "& label.Mui-focused": {
    color: "orange",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "orange",
  },
  dialog: {
    height: "800px",
    width: "800px",
  },
  radio: {
    display: "flex",
    justifyContent: "space-between",
    margin: "20px",
    OverflowEvent: "hidden",
    // backgroundColor:"#009578",
    borderRadius: "10px",
    boxShadow: "0 0 5px rgba(0, 0, 0, 0.25)",
  },
  service_radio: {
    display: "flex",
    justifyContent: "space-between",
    width: "15%",
    marginLeft: "20%",
    margin: "20px 0px",
    OverflowEvent: "hidden",
    // backgroundColor:"#009578",
    borderRadius: "10px",
    boxShadow: "0 0 5px rgba(0, 0, 0, 0.25)",
  },
  service_radio_column2: {
    display: "flex",
    justifyContent: "space-between",
    width: "15%",
    marginLeft: "40%",
    margin: "20px 0px",
    OverflowEvent: "hidden",
    // backgroundColor:"#009578",
    borderRadius: "10px",
    boxShadow: "0 0 5px rgba(0, 0, 0, 0.25)",
  },
  service_radio_label: {
    // padding:"8px 0px",
    marginRight: "5px",
    fontSize: "20px",
    backgroundColor: "#009578",
    corsor: "pointer",
    transition: "background 0.1s",
  },
  service_radio_label_column2: {
    // padding:"8px 0px",
    marginRight: "5px",
    fontSize: "20px",
    backgroundColor: "#009578",
    corsor: "pointer",
    transition: "background 0.1s",
  },
  checkbox: {
    display: "flex",
    margin: "25px 0px",
    OverflowEvent: "hidden",
    // backgroundColor:"#009578",
    borderRadius: "10px",
    boxShadow: "0 0 5px rgba(0, 0, 0, 0.25)",
  },
  radio_label: {
    padding: "8px 14px",
    fontSize: "14px",
    backgroundColor: "#009578",
    corsor: "pointer",
    transition: "background 0.1s",
  },
  checkbox_label: {
    padding: "8px 14px",
    fontSize: "14px",
    // backgroundColor:"#009578",
    corsor: "pointer",
    transition: "background 0.1s",
  },
  img_icon: {
    height: "30px",
    width: "30px",
  },
  chechbox_input: {
    display: "none",
  },
  personalinput: {
    paddingTop: "5px",
    textDecorationColor: "green",
  },
  // textField: {
  //   width: '90%',
  //   border: "1px solid red",
  //   // backgroundColor:'red',
  //   color: 'red',

  // marginLeft: 'auto',
  // marginRight: 'auto',
  // paddingBottom: 0,
  // marginTop: 0,
  // fontWeight: 500

  // radio_input : {
  //   "& + label" :{
  //     color:"green"
  //   },
  //   "&:checked + label" :{
  //     backgroundColor:"#006B52"
  //   }
  // }
}));

function UpdateService({ isOpen, isClose, selectedService, getService }) {
  const {t} = useTranslation();
  const initailFValuespesonal = {
    name_personal: selectedService.serviceName,
    duration_personal: selectedService.duration,
    price_personal: selectedService.price,
    worker: [
      {
        id: selectedService.workerData[0]._id,
      },
    ],
  };

  const initailFValuescollective = {
    nameofworkers: [],
    defaultSchedule: [],
    customDate: [],
  };

  const dispatch = useDispatch();
  const history = useHistory();

  const loginData = useSelector((state) => state.loginData);
  const language = useSelector(state => state.language)

  const [personalvalues, setPersonalValues] = useState(initailFValuespesonal);
  const token = useSelector((state) => state.token);
  const logincenterToken = useSelector(state => state.selectedLoginCenter.token)

  const [workersData, setWorkersData] = useState([]);
  const classes = useStyles();
  const [flag, setFlag] = useState(true);

  const [canclepopup, setCanclepopup] = useState(false);
  const [canclepopupconfirm, setCanclepopupconfirm] = useState(false);
  const [canclepopupnotification, setCanclepopupnotification] = useState(false);

  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("md");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalValues({
      ...personalvalues,
      [name]: value,
    });
  };
  const handlePersonalClose = () => {
    isClose(false);
  };

  const handleNotificationConfirm = () => {
    handleDeativateService();
    setCanclepopupconfirm(false);
    setCanclepopupnotification(true);
    // isClose(false);
  };
  const handleOkayPopupClose = () => {
    setCanclepopupnotification(false);
    // isClose(false);
  };

  const handleClose = () => {};
  // useForceUpdate();

  const handleCanclePopupClose = () => {
    setCanclepopup(false);
    // setOpen(false);
  };
  const handleDeativateService = async () => {
    setCanclepopup(false);
    let body={
      active: false
    }
    const response = await instance
    .put(`${requests.fetchUpdateService}/${selectedService._id}?lang=${language}`, body, {
      headers: {
        Authorization: `Bearer ${logincenterToken}`,
      },
    })
    .catch((error) => {
      console.log("ee", error.response);
      let errorMessage = error.response.data.message;
      errorToaster(errorMessage);
    });
  if (response && response.data) {
    successToaster(t("Personal Service Delete!"));
    getService();
    handlePersonalClose();
  }
    //API CALL
  };
  const handleDeactivateandAdvise = () => {
    setCanclepopupconfirm(true);
  };
  const handleConfirmPopupClose = () => {
    handleDeativateService();
    setCanclepopupconfirm(false);
  };

  const handleRemoveService = () => {
    setCanclepopup(true);
    // setcanclepopup(false);
    // setOpen(false);
  };

  const fetchWorkers = async () => {
    const response = await instance
      .get(`${requests.fetchGetWorkers}/${loginData._id}?lang=${language}`, {
        headers: {
          Authorization: `Bearer ${logincenterToken}`,
        },
      })
      .catch((error) => {
        let errorMessage = "";
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error.message;
        } else {
          errorMessage = error.response.data.message;
        }
        console.log("ee", error.response);
        errorToaster(errorMessage);
      });
    if (response && response.data) {
      setWorkersData(response.data.data);
    }
  };

  useEffect(() => {
    initailFValuescollective.defaultSchedule = [];
    initailFValuescollective.customDate = [];
    fetchWorkers();
  }, []);

  const handlePersonalWorker = (event) => {
    debugger;
    if (event.target.checked === true) {
      var id = { id: event.target.value };
      //initailFValuespesonal.worker.splice(0,initailFValuespesonal.worker.length);
      let tempVar = personalvalues;
      tempVar.worker[0] = id;
      setPersonalValues(tempVar);
    }
    setFlag(false);
    //initailFValuespesonal.worker.push(id);
  };

  useEffect(() => {
    if (flag === false) {
      setFlag(true);
    }
  }, [flag]);

  const updatePersonalService = async () => {
    let body = {
      serviceName: personalvalues.name_personal,
      duration: personalvalues.duration_personal,
      price: personalvalues.price_personal,
      workerId: personalvalues.worker,
    };
    console.log("Body ==> ", body);
    const response = await instance
      .put(`${requests.fetchUpdateService}/${selectedService._id}?lang=${language}`, body, {
        headers: {
          Authorization: `Bearer ${logincenterToken}`,
        },
      })
      .catch((error) => {
        console.log("ee", error.response);
        let errorMessage = error.response.data.message;
        errorToaster(errorMessage);
      });
    if (response && response.data) {
      successToaster(t("Personal Service Updated!"));
      getService();
      handlePersonalClose();
    }
  };

  return (
    <>
      <Dialog
        className="personalDialog"
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={isOpen}
        onClose={handlePersonalClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle
          id="form-dialog-title"
          id="personaltitle"
          className="dialogcontent"
        >
          {t("Update Personal Service")}
        </DialogTitle>
        <DialogContent>
          <Grid container className="personalContainer">
            <form className="service-form">
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-around",
                }}
              >
                <TextField
                  className=""
                  InputLabelProps={{ className: "textfield" }}
                  InputProps={{ className: "textfield__label" }}
                  id="standard-basic"
                  name="name_personal"
                  label={t("Name")}
                  required
                  value={personalvalues.name_personal}
                  onChange={handleInputChange}
                />
                <TextField
                  className=""
                  InputLabelProps={{ className: "textfield" }}
                  InputProps={{ className: "textfield__label" }}
                  id="standard-basic"
                  name="duration_personal"
                  label={t("Duration")}
                  required
                  value={personalvalues.duration_personal}
                  onChange={handleInputChange}
                />
                <TextField
                  className=""
                  InputLabelProps={{ className: "textfield" }}
                  InputProps={{ className: "textfield__label" }}
                  id="standard-basic"
                  name="price_personal"
                  label={t("Price")}
                  value={personalvalues.price_personal}
                  onChange={handleInputChange}
                />

                {/* </form> */}
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <div id="personalwrk_head">
                  <h4>
                    {t("Which workers can")} <br /> {t("perform this service")}
                  </h4>
                </div>
                <div className="all_worker_label">
                  <p>{t("All workers")}</p>
                </div>

                {workersData.map((worker) => {
                  return (
                    <div className="worker_div">
                      {console.log(
                        "worker._id === personalvalues.worker[0]._id ===",
                        worker._id === personalvalues.worker[0].id
                      )}
                      {flag === true && (
                        <input
                          checked={worker._id === personalvalues.worker[0].id}
                          className="radio_input"
                          type="radio"
                          value={worker._id}
                          name="myRadio"
                          onChange={(e) => handlePersonalWorker(e)}
                        />
                      )}

                      <Avatar
                        style={{ width: "32px", height: "32px" }}
                        alt="Remy Sharp"
                        src={
                          worker.image === ""
                            ? process.env.REACT_APP_DEFAULT_IMAGE
                            : worker.image
                        }
                      />
                      <label htmlFor={worker.name} className="worker_label">
                        {worker.name}
                      </label>
                    </div>
                  );
                })}
                {/* {workers} */}
              </Grid>
            </form>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            className="returnButton"
            variant="contained"
            onClick={handlePersonalClose}
            color="primary"
          >
            {t("Return")}
          </Button>
          <Button
            className="removeButton"
            variant="contained"
            onClick={handleRemoveService}
            color="primary"
          >
            {t("Remove")}
          </Button>
          <Button
            className="createbtn"
            variant="contained"
            onClick={() => updatePersonalService()}
            color="primary"
          >
            {t("Update")}
          </Button>
        </DialogActions>
      </Dialog>
      <div>
        <Dialog
          // className={classes.dialogPaper}
          //   fullWidth={fullWidth}
          //   maxWidth={maxWidth2}
          open={canclepopup}
          onClose={handleClose}
          aria-labelledby="max-width-dialog-title"
        >
          {/* <DialogTitle id="max-width-dialog-title">Optional sizes</DialogTitle> */}
          <DialogContent>
            <DialogContentText>
              <div
                style={{
                  margin: "62px 0px",
                  fontSize: "22px",
                  color: "#d61c38",
                  textAlign: "center",
                }}
              >
                {t("Are you sure you want to terminate the service?")}
              </div>
            </DialogContentText>
            <div className="warningservice">
              {t("the service will permanently disappear from your center")}
            </div>
          </DialogContent>
          <Grid container style={{ justifyContent: "space-evenly" }}>
            <Grid item xs={12} md={4} lg={4}>
              {" "}
              <Button
                className="returnBtnGobackservice"
                onClick={handleCanclePopupClose}
                color="primary"
              >
                {t("Go Back")}
              </Button>
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              {" "}
              <Button
                className="returnBtnCancleservice"
                onClick={handleDeativateService}
                color="primary"
              >
                {t("Deactivate")}
              </Button>
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              {" "}
              <Button
                className="returnBtncancleadviceservice"
                onClick={handleDeactivateandAdvise}
                color="primary"
              >
                {t("Deactivate and Cancel Appointments")}
              </Button>
            </Grid>
          </Grid>
        </Dialog>
      </div>

      <div>
        <Dialog
          // className={classes.dialogPaper}
          //   fullWidth={fullWidth}
          //   maxWidth={maxWidth2}
          open={canclepopupconfirm}
          onClose={handleClose}
          aria-labelledby="max-width-dialog-title"
        >
          {/* <DialogTitle id="max-width-dialog-title">Optional sizes</DialogTitle> */}
          <DialogContent>
            {/* <DialogContentText>
            Are you sure you want to terminate the service?
            </DialogContentText> */}
            <div
              style={{
                margin: "1px 41px",
                fontSize: "19px",
                textAlign: "center",
                marginBottom: "86px",
                marginTop: " 38px",
                color: "#d61c38",
              }}
            >
             {t("you want to notify your clients informing them of the cancellation of appointments")}
            </div>
          </DialogContent>
          <Grid
            container
            style={{ justifyContent: "space-evenly", marginBottom: "36px" }}
          >
            <Grid
              item
              xs={12}
              md={6}
              lg={6}
              style={{ display: "flex", justifyContent: "center" }}
            >
              {" "}
              <Button
                style={{
                  width: "120px",
                  height: "30px",
                  backgroundColor: "#d61c38",
                  color: "white",
                  borderRadius: "21px",
                  border: "2px solid black",
                }}
                // className="returnBtnGoback"
                onClick={handleConfirmPopupClose}
                color="primary"
              >
                {t("No")}
              </Button>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              lg={6}
              style={{ display: "flex", justifyContent: "center" }}
            >
              {" "}
              <Button
                style={{
                  width: "120px",
                  height: "30px",
                  backgroundColor: "#00ad22",
                  color: " white",
                  borderRadius: "21px",
                  border: "2px solid black",
                }}
                className="returnBtnCancle"
                onClick={handleNotificationConfirm}
                color="primary"
              >
                {t("Yes")}
              </Button>
            </Grid>
          </Grid>
        </Dialog>
      </div>
      <div>
        <Dialog
          // className={classes.dialogPaper}
          //   fullWidth={fullWidth}
          //   maxWidth={maxWidth2}
          open={canclepopupnotification}
          onClose={handleClose}
          aria-labelledby="max-width-dialog-title"
        >
          {/* <DialogTitle id="max-width-dialog-title">Optional sizes</DialogTitle> */}
          <DialogContent>
            <DialogContentText>
              <div
                style={{
                  margin: "0px 78px",
                  marginTop: "37px",
                  marginBottom: " 35px",
                  textAlign: "center",
                  color: "#d61c38",
                  fontSize: "19px",
                }}
              >
               {t(" An email has been sent to your clients informing of the cancellation")}
              </div>
            </DialogContentText>
            <div
              style={{
                textAlign: "center",
                margin: "10px 67px",
                fontSize: " 19px",
                color: "#00ad22",
              }}
            >
             {t(" You do not have to call your clients 1x1 to notify them savetime will send them an email and a push notification so that they are aware of the cancellation")}
            </div>
          </DialogContent>
          <Grid container style={{ justifyContent: "space-evenly" }}>
            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              {" "}
              <Button
                style={{
                  width: "120px",
                  height: "30px",
                  border: "2px solid black",
                  borderRadius: "20px",
                  backgroundColor: "#00ad22",
                  color: "white",
                  marginBottom: "5px",
                }}
                onClick={handleOkayPopupClose}
                color="primary"
              >
                {t("okay")}
              </Button>
            </Grid>
          </Grid>
        </Dialog>
      </div>
    </>
  );
}

export default UpdateService;
