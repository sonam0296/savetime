import React, { useState, useEffect } from "react";
import { Link, useHistory, withRouter } from "react-router-dom";
import add_icon from "../../assets/add_Time.jpg";
import {
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import { loadCSS } from "fg-loadcss";
import "./schedule.css";
import "react-calendar/dist/Calendar.css";
import { useToasts } from "react-toast-notifications";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import IconButton from "@material-ui/core/IconButton";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import moment from "moment";
import instance from "../../axios";
import requests from "../../requests";
import {
  setDefaultSchedule,
  setWorkerDefaultSchedule,
  setWorkerCustomSchedule,
  openWorkerModel,
  setCustomSchedule,
  workerSchedules,
  setCollectiveDefaultSchedule,
  setCollectiveCustomSchedule,
  setCollectiveServiceModel,
  setCustomData,
  setStarttime,
  setEndtime,
  setDefaultScheduleTimeArray,
  setDefaultScheduleApiData,
} from "../../redux/actions/actions";
import { useSelector, useDispatch } from "react-redux";

import { successToaster, errorToaster } from "../../common/common";
import { useTranslation } from "react-i18next";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
let count = 0;

function Schedule(props) {
  const {t} = useTranslation();
  const language = useSelector(state => state.language)
  const selectedServicesForAdmin = useSelector(
    (state) => state.selectedServicesForAdmin
  );
  const centerAdminLoginStatus = useSelector(
    (state) => state.centerAdminLoginStatus
  );
  const [centerAdminHeaderVisible, setCenterAdminHeaderVisible] =
    useState(false);
  const history = useHistory();

  const { addToast } = useToasts();

  const dispatch = useDispatch();

  const [selectDay, setDayList] = useState([]);

  const [selectDate, setDateList] = useState([]);

  const [defaultBtn, setDefault] = useState(false);

  const [checkindex, setCheckindex] = useState(null);

  const [defaultState, setdefaultState] = useState(false)

  const [defaultScheduleArray, setDefaultScheduleArray] = useState([
    {
      isChecked: false,
      Days: "Monday",
      time: [
        {
          startTime: "",
          endTime: "",
        },
      ],
    },
    {
      isChecked: false,
      Days: "Tuesday",
      time: [
        {
          startTime: "",
          endTime: "",
        },
      ],
    },
    {
      isChecked: false,
      Days: "Wednesday",
      time: [
        {
          startTime: "",
          endTime: "",
        },
      ],
    },
    {
      isChecked: false,
      Days: "Thursday",
      time: [
        {
          startTime: "",
          endTime: "",
        },
      ],
    },
    {
      isChecked: false,
      Days: "Friday",
      time: [
        {
          startTime: "",
          endTime: "",
        },
      ],
    },
    {
      isChecked: false,
      Days: "Saturday",
      time: [
        {
          startTime: "",
          endTime: "",
        },
      ],
    },
    {
      isChecked: false,
      Days: "Sunday",
      time: [
        {
          startTime: "",
          endTime: "",
        },
      ],
    },
  ]);

  const [dateschedule, setDateSchedule] = useState({
    Date: "",
    time: [
      {
        startTime: "",
        endTime: "",
      },
      {
        startTime: "",
        endTime: "",
      },
    ],
  });

  const [timeArray, setTimeArray] = useState([]);

  const [mappingArray, setMappingArray] = useState([{}, {}]);

  const [dateArray, setDateArray] = useState([]);

  const [max, setMax] = useState(0);

  const [tempArray, setTempArray] = useState([]);

  const [timeArray2, setTimeArray2] = useState([
    {
      startDate: "",
      endDate: "",
      time: [
        {
          startTime: "",
          endTime: "",
        },
      ],
    },
  ]);

  const [displayTimeArray, setDisplayTimeArray] = useState([]);

  const [defaultScheduleMontimeArray, setDefaultScheduleMontimeArray] =
    useState([]);

  const [firstTime, setFirstTime] = useState({});

  const token = useSelector((state) => state.token);
  const logincenterToken = useSelector(state => state.selectedLoginCenter.token)

  const [scheduleID, setID] = useState("");

  const user = useSelector((state) => state.loginData);

  const timetable = useSelector((state) => state.workerschedules);

  const workerinput = useSelector((state) => state.workerinput);

  const collectiveServiceSelector = useSelector(
    (state) => state.collectiveservice
  );

  const [collectiveServiceCustomSchedule, setCollectiveServiceCustomSchedule] =
    useState([]);

  const [workerCustomScheduleState, setworkerCustomScheduleState] = useState(
    []
  );
  const [centerCustomScheduleState, setCenterCustomScheduleState] = useState(
    []
  );

  const [customDataCenter, setCustomDataCenter] = useState([]);

  const workerID = useSelector((state) => state.workerinput._id);

  const defaultTime = useSelector((state) => state.defaultSchedule);

  const workerCustomSchedule = useSelector(
    (state) => state.workerCustomSchedule
  );

  const workerDefaultSchedule = useSelector(
    (state) => state.workerDefaultSchedule
  );

  const defaultSchedule_apidataSelector = useSelector(
    (state) => state.defaultSchedule_apidata
  );
  const workerdataSelector = useSelector((state) => state.workerdata);

  const collectiveDefaultScheduleSelector = useSelector(
    (state) => state.collectiveDefaultSchedule
  );

  const [counter, setCounter] = useState(0);

  const [stime, setStime] = useState("");

  const [etime, setEtime] = useState("");

  const [counterNew, setCounterNew] = useState(0);
  const [counter2, setCounter2] = useState(0);

  const customdataSelector = useSelector((state) => state.customdata);

  const defaultschedule_timearraySelector = useSelector(
    (state) => state.defaultSchedule_timearray
  );

  const [fetchCustomData, setFetchCustomData] = useState([]);

  const centerId_from_signUp = useSelector((state) => state.centerdata._id);
  const centerId_from_signIn = useSelector((state) => state.loginData._id);

  let centerId;
  if (centerId_from_signUp == undefined) {
    centerId = centerId_from_signIn;
  } else {
    centerId = centerId_from_signUp;
  }

  // Flatpickr For CustomSchedule
  const DisplayFlatpickr = () => {
    return (
      <div className="input-field">
        <div className="input-data">
          <Flatpickr
            data-enable-time
            placeholder="Time"
            onChange={(e) => handleDateTable(e, "1")}
            value=""
            options={{
              enableTime: true,
              noCalendar: true,
              dateFormat: "H:i",
              time_24hr: true,
              disableMobile: "true",
            }}
            className="timepicker text-muted rounded"
          />
          <Flatpickr
            data-enable-time
            placeholder="Time"
            onChange={(e) => handleDateTable(e, "2")}
            value=""
            options={{
              enableTime: true,
              noCalendar: true,
              dateFormat: "H:i",
              time_24hr: true,
              disableMobile: "true",
            }}
            className="timepicker text-muted rounded"
          />
          <Icon className="fa fa-times-circle crossicons" color="primary" />
        </div>
      </div>
    );
  };

  // useEffect(() => {
  //   setDefaultScheduleArray(defaultScheduleArray);
  // }, [defaultScheduleArray]);

  // For Delete Button
  useEffect(() => {
    dispatch(setDefaultScheduleTimeArray(defaultScheduleMontimeArray));
  }, [defaultScheduleMontimeArray.length]);

  //Adding Flatpickr Method For Default Schedule
  const onAddBtnClickDefaultSchedule = (
    event,
    defaultScheduleArrayNew,
    day,
    i
  ) => {
    event.preventDefault();
    let obj = {
      startTime: "",
      endTime: "",
    };
    defaultScheduleArray.map((item) => {
      if (day.Days == item.Days) {
        item.time.push(obj);
      }
    });

    // setDefaultScheduleArray(defaultScheduleArray)
    setDefaultScheduleArray([...defaultScheduleArray]);
  };

  //Adding Flatpickr for Custom Schedule
  const onAddBtnClick = (event) => {
    // let obj = {
    //   startTime: stime,
    //   endTime: etime,
    // };
    let obj = {
      startTime: "",
      endTime: "",
    };

    timeArray2[0].time.push(obj);

    setCounter(counter + 1);
    setDisplayTimeArray(
      displayTimeArray.concat(
        <DisplayFlatpickr key={displayTimeArray.length} />
      )
    );
  };

  const handleCalendar = () => {
    setdefaultState(true)
    // setToCalendar(true)
    // props.handleRedirect()
    // history.push("/customcalendar")
    if (props.type == "center") {
      dispatch(setDefaultSchedule(defaultScheduleArray));
      handleSubmit();
      history.push("/customcalendar/center");
      // history.push("/center/calendar")
    } else if (props.type == "worker") {
      dispatch(setWorkerDefaultSchedule(defaultScheduleArray))
      handleSubmit();
      history.push("/customcalendar/worker");
      // history.push("/center/calendar")
    } else if (props.type === "collectiveService") {
      const path = history.location.pathname;
      const path_array = path.split("/");
      if (path_array[2] === "admin") {
        history.push("/center/admin/servicescustomcalendar/collectiveservice");
      } else {
        handleSubmit();
        dispatch(setCollectiveDefaultSchedule(defaultScheduleArray))
        history.push("/customcalendar/collectiveservice");
      }
    }
  };
  // let maxindex = 0;
  const getTimeTable = async () => {

    const response = await instance
      .get(`${requests.fetchTimeTable}/${user._id}?lang=${language}`, {
        headers: {
          authorization: logincenterToken,
        },
      })
      .catch((error) => {
        let errorMessage = "";
        if (error?.response?.data && error?.response?.data?.error) {
          errorMessage = error?.response?.data?.error?.message;
        } else {
          errorMessage = error?.response?.data?.message;
        }
        // errorToaster(errorMessage);

        // addToast(errorMessage, { appearance: 'error' })
      });

    if (response && response.data) {
      if (Object.keys(response.data.data).includes("customData")) {
        dispatch(setCustomSchedule(response.data.data.customDate));
        const arr = response.data.data.customDate;
        const list = arr.map((d) => d.Date);
        // const time =  response.data.data.customSchedule.map((data)=>data.time)
        setDateArray(response.data.data.customDate);
        setTempArray(response.data.data.customDate);
        setDateList(list);
      } else {
        dispatch(setCustomSchedule([]));
      }

      let arr = response.data.data.defaultSchedule;

      const id = response.data.data.centerId;
      setID(id);

      const days = arr.map((data) => data.Days);

      setDayList(days);
      setTimeArray(arr);
      if (arr.length > 0) {
        dispatch(setDefaultScheduleApiData(arr));
        dispatch(setDefaultSchedule(arr));
      }
      

        arr.map((item, index) => {
          
  
          if (arr[index].time.length > 0) {
            defaultScheduleArray[index].isChecked =
              arr[index].time.length > 0 ? true : false;
            defaultScheduleArray[index].Days = arr[index].Days;
            defaultScheduleArray[index].time =
              arr[index].time.length > 0 ? arr[index].time : [];
          }
          setDefaultScheduleArray(defaultScheduleArray);
        });
    }else{
      if(defaultTime.length>0){
        const defaultarr = defaultTime.length > 0
                ? defaultTime.filter((data) => data.isChecked==true && data.time.length > 0)
                : [];
                
            if (defaultarr.length > 0) {
              // const days = defaultarr.map((data) => data.Days);
             
              // setTimeArray(defaultarr);
              defaultarr.map((item, index) => {
                if (defaultarr[index].time.length > 0) {
                  defaultScheduleArray[index].isChecked =
                    defaultarr[index].time.length > 0 ? true : false;
                  defaultScheduleArray[index].Days = defaultarr[index].Days;
                  defaultScheduleArray[index].time =
                    defaultarr[index].time.length > 0
                      ? defaultarr[index].time
                      : [];
                }
                setDefaultScheduleArray(defaultScheduleArray);
              });
            }
          }
      // if(defaultTime.length>0){
  
      //   defaultTime.map((item, index) => {
         
    
      //     if (defaultTime[index].time.length > 0) {
      //       defaultScheduleArray[index].isChecked =
      //         defaultTime[index].time.length > 0 ? true : false;
      //       defaultScheduleArray[index].Days = defaultTime[index].Days;
      //       defaultScheduleArray[index].time =
      //         defaultTime[index].time.length > 0 ? defaultTime[index].time : [];
      //     }
      //     setDefaultScheduleArray(defaultScheduleArray);
      //   });
      // }
    }
  };

  // Post Schedules Data in Backend
  const handleSubmit = async (e, row) => {
    let obj = {};
    if (props.type == "collectiveService") {
      const defaultArrayService = defaultScheduleArray.filter(
        (data) => data.isChecked == true
      );
      props.handleTimeArrayService(defaultArrayService);

      dispatch(setCollectiveDefaultSchedule(defaultArrayService));

      setDefault(true);

      successToaster(t("Collective Service's Default Schedule Saved !"));
    }

    if (props.type == "worker") {
      const defaultArrayworker = defaultScheduleArray.filter(
        (data) => data.isChecked == true
      );
      props.handleTimeArray(defaultArrayworker);

      dispatch(setWorkerDefaultSchedule(defaultArrayworker));

      setDefault(true);
      successToaster(t("Worker's Default Schedule Saved !"));
    } else {
      if (props.match.params.type == "center" || props.type == "center") {
       
        const defaultArray = defaultScheduleArray.filter(
          (data) => data.isChecked == true
        );
        obj = {
          defaultSchedule: defaultArray,
        };

        const response = scheduleID
          ? await instance
              .put(`${requests.fetchUpdateTimeTable}?lang=${language}`, obj, {
                headers: {
                  Authorization: logincenterToken,
                },
              })
              .catch((error) => {
                console.log("ee", error.response);
                let errorMessage = error.response.data.message;
                errorToaster(errorMessage);
              })
              .then(() => {
                setID(user._id);
                props.updateCenter();
                // successToaster("Default Schedule Updated!");
                // addToast("Schedule Updated!", { appearance: 'success', autoDismiss: true })
              })
          : await instance
              .post(`${requests.fetchCreateCenterSchedule}?lang=${language}`, obj, {
                headers: {
                  Authorization: logincenterToken,
                },
              })
              .catch((error) => {
                console.log("ee", error.response);
                let errorMessage = error.response.data.message;
                errorToaster(errorMessage);
              })
              .then(() => {
                setDefault(true);
                props.updateCenter();
                // successToaster("Default Schedule Saved !");
              });
        dispatch(setDefaultSchedule(defaultArray));
      }
    }
  };

  // Method For Handle CheckBox in Default Schedule
  const handleDay = (e, days, ind) => {
    
    defaultScheduleArray.map((item) => {
      if (days.Days == item.Days) {
        if (days.isChecked == false) {
          item.isChecked = true;
          // item.time=[
          //   {
          //     startTime: "",
          //     endTime: "",
          //   },
          // ]
        } else {
          item.isChecked = false;
          item.time = [
            {
              startTime: "",
              endTime: "",
            },
          ];
        }
      }
    });
    setDefaultScheduleArray([...defaultScheduleArray]);

    let isTrueData = defaultScheduleArray.filter(
      (item) => item.isChecked == true
    );

    if (
      isTrueData[0]?.time.length > 0 &&
      defaultScheduleArray[ind].isChecked == true
    ) {
      defaultScheduleArray[ind].time = isTrueData[0]?.time;
    }
    setDefaultScheduleArray([...defaultScheduleArray]);


    e.preventDefault();

    // handleSubmit();
    // getTimeTable();

    // defaultScheduleArray.map((item, index) => {
    //   if (item.isChecked == true) {
    //     let obj = {
    //       Days: item.Days,
    //       time: item.time,
    //     };

    //     if (index == 0) {
    //       setFirstTime(obj);
    //     } else {
    //       obj = {
    //         Days: item.Days,
    //         time: firstTime.time,
    //       };
    //     }
    //     defaultScheduleArray[index].time = obj.time;
    //     // setTimeArray([...timeArray, obj]);

    //     // setDefaultScheduleArray([...defaultScheduleArray]);
    //   }
    // });
  };

  const handleDate = (e, dates, index) => {
    e.preventDefault();
    if (selectDate.includes(dates)) {
      if (dateArray.length > 0) {
        const newIndex = dateArray.findIndex((day) => day.Date == dates);
        const newObj = dateArray.find((day, ind) => ind == newIndex);
        if (newObj) {
          newObj.Date = "";
          newObj.time = [
            {
              startTime: "",
              endTime: "",
            },
            // {
            //   startTime: "",
            //   endTime: "",
            // },
          ];

          dateArray[newIndex] = newObj;

          setDateArray(dateArray);
        } else {
          const Obj = {};
          Obj.Date = "";
          Obj.time = [
            {
              startTime: "",
              endTime: "",
            },
            // {
            //   startTime: "",
            //   endTime: "",
            // },
          ];

          dateArray[index] = Obj;

          setDateArray(dateArray);
        }
      }
      let datarray = selectDate.filter((date) => date !== dates);

      setDateList(datarray);
    } else {
      const datearray = [...selectDate];
      datearray[index] = dates;
      setDateList(datearray);
      if (index > 0 && dateArray.length > 0) {
        const data = dateArray[0].time;
        dateschedule.Date = dates;
        dateschedule.time = data;
        setDateArray(dateschedule);
        handleDateSchedule(dateschedule, index, days);
      }
      if (index == 0 && dateArray.length > 0 && dateArray[1]) {
        const data = dateArray[1].time;
        dateschedule.Date = dates;
        dateschedule.time = data;
        setDateArray(dateschedule);
        handleDateSchedule(dateschedule, index, days);
      }
    }
  };

  const handleSchedule = (value, i, day) => {
    const obj = {
      Days: value.Days,
      time: value.time,
    };
    const datarray = [...timeArray];
    datarray[i] = obj;
    if (i == 0) {
      setFirstTime(obj);
    }

    setTimeArray(datarray);
  };

  const handleDateSchedule = (value, i, day) => {
    const obj = {
      Date: value.Date,
      time: value.time,
    };
    const datarray = [...dateArray];

    datarray[i] = obj;
    setDateArray(datarray);
    props.handleData(datarray);
  };

  const deleteRowTime = (e, i, index) => {
    let strIndex = index.toString();

    defaultScheduleArray[i].time.splice(index, 1);
    setDefaultScheduleArray([...defaultScheduleArray]);
    // setDefaultScheduleArray(defaultScheduleArray);
  };

  const handleTimetable = (e, i, day, no, index) => {
    const t = moment(e[0]);

    const ST = t.format("HH:mm");
    console.log(ST);

    if (no == "1") {
      // defaultScheduleArray[i].time[
      //   defaultScheduleArray[i].time.length - 1
      // ].startTime = ST;
      defaultScheduleArray[i].time[index].startTime = ST;

      setDefaultScheduleArray([...defaultScheduleArray]);
      dispatch(setStarttime(ST));
    }
    if (no == "2") {
      // defaultScheduleArray[i].time[
      //   defaultScheduleArray[i].time.length - 1
      // ].endTime = ST;
      defaultScheduleArray[i].time[index].endTime = ST;
      setDefaultScheduleArray([...defaultScheduleArray]);
      dispatch(setEndtime(ST));
    }
  };

  const handleDateTable = (e, no) => {
    const t = moment(e[0]);

    const ST = t.format("HH:mm");

    if (no == counter) {
      let obj = {
        startTime: ST,
      };
    }

    if (no == "1") {
      // setTimeArray2([...timeArray2,{startTime:ST}])
      timeArray2[0].time[timeArray2[0].time.length - 1].startTime = ST;
      setStime(ST);
    }
    if (no == "2") {
      timeArray2[0].time[timeArray2[0].time.length - 1].endTime = ST;
      setEtime(ST);
    }
  };
  useEffect(() => {
    if (props.type == "collectiveService") {
      if(collectiveDefaultScheduleSelector.length>0){
        
      const defaultarr =
      collectiveDefaultScheduleSelector.length > 0
          ? collectiveDefaultScheduleSelector.filter(
              (data) => data.isChecked==true && data.time.length > 0
            )
          : [];
      if (defaultarr.length > 0) {
        const days = defaultarr.map((data) => data.Days);

        setDayList(days);
        setTimeArray(defaultarr);
        defaultarr.map((item, index) => {
          if (defaultarr[index].time.length > 0) {
            defaultScheduleArray[index].isChecked =
              defaultarr[index].time.length > 0 ? true : false;
            defaultScheduleArray[index].Days = defaultarr[index].Days;
            defaultScheduleArray[index].time =
              defaultarr[index].time.length > 0
                ? defaultarr[index].time
                : [];
          }
          setDefaultScheduleArray(defaultScheduleArray);
        });
      }
      }else{
        
      if (Object.keys(props.collectivevalues).length > 0) {
        let defaultarr =
          props.collectivevalues && Object.keys(props.collectivevalues).length > 0
            ? props.collectivevalues.defaultSchedule.filter((data) => data.Days !== "")
            : [];

        if (defaultarr.length > 0) {
          const days = defaultarr.map((data) => data.Days);

          defaultarr.map((item, index) => {
            if (defaultarr[index].time.length > 0) {
              defaultScheduleArray[index].isChecked =
                defaultarr[index].time.length > 0 ? true : false;
              defaultScheduleArray[index].Days = defaultarr[index].Days;
              defaultScheduleArray[index].time =
                defaultarr[index].time.length > 0 ? defaultarr[index].time : [];
            }
            setDefaultScheduleArray(defaultScheduleArray);
          });
        }
      } else {
        if (
          collectiveServiceSelector &&
          Object.keys(collectiveServiceSelector).length > 0
        ) {
          let defaultarr =
            collectiveServiceSelector.defaultSchedule &&
            Object.keys(collectiveServiceSelector).length > 0 &&
            collectiveServiceSelector.defaultSchedule &&
            collectiveServiceSelector.defaultSchedule.length > 0
              ? collectiveServiceSelector.defaultSchedule.filter(
                  (data) => data.isChecked==true && data.time.length > 0
                )
              : [];

          if (defaultarr.length > 0) {
            const days = defaultarr.map((data) => data.Days);

            setDayList(days);
            setTimeArray(defaultarr);

            const obj = {
              Days: defaultarr[0].Days,
              time: defaultarr[0].time,
            };

            // setFirstTime(defaultarr[0])
          } else {
            // const defaultarr =
            // collectiveDefaultScheduleSelector.length > 0
            //     ? collectiveDefaultScheduleSelector.filter(
            //         (data) => data.isChecked==true && data.time.length > 0
            //       )
            //     : [];
            // if (defaultarr.length > 0) {
            //   const days = defaultarr.map((data) => data.Days);

            //   setDayList(days);
            //   setTimeArray(defaultarr);
            //   defaultarr.map((item, index) => {
            //     if (defaultarr[index].time.length > 0) {
            //       defaultScheduleArray[index].isChecked =
            //         defaultarr[index].time.length > 0 ? true : false;
            //       defaultScheduleArray[index].Days = defaultarr[index].Days;
            //       defaultScheduleArray[index].time =
            //         defaultarr[index].time.length > 0
            //           ? defaultarr[index].time
            //           : [];
            //     }
            //     setDefaultScheduleArray(defaultScheduleArray);
            //   });
            // }
          }
        }
      }
    }
    }

    //Worker Default Schedule SetUp
    if (props.type == "worker") {
      if (Object.keys(props.Schedules).length > 0) {
        let defaultarr =
          props.Schedules && Object.keys(props.Schedules).length > 0
            ? props.Schedules.defaultSchedule.filter(
                (data) => data.isChecked==true && data.time.length > 0
              )
            : [];
        if (defaultarr.length > 0) {
          const days = defaultarr.map((data) => data.Days);
          // setDayList(days);
          // setTimeArray(defaultarr);

          //setDefaultScheduleArray(defaultarr)

          defaultarr.map((item, index) => {
            if (defaultarr[index].time.length > 0) {
              defaultScheduleArray[index].isChecked =
                defaultarr[index].time.length > 0 ? true : false;
              defaultScheduleArray[index].Days = defaultarr[index].Days;
              defaultScheduleArray[index].time =
                defaultarr[index].time.length > 0 ? defaultarr[index].time : [];
            }
            setDefaultScheduleArray(defaultScheduleArray);
          });
        }
      } else {
        if (workerinput && Object.keys(workerinput).length > 0) {
          let defaultarr =
            workerinput &&
            Object.keys(workerinput).length > 0 &&
            workerinput.defaultSchedule &&
            workerinput.defaultSchedule.length > 0
              ? workerinput.defaultSchedule.filter(
                  (data) => data.isChecked==true && data.time.length > 0
                )
              : [];

          if (defaultarr.length > 0) {
            const days = defaultarr.map((data) => data.Days);

            setDayList(days);
            // setTimeArray(defaultarr);

            defaultarr.map((item, index) => {
              if (defaultarr[index].time.length > 0) {
                defaultScheduleArray[index].isChecked =
                  defaultarr[index].time.length > 0 ? true : false;
                defaultScheduleArray[index].Days = defaultarr[index].Days;
                defaultScheduleArray[index].time =
                  defaultarr[index].time.length > 0
                    ? defaultarr[index].time
                    : [];
              }
              setDefaultScheduleArray(defaultScheduleArray);
            });
          } else {
            const defaultarr =
              workerDefaultSchedule.length > 0
                ? workerDefaultSchedule.filter((data) => data.isChecked==true && data.time.length > 0)
                : [];
            if (defaultarr.length > 0) {
              const days = defaultarr.map((data) => data.Days);

              setDayList(days);
              // setTimeArray(defaultarr);
              defaultarr.map((item, index) => {
                if (defaultarr[index].time.length > 0) {
                  defaultScheduleArray[index].isChecked =
                    defaultarr[index].time.length > 0 ? true : false;
                  defaultScheduleArray[index].Days = defaultarr[index].Days;
                  defaultScheduleArray[index].time =
                    defaultarr[index].time.length > 0
                      ? defaultarr[index].time
                      : [];
                }
                setDefaultScheduleArray(defaultScheduleArray);
              });
            }
          }
        }
      }
    } else {
      if (props.match.params.type == "worker") {
        if (Object.keys(timetable).length > 0) {
          const arr = timetable.customDate;

          const days = arr.map((data) => data.Date);

          setDateList(days);
          setDateArray(arr);
        }
      } else {
        if (props.type == "center") {
          getTimeTable();
        }
      }
    }
  }, []);

  useEffect(() => {
    const path = history.location.pathname;
    const path_array = path.split("/");
    if (path_array[2] === "admin") {
      setCenterAdminHeaderVisible(true);
    }

    if (props.type == "center") {
      getTimeTable();
    }
    //  dispatch(setCustomData({}))
  }, []);

  React.useEffect(() => {
    const node = loadCSS(
      "https://use.fontawesome.com/releases/v5.12.0/css/all.css",
      document.querySelector("#font-awesome-css")
    );
    return () => {
      node.parentNode.removeChild(node);
    };
  }, []);

  const handleShowData = (data) => {
    setDateList(data);
  };

  const handleEmpty = () => {
    setDateArray([]);
  };

  const saveState = async (e) => {
    let obj = {};

    timeArray2[0].startDate = moment(props.data.startDate).format("DD-MM-YYYY");
    timeArray2[0].endDate = moment(props.data.endDate).format("DD-MM-YYYY");
    setTimeArray2(timeArray2);

    if (
      props.match.params.type == "collectiveservice" ||
      props.type == "collectiveService"
    ) {
      if (props.data.typeOfSchedule == "custom") {
        let sampleArr = [];

        if (props.data.new) {
          let obj = {
            startDate: timeArray2[0].startDate,
            endDate: timeArray2[0].endDate,
            time: timeArray2[0].time,
          };

          if (fetchCustomData.length > 0) {
            fetchCustomData.map((item) => {
              if (
                moment(item.startDate, "DD-MM-YYYY").format("YYYY-MM-DD") <=
                  moment(obj.startDate, "DD-MM-YYYY").format("YYYY-MM-DD") &&
                moment(item.endDate, "DD-MM-YYYY").format("YYYY-MM-DD") >=
                  moment(obj.startDate, "DD-MM-YYYY").format("YYYY-MM-DD")
              ) {
                errorToaster("Date Already Selected");
              } else {
                setFetchCustomData([...fetchCustomData, obj]);
              }
            });
          } else {
            setFetchCustomData([...fetchCustomData, obj]);
          }
        }
      }
    }

    if (props.match.params.type == "worker" || props.type == "worker") {
      if (props.data.typeOfSchedule == "custom") {
        if (props.data.new) {
        }

        let obj = {
          startDate: timeArray2[0].startDate,
          endDate: timeArray2[0].endDate,
          time: timeArray2[0].time,
        };
        if (fetchCustomData.length > 0) {
          fetchCustomData.map((item) => {
            if (
              moment(item.startDate, "DD-MM-YYYY").format("YYYY-MM-DD") <=
                moment(obj.startDate, "DD-MM-YYYY").format("YYYY-MM-DD") &&
              moment(item.endDate, "DD-MM-YYYY").format("YYYY-MM-DD") >=
                moment(obj.startDate, "DD-MM-YYYY").format("YYYY-MM-DD")
            ) {
              errorToaster("Date Already Selected");
            } else {
              setFetchCustomData([...fetchCustomData, obj]);
            }
          });
        } else {
          setFetchCustomData([...fetchCustomData, obj]);
        }
      }
    }
    // handle Update for center
    if (props.match.params.type == "center" || props.type == "center") {
      if (props.data.typeOfSchedule == "custom") {
        if (props.data.new) {
          // let customDataCenter = []
          let obj = {
            startDate: timeArray2[0].startDate,
            endDate: timeArray2[0].endDate,
            time: timeArray2[0].time,
          };

          if (fetchCustomData.length > 0) {
            fetchCustomData.map((item) => {
              if (
                moment(item.startDate, "DD-MM-YYYY").format("YYYY-MM-DD") <=
                  moment(obj.startDate, "DD-MM-YYYY").format("YYYY-MM-DD") &&
                moment(item.endDate, "DD-MM-YYYY").format("YYYY-MM-DD") >=
                  moment(obj.startDate, "DD-MM-YYYY").format("YYYY-MM-DD")
              ) {
                errorToaster("Date Already Selected");
              } else {
                dispatch(setCustomData(obj));
              }
            });
          } else {
            dispatch(setCustomData(obj));
          }
        }
      }
    }
  };
  useEffect(() => {
    if (customdataSelector?.startDate) {
      setFetchCustomData([...fetchCustomData, customdataSelector]);
    }
  }, [customdataSelector]);

  useEffect(() => {
    if (props.match.params.type == "collectiveservice") {
      const path = history.location.pathname;
      const path_array = path.split("/");
      if (path_array[2] === "admin") {
        // console.log("Selected Services 111 Props ===> ", selectedServicesForAdmin.customDate);
        setFetchCustomData(selectedServicesForAdmin.customDate);
      } else {
        setFetchCustomData([]);
      }
    } else if (props.match.params.type == "center" && centerId) {
      fetchCenterCustomSchedules();
    } else if (props.match.params.type == "worker" || workerID) {
      fetchWorkerCustomSchedule();
    }
  }, []);

  const fetchWorkerCustomSchedule = async () => {
    const responce = await instance
      .get(`${requests.fetchWorkerDetails}/${workerID}?lang=${language}`, {
        headers: {
          Authorization: logincenterToken,
          "Content-Type": "application/json",
        },
      })
      .catch((err) => {});
    if (responce?.data?.data[0]?.customDate) {
      setFetchCustomData(responce.data.data[0].customDate);
    } else {
      setFetchCustomData([]);
    }
    //  else if (workerCustomSchedule) {
    //   setFetchCustomData(workerCustomSchedule);
    // }
  };

  const fetchCenterCustomSchedules = async () => {
    const responce = await instance
      .get(`${requests.fetchCustomSchedule}/${centerId}?lang=${language}`, {
        headers: {
          Authorization: logincenterToken,
          "Content-Type": "application/json",
        },
      })
      .catch((err) => {});
    if (responce?.data?.data?.customDate) {
      setCenterCustomScheduleState([...responce.data.data.customDate]);
      setFetchCustomData(responce.data.data.customDate);
    }
  };

  const handleCustomSubmit = async (e, row) => {
    let obj = {};
    if (props.match.params.type == "center" || props.type == "center") {
      if (props.data.typeOfSchedule == "custom") {
        if (props.data.new) {
          let unique1 = dateArray.filter((o) => tempArray.indexOf(o) === -1);

          const customArray = unique1.filter((data) => data.Date !== "");

          obj = {
            defaultSchedule: defaultTime,
            customDate: fetchCustomData,
          };
        } else {
          // const customArray = dateArray.filter((data) => data.Date !== "");

          obj = {
            defaultSchedule: defaultTime,
            customDate: fetchCustomData,
          };
        }

        const response =
          centerCustomScheduleState.length > 0 || defaultTime.length > 0
            ? await instance
                .put(
                  `${requests.fetchUpdateTimeTable}?lang=${language}`,
                  obj,

                  {
                    headers: {
                      Authorization: logincenterToken,
                    },
                  }
                )
                .catch((error) => {
                  let errorMessage = error.response.data.message;
                  errorToaster(errorMessage);
                })
            : await instance
                .post(`${requests.fetchCreateCenterSchedule}?lang=${language}`, obj, {
                  headers: {
                    Authorization: logincenterToken,
                  },
                })
                .catch((error) => {
                  let errorMessage = error.response.data.message;
                  errorToaster(errorMessage);
                });
        if (response) {
          // dispatch(setCustomSchedule(response.data.data.customSchedule));
          // props.updateCenter()
          successToaster(t("Center Updated !"))
          dispatch(setCustomData({}));

          history.push("/center/center-details");
        } //change
        // fetchCenterCustomSchedules();
      }
    }

    if (props.match.params.type == "worker" || props.type == "worker") {
      if (props.data.typeOfSchedule == "custom") {
        let newWorkerObj = {
          name: workerdataSelector.name,
          lastname: workerdataSelector.lastname,
          pinCode: workerdataSelector.pinCode,
          defaultSchedule: workerDefaultSchedule,
          customDate: fetchCustomData,
          image: workerdataSelector.image,
          centerIds: workerdataSelector.centerIds,
          active: workerdataSelector.active,
        };

        if (workerID) {
          const response = await instance
            .put(
              `${requests.fetchUpdateWorkers}?lang=${language}`,
              {
                workerId: workerID,
                customDate: fetchCustomData,
              },
              {
                headers: {
                  Authorization: logincenterToken,
                },
              }
            )
            .catch((error) => {
              let errorMessage = error.response.data.message;
              errorToaster(errorMessage);
            });
          // dispatch(openWorkerModel(true));
          if (response?.data?.data) {
            dispatch(
              setWorkerCustomSchedule(response.data.data.customSchedule)
            );
            successToaster(t("Worker CustomSchedule Saved !"));
            fetchWorkerCustomSchedule();
            history.push("/center/center-details");
          } //change
        } else {
          const responce = await instance
            .post(`${requests.fetchCreateWorker}?lang=${language}`, newWorkerObj, {
              headers: {
                Authorization: logincenterToken,
              },
            })
            .catch((err) => {});
          if (responce && responce.data) {
            dispatch(openWorkerModel(false));
            successToaster(t("Worker Created"));
          }
        }
      }
    }
    if (
      props.type == "collectiveService" ||
      props.match.params.type == "collectiveservice"
    ) {
      const responce = await instance
        .post(
          `${requests.fetchCollectiveService}?lang=${language}`,
          {
            serviceName: collectiveServiceSelector.name_collective,
            duration: collectiveServiceSelector.duration_collective,
            price: collectiveServiceSelector.price_collective,
            maxPerson: collectiveServiceSelector.numofperson_collective,
            type: "collective",
            workerId: collectiveServiceSelector.nameofworkers,
            centerIds: centerId,
            defaultSchedule: collectiveDefaultScheduleSelector,
            customDate: fetchCustomData,
          },
          {
            headers: {
              Authorization: logincenterToken,
              "Content-Type": "application/json",
            },
          }
        )
        .catch((err) => {});
      if (responce.data) {
        successToaster(t("Collective Service' Create !"));
        setFetchCustomData([]);
      }
      dispatch(setCollectiveServiceModel(false));

      // successToaster("Collective Service CustomSchedule Saved !")
      history.push("/center/services");
      // setFetchCustomData(responce.data.data.customDate);
    }
  };

  const handleBack = () => {
    if(props.match.params.type == "worker" || props.type == "worker"){

      dispatch(openWorkerModel(true));
      history.push("/center/center-details");
    }
    if(props.match.params.type == "collectiveservice" || props.type == "collectiveservice"){

      dispatch(setCollectiveServiceModel(true));
      history.push("/center/services")
    }

    if(props.match.params.type == "center" || props.type == "center"){
      history.push("/center/center-details");
    }

    
  };

  return (
    <>
      <div className="main-schedule">
        <Typography variant="h6" className="form-title">
          {t("Schedule")}
        </Typography>

        {props.data && props.data.show && (
          <Typography variant="h6" className="form-title">
            {t("From")}:
            {props.data
              ? props.data.startDate
              : moment().format("YYYY-MM-DD")}{" "}
            {t("to")}:
            {props.data ? props.data.endDate : moment().format("YYYY-MM-DD")}
          </Typography>
        )}
        <div className="schedule">
          {props.data &&
          props.data.datelist &&
          props.data.datelist.length > 0 ? (
            <>
              <div className="schedule-input">
                <div className="schedule-label">
                  <img
                    src={add_icon}
                    alt="addicon"
                    onClick={(e) => onAddBtnClick(e)}
                    id="addicon"
                  />
                </div>
                <div className="input-field">
                  <div className="input-data">
                    <Flatpickr
                      data-enable-time
                      placeholder={t("Time")}
                      onChange={(e) => handleDateTable(e, "1")}
                      value=""
                      options={{
                        enableTime: true,
                        noCalendar: true,
                        dateFormat: "H:i",
                        time_24hr: true,
                        disableMobile: "true",
                      }}
                      className="timepicker text-muted rounded"
                    />
                    <Flatpickr
                      data-enable-time
                      placeholder={t("Time")}
                      onChange={(e) => handleDateTable(e, "2")}
                      value=""
                      options={{
                        enableTime: true,
                        noCalendar: true,
                        dateFormat: "H:i",
                        time_24hr: true,
                        disableMobile: "true",
                      }}
                      className="timepicker text-muted rounded"
                    />
                    <Icon
                      className="fa fa-times-circle crossicons"
                      color="primary"
                    />
                  </div>

                  {displayTimeArray}
                </div>
              </div>
            </>
          ) : (
            defaultScheduleArray.map((day, i) => {
              return (
                <>
                  <div className="schedule-input">
                    <div className="schedule-label">
                      <FormControlLabel
                        control={
                          <Checkbox
                            onClick={(e) => handleDay(e, day, i)}
                            checked={day.isChecked == true ? true : false}
                            // {selectDay.includes(day) ? true : false}
                          />
                        }
                        label={t(day.Days)}
                      />
                    </div>
                    <div className="input-field">
                      {day?.time?.map((item, index) => {
                        return (
                          <div className="input-data">
                            <Flatpickr
                              data-enable-time
                              placeholder={t("Time")}
                              onChange={(e) =>
                                {handleTimetable(e, i, day, "1", index)}
                              }
                              value={item.startTime}
                              options={{
                                enableTime: true,
                                noCalendar: true,
                                dateFormat: "H:i",
                                time_24hr: true,
                                disableMobile: "true",
                              }}
                              className="timepicker text-muted rounded"
                            />
                            <Flatpickr
                              data-enable-time
                              placeholder={t("Time")}
                              onChange={(e) =>
                                {handleTimetable(e, i, day, "2", index)}
                              }
                              value={item.endTime}
                              options={{
                                enableTime: true,
                                noCalendar: true,
                                dateFormat: "H:i",
                                time_24hr: true,
                                disableMobile: "true",
                              }}
                              className="timepicker text-muted rounded"
                            />

                            {index == 0 ? (
                              <i
                                class="fas fa-plus-circle addicons"
                                onClick={(e) =>
                                  onAddBtnClickDefaultSchedule(
                                    e,
                                    defaultScheduleArray,
                                    day,
                                    i
                                  )
                                }
                              />
                            ) : (
                              <i
                                class="fas fa-times-circle crossicons"
                                onClick={(e) => deleteRowTime(e, i, index)}
                              ></i>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              );
            })
          )}
        </div>

        <div className="worker-btn">
          {props.data && props.data.show ? (
            <div>
              <div className="save-btn">
                <button className="save" onClick={(e) => saveState(e)}>
                  {t("Save")}
                </button>
              </div>
              <div className="custom_shedules">
                {/* <div className="individual-shedule"> */}
                {fetchCustomData.length > 0 && fetchCustomData[0].startDate
                  ? fetchCustomData?.map((item) => (
                      <div className="individual-shedule">
                        <span>
                          {t("from")} {item.startDate} {t("to")} {item.endDate}
                        </span>
                        <span>
                          {item?.time?.map((sub) => (
                            <span>
                              {" "}
                              {t("from")} {sub.startTime} {t("to")} {sub.endTime}
                            </span>
                          ))}
                        </span>
                      </div>
                    ))
                  : null}
                {/* </div> */}
              </div>
              <div className="custom-main-btn">
                <div>
                  <Button
                    className="return-btn"
                    onClick={handleBack}
                    variant="contained"
                  >
                    {t("Return")}
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={(e) => handleCustomSubmit(e, props.data)}
                    className="confirm-btn"
                    variant="contained"
                  >
                    {t("Create")}
                  </Button>
                </div>
              </div>
            </div>
          ) : !defaultBtn ? (
            <>
              <Button
                variant="contained"
                style={{ backgroundColor: "#D61C38", color: "white", borderRadius:'10px', marginRight:'2rem' }}
                onClick={(e) => handleSubmit(e)}
              >
                {t("Default Schedule")}
              </Button>
              <Button
                variant="contained"
                component={Link}
                onClick={handleCalendar}
                style={{ backgroundColor: "#00AD22", color: "white", borderRadius:'10px' }}
              >
                {t("Custom Schedule")}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                style={{ backgroundColor: "#00AD22", color: "white", borderRadius:'10px' }}
                onClick={(e) => handleSubmit(e)}
              >
                {t("Default Schedule")}
              </Button>
              <Button
                variant="contained"
                component={Link}
                onClick={handleCalendar}
                style={{ backgroundColor: "#00AD22", color: "white" , borderRadius:'10px'}}
              >
                {t("Custom Schedule")}
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default withRouter(Schedule);
