import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import "./repeatAppontment.css";
import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import * as moment from "moment";
import { useState } from "react";

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick

import "@fullcalendar/daygrid/main.css";
import { useDispatch, useSelector } from "react-redux";
import requests from "../requests";
import instance from "../axios";
import {
  setEventEndDate,
  setEventStartDate,
  setMonthEvents,
} from "../redux/actions/actions";
import { errorToaster, successToaster } from "../common/common";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  container: {
    // display: "flex",
    // flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(0),
    width: 180,
  },
}));

function RepeatAppoinment(props) {
  const {t} = useTranslation();
  const language = useSelector(state => state.language)
  const classes = useStyles();
  const [time, setTime] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [SD, setSD] = useState("");
  const [ED, setED] = useState("");
  const [realServiceId, setRealServiceId] = useState("");
  const token = useSelector((state) => state.token);
  const [flag, setFlag] = useState(false);
  const [service, setService] = useState("");

  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("md");
  const [maxWidth2, setMaxWidth2] = React.useState("sm");

  const [workersData, setWorkersData] = useState([]);

  const [allAppoinments, setAllAppoinments] = useState([]);

  const [events, setEvents] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");

  // let appoinments = [];
  const [appoinments, setAppoinments] = useState([]);

  const monthseventsSelector = useSelector((state) => state.monthevents);
  const eventStartDate = useSelector((state) => state.eventStartDate);
  const eventEndDate = useSelector((state) => state.eventEndDate);

  const loginData = useSelector((state) => state.loginData);

  const dispatch = useDispatch();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    props.onDeactive();
    setOpen(false);
  };

  useEffect(() => {
    if(eventEndDate&& eventStartDate)
    getEvents();
  }, [eventEndDate]);

  useEffect(() => {
    if (workersData.length > 0 && monthseventsSelector.length > 0) {
      handleEvent();
    }
  }, [workersData, monthseventsSelector]);

  useEffect(() => {
    setAllAppoinments([props.aptObj]);
    fetchWorkers();
  }, []);

  let appoinmentObj = {
    name: `${props.input.name}`,
    telephone: `${props.input.phoneNumber}`,
    emailAddress: `${props.input.emailAddress}`,
    serviceId: realServiceId,
    startTime: `${time}`,
    Date: `${moment(selectedDate).format("DD-MM-YYYY")}`,
    centerId: props.selectedCenterId,
    workerId: `${props.workerId}`,
    suggestion: "test",
    appointmentBy: "web",
    userId: loginData._id,
  };
  const getEvents = async () => {
    let obj = {
      startDate: eventStartDate,
      endDate: eventEndDate,
      workerId: props.workerId,
      centerId: props.selectedCenterId,
    };

    const responce = await instance
      .post(`${requests.fetchCenterEvents}?limit=100&pageNo=1&lang=${language}`, obj, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      })
      .catch((err) => {
        console.log(err);
      });
    if (responce && responce.data) {
      dispatch(setMonthEvents(responce.data.data));
      // handleEvent();
    }
  };

  // For Fetch Workers
  const fetchWorkers = async () => {
    try {
      const responce = await instance.get(
        `${requests.fetchGetWorkers}/${loginData._id}`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      setWorkersData(responce.data.data);
    } catch (err) {}
  };

  const handleEvent = () => {
    for (let i = 0; i < monthseventsSelector.length; i++) {
      let workerArray = workersData.find((data) => {
        return data._id == monthseventsSelector[i].workerId;
      });
      let obj = {};
      obj.title =`${monthseventsSelector[i].eventType} ${workerArray?.name}`;

      const startInput = monthseventsSelector[i].startDate;

      const endInput = monthseventsSelector[i].endDate;

      const [day, month, year] = startInput.split("-");
      const [endDay, endMonth, endYear] = endInput.split("-");

      obj.start = `${year}-${month}-${day}`;
      obj.end = `${endYear}-${endMonth}-${endDay}`;
      switch (monthseventsSelector[i].eventType) {
        case "Vacaciones":
          obj.backgroundColor = "#1C38D6";
          break;
        case "Baja":
          obj.backgroundColor = "#D61C38";
          break;
        case "Permiso":
          obj.backgroundColor = "#F2B700";
          break;
        case "Festivo centro":
          obj.backgroundColor = "#000000";
          break;
      }
      events.push(obj);
    }
    // setEvents(events);
    setFlag(true);
  };

  const handleMonthName = (args) => {
    const monthName = args.view.title.split(" ");

    const month = moment(monthName[0], "MMM").format("MM");
    const year = moment(monthName[1], "YYYY").format("YYYY");

    // months start at index 0 in momentjs, so we subtract 1
    const startDate = moment([year, month - 1, parseInt("01")]).format(
      "DD-MM-YYYY"
    );
    // get the number of days for this month
    const daysInMonth = moment(startDate, "DD-MM-YYYY").daysInMonth();
    // we are adding the days in this month to the start date (minus the first day)
    const endDate = moment(startDate, "DD-MM-YYYY")
      .add(daysInMonth - 1, "days")
      .format("DD-MM-YYYY");
    setSD(startDate);
    setED(endDate);

    getEvents();
    // handleEvent();
  };

  useEffect(() => {
    let serviceId1 = props.workerService.find(
      ({ serviceName }) => serviceName === service
    );

    setRealServiceId(serviceId1?._id);
  }, [service]);

  const handleChange = (event) => {
    setService(event.target.value);
  };
  const handleAddAppoinment = () => {
    setAppoinments([...appoinments, appoinmentObj]);
    allAppoinments.push(appoinmentObj);
  };

  const handleCreatesAppoinment = async () => {
    // setOpen(true);
    // allAppoinments.push(appoinments)
    const response = await instance
    .post(requests.fetchAddAppointment, allAppoinments, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    }).catch((error) => {
      errorToaster(error.response.data.error.message);
     
      if (error?.response?.data?.message) {
        let errorMessage = error.response.data.message;
        errorToaster(errorMessage);
      } else {
        if (error.response.data.error.message) {
          
        }
      }

     
    });
    if (response && response.data) {
      successToaster(t("Appointments Created!"));
      setOpen(true);
      // props.onDeactive();
    }
  }
  return (
    <div>
      {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={props.activate}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        {/* <DialogTitle id="form-dialog-title">Repeat Appoinment</DialogTitle> */}

        <DialogContent>
          <Grid container spacing={4}>
          <Grid items xs={12} style={{ position: "relative" }}>
                <div className="papers-header">
                  <Typography style={{textAlign:'center'}} variant="h1">Repeat Appoinment</Typography>
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
              item
              xs={12}
              sm={12}
              md={6}
              lg={6}
              xl={6}
              style={{ justifyContent: "center" }}
            >
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={flag === true && events}
                dateClick={(arg) => {
                  setSelectedDate(arg.date);
                }}
                // eventRender={(info) => console.log(info)}
                datesRender={(args) => handleMonthName(args)}
                datesSet={(dateInfo) => {
                  dispatch(
                    setEventStartDate(
                      moment(dateInfo.start).format("DD-MM-YYYY")
                    )
                  );
                  dispatch(
                    setEventEndDate(moment(dateInfo.end).format("DD-MM-YYYY"))
                  );

                  // console.log(moment(dateInfo.start).format("DD-MM-YYYY"));
                  // console.log(moment(dateInfo.end).format("DD-MM-YYYY"));
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={5}
              lg={5}
              xl={5}
              className="rpt-GridItem2"
            >
              <div className="rpt-aptContainer2">
                <FormControl className="rpt-select-service">
                  <Select
                    value={service}
                    onChange={handleChange}
                    displayEmpty
                    // className={classes.selectEmpty}
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value="">
                      <em>{t("Select Service")}</em>
                    </MenuItem>
                    {props?.workerService.map((item) => (
                      <MenuItem value={item.serviceName}>
                        {item.serviceName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div className="rpt-select-worker">
                  <p>{t("Work BY")}:{props?.workerName}</p>
                </div>

                {/* Time Picker */}
                <form className={classes.container} noValidate>
                  <TextField
                    id="time"
                    label={t("Time")}
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    defaultValue="07:30"
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                  />
                </form>

                <div className="aptDatas">
                  {appoinments.map((item) => (
                    <div className="apt-data">
                      {item.Date} at {item.startTime}
                    </div>
                  ))}
                </div>
              </div>
            </Grid>
            {/* <div className="buttons">
          <div className="left-btns">
            <button>go Back</button>
            <button>save</button>
          </div>
          <div className="right-btns">
            <button>Save and advise</button>
          </div>
        </div> */}
          </Grid>
        </DialogContent>
        <Grid container style={{display:'flex',justifyContent:'space-evenly'}}>
            <Grid item>
              {" "}
              <Button
              onClick={() => handleClose()}
              className="returnBtnrpt"
              color="primary"
            >
              {t("Go Back")}
            </Button>
            </Grid>
            <Grid item>
              {" "}
              <Button
              onClick={() => handleAddAppoinment()}
              className="saveBtnrpt"
              color="primary"
            >
              {t("Save")}
            </Button>
            </Grid>
            <Grid item>
              {" "}
              <Button
              onClick={handleCreatesAppoinment}
              className="saveAdviseBtnrpt"
              color="primary"
            >
              {t("Save and advise")}
            </Button>
            </Grid>
          </Grid>
       
      </Dialog>

      {/* it is for 6C+1 screen */}
      <div>
        <Dialog
          // className={classes.dialogPaper}
          fullWidth={fullWidth}
          maxWidth={maxWidth2}
          open={open}
          onClose={handleClose}
          aria-labelledby="max-width-dialog-title"
        >
          {/* <DialogTitle id="max-width-dialog-title">Optional sizes</DialogTitle> */}
          <DialogContent>
            <DialogContentText>
              <div className="contenttitle">
                {t("An email has been sent to clients @........ informing about the reserved appointments!")}
              </div>
            </DialogContentText>
            <div className="maincontent">
             {t(" Do not worry about contacting us savetime will send you an email and a push notification so that you are aware of the reserved appointments")}
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
                className="confirmBtn"
                onClick={handleClose}
                color="primary"
              >
                {t("Okay")}
              </Button>
            </Grid>
          </Grid>
        </Dialog>
      </div>
    </div>
  );
}

export default RepeatAppoinment;
