import React, { useState, useEffect, useRef } from "react";
import "./service.css";
import addlogo from "../../assets/plusicon.png";
import uparrow from "../../assets/north_black_24dp.svg";
import rightarrow from "../../assets/rightarrow.png";
import downarraow from "../../assets/south_black_24dp.svg";
//material-ui
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import { Grid, Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Header from "../../components/Header";
import { Link, Redirect, useHistory, withRouter } from "react-router-dom";
import {
  setCollectiveDefaultSchedule,
  setCollectiveService,
  setCollectiveServiceModel,
  setPersonalService,
} from "../../redux/actions/actions";
import instance from "../../axios";
import requests from "../../requests";

import Schedule from "./Schedule";

import { successToaster, errorToaster } from "../../common/common";
import CenterAdminHeader from "../center-admin/CenterAdminHeader/CenterAdminHeader";
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

const initailFValuespesonal = {
  name_personal: "",
  duration_personal: "",
  price_personal: "",
  worker: [],
};
const initailFValuescollective = {
  // name_collective: "",
  // duration_collective: "",
  // price_collective: "",
  // numofperson_collective: "",
  nameofworkers: [],
  defaultSchedule: [],
  customDate: [],
};
const initialValueselectedService = {
  serviceID: "",
  serviceName: "",
  serviceDuration: "",
};
const initialValueselectedServiceColumnTwo = [
  // {
  // serviceID:'',
  // serviceName:'',
  // serviceDuration:''
  // }
];

function Service() {
  const dispatch = useDispatch();
  const history = useHistory();
  const {t} = useTranslation();
  const language = useSelector(state => state.language)
  const [flag, setFlag] = useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("md");
  const [serviceColumnOneFlag, setServiceColumnOneFlag] = useState(false);
  const [serviceColumnTwoFlag, setServiceColumnTwoFlag] = useState(false);
  const [allWorkerBtnPersonal, setAllWorkerBtnPersonal] = useState(true);
  const [allWorkerBtnCollective, setAllWorkerBtnCollective] = useState(true);
  const centerAdminLoginStatus = useSelector(
    (state) => state.centerAdminLoginStatus
  );
  const [centerAdminHeaderVisible, setCenterAdminHeaderVisible] =
    useState(false);

  const [personalvalues, setPersonalValues] = useState(initailFValuespesonal);
  const [collectivevalues, setCollectiveValues] = useState(
    initailFValuescollective
  );
  const [selectedworker, setSelectedWorker] = useState([]);
  const [interTime, setInterTime] = useState(0);
  const [services, setServices] = useState([]);
  const [serviceArray, setServiceArray] = useState([]);
  const [value, setValue] = useState({});
  const token = useSelector((state) => state.token);
  const logincenterToken = useSelector(state => state.selectedLoginCenter.token)
  const colorChange = useRef();
  const [selectedService, setSelectedService] = useState(
    initialValueselectedService
  );
  const [selectedServiceColumnTwo, setSelectedServiceColumnTwo] = useState(
    initialValueselectedServiceColumnTwo
  );

  const [selectedworkers, setSelectedWorkers] = useState(
    initailFValuescollective.nameofworkers
  );
  const [workersData, setWorkersData] = useState([]);

  const opencollectivemodelSelector = useSelector(
    (state) => state.opencollectivemodel
  );

  const [collectiveServiceData, setCollectiveServiceData] = useState({});
  const classes = useStyles();
  const [personalopen, setPersonalOpen] = useState(false);
  const [collectiveopen, setCollectiveOpen] = useState(false);
  const [serviceOneTrue, setServiceOneTrue] = useState(false);
  const [interleavedOpen, setInterleavedOpen] = useState(false);
  const [TimeTable, setTimeTable] = useState([]);
  const centerId_from_signUp = useSelector((state) => state.centerdata._id);
  const centerId_from_signIn = useSelector((state) => state.loginData._id);

  const state = useSelector((state) => state);
  const personalservice = useSelector((state) => state.personalservice);
  const collectiveservice = useSelector((state) => state.collectiveservice);
  const [personalSelfSuffecient, setPersonalSelfSuffecient] = useState(false);
  const [collectiveSelfSuffecient, setCollectiveSelfSuffecient] =
    useState(false);
  // const customScheduleSelector = useSelector(state => state.customSchedule)
  // const defaultScheduleSelector = useSelector(state => state.defaultSchedule)

  const [index, setIndex] = useState(0);

  const collectiveDefaultScheduleSelector = useSelector(
    (state) => state.collectiveDefaultSchedule
  );
  const collectiveCustomScheduleSelector = useSelector(
    (state) => state.collectiveCustomSchedule
  );

  let centerId;
  if (centerId_from_signUp == undefined) {
    centerId = centerId_from_signIn;
  } else {
    centerId = centerId_from_signUp;
  }

  const handlePersonalOpen = () => {
    setPersonalOpen(true);
    handleCollectiveClose();
  };

  const handlePersonalClose = () => {
    setPersonalOpen(false);
    setPersonalSelfSuffecient(false);
    dispatch(
      setPersonalService(
        (personalvalues.name_personal = ""),
        (personalvalues.duration_personal = ""),
        (personalvalues.price_personal = ""),
        // (personalvalues.numofperson_collective = ""),
        (personalvalues.worker = [])
        // (personalvalues.defaultSchedule = []),
        // (personalvalues.customDate = [])
      )
    );
  };
  const handleCollectiveOpen = () => {
    setCollectiveOpen(true);
    handlePersonalClose();
  };

  const handleCollectiveClose = () => {
    dispatch(
      setCollectiveService(
        (collectivevalues.name_collective = ""),
        (collectivevalues.duration_collective = ""),
        (collectivevalues.price_collective = ""),
        (collectivevalues.numofperson_collective = ""),
        (collectivevalues.nameofworkers = []),
        (collectivevalues.defaultSchedule = []),
        (collectivevalues.customDate = [])
      )
    );
    dispatch(setCollectiveServiceModel(false));
    setCollectiveOpen(false);
    setCollectiveSelfSuffecient(false);
    dispatch(setCollectiveDefaultSchedule([]));
  };

  const handleselectworkers = (event) => {
    if (event.target.checked === true) {
      let id = { id: event.target.value };

      initailFValuescollective.nameofworkers.splice(
        0,
        initailFValuescollective.nameofworkers.length
      );
      initailFValuescollective.nameofworkers.push(id);
    }

    if (Object.keys(collectivevalues).length >= 7) {
      dispatch(setCollectiveService(collectivevalues));
    }
  };
  const handlePersonalWorker = (event) => {
    if (event.target.checked === true) {
      var id = { id: event.target.value };
      initailFValuespesonal.worker.splice(
        0,
        initailFValuespesonal.worker.length
      );
    }
    initailFValuespesonal.worker.push(id);
  };
  var cnt = 0;

  let emptyArray = [];
  let data;
  const handleServiceColumnOne = (event, selectedservice) => {
    // setFlag(true)
    console.log(selectedService,"selectedservione")
    if (serviceColumnOneFlag == false) {
      setServiceColumnOneFlag(true);
    } else {
      setPersonalSelfSuffecient(false);
    }
    initialValueselectedService.serviceID = selectedservice.serviceID;
    initialValueselectedService.serviceName = selectedservice.serviceName;
    initialValueselectedService.serviceDuration =
      selectedservice.serviceDuration;
    setSelectedService(initialValueselectedService);

    if (event.target.checked === true) {
      let serviceObj = {
        name: event.target.value,
        duration: selectedservice.serviceDuration,
      };
      setServiceOneTrue(true);

      emptyArray.splice(0, emptyArray.length);

      emptyArray.push(serviceObj);

      setServiceArray(emptyArray);
    }

    data = checkedCondition(event);
  };

  const handleServiceColumnTwo = (event) => {
    if (event.target.checked) {
      setInterleavedOpen(true);
    }
  };

  // useForceUpdate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalValues({
      ...personalvalues,
      [name]: value,
    });
  };
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

  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    dispatch(setPersonalService(personalvalues));

    updatePersonalService();
  };
  useEffect(() => {
    collectivevalues.name_collective = collectiveservice.name_collective;
    collectivevalues.duration_collective =
      collectiveservice.duration_collective;
    collectivevalues.price_collective = collectiveservice.price_collective;
    collectivevalues.numofperson_collective =
      collectiveservice.numofperson_collective;
  }, [collectiveservice]);
  // updatePersonalService();
  const handleCollectiveSubmit = (e) => {
    e.preventDefault();
    // collectivevalues.nameofworkers=selectedworkers;
    collectivevalues.defaultSchedule = collectiveDefaultScheduleSelector;
    collectivevalues.customDate = collectiveCustomScheduleSelector;
    dispatch(setCollectiveService(collectivevalues));

    updateCollectiveService();
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
    } catch (err) {}
  };

  useEffect(() => {
    initailFValuescollective.defaultSchedule = [];
    initailFValuescollective.customDate = [];
  }, []);

  useEffect(() => {
    const path = history.location.pathname;
    const path_array = path.split("/");
    if (path_array[2] === "admin") {
      setCenterAdminHeaderVisible(true);
    }
    fetchWorkers();
  }, []);

  const handleRedirect = async () => {
    history.push("/customcalendar");
  };

  const updatePersonalService = async () => {
    // let body = {
    //   serviceName:personalservice.name_personal,
    //   duration:personalservice.duration_personal,
    //   price:personalservice.price_personal,
    //   worker:personalservice.worker,
    //   centerIds:centerId

    // }

    const responce = await instance
      .post(
        `${requests.fetchPersonalService}?lang=${language}`,
        {
          serviceName: personalvalues.name_personal,
          duration: personalvalues.duration_personal,
          price: personalvalues.price_personal,
          type: "personal",
          workerId: personalvalues.worker,
          centerIds: centerId,
          isSelfSufficient: personalSelfSuffecient,
        },
        {
          headers: {
            Authorization: logincenterToken,
            "Content-Type": "application/json",
          },
        }
      )
      .catch((error) => {
        console.log("ee", error.response);
        let errorMessage = error.response.data.message;
        errorToaster(errorMessage);
      });
    if (responce && responce.data) {
      successToaster(t("Personal Service Created !"));
      getServices();
      // refreshPage();
      handlePersonalClose();
      setPersonalSelfSuffecient(false);
    }
    // successToaster("Data Posted")
    //console.log(personalservice[personalservice.length-1])
  };

  const updateCollectiveService = async () => {
    const responce = await instance
      .post(
        `${requests.fetchCollectiveService}?lang=${language}`,
        {
          serviceName: collectivevalues.name_collective,
          duration: collectivevalues.duration_collective,
          price: collectivevalues.price_collective,
          maxPerson: collectivevalues.numofperson_collective,
          type: "collective",
          workerId: collectivevalues.nameofworkers,
          centerIds: centerId,
          defaultSchedule: collectivevalues.defaultSchedule,
          customDate: collectivevalues.customDate,
          isSelfSufficient: collectiveSelfSuffecient,
        },
        {
          headers: {
            Authorization: logincenterToken,
            "Content-Type": "application/json",
          },
        }
      )
      .catch((error) => {
        let errorMessage = error.response.data.message;
        errorToaster(errorMessage);
      });
    // successToaster("Data Posted")

    if (responce && responce.data) {
      successToaster(t("Collective Service Created !"));
      // refreshPage();
      getServices();
      setCollectiveOpen(false);
      setCollectiveSelfSuffecient(false);
    }
  };

  //  function updatePersonalService() {
  //   let body = JSON.stringify({

  //   })
  //  }
  const getServices = async () => {
    const responce = await instance
      .post(
        `${requests.fetchCenterDetails}?lang=${language}`,
        {
          centerId: centerId,
        },
        {
          headers: {
            Authorization: logincenterToken,
            "Content-Type": "application/json",
          },
        }
      )
      .catch((error) => {
        let errorMessage = error.response.data.message;
        errorToaster(errorMessage);
      });
    // successToaster("Data Posted")

    if (responce.data?.data[0]?.serviceList) {
      let servicearr = responce.data.data[0].serviceList.filter(
        (service) => service.type == "personal"
      );
      setServices(servicearr);
    }
  };

  let serviceId;

  const UpdateService = async () => {
    let startTime = interTime;
    let overlappedArray = [];
    let endTime;
    console.log(selectedService,'222')
    //interTime+parseInt(selectedServiceColumnTwo[0].serviceDuration)
    selectedServiceColumnTwo.map((singleService, index) => {
      //endTime:0,
      overlappedArray.push({
        serviceId: selectedServiceColumnTwo[index].serviceID,
        startTime: selectedServiceColumnTwo[index].startTime,
        endTime:
          selectedServiceColumnTwo[index].startTime +
          parseInt(selectedServiceColumnTwo[index].serviceDuration),
      });
    });

    const responce = await instance
      .put(
        `${requests.fetchUpdateService}/${selectedService.serviceID}?lang=${language}`,
        {
          overLappedServices: overlappedArray,
        },
        {
          headers: {
            Authorization: logincenterToken,
            "Content-Type": "application/json",
          },
        }
      )
      .catch((err) => {});
    if (responce && responce.data) {
      successToaster(t("OverLapped Service Created !"));

      // refreshPage();
    }
    history.push("/center/workersDetails");
  };

  function refreshPage() {
    window.location.reload();
  }
  // newServiceOverlapped.push({ serviceId: ObjectID(element.serviceId), startTime: element.startTime, endTime: element.endTime })

  useEffect(() => {
    if (opencollectivemodelSelector) {
      setCollectiveOpen(true);
    }
    getServices();
  }, []);

  const handleCloseinterLeadvedService = (e) => {
     
    setInterleavedOpen(false);
    if(e?.target?.innerHTML=="Cancle"){
      setSelectedService(initailFValuespesonal)
      refreshPage();
    }
  };

  const incNum = () => {
    setInterTime(interTime + 5);
  };

  const decNum = () => {
    if (interTime > 0) {
      setInterTime(interTime - 5);
    } else {
      errorToaster("You Reach Limit");
      setInterTime(0);
    }
  };

  // const updateSecondColumnData = () =>{

  // }

  const savedata = () => {
    selectedServiceColumnTwo[selectedServiceColumnTwo.length - 1].startTime =
      interTime;
    handleCloseinterLeadvedService();
  };

  const returnBack = () => {
    // setSelectedService(initailFValuespesonal)
    history.push("/center/center-details");
  };

  const checkedCondition = (e) => {
    return e.target.checked;
  };

  const handleColorChange = () => {
    colorChange.current.id = "selected_radio_btn";
  };
  const handleTimeArrayService = (data) => {
    setValue(data);
  };

  const handleSelectedService = (newSelectedService) => {
    setSelectedService(newSelectedService);
    const initailFValuespesonal = {
      name_personal: newSelectedService.serviceName,
      duration_personal: newSelectedService.serviceDuration,
      price_personal: newSelectedService.servicePrice,
      worker: [
        {
          id: newSelectedService.workerId,
        },
      ],
    };
    setPersonalValues(initailFValuespesonal);
    setPersonalOpen(true);
    setPersonalSelfSuffecient(newSelectedService.isSelfSufficient);
    setFlag(true);
  };

  const handlePersonalAllworker = () => {
    if (allWorkerBtnPersonal == false) {
      setAllWorkerBtnPersonal(true);
      setPersonalSelfSuffecient(false);
    } else {
      setAllWorkerBtnPersonal(false);
    }
  };
  const handlePersonalSelfSufficient = () => {
    if (personalSelfSuffecient == false) {
      setPersonalSelfSuffecient(true);
      setAllWorkerBtnPersonal(false);
    } else {
      setPersonalSelfSuffecient(false);
    }
  };
  const handleCollectiveAllworker = () => {
    if (allWorkerBtnCollective == false) {
      setAllWorkerBtnCollective(true);
      setCollectiveSelfSuffecient(false);
    } else {
      setAllWorkerBtnCollective(false);
    }
  };
  const handleCollectiveSelfSufficient = () => {
    if (collectiveSelfSuffecient == false) {
      setCollectiveSelfSuffecient(true);
      setAllWorkerBtnCollective(false);
    } else {
      setCollectiveSelfSuffecient(false);
    }
  };

  return (
    <>
      <div className="service-container">
        {centerAdminLoginStatus === true &&
        centerAdminHeaderVisible === true ? (
          <CenterAdminHeader title={t("Create Service")} />
        ) : (
          <Header title={t("Create Service")} className="center-header" />
        )}
        <div className="create_service_btn" onClick={handlePersonalOpen}>
        {t("Create Service")}
          <img className="Create_btn_img" src={addlogo} alt="addlogo" />
        </div>
        {/* for showing serveses */}
        <Grid container>
          {/* <Grid item xs={12} sm={12} md={6} lg={6}> */}
          <div className="services">
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <div className="service_radio_div">
                {services.map((service, index) => {
                  let newSelectedService = {
                    serviceID: service._id,
                    serviceName: service.serviceName,
                    serviceDuration: service.duration,
                    servicePrice: service.price,
                    workerId: service.workerId[0]?.id,
                    isSelfSufficient: service.isSelfSufficient,
                  };

                  return (
                    <div
                      className="service_radio"
                      // ref={colorChange}
                      // onClick={handleColorChange}
                      // onClick={() => handleSelectedService(newSelectedService)}
                    >
                      <input
                        id={`radio ${index + 1}`}
                        className={(e) =>
                          e.target.checked
                            ? `withgreenbackground`
                            : `withoutgreenbackground`
                        }
                        type="radio"
                        value={service.serviceName}
                        name="myRadio"
                        onChange={(e) =>
                          handleServiceColumnOne(e, newSelectedService)
                        }
                        // onClick={() => handleSelectedService(newSelectedService)}
                      />
                      <label
                        htmlFor={service.serviceName}
                        className="service_radio_label"
                        onClick={() =>
                          handleSelectedService(newSelectedService)
                        }
                      >
                        {service.serviceName}
                      </label>
                      {/* <button>{service.serviceName}</button> */}
                    </div>
                  );
                })}
              </div>
              {/* serviceOneTrue ? "withgreenbackground" : "withoutgreenbackground" */}
              {/* <div>
              <button className="returnbtn_main" onClick={returnBack}>
                Return
              </button>
            </div> */}
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <div className="serviceheading">
                <p>
                  {" "}
                {t("What services can")} <br /> {t("you put in")} <br />
                  {t("between this")}
                </p>
              </div>
              <div>
                <img
                  className="service_rightarrow"
                  src={rightarrow}
                  alt="rightarrow"
                />
              </div>
            </Grid>

            <Grid item xs={12} sm={4} md={4} lg={4} style={{marginleft: '-60px'}}>
              <div className="service_checkbox_div">
                {/* <Scrollbars> */}
                {services.map((serv) => {
                  let newServiceArr = {
                    serviceID: serv._id,
                    serviceName: serv.serviceName,
                    serviceDuration: serv.duration,
                    // startTime:interTime
                  };
                  // newServiceArr.startTime=interTime

                  if (serviceArray.length > 0) {
                    if (
                      serviceArray[0]?.name != serv.serviceName &&
                      serviceArray[0]?.duration > serv.duration
                    ) {
                      return (
                        <div className="service_checkbox">
                          <input
                            className="service_checkbox_input"
                            type="checkbox"
                            value={serv.serviceName}
                            name="myCheck"
                            onChange={(e) => handleServiceColumnTwo(e)}
                            onClick={() =>
                              setSelectedServiceColumnTwo([
                                ...selectedServiceColumnTwo,
                                newServiceArr,
                              ])
                            }
                          />
                          <label
                            htmlFor={serv.serviceName}
                            className="service_checkbox_label"
                          >
                            {serv.serviceName}
                          </label>
                        </div>

                        //{classes.service_radio_label_column2}
                      );
                    }
                  } else {
                    return (
                      <div className="service_checkbox">
                        <input
                          className="service_checkbox_input"
                          type="checkbox"
                          value={serv.serviceName}
                          name="myCheck"
                          onChange={(e) => handleServiceColumnTwo(e)}
                          onClick={() =>
                            setSelectedServiceColumnTwo([
                              ...selectedServiceColumnTwo,
                              newServiceArr,
                            ])
                          }
                        />
                        <label
                          htmlFor={serv.serviceName}
                          className="service_checkbox_label"
                        >
                          {serv.serviceName}
                        </label>
                      </div>

                      //{classes.service_radio_label_column2}
                    );
                  }
                })}
                {/* </Scrollbars> */}
              </div>
              {/* <div>
            <div>
              <button className="returnbtn_main" onClick={returnBack}>
                Return
              </button>
            </div>
            <div>
              <button className="createbtn_main" onClick={UpdateService}>
                Following
              </button>
            </div>
          </div> */}
            </Grid>
          </div>
          {/* <div className="main-btns">
            <div>
              <button className="returnbtn_main" onClick={returnBack}>
                {t("Return")}
              </button>
            </div>
            <div>
              <button className="createbtn_main" onClick={UpdateService}>
                {t("Following")}
              </button>
            </div>
          </div> */}
          {/* </Grid> */}
        </Grid>
        <Grid container style={{marginTop:'6rem',width:'100%'}}>
        {/* <Grid item xs={0} sm={0} md={1} lg={1} xl={1}></Grid> */}
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className="centerDetails_return_item" >
        <Button
            variant="contained"
            className="centerDetails_returnBtn"
            onClick={(e) => returnBack(e)}
          >
            {t("Return")}
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className="centerDetails_following_item" >
        <Button
            variant="contained"
            className="centerDetails_following"
            onClick={(e)=>UpdateService(e)}
          >
            {t("Following")}
          </Button>
        </Grid>
        {/* <Grid item xs={0} sm={0} md={1} lg={1} xl={1}></Grid> */}
        </Grid>

        {/* Dialog Box For Personal Service */}
        <Dialog
          style={{ borderRadius: "30px" }}
          className="personalDialog"
          open={personalopen}
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          onClose={handlePersonalClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle
            id="form-dialog-title"
            id="personaltitle"
            className="dialogcontent"
          >
            <Grid items xs={12}
            //  style={{ position: "relative" }}
             >
              <div className="papers-header">
                <Typography variant="h1" style={{ textAlign: "center" }}>
                  {" "}
                  {t("Create Personal Service")}
                </Typography>
              </div>
              <div className="close-icon-service">
                {/* <Close className="close" onClick={(e) => handleClose(e)} /> */}
                <i
                  class="fas fa-times close"
                  onClick={(e) => handlePersonalClose(e)}
                ></i>
              </div>
            </Grid>
          </DialogTitle>
          <DialogContent>
            <DialogContentText className="dialogcontent">
              <div style={{marginBottom:'-15px'}}>
              {t("Type of Service")}

              </div>
              <div className="typeOfServices">
                <Button
                  className="personal"
                  variant="outlined"
                  color="primary"
                  onClick={handlePersonalOpen}
                >
                  {t("Personal")}
                </Button>
                <Button
                  className="collective"
                  variant="outlined"
                  color="primary"
                  onClick={handleCollectiveOpen}
                >
                  {t("Collective")}
                </Button>
              </div>
            </DialogContentText>

            <Grid container className="personalContainer">
              <form onSubmit={handlePersonalSubmit} className="service-form">
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={5}
                  lg={5}
                  className="personalServiceGrid"
                  // style={{
                  //   display: "flex",
                  //   flexDirection: "column",
                  //   justifyContent: "space-around",
                  // }}
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
                    fullWidth
                  />
                  <TextField
                    className=""
                    InputLabelProps={{ className: "textfield" }}
                    InputProps={{ className: "textfield__label" }}
                    id="standard-basic"
                    name="duration_personal"
                    label={t("Duration(min)")}
                    required
                    value={personalvalues.duration_personal}
                    onChange={handleInputChange}
                    fullWidth
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
                    fullWidth
                  />

                  {/* </form> */}
                </Grid>
                <Grid item xs={0} sm={0} md={2} lg={2}></Grid>

                <Grid item xs={12} sm={12} md={5} lg={5}>
                  <div id="personalwrk_head">
                    <h4>
                      {t("Which workers can")} <br />{t("perform this service?")}
                    </h4>
                  </div>
                  <button
                    className={
                      allWorkerBtnPersonal == false
                        ? "all_worker_label"
                        : "all_worker_label_selected"
                    }
                    onClick={() => handlePersonalAllworker()}
                  >
                    <p>{t("All workers")}</p>
                  </button>
                  <button
                    className={
                      personalSelfSuffecient == false
                        ? "self-sufficient-label"
                        : "self-sufficient-label-green"
                    }
                    onClick={() => handlePersonalSelfSufficient()}
                  >
                    {t("It is a self-sufficient machine")}
                  </button>
                  {/* <div className="self-sufficient-label" onClick={()=>handlePersonalSelfSufficient()}>
                    <p>It is a self-sufficient machine</p>
                  </div> */}
                  <div className="workerList">
                    {personalSelfSuffecient == false &&
                      workersData.map((worker) => {
                        return (
                          <div
                            className={
                              worker.active == true
                                ? "worker_div"
                                : "worker_div_inactive"
                            }
                          >
                            {flag == true ? (
                              <input
                                checked={
                                  worker._id === personalvalues?.worker[0]?.id
                                }
                                className="radio_input"
                                type="radio"
                                value={worker._id}
                                name="myRadio"
                                onChange={(e) => handlePersonalWorker(e)}
                              />
                            ) : (
                              <input
                                // checked={worker._id === personalvalues?.worker[0]?.id}
                                className="radio_input"
                                type="radio"
                                value={worker._id}
                                name="myRadio"
                                onChange={(e) => handlePersonalWorker(e)}
                              />
                            )}

                            <i>
                              <img
                                className="img_icon"
                                src={worker.image}
                                // alt={worker.name}
                              />
                            </i>
                            <label
                              htmlFor={worker.name}
                              className="worker_label"
                            >
                              {worker.name}
                            </label>
                          </div>
                        );
                      })}
                  </div>
                  {/* {workers} */}
                </Grid>
              </form>
            </Grid>
          </DialogContent>

          <DialogActions
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button
              className="returnbtn"
              variant="contained"
              onClick={handlePersonalClose}
              color="primary"
            >
              {t("Return")}
            </Button>
            <Button
              className="createbtn"
              variant="contained"
              onClick={handlePersonalSubmit}
              color="primary"
            >
              {t("Create")}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Box For collective Service */}

        <Dialog
          style={{ borderRadius: "30px" }}
          className="collectiveDilog"
          open={collectiveopen}
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          onClose={handleCollectiveClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            <Grid items xs={12} 
            // style={{ position: "relative" }}
            >
              <div className="papers-header">
                <Typography variant="h1" style={{ textAlign: "center" }}>
                  {" "}
                  {t("Create Collective Service")}
                </Typography>
              </div>
              <div className="close-icon-service">
                {/* <Close className="close" onClick={(e) => handleClose(e)} /> */}
                <i
                  class="fas fa-times close"
                  onClick={(e) => handleCollectiveClose(e)}
                ></i>
              </div>
            </Grid>
          </DialogTitle>
          <DialogContent>
            <DialogContentText className="dialogcontent">
              <div>

              {t("Type of Service")}
              </div>
              {/* this is the text i want to bigger for my screen size
            checking if it is ok then no problem */}
              <div className="collectiveServicebtn">
                <Button
                  className="personal2"
                  variant="outlined"
                  color="primary"
                  onClick={handlePersonalOpen}
                >
                  {t("Personal")}
                </Button>
                <Button
                  className="collective2"
                  variant="outlined"
                  color="primary"
                  onClick={handleCollectiveOpen}
                >
                 {t("Collective")}
                </Button>
              </div>
            </DialogContentText>

            <Grid container>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <form onSubmit={handleCollectiveSubmit}>
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
                      label={t("Duration(min)")}
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
                    <div style={{ width: "290px" }}>
                    <h4> {t("Which workers can")} {t("perform this service?")}</h4>
                      {/* <h4>Which workers can perform this service?</h4> */}
                    </div>
                    <div className="collectiveAllwrkmachine">
                      <button
                        className={
                          allWorkerBtnCollective == false
                            ? "all_worker_label_2"
                            : "all_worker_label_2selected"
                        }
                        onClick={() => handleCollectiveAllworker()}
                      >
                        <p>{t("All workers")}</p>
                      </button>

                      <button
                        className={
                          collectiveSelfSuffecient == false
                            ? "self-sufficient-label-2"
                            : "self-sufficient-label-2-green"
                        }
                        onClick={() => handleCollectiveSelfSufficient()}
                      >
                        {t("It is a self-sufficient machine")}
                      </button>
                    </div>
                    {/* <div className="self-sufficient-label-2" onClick={()=>handleCollectiveSelfSufficient()}>
                      <p>It is a self-sufficient machine</p>
                    </div> */}
                    <div className="mainworkerCollectiveList">
                      <div className="workerListCollective">
                        {collectiveSelfSuffecient == false &&
                          workersData.map((worker) => {
                            return (
                              <div
                                className={
                                  worker.active == true
                                    ? "worker_chechbox_div"
                                    : "worker_chechbox_div_inactive"
                                }
                              >
                                <input
                                  className="worker_input"
                                  type="radio"
                                  name="myRadio"
                                  id={worker.name}
                                  value={worker._id}
                                  onChange={(e) => handleselectworkers(e)}
                                />
                                <i>
                                  <img
                                    className="img_icon"
                                    src={worker.image}
                                    alt=""
                                  />
                                </i>
                                <label
                                  htmlFor={worker.name}
                                  className="worker_label"
                                >
                                  {worker.name}
                                </label>
                              </div>
                            );
                          })}
                      </div>
                    </div>
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

          <DialogActions>
            <Button
              className="returnbtn"
              variant="contained"
              onClick={handleCollectiveClose}
              color="primary"
            >
              {t("Return")}
            </Button>
            <Button
              className="createbtn"
              variant="contained"
              onClick={handleCollectiveSubmit}
              color="primary"
            >
              {t("Create")}
            </Button>
          </DialogActions>
        </Dialog>
        {/* InterLeaved Service Dilog box */}
        {selectedServiceColumnTwo.length > 0 ? (
          <Dialog
            open={interleavedOpen}
            onClose={handleCloseinterLeadvedService}
            aria-labelledby="form-dialog-title"
          >
            {/* <DialogTitle id="form-dialog-title">Subscribe</DialogTitle> */}
            <DialogContent>
              <DialogContentText className="DialogContentText">
                {t("Indicate how long you spend with the client in column 1 before you can attend the client in column 2")}
              </DialogContentText>
              <Grid container>
                <div className="interleaved">
                  <Grid item xs={12} sm={12} md={4} lg={4}>
                    <div className="firstservice">
                      <button className="firstservice_btn">
                        {selectedService.serviceName}
                      </button>
                      <div className="firstservice_duration">
                        {t("Duration")} {selectedService.serviceDuration} {t("min")}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={4}>
                    <div className="quantity">
                      <img
                        src={uparrow}
                        className="uparrow"
                        alt="uparrow"
                        onClick={incNum}
                      />
                      <div>{interTime} min</div>
                      <img
                        src={downarraow}
                        className="downarrow"
                        alt="downarraow"
                        onClick={decNum}
                      />
                    </div>

                    {/* <input name="quantity" type="text" className="quantity_input" value={interTime} /> */}
                  </Grid>

                  <Grid item xs={12} sm={12} md={4} lg={4}>
                    <div className="secondservice">
                      <button className="secondservice_btn">
                        {
                          selectedServiceColumnTwo[
                            selectedServiceColumnTwo.length - 1
                          ].serviceName
                        }
                      </button>
                      <div className="secondservice_duration">
                      {t("Duration")}{" "}
                        {
                          selectedServiceColumnTwo[
                            selectedServiceColumnTwo.length - 1
                          ].serviceDuration
                        }{" "}
                       {t("min")}
                      </div>
                    </div>
                  </Grid>
                </div>
              </Grid>
              <div className="interleavedservice_data">
                <div className="data servicename">
                  {selectedService.serviceName}
                </div>
                <div className="data">{interTime} min</div>
                <div className="data servicename">
                  {
                    selectedServiceColumnTwo[
                      selectedServiceColumnTwo.length - 1
                    ].serviceName
                  }
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={(e)=>handleCloseinterLeadvedService(e)}
                className="returnbtn"
                color="primary"
              >
                {t("Cancel")}
              </Button>
              <Button onClick={savedata} className="createbtn" color="primary">
                {t("Create")}
              </Button>
            </DialogActions>
          </Dialog>
        ) : null}

        {/* {selectedServiceColumnTwo.length>0 && <InterLivedService selectedServiceColumnTwo={selectedServiceColumnTwo} selectedService={selectedService} interleavedOpen={interleavedOpen}/>} */}
      </div>
    </>
  );
}

export default Service;

//<Button onClick={handleCloseinterLeadvedService} className="returnbtn" color="primary">
//
