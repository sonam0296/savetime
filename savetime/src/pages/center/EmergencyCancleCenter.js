import React, { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import { DateRangePicker } from "react-date-range";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  TextField,
  MenuItem,
  Select,
  makeStyles,
} from "@material-ui/core";

import "./emergencyCancle.css";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import Header from "../../components/Header";
import instance from "../../axios";
import requests from "../../requests";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { setMonthEvents, setWorkerLoginStatus } from "../../redux/actions/actions";
import { addDays } from "@fullcalendar/react";
import { errorToaster, successToaster } from "../../common/common";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import { withStyles } from 'material-ui/styles';

// const classes = useStyles();
// const useStyles = makeStyles((theme) => ({

//   dialogPaper: {
//     minHeight: '80vh',
//     maxHeight: '80vh',
// },
// }));

function EmergencyCancle() {
  const {t} = useTranslation();
  const language = useSelector(state => state.language)
  let eventsData = [];
  const history = useHistory();
  const [starttime, setStartTime] = useState(null);
  const [endtime, setEndTime] = useState(null);
  const [SD, setSD] = useState(null);
  const [ED, setED] = useState(null);
  const centerAdminLoginStatus = useSelector(
    (state) => state.centerAdminLoginStatus
  );
  const [serviceList, setServiceList] = useState([]);
  const [workerList, setWorkerList] = useState([]);

  const [service, setService] = useState("");
  const [worker, setWorker] = useState("");

  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedWorkerId, setSelectedWorkerId] = useState("");

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const [monthseventData, setMonthseventData] = useState([]);
  const monthseventsSelector = useSelector((state) => state.monthevents);
  const centerId_from_signUp = useSelector((state) => state.centerdata._id);
  const centerId_from_signIn = useSelector((state) => state.loginData._id);
  const logincenterToken = useSelector(state => state.selectedLoginCenter.token)
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("sm");
  const [maxWidth2, setMaxWidth2] = React.useState("sm");
  const [showGetTime, setShowGetTime] = useState(true);

  const [openEmergencyCancle, setOpenEmergencyCancle] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpenEmergencyCancle(false);
  };

  let centerId;
  if (centerId_from_signUp == undefined) {
    centerId = centerId_from_signIn;
  } else {
    centerId = centerId_from_signUp;
  }

  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
      color: "#95e6ac",
    },
  ]);

  useEffect(() => {
    getWorkers();
    getServices();
    handleMonthName1(dates[0].startDate);
    dispatch(setWorkerLoginStatus(false))
  }, []);

  useEffect(() => {
    if (ED) {
      getEvents();
    }
  }, [ED]);

  const cancleConfirmAppoinment = async () => {
    let obj = {};
    if (selectedWorkerId && selectedServiceId) {
      obj = {
        serviceId: selectedServiceId,
        workerId: selectedWorkerId,
        customDateForCancleAppointment: false,
        startDate: moment(dates[0].startDate).format("DD-MM-YYYY"),
        endDate: moment(dates[0].endDate).format("DD-MM-YYYY"),
        startTime: starttime,
        endTime: endtime,
      };
    } else if (selectedWorkerId) {
      obj = {
        workerId: selectedWorkerId,
        customDateForCancleAppointment: false,
        startDate: moment(dates[0].startDate).format("DD-MM-YYYY"),
        endDate: moment(dates[0].endDate).format("DD-MM-YYYY"),
        startTime: starttime,
        endTime: endtime,
      };
    } else if (selectedServiceId) {
      obj = {
        serviceId: selectedServiceId,
        customDateForCancleAppointment: false,
        startDate: moment(dates[0].startDate).format("DD-MM-YYYY"),
        endDate: moment(dates[0].endDate).format("DD-MM-YYYY"),
        startTime: starttime,
        endTime: endtime,
      };
    }
    if(showGetTime==false){
      delete obj.startTime
      delete obj.endTime
    }
    const response = await instance
      .post(`${requests.fetchCancleAppoinment}?lang=${language}`, obj, {
        headers: {
          Authorization: logincenterToken,
          "Content-Type": "application/json",
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
      successToaster(t("Appoinment Cancled"));
    }
    setOpenEmergencyCancle(false);
    history.push("/center/emergencyCancle");
  };

  const  cancleAppoinment = async () => {
    setOpenEmergencyCancle(true);
    // let obj = {};
    // if (selectedWorkerId && selectedServiceId) {
    //   obj = {
    //     serviceId: selectedServiceId,
    //     workerId: selectedWorkerId,
    //     customDateForCancleAppointment: false,
    //     startDate: moment(dates[0].startDate).format("DD-MM-YYYY"),
    //     endDate: moment(dates[0].endDate).format("DD-MM-YYYY"),
    //     startTime: starttime,
    //     endTime: endtime,
    //   };
    // } else if (selectedWorkerId) {
    //   obj = {
    //     workerId: selectedWorkerId,
    //     customDateForCancleAppointment: false,
    //     startDate: moment(dates[0].startDate).format("DD-MM-YYYY"),
    //     endDate: moment(dates[0].endDate).format("DD-MM-YYYY"),
    //     startTime: starttime,
    //     endTime: endtime,
    //   };
    // } else if (selectedServiceId) {
    //   obj = {
    //     serviceId: selectedServiceId,
    //     customDateForCancleAppointment: false,
    //     startDate: moment(dates[0].startDate).format("DD-MM-YYYY"),
    //     endDate: moment(dates[0].endDate).format("DD-MM-YYYY"),
    //     startTime: starttime,
    //     endTime: endtime,
    //   };
    // }
    // const response = await instance
    //   .post(`${requests.fetchCancleAppoinment}`, obj, {
    //     headers: {
    //       Authorization: token,
    //       "Content-Type": "application/json",
    //     },
    //   })
    //   .catch((error) => {
    //     let errorMessage = "";
    //     if (error.response.data && error.response.data.error) {
    //       errorMessage = error.response.data.error.message;
    //     } else {
    //       errorMessage = error.response.data.message;
    //     }
    //     console.log("ee", error.response);
    //     errorToaster(errorMessage);
    //   });
    // if (response && response.data) {
    //   successToaster("Appoinment Canceled !!");
    // }
    // history.push("/center/emergencyCancle");
  };

  const getWorkers = async () => {
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
      if (responce && responce.data) {
        setWorkerList(responce.data.data);
      }
    } catch (err) {}
  };

  const getServices = async () => {
    const response = await instance
      .get(`${requests.fetchGetService}${centerId}?lang=${language}`, {
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
      setServiceList(response.data.data);
    }
  };

  const getEvents = async () => {
    let obj = {
      workerId: selectedWorkerId,
      startDate: SD,
      endDate: ED,
      // moment(dates?.selection1?.endDate).format("DD-MM-YYYY"),
    };

    const responce = await instance
      .post(`${requests.fetchCenterEvents}?limit=100&pageNo=1&lang=${language}`, obj, {
        headers: {
          Authorization: logincenterToken,
          "Content-Type": "application/json",
        },
      })
      .catch((err) => {
        console.log(err);
      });
    if (responce && responce.data) {
      dispatch(setMonthEvents(responce.data.data));
      eventsData = responce.data.data;
      setMonthseventData(responce.data.data);
      handleEvent();
    }
  };
  const handleEvent = () => {
    for (let i = 0; i < eventsData.length; i++) {
      let obj = {};
      // obj.title = eventsData[i].eventType;

      const startInput = eventsData[i].startDate;

      const endInput = eventsData[i].endDate;

      const [day, month, year] = startInput.split("-");
      const [endDay, endMonth, endYear] = endInput.split("-");

      obj.startDate = `${year}-${month}-${day}`;
      obj.endDate = `${endYear}-${endMonth}-${endDay}`;
      switch (eventsData[i].eventType) {
        case "Vacaciones":
          obj.backgroundColor = "#1e2fdf";
          break;
        case "Baja":
          obj.backgroundColor = "#e6012f";
          break;
        case "Permiso":
          obj.backgroundColor = "#f9ba00";
          break;
        case "Festivo centro":
          obj.backgroundColor = "#000000";
          break;
      }

      // var sampleObj = {
      //   ["selection" + (i + 2)]: {
      //     startDate: new Date(obj.startDate),
      //     endDate: new Date(obj.endDate),
      //     key: `selection${i + 2}`,
      //     color: obj.backgroundColor,
      //   },
      // };
      // var objects = { key1: { name: "etc" } };

      // for (var x = 0; x < 2; x++) {
      // }

      let newObj = {
        startDate: new Date(obj.startDate),
        endDate: new Date(obj.endDate),
        key: `selection${i + 2}`,
        color: obj.backgroundColor,
      };
      setDates([...dates, newObj]);

      // console.log(objects);
      // setDates(dates);
      // setDates({ ...dates, sampleObj });
      // console.log(dates,"dates1")
      //   dates.push( sampleObj )
      // dates.selection2.startDate=new Date(obj.startDate)
      // dates.selection2.endDate=new Date(obj.endDate)
      // console.log(new Date(obj.startDate))

      // events.push(obj);
    }
    // setDates(dates)
    // setEvents(events);
    // setFlag(true);
  };

  const handleMonthName1 = (args1) => {
    const monthName = args1.toString().split(" ");

    const month = moment(monthName[1], "MMM").format("MM");
    const year = moment(monthName[3], "YYYY").format("YYYY");

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

    // getEvents();
    // handleEvent();
  };

  const handleMonthName2 = (args) => {
    const monthName = args.toString().split(" ");

    const month = moment(monthName[1], "MMM").format("MM");
    const year = moment(monthName[3], "YYYY").format("YYYY");
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

    // getEvents();
    // handleEvent();
  };

  useEffect(() => {
    let serviceId1 = serviceList.find(
      ({ serviceName }) => serviceName === service
    );

    setSelectedServiceId(serviceId1?._id);
  }, [service]);

  useEffect(() => {
    let workerId1 = workerList.find(({ name }) => name === worker);

    setSelectedWorkerId(workerId1?._id);
  }, [worker]);

  const handleChange = (item) => {
    dates[0].startDate = item?.selection?.startDate ? item?.selection?.startDate : item?.selection2?.startDate;
    dates[0].endDate = item?.selection?.endDate ? item?.selection?.endDate : item?.selection2?.endDate;
    setDates([...dates]);
  };

  const handleChangeService = (event) => {
    setService(event.target.value);
  };
  const handleChangeWorker = (event) => {
    setWorker(event.target.value);
  };

  const handleGoBack = () => {
    // handleClickOpen()
    // setOpen(true);
    if(centerAdminLoginStatus==true){
      history.push("/center/admin/dashboard");
    }else{
      
      history.push("/center/main-page");
    }
  };

  const handleAllDay = () =>{
    if(showGetTime==true){

      setShowGetTime(false)
    }else{
      setShowGetTime(true)
    }
  }

  return (
    <div>
      <Header />

      <Grid container className="emg-container">
        <Grid
          item
          className="left-item"
          // spacing={4}
          xs={12}
          sm={12}
          md={6}
          lg={6}
          xl={6}
          style={{ justifyContent: "center" }}
        >
          <DateRange
            // editableDateInputs={true}
            // dayContentRenderer={(args)=>console.log(args,"00")}
            // dateDisplayFormat=
            onShownDateChange={(arg) => handleMonthName2(arg)}
            onChange={(item) => handleChange(item)}
            moveRangeOnFirstSelection={false}
            ranges={dates}

            // {dates}
          />
          <Grid item style={{display:'flex',marginLeft:'3rem'}}>
            <div className="showcolorindication">
              <span className="green"></span><span>{t("Selected day")}</span>
            </div>
            <div className="showcolorindication">
              <span className="black"></span><span>{t("Closed Center")}</span>
            </div>
            <div className="showcolorindication">
            <span className="red"></span><span>{t("Worker Come Down")}</span>
            </div>
            <div className="showcolorindication">
            <span className="yellow"></span><span>{t("Worker Excuse Me")}</span>
            </div>
            <div className="showcolorindication">
            <span className="blue"></span><span>{t("Worker Holiday")}</span>
            </div>
            
          </Grid>
        </Grid>
        <Grid item className="right-item" xs={12} sm={12} md={6} lg={6} xl={6}>
          <div className="right-subItems">
            <div className="slectors">
              <FormControl className="select-service">
                <Select
                  placeholder="Select Service"
                  value={service}
                  onChange={handleChangeService}
                  displayEmpty
                  // className={classes.selectEmpty}
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value="">
                    <em>{t("Select Service")}</em>
                  </MenuItem>
                  {serviceList.map((item) => (
                    <MenuItem value={item.serviceName}>
                      {item.serviceName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl className="select-worker">
                <Select
                  // placeholder="Select Worker"
                  value={worker}
                  onChange={handleChangeWorker}
                  displayEmpty
                  // className={classes.selectEmpty}
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value="">
                    <em>{t("Select Worker")}</em>
                  </MenuItem>
                  {workerList.map((item) => (
                    <MenuItem value={item.name}>{item.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="infoText">
              {/* Text */}
              <h4>{`${t("Appoinment will be cancled from")} ${moment(
                dates[0].startDate
              ).format("DD")} ${t("to")} ${moment(dates[0].endDate).format("DD")}`}</h4>
            </div>
            {showGetTime == true ? (
              <>
                <div className="startTime">
                  {/* Start Time */}
                  {t("From Day startDate at")}
                  <form noValidate>
                    <TextField
                      id="time"
                      label="StartTime"
                      type="time"
                      value={starttime}
                      onChange={(e) => setStartTime(e.target.value)}
                      defaultValue="07:30"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        step: 300, // 5 min
                      }}
                    />
                  </form>
                </div>
                <div className="endTime">
                  {/* End Time */}
                  {t("untill the EndDate at")}
                  <form noValidate>
                    <TextField
                      id="time"
                      label="EndTime"
                      type="time"
                      value={endtime}
                      onChange={(e) => setEndTime(e.target.value)}
                      defaultValue="07:30"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        step: 300, // 5 min
                      }}
                    />
                  </form>
                </div>
              </>
            ) : null}
            <div className="allDayBtn">
              {/* Button */}

              <Button onClick={()=>handleAllDay()} className="returnBtn1" color="primary">
                
                {t("All Day")}
              </Button>
            </div>
          </div>
        </Grid>
        <div className="main-btns">
          <div>
            <button className="goBackBtnem" onClick={() => handleGoBack()}>
              {t("Go Back")}
            </button>
          </div>
          <div>
            <button
              className="cancleAppoinmentem"
              onClick={() => cancleAppoinment()}
            >
              {t("Cancle Appoinment")}
            </button>
          </div>
        </div>
      </Grid>

      {/* It is for 6C+ Confirm emergency cancellation */}
      <div>
        <Dialog
          // className={classes.dialogPaper}
          fullWidth={fullWidth}
          maxWidth={maxWidth2}
          open={openEmergencyCancle}
          onClose={handleClose}
          aria-labelledby="max-width-dialog-title"
        >
          {/* <DialogTitle id="max-width-dialog-title">Optional sizes</DialogTitle> */}
          <DialogContent>
            <DialogContentText>
              <div className="titlecontent">
                {t("Are you sure you want to cancel the appointments of the services.... And of the worker .... from")}{" "}
                {`${moment(dates[0].startDate).format(
                  "DD"
                )} at ${starttime} to ${moment(dates[0].endDate).format(
                  "DD"
                )} at ${endtime}`}
              </div>
            </DialogContentText>
            <div className="datacontent">
              {("It is not necessary that you call fus clients 1 x 1 to notify savetime will send them an email and a push notification so that they are aware of the cancellation")}
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
                onClick={cancleConfirmAppoinment}
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

export default EmergencyCancle;

//"customDateForCancleAppointment": false,
