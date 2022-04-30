import React, { useState, useEffect } from "react";
import { Container, Grid, TextField } from "@material-ui/core";
import moment from "moment";

import Schedule from "./Schedule";
import "./calendar.css";
import Header from "../../components/Header";
import CenterAdminHeader from '../center-admin/CenterAdminHeader/CenterAdminHeader';

import Footer from "../../components/Footer";
import { useSelector, useDispatch } from "react-redux";


import { setCustomScheduleTime } from "../../redux/actions/actions";

import { useHistory } from "react-router-dom";

import { Calendar } from "react-multi-date-picker";
import "react-multi-date-picker/styles/colors/teal.css"
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { useTranslation } from "react-i18next";

const monthlist = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function Calender(props) {
  const {t} = useTranslation();
  let SD = moment().format("YYYY-MM-DD")
  let ED = moment().format("YYYY-MM-DD")

  const history = useHistory();
  const centerAdminLoginStatus = useSelector((state) => state.centerAdminLoginStatus);
  const [centerAdminHeaderVisible, setCenterAdminHeaderVisible] = useState(false);

  const [data, setData] = useState({});
  const [showdata, setShowData] = useState({});
  const [show, setShow] = useState(true);
  const [isData, setIsData] = useState(false);
  const [dataSource, setDataSource] = useState({});

  const [values, setValues] = useState([]);



  const [currentEvent, setCurrentEvent] = useState({
    startDate: null,
    endDate: null,
  });

  // const [SD, setSD] = useState("")
  // const [ED, setED] = useState("")
  const custom = useSelector((state) => state.customSchedule);
  const timetable = useSelector((state) => state.workerschedules);
  const [datearray, setArray] = useState([]);
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const customscheduletime = useSelector((state) => state.customscheduletime);

  const handleClickOpen = () => {
    setOpen(true);
  };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  useEffect(() => {
    const path = history.location.pathname;
    const path_array = path.split("/");
    if (path_array[2] === "admin") {
      setCenterAdminHeaderVisible(true);
    }

  }, [])

  useEffect(() => {
    if (values.length > 1) {

      let timeobj = [{
        startDate: values[0].format("YYYY-MM-DD"),
        endDate: values[1].format("YYYY-MM-DD")
      }]
      if (timeobj) {
        handleRange(timeobj)
      }
    }
  }, [values]);

  const handleRange = (item) => {

    if (item.length > 0) {
      SD = item[0].startDate
      ED = item[0].endDate
    }
    if (SD && ED) {

      saveCurrentDate();
    }

  };

  useEffect(() => {
    saveCurrentDate();
  }, [props.match.params.type]);

  const handleData = (data) => {
    console.log("data", data);
  };

  const saveCurrentDate = () => {
    var oneDate = moment(SD, "DD-MM-YYYY");
    var monthName = oneDate.format("MMMM");
    let datelist = [];

    for (var d = new Date(SD); d <= new Date(ED); d.setDate(d.getDate() + 1)) {
      let ed = moment(d);
      let a = ed.utc().format("DD-MM-YYYY");

      datelist.push(a);
    }
    setArray(datelist);

    const currentEventData = {
      startDate: SD,
      endDate: ED,
      monthname: monthName,
      datelist: datelist,
      show: show,
      typeOfSchedule: "custom",
      new: true,
    };
    setIsData(true);
    setData(currentEventData);
    //this.setState({ currentEvent: null });

  };

  // useEffect(() => {
  //   if (props.match.params.type == "worker") {
  //     if (Object.keys(timetable).length > 0) {
  //       const customtable = timetable.customDate;
  //       if (customtable.length > 0) {
  //         const len = customtable.length - 1;
  //         console.log(customtable, "customtable");
  //         const dateList = customtable.map((data) => data.Date);
  //         const timeList = customtable.map((data) => data.time);

  //         // const SD = customtable[0].Date
  //         // const ED = customtable[len].Date

  //         // const currentEvent = { startDate: SD, endDate: ED, datelist: dateList, show: show, typeOfSchedule: "custom", custom: customtable }

  //         const tempObj = currentEvent;
  //         setIsData(true);
  //         setData(tempObj);
  //       }
  //     }
  //   } else {
  //     if (custom.length > 0) {
  //       const len = custom.length - 1;

  //       const dateList = custom.map((data) => data.Date);
  //       const timeList = custom.map((data) => data.time);

  //       // const SD = custom[0].Date
  //       // const ED = custom[len].Date

  //       //  const currentEvent = { startDate: SD, endDate: ED, datelist: dateList, show: show, typeOfSchedule: "custom", custom: custom }

  //       const tempObj = currentEvent;
  //       setIsData(true);
  //       setData(tempObj);

  //       console.log("currentEvent", tempObj);
  //     } else {
  //     }
  //   }
  // }, []);

  return (
    <>

      <div className="center-calendar">

        {
          centerAdminLoginStatus === true && centerAdminHeaderVisible === true ?
            <CenterAdminHeader title={t("Center Data")} />
            :
            <Header title={t("Center Data")} className="center-header" />
        }

        <Grid container className="container-1">
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}
            className="center-cal"
          >
            <Calendar
              value={values}
              onChange={(dateObjects) => {
                setValues(dateObjects);
              }}
              fullYear
              minDate={new Date()}
              range={true}
              showOtherDays={true}
              className="teal"
            />
            {/* <DateRangePicker 
           onChange={(item)=>handleRange(item)}
          //  {item => setState([item.selection])}
           showSelectionPreview={true}
           moveRangeOnFirstSelection={false}
           minDate={addDays(new Date(), -0)}
           months={4}
           ranges={state}
           direction="vertical"
           scroll={{ enabled: true }}
           /> */}
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={5}
            lg={5}
            xl={5}
            className="container-2"
          >
            <Schedule data={data} isData={isData} handleData={handleData} />
          </Grid>
        </Grid>

        <Footer className="calendar-footer" />
      </div>
    </>
  );
}

export default Calender;

{
  /* <Calendar
              enableRangeSelection={true}
              onRangeSelected={(e,date) => handleRange(e,date)}
              minDate={new Date()}
              dataSource={dataSource}
              style="background"
              roundRangeLimits={true}
            /> */
}