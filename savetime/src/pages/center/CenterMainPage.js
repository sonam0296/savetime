import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useSelector, useDispatch } from "react-redux";
import $ from 'jquery'

// import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import "./centerMainPage.css";
import * as moment from "moment";

import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
// import EventCalendar from "react-event-calendar"

// import interactionPlugin from "@fullcalendar/interaction"

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!

import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import SkipNextIcon from "@material-ui/icons/SkipNext";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import {
  Collapse,
  DialogTitle,
  Grid,
  Button,
  DialogContentText,
  Typography,
} from "@material-ui/core";
import {
  centerDataForArray,
  setEventData,
  setEventEndDate,
  setEventStartDate,
  setWorkerAppoinmentData,
  setWorkerLoginStatus,
} from "../../redux/actions/actions";
import { successToaster, errorToaster } from "../../common/common";
import interactionPlugin from "@fullcalendar/interaction";
import { objectOf } from "prop-types";
import { useHistory } from "react-router-dom";
import RepeatAppoinment from "../../Modal/RepeatAppoinment";
import instance from "../../axios";
import requests from "../../requests";
import CancleAppoinmentModal from "../../Modal/CancleAppoinmentModal";
import { useTranslation } from "react-i18next";
import { Language } from "@material-ui/icons";
// import "@fullcalendar/daygrid/main.css";

function CenterMainPage() {
  const { t } = useTranslation();

  const language = useSelector((state) => state.language);
  const dispatch = useDispatch();
  const history = useHistory();
  const [startDate, setStartDate] = useState(new Date());
  const token = useSelector((state) => state.token);
  const [centerData, setCenterData] = useState();
  const loginData = useSelector((state) => state.loginData);
  const logincenterToken = useSelector(state => state.selectedLoginCenter.token)
  const eventData = useSelector((state) => state.eventData);

  const [flag, setFlag] = useState(false);

  //dialog for cancle appoinment
  const [openCancleAppoinment, setOpenCancleAppoinment] = useState(false);
  const [suggetionDialog, setSuggetionDialog] = useState(false);

  //repeateAppoinment
  const [activate, setActivate] = useState(false);
  const [cancleactivate, setCancleActivate] = useState(false);

  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("sm");

  // const centerData = useSelector(state => state.centerData)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [workerId, setWorkerId] = useState("");
  const [timing, setTiming] = useState("");
  const [workerService, setWorkerService] = useState([]);
  const [open, setOpen] = useState(false);
  const [workerName, setWorkerName] = useState();
  const [service, setService] = React.useState("");
  const [array, setArray] = useState([]);
  const [appoinmentTime, setAppoinmentTime] = useState({});
  const [filteredDataPermission, setFilteredDataPermission] = useState([]);
  const [input, setInput] = useState({
    name: "",
    emailAddress: "",
    phoneNumber: "",
  });
  const [workersData, setWorkersData] = useState([]);
  const permissionData = useSelector((state) => state.loginData.permissions);
  const [permissions, setpermissions] = useState(permissionData);

  // const [eventData,setEventData] = useState([])

  const dragItem = useRef();
  const [dragging, setDragging] = useState(false);
  const [event, setEvent] = useState([]);
  // const [calenderStartDate,setcalenderStartDate] = useState("")
  // const [endDate,setEndDate] = useState("")
  const eventStartDate = useSelector((state) => state.eventStartDate);
  const eventEndDate = useSelector((state) => state.eventEndDate);

  const handleInput = (e) => {
    e.preventDefault();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const closeActivate = async () => {
    setActivate(false);
  };
  const closeCancleActivate = async () => {
    setCancleActivate(false);
  };

  const handleOpenCancleAppoinment = () => {
    setOpenCancleAppoinment(true);
  };

  const handleCloseCancleAppoinment = () => {
    setOpenCancleAppoinment(false);
  };

  const handleSuggetionOpen = () => {
    setSuggetionDialog(true);
  };

  const handleSuggestionClose = () => {
    setSuggetionDialog(false);
  };

  const events = [
    {
      start: "2021-07-20",
      end: "2021-07-28",
      eventClasses: "optionalEvent",
      title: "test event",
      description: "This is a test description of an event",
    },
    {
      start: "2021-07-19",
      end: "2021-07-25",
      title: "test event1",
      description: "This is a test description of an event",
      data: "you can add what ever random data you may want to use later",
    },
  ];

  let serviceId1 = workerService.find(
    ({ serviceName }) => serviceName === service
  );
  let realServiceId = serviceId1 && serviceId1._id ? serviceId1._id : " ";

  const handleChange = (event) => {
    setService(event.target.value);
  };

  const centerId = loginData._id;

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
    getCenterWorker();
    fetchWorkers();
    dispatch(setWorkerLoginStatus(true));
  }, []);

  useEffect(() => {
    console.log(permissions, "perm");
    const permission = Object.keys(permissions);
    console.log(permission, "==");
    const filtered = permission.filter((key) => {
      return permissions[key];
    });
    console.log(filtered);
    if (filtered.length > 0) {
      setFilteredDataPermission(filtered);
    }
  }, [permissionData]);

  const getCenterWorker = async () => {
    const data = await fetch(
      `http://35.180.150.125/api/center/centerWorker?lang=${language}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: logincenterToken,
        },
        body: JSON.stringify({
          centerId: centerId,
          Date: `${moment(startDate).format("DD-MM-YYYY")}`,
        }),
      }
    );

    const res = data.json().then((data) => {
      setCenterData(data?.data[0]);
      // dispatch(centerDataForArray(data.data[0]))
    });
  };

  const handleWorker = async (arg) => {
    // let selectedDate = moment(arg.date).format("DD-MM-YYYY");
    let selectedDate = new Date(arg.dateStr)
    // let newstdate=moment(arg.dateStr,'YYYY-MM-DD').format("DD-MM-YYYY")
    setStartDate(selectedDate);
    // console.log(arg,'arg')
    console.log(selectedDate, 'selectedDate')
    const data = await fetch(
      `http://35.180.150.125/api/center/centerWorker?lang=${language}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: logincenterToken,
        },
        body: JSON.stringify({
          centerId: centerId,
          Date: `${moment(arg.date).format("DD-MM-YYYY")}`,
        }),
      }
    );

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
        wo.dId = `${i + 1}${j + 1}`;
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
              arr[arr.length - 1].time =
                centerData.workerData[j].appointmentData[l];
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

  const setArrayData = () => {
    setArray(array1);
  };

  const handleCellClick = async (id, time, e) => {
    if (typeof time === "object") {
      setCancleActivate(true);
      setAppoinmentTime(time);
      const response = await instance
        .get(`${requests.fetchAppoinmentData}/${time._id}?lang=${language}`, {
          headers: {
            Authorization: logincenterToken,
          },
        })
        .catch((error) => {
          console.log(error, "error");
          let errorMessage = error.response.data.message;
          errorToaster(errorMessage);
        });
      if (response && response) {
        dispatch(setWorkerAppoinmentData(response.data.data[0]));
      }
    } else {
      setWorkerId(id);
      // const Time = JSON.stringify(time);
      setTiming(time);
      let obj = {
        centerId: centerId,
        workerId: `${id}`,
      };
      const response = await instance
        .post(`${requests.fetchWorkerServices}?lang=${language}`, obj, {
          headers: {
            Authorization: logincenterToken,
          },
        })
        .catch((error) => {
          console.log(error, "error");
          let errorMessage;
          if (error?.response?.data?.message) {

            errorMessage = error.response.data.message;
          } else {
            if (error.message == "Request failed with status code 404") {
              console.log('enter')
              errorMessage = "Service Not Found !"
            }
            // errorMessage=error.message
          }
          console.log(errorMessage, '--')
          errorToaster(errorMessage);
        });
      if (response && response.data) {
        setWorkerService(response.data.data);
        setOpen(true);
      }
      console.log(response, 'respon')

      const findMethodForWorker = workers.find(({ _id }) => _id === id);
      setWorkerName(findMethodForWorker.name);
    }

    // setWorkerId(id);
    // console.log(time, "time");
    // const myJSON = JSON.stringify(time);
    // console.log(myJSON, "json");
    // setTiming(time);
    // let obj = {
    //   centerId: centerId,
    //   workerId: `${id}`,
    // };
    // console.log(obj, "obj");
    // const response = await instance
    //   .post(requests.fetchWorkerServices, obj, {
    //     headers: {
    //       Authorization: token,
    //     },
    //   })
    //   .catch((error) => {
    //     console.log(error, "error");
    //     let errorMessage = error.response.data.message;
    //     errorToaster(errorMessage);
    //   });
    // if (response && response.data) {
    //   console.log(response, "res");
    //   setWorkerService(response.data.data);
    // }

    // setOpen(true);
    // const data = await fetch(
    //   "http://35.180.150.125/api/service/workerServices",
    //   {
    //     method: "POST",
    //     headers: {
    //       // 'Accept': 'application/json',
    //       // 'Content-Type': 'application/json',
    //       Authorization: token,
    //     },
    //     body: JSON.stringify({
    //       centerId: centerId,
    //       workerId: `${id}`,
    //     }),
    //   }
    // );

    // const res = data.json().then((data) => {
    //   console.log(data, "dataa");
    //   setWorkerService(data.data);
    // });
    // console.log(workers, "workers");
    // const findMethodForWorker = workers.find(({ _id }) => _id === id);
    // setWorkerName(findMethodForWorker.name);
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

  let obj = [
    {
      name: `${input.name}`,
      telephone: `${input.phoneNumber}`,
      emailAddress: `${input.emailAddress}`,
      serviceId: realServiceId,
      startTime: `${timing}`,
      Date: `${moment(startDate).format("DD-MM-YYYY")}`,
      centerId: centerId,
      workerId: `${workerId}`,
      suggestion: "test",
    },
  ];

  //function for creating appointment when called

  const handleCreateAppointment = async () => {
    const data = await fetch(
      `http://35.180.150.125/api/appointment/add-appointment?lang=${language}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: logincenterToken,
        },
        body: JSON.stringify([
          {
            name: `${input.name}`,
            telephone: `${input.phoneNumber}`,
            emailAddress: `${input.emailAddress}`,
            serviceId: realServiceId,
            startTime: `${timing}`,
            Date: `${moment(startDate).format("DD-MM-YYYY")}`,
            centerId: `${centerId}`,
            workerId: `${workerId}`,
            suggestion: "test",
          },
        ]),
      }
    );

    const res = data.json().then((data) => {
      if (data.status) {
        successToaster(data?.status);
        setWorkerService([])
      } else {
        console.log(data);
        errorToaster(data?.message);
      }
    });
  };
  const dragNode = useRef();

  const handleDragEnd = () => {
    dragNode.current.removeEventListener("dragend", handleDragEnd);
    dragItem.current = null;
    dragNode.current = null;
    setDragging(true);
  };

  const onEnd = async (result) => {
    let currentWorkerId = result.source.index;
    let newWorkerId = result.destination.index;

    for (let i = 0; i < array1.length; i++) {
      for (let j = 0; j < array1[i].length; j++) {
        if (array1[i][j].id) {
          if (array1[i][j].dId == newWorkerId) {
            var dataX = array1[i][j];

            break;
          }
        }
      }
    }

    for (let i = 0; i < array1.length; i++) {
      for (let j = 0; j < array1[i].length; j++) {
        if (array1[i][j].id) {
          if (array1[i][j].dId == currentWorkerId) {
            var cWorker = array1[i][j];

            break;
          }
        }
      }
    }

    let bookingId = cWorker.time._id;
    let newBookingTime = dataX.time;
    let nWorkerId = cWorker.id;

    const data = await fetch(
      `http://35.180.150.125/api/appointment/update-appointment/${bookingId}?lang=${language}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: logincenterToken,
        },
        body: JSON.stringify({
          startTime: `${newBookingTime}`,
          Date: `${moment(startDate).format("DD-MM-YYYY")}`,
          workerId: `${nWorkerId}`,
        }),
      }
    );

    const res = data.json().then((data) => {
      if (data.status) {
        successToaster(data.status);
      } else {
        console.log(data.error);
        // errorToaster(data.error.message);
      }
    });

    const apiCall = await fetch(
      `http://35.180.150.125/api/center/centerWorker?lang=${language}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: logincenterToken,
        },
        body: JSON.stringify({
          centerId: centerId,
          Date: `${moment(startDate).format("DD-MM-YYYY")}`,
        }),
      }
    );

    const response1 = apiCall.json().then((data) => {
      // setCenterData(data.data[0]);
      dispatch(centerDataForArray(data.data[0]));
    });
  };

  // to handle events
  const getEvents = async () => {
    const data = await fetch(
      `http://35.180.150.125/api/event/filter-event?limit=100&pageNo=1&lang=${language}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: logincenterToken,
        },
        body: JSON.stringify({
          startDate: eventStartDate,
          endDate: eventEndDate,
        }),
      }
    );

    // console.log(token)

    const res = data.json().then((data) => {
      // setEvent(data.data)
      dispatch(setEventData(data.data));
    });
    // console.log(eventData, "eventData");
    // for (let i = 0; i < eventData.length; i++) {
    //   let obj = {};
    //   obj.title = eventData[i].eventType;

    //   const startInput = eventData[i].startDate;

    //   const endInput = eventData[i].endDate;

    //   const [day, month, year] = startInput.split("-");
    //   const [endDay, endMonth, endYear] = endInput.split("-");

    //   obj.start = `${year}-${month}-${day}`;
    //   obj.end = `${endYear}-${endMonth}-${endDay}`;

    //   switch (eventData[i].eventType) {
    //     case "Vacaciones":
    //       obj.backgroundColor = "blue";
    //       break;
    //     case "Baja":
    //       obj.backgroundColor = "red";
    //       break;
    //     case "Permiso":
    //       obj.backgroundColor = "yellow";
    //       break;
    //     case "Festivo centro":
    //       obj.backgroundColor = "Black";
    //       break;
    //   }

    //   event.push(obj);
    // }
    // setFlag(true);
    // console.log(event);
  };
  const fetchWorkers = async () => {
    try {
      const responce = await instance.get(
        `${requests.fetchGetWorkers}/${centerId}?lang=${language}`,
        {
          headers: {
            Authorization: logincenterToken,
            "Content-Type": "application/json",
          },
        }
      );
      setWorkersData(responce.data.data);
    } catch (err) { }
  };

  const handleEvent = () => {
    for (let i = 0; i < eventData.length; i++) {
      let workerArray = workersData.find((data) => {
        return data._id == eventData[i].workerId;
      });
      let obj = {};
      obj.title = `${eventData[i].eventType} ${workerArray?.name}`;
      //  ${workerArray?.name}`;

      const startInput = eventData[i].startDate;

      const endInput = eventData[i].endDate;

      const [day, month, year] = startInput.split("-");
      const [endDay, endMonth, endYear] = endInput.split("-");

      obj.start = `${year}-${month}-${day}`;
      obj.end = `${endYear}-${endMonth}-${endDay}`;
      switch (eventData[i].eventType) {
        case "Vacaciones":
          obj.backgroundColor = "#1C38D6"; //blue
          break;
        case "Baja":
          obj.backgroundColor = "#D61C38"; //red
          break;
        case "Permiso":
          obj.backgroundColor = "#F2B700"; //yello
          break;
        case "Festivo centro":
          obj.backgroundColor = "#000000"; //black
          break;
      }
      event.push(obj);
    }
    setEvent(event);
    setFlag(true);
  };

  useEffect(() => {
    getEvents();
  }, [eventStartDate, eventEndDate]);

  const emergencyCancle = () => {
    history.push("/center/emergencyCancle");
    dispatch(setWorkerLoginStatus(false));
  };

  const handleClient = () => {
    history.push("/center/clients");
    dispatch(setWorkerLoginStatus(false));
  };
  const handleBack = () => {
    dispatch(setWorkerLoginStatus(false));

    history.push("/center/workersDetails");
  };

  // useEffect(() => {
  //   if (SD && ED) {
  //     console.log("sd aur ed hai");
  //     getEvents();
  //   }
  // }, [ED]);

  useEffect(() => {
    if (eventData.length > 0 && workersData.length > 0) {
      handleEvent();
    }
  }, [eventData, workersData]);

  const handleAppoinmentReturn = () => {
    setWorkerService([])
    handleClose();
  };

  const handleRepeateAppoinment = () => {
    setActivate(true);
  };

  const handlePermissions = (e) => {
    if (e.target.innerHTML == "Center Data") {
      history.push("/center/worker/center-details");
    } else if (e.target.innerHTML == "Access To Admin") {
      history.push("/center/admin-login");
    } else if (e.target.innerHTML == "Contracted Plan") {
      history.push("/center/worker/plan");
    } else if (e.target.innerHTML == "Center Images") {
      history.push("/center/worker/centerImage");
    } else if (e.target.innerHTML == "Client File") {
      history.push("/center/worker/clients");
    } else if (e.target.innerHTML == "Day Management") {
      history.push("/center/worker/events");
    } else if (e.target.innerHTML == "Emergency Cancellation") {
      history.push("/center/worker/emergencycancle");
    } else if (e.target.innerHTML == "Tax Data") {
      history.push("/center/worker/tax-data");
    } else if (e.target.innerHTML == "+Centers") {
      history.push("/center/worker/center-management");
    } else if (e.target.innerHTML == "Workers") {
      history.push("/center/worker/workers");
    } else if (e.target.innerHTML == "Action Dates") {
      history.push("/center/worker/action-dates");
    } else if (e.target.innerHTML == "Services") {
      history.push("/center/worker/services");
    }
  };

  return (
    <div className="mainPage-container">
      <Header />

      <Grid container spacing={4} className="mainContainer">
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          lg={6}
          xl={5}
          style={{ justifyContent: "center" }}
        >
          <FullCalendar
          className="fc-highlight"
            firstDay='1'
            locale='en'
            firstDay='1'
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            datesSet={(dateInfo) => {
              dispatch(
                setEventStartDate(moment(dateInfo.start).format("DD-MM-YYYY"))
              );
              dispatch(
                setEventEndDate(moment(dateInfo.end).format("DD-MM-YYYY"))
              );
            }}
            events={flag === true && event}
            dayClick ={ (arg) => {
              handleWorker(arg);
              $(".fc-highlight").removeClass("fc-highlight");
              $(this).addClass("fc-highlight");
            }}
      //       dateClick={(arg) => {
      //         handleWorker(arg);
      //         $(".day-highlight").removeClass("day-highlight");
      // $(this).addClass("day-highlight");
      //       }}
          />
          <Grid item style={{ display: "flex" }}>

            <div style={{ padding: '0px 10px' }}>
              <span className="black"></span>
              <span>{t("Closed Center")}</span>
            </div>
            <div style={{ padding: '0px 10px' }}>
              <span className="red"></span>
              <span>{t("Worker Come Down")}</span>
            </div>
            <div style={{ padding: '0px 10px' }}>
              <span className="yellow"></span>
              <span>{t("Worker Excuse Me")}</span>
            </div>
            <div style={{ padding: '0px 10px' }}>
              <span className="blue"></span>
              <span>{t("Worker Holiday")}</span>
            </div>
          </Grid>

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
              // justifyContent: "space-evenly",
            }}
          >
            <div className="permissionBtns">
              {filteredDataPermission.map((item, index) => (
                <div className="permissionButton">
                  <Button
                    variant="contained"
                    onClick={(e) => handlePermissions(e)}
                    color="secondary"
                    style={{
                      backgroundColor: "#D61C38",
                      border: "solid 2px black",
                      borderRadius: "25px",
                      margin: "16px 0px",
                      width: "185px",
                    }}
                  >
                    {item == "centerData"
                      ? t("Center Data")
                      : item == "accessTOAdmin"
                        ? t("Access To Admin")
                        : item == "actualSubscription"
                          ? t("Contracted Plan")
                          : item == "centerImages"
                            ? t("Center Images")
                            : item == "clientFile"
                              ? t("Client File")
                              : item == "dayManagement"
                                ? t("Day Management")
                                : item == "emergencyCancellation"
                                  ? t("Emergency Cancellation")
                                  : item == "fiscalData"
                                    ? t("Tax Data")
                                    : item == "moreCenters"
                                      ? t("+Centers")
                                      : item == "permissionToWorkers"
                                        ? t("Workers")
                                        : item == "registryOfInternalActions"
                                          ? t("Action Dates")
                                          : item == "services"
                                            ? t("Services")
                                            : null}
                  </Button>
                </div>
              ))}
            </div>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={6} xl={7}>
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
                    <col style={{ width: "2rem" }} />
                    <col style={{ width: "2.5rem" }} />
                    <col style={{ width: "3.5rem" }} />
                    <col style={{ width: "3.5rem" }} />
                  </colgroup>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        style={{ borderTopLeftRadius: "10px", width: "100px" }}
                        className="table-cell">{t("Time")}</TableCell>

                      {workers?.length > 0 ? (
                        workers.map((item, index) => {
                          if (
                            index >= currentIndex &&
                            index <= currentIndex + 2
                          ) {
                            return (
                              <TableCell
                                style={{ width: "100px" }}
                                align="right">{item.name}</TableCell>
                            );
                          }
                        })) : (
                        <>
                          <TableCell
                            style={{ width: "100px" }}
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
                  <DragDropContext onDragEnd={onEnd}>
                    <Droppable droppableId="12345">
                      {(provided) => (
                        <TableBody
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {array1?.length > 0 ? (
                            array1.map((row) => {
                              return (
                                <TableRow>
                                  {row.map((item, index) => {
                                    if (index === 0) {
                                      return (
                                        <TableCell component="th" scope="row">
                                          {item.time !== null ? (
                                            <button id="table-button">
                                              {!item.id ? (
                                                item.time
                                              ) : item.time !==
                                                "not avaliable" ? (
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
                                        <Draggable
                                          draggableId={`${item.dId}`}
                                          key={item.dId}
                                          index={parseInt(item.dId)}
                                        >
                                          {(provided) => (
                                            <TableCell
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
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
                                                  ) : typeof item.time ===
                                                    "object" ? (
                                                    item.time
                                                      .runningAppointment ==
                                                      true ? (
                                                      <span className="dot2"></span>
                                                    ) : item.time
                                                      .previousAppointment ==
                                                      true ? (
                                                      <span className="dot3"></span>
                                                    ) : item.time
                                                      .nextAppointment ==
                                                      true ? (
                                                      <span className="dot1"></span>
                                                    ) : null
                                                  ) : (
                                                    ""
                                                  )}
                                                </button>
                                              ) : (
                                                <button
                                                  id="not-avaliable"
                                                  disabled={true}
                                                ></button>
                                              )}
                                            </TableCell>
                                          )}
                                        </Draggable>
                                      );
                                    }
                                  })}
                                </TableRow>
                              );
                            })
                          ) : (
                            <>
                              <TableRow style={{ height: "2rem" }}>
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
                              <TableRow style={{ height: "2rem" }}>
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
                              <TableRow style={{ height: "2rem" }}>
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
                              <TableRow style={{ height: "2rem" }}>
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
                              {/* <TableRow style={{ height: "2rem" }}>
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
                              </TableRow> */}
                            </>
                          )
                          }
                        </TableBody>
                      )}
                    </Droppable>
                  </DragDropContext>
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

      <Grid container className="footer-btn-center">
        <Grid
          item
          className="footer-btn-item-center"
          xs={12}
          sm={12}
          md={6}
          lg={6}
          xl={6}
        >
          <button
            className="footer-btn-goBack-center"
            onClick={() => handleBack()}
          >
            {t("Go Back")}
          </button>
        </Grid>
      </Grid>
      <div>
        <Dialog
          open={open}
          onClose={handleAppoinmentReturn}
          aria-labelledby="form-dialog-title"
        >
          {/* <DialogTitle id="form-dialog-title">Create Appointment</DialogTitle> */}
          <DialogContent>
            <Grid
              container
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "auto",
              }}
            >
              <Grid items xs={12} style={{ position: "relative" }}>
                <div className="papers-header">
                  <Typography style={{ textAlign: "center" }} variant="h1">
                    {t("Create Appointment")}
                  </Typography>
                </div>
                <div className="close-icon">
                  {/* <Close className="close" onClick={(e) => handleClose(e)} /> */}
                  <i
                    class="fas fa-times close"
                    onClick={(e) => handleAppoinmentReturn(e)}
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
                {console.log(startDate, 'startDate1212')}
                <div id="modelForm">
                  <p>
                    {t("Day and time")}:{moment(startDate).format("DD-MM-YYYY")}{" "}
                    &nbsp;{timing}{" "}
                  </p>
                </div>
                <div
                  id="modelForm1"
                  className="rpt-appoinment"
                  onClick={() => handleRepeateAppoinment()}
                >
                  <p>{t("Repeat appointment")}</p>
                </div>
                <div id="modelForm">
                  <p>
                    {t("Work BY")}:{workerName}
                  </p>
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
                      {workerService.map((item) => (
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

                  {/* <textarea 
                style={{marginTop:"10px"}}
                value={textInput}
                onChange={handleTextInput}>
                </textarea>
                <input
                  type="file"
                  onChange={handleFileUpload}
                /> */}
                </form>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              className="dialougeButton1"
              onClick={handleAppoinmentReturn}
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
      </div>
      <div>
        {activate ? (
          <RepeatAppoinment
            aptObj={obj[0]}
            activate={activate}
            workerId={workerId}
            workerName={workerName}
            workerService={workerService}
            selectedCenterId={centerId}
            input={input}
            onDeactive={closeActivate}
          // workerid input services
          />
        ) : null}
      </div>
      <div>
        {cancleactivate ? (
          <CancleAppoinmentModal
            activate={cancleactivate}
            onDeactive={closeCancleActivate}
            appoinmentTime={appoinmentTime}
          />
        ) : null}
      </div>
      {/* it is for 6C+1 screen */}
      <div>
        <Dialog
          // className={classes.dialogPaper}
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          // open={open}
          onClose={handleClose}
          aria-labelledby="max-width-dialog-title"
        >
          {/* <DialogTitle id="max-width-dialog-title">Optional sizes</DialogTitle> */}
          <DialogContent>
            {/* <DialogContentText>
              their clients have been notified informing of the cancellation
            </DialogContentText> */}
            are you sure you want to cancel joel gomez's appointment
          </DialogContent>
          <Grid container>
            <Grid item>
              {" "}
              <Button onClick={handleClose} color="primary">
                Go Back
              </Button>
            </Grid>
            <Grid item>
              {" "}
              <Button onClick={handleClose} color="primary">
                Cancle
              </Button>
            </Grid>
            <Grid item>
              {" "}
              <Button onClick={handleClose} color="primary">
                Cancel and Advise
              </Button>
            </Grid>
          </Grid>
        </Dialog>
      </div>
      {/* it is for 6C+1 screen */}
      <div>
        <Dialog
          // className={classes.dialogPaper}
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          // open={}
          onClose={handleClose}
          aria-labelledby="max-width-dialog-title"
        >
          {/* <DialogTitle id="max-width-dialog-title">Optional sizes</DialogTitle> */}
          <DialogContent>
            <DialogContentText>
              An email has been sent to Joel Gomez informing of the cancellation
            </DialogContentText>
            Do not worry about contacting you savetime will send you an email
            and a push notification so that you are aware of the cancellation
          </DialogContent>
          <Grid container>
            <Grid item>
              {" "}
              <Button onClick={handleClose} color="primary">
                Okey
              </Button>
            </Grid>
          </Grid>
        </Dialog>
      </div>
    </div>
  );
}

export default CenterMainPage;
// <span className="dot1"></span>
// item.time.name
