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
import "./updatecollective.css";

import Schedule from "../../../../center/Schedule";
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
    textDecorationColor: "#00ad22",
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

function UpdateCollectiveService({
  isOpen,
  isClose,
  selectedService,
  getService,
}) {
  let initailFValuescollective = {
    name_collective: selectedService.serviceName,
    duration_collective: selectedService.duration,
    price_collective: selectedService.price,
    numofperson_collective: selectedService.maxPerson,

    nameofworkers: [
      {
        id: selectedService?.workerData[0]?._id,
      },
    ],
    defaultSchedule: selectedService.defaultSchedule,
    customDate: [],
  };
  const {t} = useTranslation();
  const language = useSelector(state => state.language)
  const initialValueselectedService = {
    serviceID: "",
    serviceName: "",
    serviceDuration: "",
  };

  const dispatch = useDispatch();
  const history = useHistory();

  const loginData = useSelector((state) => state.loginData);
  const collectiveDefaultSchedule = useSelector(
    (state) => state.collectiveDefaultSchedule
  );

  const token = useSelector((state) => state.token);
  const logincenterToken = useSelector(state => state.selectedLoginCenter.token)
  const [workersData, setWorkersData] = useState([]);

  const [collectivevalues, setCollectiveValues] = useState(
    initailFValuescollective
  );
  const [flag, setFlag] = useState(true);

  const [collectiveServiceData, setCollectiveServiceData] = useState({});
  const [value, setValue] = useState({});

  const [canclepopup, setCanclepopup] = useState(false);
  const [canclepopupconfirm, setCanclepopupconfirm] = useState(false);
  const [canclepopupnotification, setCanclepopupnotification] = useState(false);

  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("md");

  const classes = useStyles();

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
    successToaster(t("Collective Service Deleted!"));
    handlePersonalClose();
    getService();
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

  const handlePersonalClose = () => {
    isClose(false);

    let tempInitailFValuescollective = {
      name_collective: "",
      duration_collective: "",
      price_collective: "",
      numofperson_collective: "",

      nameofworkers: [
        {
          id: "",
        },
      ],
      defaultSchedule: [],
      customDate: [],
    };
    setCollectiveValues(tempInitailFValuescollective);
  };

  // useForceUpdate();
  const handleInputChangecollective = (e) => {
    const { name, value } = e.target;
    setCollectiveValues({
      ...collectivevalues,
      [name]: value,
    });
    // if(Object.keys(collectivevalues).length >= 7){
    //   dispatch(setCollectiveService(collectivevalues))
    // }
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
    fetchWorkers();
  }, []);

  useEffect(() => {
    if (flag === false) {
      setFlag(true);
    }
  }, [flag]);

  const handleselectworkers = (event) => {
    // if (event.target.checked === true) {
    //     let id = { id: event.target.value };

    //     initailFValuescollective.nameofworkers.splice(
    //         0,
    //         initailFValuescollective.nameofworkers.length
    //     );
    //     initailFValuescollective.nameofworkers.push(id);
    //     console.log(initailFValuescollective, "initial");
    // }

    // if (Object.keys(collectivevalues).length >= 7) {
    //     dispatch(setCollectiveService(collectivevalues));
    // }

    if (event.target.checked === true) {
      var id = { id: event.target.value };
      let tempVar = collectivevalues;
      tempVar.nameofworkers[0] = id;
      setCollectiveValues(tempVar);
    }
    setFlag(false);
  };

  const handleTimeArrayService = (data) => {
    setValue(data);
  };

  const handleUpdateData = async () => {
    let body = {
      serviceName: collectivevalues.name_collective,
      duration: collectivevalues.duration_collective,
      price: collectivevalues.price_collective,
      workerId: collectivevalues.nameofworkers,
      defaultSchedule: collectiveDefaultSchedule,
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
      successToaster(t("Collective Service Updated!"));
      handlePersonalClose();
      getService();
    }
  };

  return (
    <>
      <Dialog
        className="collectiveDilog"
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={isOpen}
        onClose={() => handlePersonalClose()}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {t("Update Collective Service")}
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <form>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  className="collectivegrid"
                >
                  <TextField
                    className="collectiveinput"
                    InputLabelProps={{ className: "textfield" }}
                    InputProps={{ className: "textfield__label" }}
                    id="standard-basic"
                    name="name_collective"
                    label={t("Name")}
                    required
                    value={collectivevalues.name_collective}
                    onChange={handleInputChangecollective}
                  />
                  <TextField
                    className="collectiveinput"
                    InputLabelProps={{ className: "textfield" }}
                    InputProps={{ className: "textfield__label" }}
                    id="standard-basic"
                    name="duration_collective"
                    label={t("Duration")}
                    required
                    value={collectivevalues.duration_collective}
                    onChange={handleInputChangecollective}
                  />
                  <TextField
                    className="collectiveinput"
                    InputLabelProps={{ className: "textfield" }}
                    InputProps={{ className: "textfield__label" }}
                    id="standard-basic"
                    name="price_collective"
                    label={t("Price")}
                    value={collectivevalues.price_collective}
                    onChange={handleInputChangecollective}
                  />
                  <TextField
                    className="collectiveinput"
                    InputLabelProps={{ className: "textfield" }}
                    InputProps={{ className: "textfield__label" }}
                    id="standard-basic"
                    name="numofperson_collective"
                    label={t("Max. Num of People")}
                    required
                    value={collectivevalues.numofperson_collective}
                    onChange={handleInputChangecollective}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  {workersData.map((worker) => {
                    return (
                      <div className="worker_chechbox_div">
                        {flag === true && (
                          <input
                            checked={
                              worker._id ===
                              collectivevalues.nameofworkers[0].id
                            }
                            className="worker_input"
                            type="radio"
                            name="myRadio"
                            id={worker.name}
                            value={worker._id}
                            onChange={(e) => handleselectworkers(e)}
                          />
                        )}
                        <Avatar
                          style={{ width: "32px", height: "32px" }}
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
                </Grid>
              </form>
            </Grid>
            <Grid className="div-2" item xs={12} sm={12} md={6} lg={6} xl={6}>
              <Schedule
                type={"collectiveService"}
                collectivevalues={collectivevalues}
                handleTimeArrayService={handleTimeArrayService}
                Schedules={value}
                collectiveServiceData={collectiveServiceData}
                data={{ typeOfSchedule: "default" }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        {/* <DialogActions> */}
          <Grid container>
            <Grid item xs={12} md={4} lg={4} style={{display:'flex',justifyContent:'center'}}>
              <Button
                className="returnButton"
                variant="contained"
                onClick={() => handlePersonalClose()}
                color="primary"
              >
                {t("Return")}
              </Button>
            </Grid>
            <Grid item xs={12} md={4} lg={4} style={{display:'flex',justifyContent:'center'}}>
              <Button
                className="removeButton"
                variant="contained"
                onClick={() => handleRemoveService()}
                color="primary"
              >
                {t("Remove")}
              </Button>
            </Grid>
            <Grid item xs={12} md={4} lg={4} style={{display:'flex',justifyContent:'center'}}>

            <Button
              className="createbtn"
              variant="contained"
              onClick={() => handleUpdateData()}
              color="primary"
            >
              {t("Update")}
            </Button>
            </Grid>
          </Grid>
        {/* </DialogActions> */}
      </Dialog>

      {/*  */}
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
                // color="primary"
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
              {t("You do not have to call your clients 1x1 to notify them savetime will send them an email and a push notification so that they are aware of the cancellation")}
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

export default UpdateCollectiveService;
