import React, { useState, useEffect } from "react";
import addlogo from "../../assets/plusicon.png";
import Header from "../../components/Header";
import "./event.css";
import moment from "moment";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useDispatch, useSelector } from "react-redux";
import instance from "../../axios";
import requests from "../../requests";
import { successToaster, errorToaster } from "../../common/common";

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Grid, Typography } from "@material-ui/core";
// import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import {
  setMonthEvents,
  setWorkerLoginStatus,
} from "../../redux/actions/actions";
import CenterAdminHeader from "../center-admin/CenterAdminHeader/CenterAdminHeader";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Event() {
  const { t } = useTranslation();
  const language = useSelector((state) => state.language);
  // let worker = "";
  // let eventType="";

  var d = new Date();
  var n = d.toISOString();

  const [events, setEvents] = useState([]);
  const [calendarDate, setCalendarDate] = useState(n);
  const [instructorModel, setInstructorModel] = useState({
    instructorId: 172,
    date: calendarDate,
  });
  const history = useHistory();
  const centerAdminLoginStatus = useSelector(
    (state) => state.centerAdminLoginStatus
  );
  const [centerAdminHeaderVisible, setCenterAdminHeaderVisible] =
    useState(false);

  const [open, setOpen] = React.useState(false);
  const [workersData, setWorkersData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const logincenterToken = useSelector(
    (state) => state.selectedLoginCenter.token
  );
  const selectedLoginCenter = useSelector((state) => state.selectedLoginCenter);
  const [startDateState, setStartDate] = useState(null);
  const [endDateState, setEndDate] = useState(null);

  const [SD, setSD] = useState("");
  const [ED, setED] = useState("");

  const [dayArray, setDayArray] = useState([]);

  const [worker, setWorker] = useState("");
  const [eventType, setEventType] = useState("");

  const [monthsEvents, setMonthsEvents] = useState([]);

  const [input, setInput] = useState({});

  const centerId_from_signUp = useSelector((state) => state.centerdata._id);
  const centerId = useSelector((state) => state.loginData._id);
  const monthseventsSelector = useSelector((state) => state.monthevents);
  const workerLoginStatus = useSelector((state) => state.workerLoginStatus);

  const [flag, setFlag] = useState(false);
  const [event, setEvent] = useState([]);

  // let centerId = centerId_from_signIn;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getEvents = async () => {
    let obj = {
      startDate: SD,
      endDate: ED,
    };

    const responce = await instance
      .post(
        `${requests.fetchCenterEvents}?limit=100&pageNo=1&lang=${language}`,
        obj,
        {
          headers: {
            Authorization: logincenterToken,
            "Content-Type": "application/json",
          },
        }
      )
      .catch((err) => {
        console.log(err);
      });
    if (responce && responce.data) {
      dispatch(setMonthEvents(responce.data.data));
      // handleEvent();
    }
  };

  //For Select type of event
  const handleEventTypes = (e) => {
    setEventType(e.target.innerText);
  };

  //For Post Creat Event
  const handleCreateEvent = async () => {
    let obj = {
      eventType: eventType,
      startDate: moment(startDateState).format("DD-MM-YYYY"),
      endDate: moment(endDateState).format("DD-MM-YYYY"),
      workerId: worker,
    };
    try {
      const responce = await instance.post(
        `${requests.fetchEventCreate}?lang=${language}`,
        obj,
        {
          headers: {
            Authorization: logincenterToken,
            "Content-Type": "application/json",
          },
        }
      );
      if (responce && responce.data) {
        setEventData(responce.data);
        successToaster("Event Created");
        getEvents();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // For Handle Worker Selection
  const handleWorkers = (e) => {
    if (e.target.checked === true) {
      var id = e.target.value;
    }
    setWorker(id);
  };

  // For Fetch Workers
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
    } catch (err) {}
  };

  useEffect(() => {
    const path = history.location.pathname;
    const path_array = path.split("/");
    if (path_array[2] === "admin") {
      setCenterAdminHeaderVisible(true);
    }

    fetchWorkers();
    dispatch(setWorkerLoginStatus(false));
    // getEvents();
    // handleEvent();
  }, []);

  const handleEvent = () => {
    for (let i = 0; i < monthseventsSelector.length; i++) {
      let workerArray = workersData.find((data) => {
        return data._id == monthseventsSelector[i].workerId;
      });
      let obj = {};
      obj.title = `${monthseventsSelector[i].eventType} ${workerArray?.name}`;

      const startInput = monthseventsSelector[i].startDate;

      const endInput = monthseventsSelector[i].endDate;

      const [day, month, year] = startInput.split("-");
      const [endDay, endMonth, endYear] = endInput.split("-");

      obj.start = `${year}-${month}-${day}`;
      obj.end = `${endYear}-${endMonth}-${endDay}`;
      switch (monthseventsSelector[i].eventType) {
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
      events.push(obj);
    }
    setEvents(events);
    setFlag(true);
  };
  const handleMonthName = (args) => {
    let startDate = moment(args.start).format("DD-MM-YYYY");
    let endDate = moment(args.end).format("DD-MM-YYYY");
    // const monthName = args.view.title.split(" ");

    // const month = moment(monthName[0], "MMM").format("MM");
    // const year = moment(monthName[1], "YYYY").format("YYYY");

    // // months start at index 0 in momentjs, so we subtract 1
    // const startDate = moment([year, month - 1, parseInt("01")]).format(
    //   "DD-MM-YYYY"
    // );
    // // get the number of days for this month
    // const daysInMonth = moment(startDate, "DD-MM-YYYY").daysInMonth();
    // // we are adding the days in this month to the start date (minus the first day)
    // const endDate = moment(startDate, "DD-MM-YYYY")
    //   .add(daysInMonth - 1, "days")
    //   .format("DD-MM-YYYY");
    setSD(startDate);
    setED(endDate);

    // getEvents();
    // handleEvent();
  };
  useEffect(() => {
    if (SD && ED) {
      getEvents();
    }
  }, [ED]);

  useEffect(() => {
    if (workersData.length > 0 && monthseventsSelector.length > 0) {
      handleEvent();
    }
  }, [workersData, monthseventsSelector]);

  const handleGoBack = () => {
    if (centerAdminLoginStatus === true) {
      if (selectedLoginCenter.isActive == true) {
        history.push("/center/admin/dashboard");
      } else {
        history.push("/center/main-page");
      }
    } else {
      history.push("/center/main-page");
    }
  };

  return (
    <div className="service-container">
      {centerAdminLoginStatus === true && centerAdminHeaderVisible === true ? (
        <CenterAdminHeader title={t("Day Management")} />
      ) : (
        <Header title={t("Day Management")} className="service-header" />
      )}

      <div className="create_event_btn" onClick={handleClickOpen}>
        {t("Create Event")}
        <img className="Create_btn_img1" src={addlogo} alt="addlogo" />
      </div>
      <div>
        <Grid container className="event-container">
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={flag === true && events}
              dateClick={(arg) => {
                // console.log(arg);
              }}
              // eventRender={(info) => console.log(info)}
              // datesRender={
              //   // (args) => console.log(args, "args1")
              //   // handleMonthName(args)
              // }
              datesSet={(args) => handleMonthName(args)}
            />
            <Grid item style={{ display: "flex", marginLeft: "3rem" }}>
              {/* <div className="showcolorindication">
                <span className="green"></span>
                <span>Selected day</span>
              </div> */}
              <div className="showcolorindication">
                <span className="black"></span>
                <span>{t("Closed Center")}</span>
              </div>
              <div className="showcolorindication">
                <span className="red"></span>
                <span>{t("Worker Come Down")}</span>
              </div>
              <div className="showcolorindication">
                <span className="yellow"></span>
                <span>{t("Worker Excuse Me")}</span>
              </div>
              <div className="showcolorindication">
                <span className="blue"></span>
                <span>{t("Worker Holiday")}</span>
              </div>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className="eventmap">
            <div className="eventDatas">
              {/* <div className=""> */}

              {monthseventsSelector.map((item) => {
                let workerArray = workersData.find((data) => {
                  return data._id == item.workerId;
                });
                switch (item.eventType) {
                  case "Vacaciones":
                    item.backgroundColor = "#1C38D6";
                    break;
                  case "Baja":
                    item.backgroundColor = "#D61C38";
                    break;
                  case "Permiso":
                    item.backgroundColor = "#F2B700";
                    break;
                  case "Festivo centro":
                    item.backgroundColor = "#000000";
                    break;
                }
                return (
                  <div
                    className="event-data"
                    style={{
                      margin: "8px",
                      width: "300px",
                      // height: "45px",
                      border: "2px solid",
                      borderRadius: "10px",
                      display: "flex",
                      borderColor: item.backgroundColor,
                    }}
                  >
                    <div>
                      <img className="img_icon" src={workerArray?.image} />
                    </div>{" "}
                    <div>
                      <div
                        style={{
                          fontSize: "17px",
                          marginLeft: "7px",
                          color: item.backgroundColor,
                        }}
                      >
                        {workerArray?.name}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          marginLeft: "6px",
                          color: item.backgroundColor,
                        }}
                      >
                        <span>
                          {item.eventType} {t("from")} {item.startDate}{" "}
                          {t("to")} {item.endDate}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* </div> */}
            </div>
          </Grid>
        </Grid>
        <Grid container>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Button
              variant="contained"
              onClick={handleGoBack}
              color="secondary"
              style={{
                backgroundColor: "#D61C38",
                border: "solid 2px black",
                borderRadius: "30px",
                margin: "16px 0px",
                width: "250px",
                // height:'50px',
                fontSize: "30px",
              }}
            >
              {t("Go Back")}
            </Button>
          </Grid>
        </Grid>
      </div>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <Typography style={{ textAlign: "center",marginBottom:'1rem' }} variant="h1">
              {t("Create Event")}
            </Typography>
            <div className="headers-btn ">
              <Button
                id="holiday"
                value="Vacaciones"
                onClick={(e) => handleEventTypes(e)}
                color="primary"
              >
                Vacaciones
              </Button>
              <Button
                id="short"
                value="Baja"
                onClick={(e) => handleEventTypes(e)}
                color="primary"
              >
                Baja
              </Button>
              <Button
                id="excuse"
                value="Permiso"
                onClick={(e) => handleEventTypes(e)}
                color="primary"
              >
                Permiso
              </Button>
              <Button
                id="festival"
                value="Festivo centro"
                onClick={(e) => handleEventTypes(e)}
                color="primary"
              >
                Festivo centro
              </Button>
            </div>
            <div className="workers-name">
              {workersData.map((worker) => {
                return (
                  <div className="worker_div">
                    <input
                      className="radio_input"
                      type="radio"
                      value={worker._id}
                      name="myRadio"
                      onChange={(e) => handleWorkers(e)}
                    />
                    <i>
                      <img
                        className="img_icon"
                        src={worker.image}
                        alt={worker.name}
                      />
                    </i>
                    <label htmlFor={worker.name} className="worker_label">
                      {worker.name}
                    </label>
                  </div>
                );
              })}
            </div>
            <div className="date-pickers">
              <DatePicker
                selected={startDateState}
                placeholderText={t("Start date")}
                onChange={(date) => setStartDate(date)}
                showTimeSelect
              />
              <DatePicker
                selected={endDateState}
                placeholderText={t("Final date")}
                onChange={(date) => setEndDate(date)}
                showTimeSelect
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              className="returnbtn"
              variant="contained"
              onClick={handleClose}
              color="primary"
            >
              {t("Return")}
            </Button>
            <Button
              className="createbtn"
              variant="contained"
              onClick={handleCreateEvent}
              color="primary"
            >
              {t("Create")}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Event;
