import React, { useState, useEffect } from "react";
import { Link, useHistory, withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import useMediaQuery from "@material-ui/core/useMediaQuery";

//Form Controll
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import SkipNextIcon from "@material-ui/icons/SkipNext";
// import Header from '../components/Header';
import { Collapse, DialogTitle, Grid, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

import Header from "../components/Header";
import Footer from "../components/Footer";

//For React Calender
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import * as moment from "moment";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import "flatpickr/dist/themes/material_green.css";
import "react-datepicker/dist/react-datepicker.css";
import "./appointment.css";

import instance from "../axios";
import requests from "../requests";
import { useSelector, useDispatch } from "react-redux";
import { successToaster, errorToaster } from "../common/common";
import {
  customArraydata,
  selectedRowData,
  centerDataForArray,
  setUserLoginStatus,
  setAppointDetails,
  setAppointBookModel,
} from "../redux/actions/actions";
import RepeatAppoinment from "./RepeatAppoinment";
import { useTranslation } from "react-i18next";

export default function Appointment(props) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const language = useSelector(state => state.language)
  const history = useHistory();

  const [open, setOpen] = useState(false);
  const [service, setService] = React.useState("");

  const [workerName, setWorkerName] = useState();
  const [timing, setTiming] = useState("");
  const [centerData, setCenterData] = useState();

  // const centerData = useSelector(state => state.centerData)
  //Time Split
  const [startDate, setStartDate] = useState(new Date());
  const [currentIndex, setCurrentIndex] = useState(0);

  //worker services
  const [workerService, setWorkerService] = useState([]);
  const [workerId, setWorkerId] = useState("");
  const [file, setFile] = useState(null);

  //calender value
  const theme = useTheme();
  const token = useSelector((state) => state.token);
  const loginData = useSelector((state) => state.loginData);

  //repeateAppoinment
  const [activate, setActivate] = useState(false);

  const selectedCenterId = useSelector((state) => state.selectedCenter._id);
  const selectedRowTime = useSelector((state) => state.selectedRowData.cTime);
  const openAppointmentBookModel = useSelector(
    (state) => state.openAppointmentBookModel
  );
  const appointmentDetails = useSelector((state) => state.appointmentDetails);
  const userLoginStatus = useSelector((state) => state.userLoginStatus);

  //dilog for appoinment confirm
  const [appointmentConfirmOpen, setAppointmentConfirmOpen] =
    React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("sm");

  const [input, setInput] = useState({
    name: loginData.name,
    emailAddress: loginData.emailAddress,
  });

  const [textInput, selectedTextInput] = useState("");

  const handleClickOpen = () => {
    setAppointmentConfirmOpen(true);
  };

  const closeActivate = async () => {
    setActivate(false);
  };

  const handleAppointmentClose = () => {
    setAppointmentConfirmOpen(false);
    dispatch(setAppointDetails({}));
    dispatch(setUserLoginStatus(false));
    dispatch(setAppointBookModel(false));
  };

  const handleInput = (e) => {
    e.preventDefault();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleTextInput = (e) => {
    e.preventDefault();
    selectedTextInput(e.target.value);
  };

  const currentDate = "2021-06-15";

  const useStyles = makeStyles({
    table: {
      minWidth: 500,
    },
    sticky: {
      position: "sticky",
      left: 0,
      background: "white",
      boxShadow: "5px 2px 5px grey",
    },
  });
  const classes = useStyles();

  useEffect(() => {
   
    if (openAppointmentBookModel) {
      setAppointmentConfirmOpen(true);
    }
    getCenterWorker();
  }, []);

  const getCenterWorker = async () => {
    const obj = {
      name: loginData.name,
      emailAddress: loginData.emailAddress,
      phoneNumber: loginData.phonenumber,
    };
    setInput(obj);

    const data = await fetch(`http://35.180.150.125/api/center/centerWorker?lang=${language}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        centerId: selectedCenterId,
        Date: `${moment(startDate).format("DD-MM-YYYY")}`,
      }),
    });

    const res = data.json().then((data) => {
      if(data?.data?.length>0){
        
        setCenterData(data?.data[0]);
      }
      // dispatch(centerDataForArray(data.data[0]))
    });
  };

  const handleWorker = async (value) => {
    const data = await fetch(`http://35.180.150.125/api/center/centerWorker?lang=${language}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        centerId: selectedCenterId,
        Date: `${moment(value).format("DD-MM-YYYY")}`,
      }),
    });

    const res = data.json().then((data) => {
      setCenterData(data.data[0]);
      // dispatch(centerDataForArray(data.data[0]))
    });
  };

  let workers =
    centerData && centerData.workerData ? centerData.workerData : [];
  let noOfRows =
    centerData &&
    centerData.centerScheduleData[0] &&
    centerData.centerScheduleData[0].splitTime
      ? centerData.centerScheduleData[0].splitTime.length
      : 0;

  let array1 = [];
  for (let i = 0; i < noOfRows; i++) {
    let arr = [];
    var fo = {
      time: centerData.centerScheduleData[0].splitTime[i],
    };
    arr.push(fo);
    for (let j = 0; j < centerData.workerData.length; j++) {
      for (let k = 0; k < centerData.workerData[j].splitTime.length; k++) {
        var key = "id"; //`worker${j + 1}`
        var wo = {};
        if (
          centerData.centerScheduleData[0].splitTime[i] ==
          centerData.workerData[j].splitTime[k]
        ) {
          wo[key] = centerData.workerData[j]._id;
          wo.time = centerData.workerData[j].splitTime[k];
          arr.push(wo);
          for (
            let l = 0;
            l < centerData.workerData[j].appointmentData.length;
            l++
          ) {
            if (
              centerData.workerData[j].appointmentData[l].startTime <=
                centerData.workerData[j].splitTime[k] &&
              centerData.workerData[j].appointmentData[l].endTime >
                centerData.workerData[j].splitTime[k]
            ) {
              arr[arr.length - 1].time = "not avaliable";
              break;
            }
          }
          break;
        } else {
          let workerTime = centerData.workerData[j].splitTime.filter((item) => {
            return item == centerData.centerScheduleData[0].splitTime[i];
          });
          if (workerTime.length == 0) {
            wo.id = centerData.workerData[j]._id;
            wo.time = null;
            arr.push(wo);
            break;
          }
        }
      }
    }
    array1.push(arr);
  }

  dispatch(customArraydata(array1));

  const handleWorkerService = async () => {
    const data = await fetch(
      `http://35.180.150.125/api/service/workerServices?lang=${language}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          centerId: "6073ee082ddb00179cddd77d",
          workerId: "6087f4bd72be34372ca7d7aa",
        }),
      }
    );

    const res = data.json().then((data) => {
      setWorkerService(data);
    });
  };

  let serviceId1 = workerService?.find(
    ({ serviceName }) => serviceName === service
  );
  let realServiceId = serviceId1 && serviceId1._id ? serviceId1._id : " ";

  const handleChange = (event) => {
    setService(event.target.value);
  };

  const handleConfirmAppointment = async () => {
    let confirmObj = [
      {
        name: appointmentDetails[0]?.name,
        telephone: appointmentDetails[0]?.telephone,
        emailAddress: appointmentDetails[0]?.emailAddress,
        serviceId: appointmentDetails[0]?.serviceId,
        startTime: appointmentDetails[0]?.startTime,
        Date: appointmentDetails[0]?.Date,
        centerId: appointmentDetails[0]?.centerId,
        workerId: appointmentDetails[0]?.workerId,
        suggestion: "test",
        appointmentBy: "web",
        userId: loginData._id,
      },
    ];
    if (userLoginStatus == true) {
      const data = await instance
        .post(`${requests.fetchAddAppointment}/?lang=${language}`, confirmObj, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        })
        .catch((error) => {
          errorToaster(error.response.data.error.message);
          console.log(error);
          if (error?.response?.data?.message) {
            let errorMessage = error.response.data.message;
            errorToaster(errorMessage);
          } else {
            if (error.response.data.error.message) {
              //  dispatch(setUserLoginStatus(true))
              //  dispatch(setAppointDetails(obj))
              //  errorToaster("Please Login To Book Appointment!")
              //  history.push("/")
            }
          }

          // console.log(errorMessage,"---")
          // history.push("/")
        });
      if (data && data.data) {
        successToaster(t("Appointment Created!"));
      }
    }
    setAppointmentConfirmOpen(false);
    dispatch(setAppointDetails({}));
    dispatch(setUserLoginStatus(false));
    dispatch(setAppointBookModel(false));
  };
  let obj = [
    {
      name: `${input.name}`,
      telephone: `${input.phoneNumber}`,
      emailAddress: `${input.emailAddress}`,
      serviceId: realServiceId,
      startTime: `${timing}`,
      Date: `${moment(startDate).format("DD-MM-YYYY")}`,
      centerId: selectedCenterId,
      workerId: `${workerId}`,
      suggestion: "test",
      appointmentBy: "web",
      userId: loginData._id,
    },
  ];
  const handleCreateAppointment = async () => {
    if(loginData.type=='client'){
     

    const data = await instance
      .post(`${requests.fetchAddAppointment}/?lang=${language}`, obj, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.data?.message) {
          let errorMessage = error.response.data.message;
          errorToaster(errorMessage);
        } 
        // console.log(errorMessage,"---")
        // history.push("/")
      });
    if (data && data.data) {
      successToaster(t("Appointment Created!"));
      getCenterWorker();
    }
  
    handleClose();
  }else {
   
      dispatch(setUserLoginStatus(true));
      dispatch(setAppointDetails(obj));
      errorToaster("Please Login To Book Appointment!");
      history.push("/");
    
  }

  };

  const handleNextWorker = () => {
    setCurrentIndex(currentIndex + 3);
  };

  const handlePreviousWorker = () => {
    setCurrentIndex(currentIndex - 3);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCellClick = async (id, time, e) => {
   
    setWorkerId(id);
    setTiming(time);

    setOpen(true);
    const data = await fetch(
      `http://35.180.150.125/api/service/workerServices?lang=${language}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          centerId: selectedCenterId,
          workerId: `${id}`,
        }),
      }
    );

    const res = data.json().then((data) => {
      setWorkerService(data.data);
    });
    const findMethodForWorker = workers?.find(({ _id }) => _id === id);
    setWorkerName(findMethodForWorker.name);
  };

  //Notes file upload
  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleBackAppoinment = () => {
    history.push("/client/maindashboard");
  };

  return (
    <div className="dash-container">
     
      <Header className="container-header" />
      <div className="grid-container">
        <Grid container spacing={4}>
          <Grid
            item
            xs={12}
            sm={12}
            md={5}
            lg={5}
            xl={5}
            style={{ justifyContent: "center" }}
          >
            <Calendar
              className={["react-calendar"]}
              onChange={(value) => setStartDate(value)}
              // console.log(value,"value")}
              //
              onClickDay={(value) => {
                handleWorker(value);
              }}
              value={startDate}
            />

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={7} lg={7} xl={7}>
            <div
              style={{
                marginLeft: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div align="left">
                <Button
                  id="y"
                  onClick={handlePreviousWorker}
                  disabled={currentIndex === 0 ? true : false}
                >
                  <SkipPreviousIcon />
                </Button>
              </div>
              <div className="item">
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <colgroup>
                      <col style={{ width: "3.5rem" }} />
                      <col style={{ width: "3.5rem" }} />
                      <col style={{ width: "3.5rem" }} />
                      <col style={{ width: "3.5rem" }} />
                    </colgroup>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          style={{ borderTopLeftRadius: "10px", width: "2rem" }}
                          className={workers?.length > 0 ? "table-cell" : ""}
                        >
                          {t("Time")}
                        </TableCell>

                        {workers?.length > 0 ? (
                          workers?.map((item, index) => {
                            if (
                              index >= currentIndex &&
                              index <= currentIndex + 2
                            ) {
                              return (
                                <TableCell
                                  style={{ width: "3.5rem" }}
                                  align="right"
                                >
                                  {item.name}
                                </TableCell>
                              );
                            }
                          })
                        ) : (
                          <>
                            <TableCell
                              style={{ width: "3.5rem" }}
                              // align="right"
                            >
                              {t("Not Available")}
                            </TableCell>
                            <TableCell
                              style={{ width: "3.5rem" }}
                              // align="right"
                            >
                              {t("Not Available")}
                            </TableCell>
                            <TableCell
                              style={{
                                borderTopRightRadius: "10px",
                                width: "3.5rem",
                              }}
                              // align="right"
                            >
                              {t("Not Available")}
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {array1.length > 0 ? (
                        array1.map((row) => {
                          return (
                            <TableRow>
                              {row.map((item, index) => {
                                if (index === 0) {
                                  return (
                                    <TableCell
                                      style={{ width: "3.5rem" }}
                                      component="th"
                                      scope="row"
                                    >
                                      {item.time !== null ? (
                                        <button
                                          id="table-button"
                                          onClick={(e) =>
                                            handleCellClick(
                                              item.id,
                                              item.time,
                                              e
                                            )
                                          }
                                        >
                                          {!item.id ? (
                                            item.time
                                          ) : item.time !== "not avaliable" ? (
                                            ""
                                          ) : (
                                            <span className="dot1"></span>
                                          )}
                                        </button>
                                      ) : (
                                        <button
                                          id="not-avaliable"
                                          disabled={true}
                                        ></button>
                                      )}
                                    </TableCell>
                                  );
                                }

                                if (
                                  index >= currentIndex + 1 &&
                                  index <= currentIndex + 3
                                ) {
                                  return (
                                    <TableCell
                                      style={{ width: "3.5rem" }}
                                      component="th"
                                      scope="row"
                                    >
                                      {item.time !== null ? (
                                        <button
                                          id="table-button"
                                          onClick={(e) =>
                                            handleCellClick(
                                              item.id,
                                              item.time,
                                              e
                                            )
                                          }
                                        >
                                          {!item.id ? (
                                            item.time
                                          ) : item.time !== "not avaliable" ? (
                                            ""
                                          ) : (
                                            <span className="dot1"></span>
                                          )}
                                        </button>
                                      ) : (
                                        <button
                                          id="not-avaliable"
                                          disabled={true}
                                        ></button>
                                      )}
                                    </TableCell>
                                  );
                                }
                              })}
                            </TableRow>
                          );
                        })
                      ) : (
                        <>
                          <TableRow style={{  height: "2rem" }}>
                            <TableCell
                              style={{ width: "2rem", height: "2rem" }}
                            ></TableCell>
                            <TableCell
                              style={{ width: "3.5rem", height: "2rem" }}
                            ></TableCell>
                            <TableCell
                              style={{ width: "3.5rem", height: "2rem" }}
                            ></TableCell>
                            <TableCell
                              style={{ width: "3.5rem", height: "2rem" }}
                            ></TableCell>
                          </TableRow>
                          <TableRow style={{  height: "2rem" }}>
                            <TableCell
                              style={{ width: "2rem", height: "2rem" }}
                            ></TableCell>
                            <TableCell
                              style={{ width: "3.5rem", height: "2rem" }}
                            ></TableCell>
                            <TableCell
                              style={{ width: "3.5rem", height: "2rem" }}
                            ></TableCell>
                            <TableCell
                              style={{ width: "3.5rem", height: "2rem" }}
                            ></TableCell>
                          </TableRow>
                          <TableRow style={{  height: "2rem" }}>
                            <TableCell
                              style={{ width: "2rem", height: "2rem" }}
                            ></TableCell>
                            <TableCell
                              style={{ width: "3.5rem", height: "2rem" }}
                            ></TableCell>
                            <TableCell
                              style={{ width: "3.5rem", height: "2rem" }}
                            ></TableCell>
                            <TableCell
                              style={{ width: "3.5rem", height: "2rem" }}
                            ></TableCell>
                          </TableRow>
                          <TableRow style={{  height: "2rem" }}>
                            <TableCell
                              style={{ width: "2rem", height: "2rem" }}
                            ></TableCell>
                            <TableCell
                              style={{ width: "3.5rem", height: "2rem" }}
                            ></TableCell>
                            <TableCell
                              style={{ width: "3.5rem", height: "2rem" }}
                            ></TableCell>
                            <TableCell
                              style={{ width: "3.5rem", height: "2rem" }}
                            ></TableCell>
                          </TableRow>
                          <TableRow style={{  height: "2rem" }}>
                            <TableCell
                              style={{ width: "2rem", height: "2rem" }}
                            ></TableCell>
                            <TableCell
                              style={{ width: "3.5rem", height: "2rem" }}
                            ></TableCell>
                            <TableCell
                              style={{ width: "3.5rem", height: "2rem" }}
                            ></TableCell>
                            <TableCell
                              style={{ width: "3.5rem", height: "2rem" }}
                            ></TableCell>
                          </TableRow>
                        </>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              <div align="right">
                <Button
                  id="x"
                  onClick={handleNextWorker}
                  disabled={currentIndex === workers.length - 3 ? true : false}
                >
                  <SkipNextIcon />
                </Button>
              </div>
            </div>

            <Grid
              style={{
                margin: " 20px 20px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  marginLeft: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span className="dot1"></span>
                <span>{t("Service to be performed")}</span>
              </div>
              <div style={{ marginLeft: "20px" }}>
                <span className="dot2"></span>
                {t("Performing Service")}
              </div>
              <div style={{ marginLeft: "20px" }}>
                <span className="dot3"></span>
                {t("Service Performed")}
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid container className="footer-btn">
          <Grid
            item
            className="footer-btn-item"
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
          >
            <button
              className="footer-btn-goBack"
              onClick={() => handleBackAppoinment()}
            >
              {t("Go Back")}
            </button>
          </Grid>
        </Grid>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        {/* <DialogTitle id="form-dialog-title">
          <h2>Create Appointment</h2>
        </DialogTitle> */}
        <DialogContent>
          <Grid
            container
            style={{ display: "flex", flexDirection: "column", margin: "auto" }}
          >
            <Grid items xs={12} style={{ position: "relative" }}>
              <div className="papers-header">
                <Typography style={{ textAlign: "center" }} variant="h2">
                  {t("Create Appointment")}
                </Typography>
              </div>
              <div className="close-icon">
                {/* <Close className="close" onClick={(e) => handleClose(e)} /> */}
                <i
                  class="fas fa-times close"
                  onClick={(e) => handleClose(e)}
                ></i>
              </div>
            </Grid>
            <Grid
              className="flex-item"
              item
              xl={12}
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                marginTop: "2rem",
              }}
            >
              <div id="modelForm">
                <p>
                  {t("Day and time")}:
                  {moment(startDate).format("DD-MM-YYYY")} &nbsp;{timing}{" "}
                </p>
              </div>
              {/* <div id="modelForm1" className="rept-app-btn" onClick={()=>setActivate(true)}>
                <p >Repeat appointment</p>
              </div> */}
              <div id="modelForm">
                <p>{t("Work BY")}:{workerName}</p>
              </div>
              <div id="modelForm1">
                <FormControl className={classes.formControl}>
                  <Select
                    value={service}
                    onChange={handleChange}
                    displayEmpty
                    className={classes.selectEmpty}
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value="">
                      <em>{t("Select Service")}</em>
                    </MenuItem>
                    {workerService?.map((item) => (
                      <MenuItem value={item.serviceName}>
                        {item.serviceName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </Grid>
            <Grid item xl={12} style={{ marginLeft: "40px" }}>
              <form
                className="formStyle"
                noValidate
                autoComplete="off"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div className="modelInput">
                  <TextField
                    id="standard-basic"
                    label={t("Name")}
                    name="name"
                    value={input.name}
                    onChange={handleInput}
                  />
                </div>

                <div className="modelInput">
                  <TextField
                    id="standard-basic"
                    label={t("Email")}
                    name="emailAddress"
                    value={input.emailAddress}
                    onChange={handleInput}
                  />
                </div>
                <div className="modelInput">
                  <TextField
                    id="standard-basic"
                    label={t("Telephone")}
                    name="phoneNumber"
                    value={input.phoneNumber}
                    onChange={handleInput}
                  />
                </div>
                {/* <Button
                  variant="contained"
                  component="label"
                  style={{ width: "100px", marginTop: "10px" }}
                >
                  Note

                </Button> */}
                <textarea
                  style={{ marginTop: "10px" }}
                  value={textInput}
                  onChange={handleTextInput}
                ></textarea>
                <input type="file" onChange={handleFileUpload} />
              </form>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            className="dialougeButton1"
            onClick={handleClose}
          >
            {t("Return")}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className="dialougeButton2"
            onClick={handleCreateAppointment}
          >
            {t("Create")}
          </Button>
        </DialogActions>
      </Dialog>
      <div>
        <Dialog
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          open={appointmentConfirmOpen}
          onClose={handleAppointmentClose}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogTitle id="max-width-dialog-title">
            {t("Confirm Appoinment")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <h1>{t("Do You Want To confirm Your Appointment")}</h1>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleAppointmentClose}
              className="dialougeButton1"
              color="primary"
            >
              {t("Close")}
            </Button>
            <Button
              onClick={handleConfirmAppointment}
              className="dialougeButton2"
              color="primary"
            >
              {t("Confirm")}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        {activate ? (
          <RepeatAppoinment
            aptObj={obj[0]}
            activate={activate}
            workerId={workerId}
            workerName={workerName}
            workerService={workerService}
            selectedCenterId={selectedCenterId}
            input={input}
            onDeactive={closeActivate}
            // workerid input services
          />
        ) : null}
      </div>
      <Footer className="container-footer" />
    </div>
  );
}
