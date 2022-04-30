import {
  Button,
  Grid,
  InputAdornment,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import "./cancleAppoinmentModal.css";
import { useSelector } from "react-redux";
import { errorToaster, successToaster } from "../common/common";
import instance from "../axios";
import requests from "../requests";
import { useTranslation } from "react-i18next";

function CancleAppoinmentModal(props) {
  const {t} = useTranslation();
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("md");
  const [maxWidth2, setMaxWidth2] = React.useState("sm");
  const [maxWidth3, setMaxWidth3] = React.useState("sm");
  const token = useSelector((state) => state.token);
  const loginData = useSelector((state) => state.loginData);
  const [serviceList, setServiceList] = useState([]);
  const [workersData, setWorkersData] = useState([]);

  const [servicePrice, setServicePrice] = useState(workerAppoinmentData?.price);

  const [selectedworker, setSelectedworker] = useState(
    workerAppoinmentData?.workerData[0]?._id
  );
  const [selectedservice, setSelectedservice] = useState(
    workerAppoinmentData?.serviceData[0]?._id
  );

  const [canclepopup, setcanclepopup] = useState(false);
  const [confirmpopup, setconfirmpopup] = useState(false);

  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedWorkerId, setSelectedWorkerId] = useState("");

  const [service, setService] = useState("");
  const [worker, setWorker] = useState("");

  const workerAppoinmentData = useSelector(
    (state) => state.workerAppoinmentData
  );
  const [input, setInput] = useState({});

  const handleUpdateAppoinment = async () =>{
    let obj = {
        telephone:input.telephone,
        emailAddress:input.emailAddress,
        workerId:selectedworker,
        serviceId:selectedservice,
        price:servicePrice,
        suggestion:input.note,
        
    };
    const response = await instance
      .put(
        `${requests.fetchUpdateAppoinment}/${workerAppoinmentData._id}`,
        obj,

        {
          headers: {
            Authorization: token,
          },
        }
      )
      .catch((error) => {
        let errorMessage = error.response.data.message;
        errorToaster(errorMessage);
      });
    if (response && response.data) {
      successToaster(t("Appoinment Updated"));
    }
    props.onDeactive();
  }
  const handleUpdateAppoinmentAdvice = async () =>{
    let obj = {
        telephone:input.telephone,
        emailAddress:input.emailAddress,
        workerId:selectedworker,
        serviceId:selectedservice,
        price:servicePrice,
        suggestion:input.note,
        
    };
    const response = await instance
      .put(
        `${requests.fetchUpdateAppoinment}/${workerAppoinmentData._id}`,
        obj,

        {
          headers: {
            Authorization: token,
          },
        }
      )
      .catch((error) => {
        let errorMessage = error.response.data.message;
        errorToaster(errorMessage);
      });
    if (response && response.data) {
      successToaster(t("Appoinment Updated"));
    }
    props.onDeactive();
  }

  const handleClose = () => {
    setcanclepopup(true);
    // props.onDeactive();
    // setOpen(false);
  };
  const handleCanclePopupClose = () => {
    setcanclepopup(false);
    // setOpen(false);
  };
  const handleCloseCancleAllPopup = async () => {
    setcanclepopup(false);
    props.onDeactive();
    let obj = {
        appointmentId: workerAppoinmentData._id,
    };
    const response = await instance
      .put(
        requests.fetchCancleAppoinment,
        obj,

        {
          headers: {
            Authorization: token,
          },
        }
      )
      .catch((error) => {
        let errorMessage = error.response.data.message;
        errorToaster(errorMessage);
      });
    if (response && response.data) {
      successToaster(t("Appoinment Cancled"));
    }
    props.onDeactive();
    // setOpen(false);
  };
  const handleCloseCancleandAdvise = async () => {
    setcanclepopup(false);
    setconfirmpopup(true);
    let obj = {
        appointmentId: workerAppoinmentData._id,
        isMailSend: true
    };
    const response = await instance
      .put(
        requests.fetchCancleAppoinment,
        obj,

        {
          headers: {
            Authorization: token,
          },
        }
      )
      .catch((error) => {
          console.log(error)
        let errorMessage = error.response.data.message;
        errorToaster(errorMessage);
      });
    if (response && response.data) {
      successToaster(t("Appoinment Cancled"));
    }
    props.onDeactive();
   
    //   props.onDeactive();
    // setOpen(false);
  };
  const handleCloseConfirm = () => {
    setconfirmpopup(false);
    props.onDeactive();
    // setOpen(false);
  };

  const handelChange = async (e) => {
    e.preventDefault();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getWorkers();
    getServices();
  }, []);


  const handleChangeWorker = (event) => {
    const name = event.target.value;
    if (name != selectedworker) {
      let newSelectedWorker = workersData.filter((item) => item._id == name);

      if (newSelectedWorker.length > 0) {
        setSelectedworker(newSelectedWorker[0]._id);
      }
    }
  };

  const handleChangeService = (event) => {
    const name = event.target.value;
    if (name != selectedservice) {
      let newSelectedService = serviceList.filter((item) => item._id == name);
      if (newSelectedService.length > 0) {
        setSelectedservice(newSelectedService[0]._id);
        setServicePrice(newSelectedService[0].price);
      }
    }
  };
  //   const handleChangeWorker = (event) => {
  //     setWorker(event.target.value);
  //   };

  useEffect(() => {
    let serviceId1 = serviceList.find(
      ({ serviceName }) => serviceName === service
    );

    setSelectedServiceId(serviceId1?._id);
  }, [service]);

  useEffect(() => {
    let workerId1 = workersData.find(({ name }) => name === worker);

    setSelectedWorkerId(workerId1?._id);
  }, [worker]);

  useEffect(() => {
    let obj = {
      name: workerAppoinmentData.name,
      emailAddress: workerAppoinmentData.emailAddress,
      telephone: workerAppoinmentData.telephone,
      price: workerAppoinmentData.price,
    };
    setInput(obj);
    setServicePrice(workerAppoinmentData?.price);
    setSelectedworker(workerAppoinmentData?.workerData[0]?._id);
    setSelectedservice(workerAppoinmentData?.serviceData[0]?._id);
  }, [workerAppoinmentData]);

  const getWorkers = async () => {
    const response = await instance
      .get(`${requests.fetchGetWorkers}/${loginData._id}`, {
        headers: {
          Authorization: token,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.message;
        errorToaster(errorMessage);
      });

    if (response && response.data) {
      setWorkersData(response.data.data);

      //   props.onDeactive();

      // addToast("worker created", { appearance: 'success', autoDismiss: true })
    }
  };

  const getServices = async () => {
    const response = await instance
      .get(`${requests.fetchGetService}${loginData._id}`, {
        headers: {
          Authorization: `${token}`,
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
      setServiceList(response.data.data);
    }
  };

  return (
    <div>
    
      <Dialog
        fullWidth={fullWidth}
        // style={{width:'100%'}}
        maxWidth={maxWidth}
        open={props.activate}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogContent>
          <Grid container>
            <Grid items xs={12} style={{ position: "relative" }}>
              <div className="papers-header">
                <Typography style={{ textAlign: "center" }} variant="h1">
                  {t("Quote From ")}
                  {workerAppoinmentData.name}
                </Typography>
              </div>
              <div className="close-icon">
                {/* <Close className="close" onClick={(e) => handleClose(e)} /> */}
                <i
                  class="fas fa-times close"
                  onClick={(e) => handleCloseConfirm(e)}
                ></i>
              </div>
            </Grid>
            <Grid item xs={12} md={6} lg={6} className="workeritemleft">
              <div className="workerImage">
                <img
                  alt="image"
                  src={
                    workerAppoinmentData.clientData[0]?.image.length > 0
                      ? workerAppoinmentData.clientData[0]?.image
                      : "https://savetime-image.s3.eu-west-3.amazonaws.com/Person-b5c47224-332f-4862-8268-1e822350ff51.png"
                  }
                  width="250"
                  height="250"
                  style={{ border: "2px solid black", borderRadius: "100%" }}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6} lg={6} className="workeritemright">
              <TextField
                id="standard-start-adornment"
                required
                name="telephone"
                value={input.telephone}
                onChange={(e) => handelChange(e)}
                className="name-field"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">{t("Telephone")}</InputAdornment>
                  ),
                }}
              />
              <TextField
                id="standard-start-adornment"
                required
                name="emailAddress"
                value={input.emailAddress}
                onChange={(e) => handelChange(e)}
                className="name-field"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">{t("Email")}</InputAdornment>
                  ),
                }}
              />
              <div>
                <span>Workers{":"} </span>
                <Select
                  // style={{ width: "200px" }}
                  onChange={(e) => handleChangeWorker(e)}
                  defaultValue={selectedworker}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">{t("Workers")}</InputAdornment>
                    ),
                  }}
                  className="name-field-select"
                >
                  {workersData.length > 0 &&
                    workersData.map((item) => (
                      <MenuItem className="MenuItem" value={item._id}>
                        <span className="workername">{item.name}</span>
                      </MenuItem>
                    ))}
                </Select>
              </div>
              <div>
                <span>{t("Service")}{":"} </span>
                <Select
                  // style={{ width: "200px" }}
                  onClick={(e) => handleChangeService(e)}
                  defaultValue={selectedservice}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">{t("Service")}</InputAdornment>
                    ),
                  }}
                  className="name-field-select"
                >
                  {serviceList.length > 0 &&
                    serviceList.map((item) => (
                      <MenuItem className="MenuItem" value={item._id}>
                        <div>
                          <span className="workername">{item.serviceName}</span>
                        </div>
                      </MenuItem>
                    ))}
                </Select>
              </div>
              <TextField
                id="standard-start-adornment"
                required
                name="price"
                value={servicePrice}
                onChange={(e) => handelChange(e)}
                className="name-field"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">{t("Price")}</InputAdornment>
                  ),
                }}
              />
              {/* <Select
                // style={{ width: "200px" }}
                //   onClick={(e) => handleChange(e)}
                //   defaultValue={selectedworker._id}
                inputProps={{
                  startAdornment: (
                    <InputAdornment position="start">Time</InputAdornment>
                  ),
                }}
                className="name-field"
              >
                {
                // centerWorkerList.length > 0 &&
                //         centerWorkerList.map((item) => (
                          <MenuItem className="MenuItem" 
                        //   value={item._id}
                          >
                            <div >
                              
                              <span className="workername">From {workerAppoinmentData.startTime} to {workerAppoinmentData.endTime}</span>
                            </div>
                          </MenuItem>
                        // ))
                        }
              </Select> */}
              <div className="name-field">
                {t("Time")} :
                <span>
                  {t("From")} {workerAppoinmentData.startTime} {t("to")}{" "}
                  {workerAppoinmentData.endTime}
                </span>
              </div>
              <div className="name-field">
                {t("Condition")}:{" "}
                {props.appoinmentTime.nextAppointment == true ? (
                  <span>
                    {t("Service To be Perfomed")} <span className="dot1"> </span>
                  </span>
                ) : props.appoinmentTime.previousAppointment == true ? (
                  <span>
                    {t("Service Perfomed")} <span className="dot3"> </span>
                  </span>
                ) : props.appoinmentTime.runningAppointment == true ? (
                  <span>
                    {t("Service Perfoming")} <span className="dot2"> </span>
                  </span>
                ) : null}
              </div>
              <TextField
                id="standard-start-adornment"
                required
                name="note"
                value={input.note}
                onChange={(e) => handelChange(e)}
                className="name-field"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">{t("Note")}:</InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12} md={4} lg={4}>
              <Button className="returnBtncancleApp" onClick={handleClose}>
                {t("Cancle Appoinment")}
              </Button>
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <Button className="saveBtncancleApp" onClick={()=>handleUpdateAppoinment()}>{t("Save")}</Button>
            </Grid>
            <Grid item xs={12} md={4} lg={4} onClick={()=>handleUpdateAppoinmentAdvice()}>
              <Button className="saveAdviseBtncancleApp">
                {" "}
                {t("Save and advice")}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions> */}
      </Dialog>
      <div>
        <Dialog
          // className={classes.dialogPaper}
          fullWidth={fullWidth}
          maxWidth={maxWidth2}
          open={canclepopup}
          onClose={handleClose}
          aria-labelledby="max-width-dialog-title"
        >
          {/* <DialogTitle id="max-width-dialog-title">Optional sizes</DialogTitle> */}
          <DialogContent>
            {/* <DialogContentText>
              their clients have been notified informing of the cancellation
            </DialogContentText> */}
            <div className="warning">
             {t("Are you sure you want to cancel")} {workerAppoinmentData.name}{" "}
              {t("appointment")}
            </div>
          </DialogContent>
          <Grid container style={{justifyContent:'space-evenly'}}>
            <Grid item xs={12} md={4} lg={4}>
              {" "}
              <Button
                className="returnBtnGoback"
                onClick={handleCanclePopupClose}
                color="primary"
              >
                {t("Go Back")}
              </Button>
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              {" "}
              <Button
                className="returnBtnCancle"
                onClick={handleCloseCancleAllPopup}
                color="primary"
              >
                {t("Cancle")}
              </Button>
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              {" "}
              <Button
                className="returnBtncancleadvice"
                onClick={handleCloseCancleandAdvise}
                color="primary"
              >
                {t("Cancel and Advise")}
              </Button>
            </Grid>
          </Grid>
        </Dialog>
      </div>
      {/* ////////////////////////// */}
      <div>
        <Dialog
          // className={classes.dialogPaper}
          fullWidth={fullWidth}
          maxWidth={maxWidth3}
          open={confirmpopup}
          onClose={handleClose}
          aria-labelledby="max-width-dialog-title"
        >
          {/* <DialogTitle id="max-width-dialog-title">Optional sizes</DialogTitle> */}
          <DialogContent>
            <DialogContentText>
              <div className="titleconfirm">
                {t("An email has been sent to")} {workerAppoinmentData.name} 
                {t("informing of the cancellation")}
              </div>
            </DialogContentText>
            <div className="contentconfirm">
              {t("Do not worry about contacting you savetime will send you an email and a push notification so that you are aware of the cancellation")}
            </div>
          </DialogContent>
          <Grid container style={{ display: "flex", justifyContent: "center" }}>
            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              {" "}
              <Button
                className="confirmbtn"
                onClick={handleCloseConfirm}
                color="primary"
              >
                {t("Okey")}
              </Button>
            </Grid>
          </Grid>
        </Dialog>
      </div>
    </div>
  );
}

export default CancleAppoinmentModal;
