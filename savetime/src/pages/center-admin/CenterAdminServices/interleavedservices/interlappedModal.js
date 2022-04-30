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
} from "../../../../redux/actions/actions";
import instance from "../../../../axios";
import requests from "../../../../requests";


import { successToaster, errorToaster } from "../../../../common/common";


import uparrow from "../../../../assets/north_black_24dp.svg";
import downarraow from "../../../../assets/south_black_24dp.svg";
import "./InterlevedService.css"
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





function InterlappedModal({
    isOpen,
    isClose,
    selectedService,
    selectedOverLappedSevices,
    getService
}) {

    let initailFValuescollective = {
        name_collective: selectedService.serviceName,
        duration_collective: selectedService.duration,
        price_collective: selectedService.price,
        numofperson_collective: selectedService.maxPerson,

        nameofworkers: [{
            id: selectedService.workerData[0]._id
        }],
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

    const loginData = useSelector((state) => state.loginData)
    const collectiveDefaultSchedule = useSelector((state) => state.collectiveDefaultSchedule)

    const token = useSelector((state) => state.token);
    const logincenterToken = useSelector(state => state.selectedLoginCenter.token)
    const [workersData, setWorkersData] = useState([]);

    const [collectivevalues, setCollectiveValues] = useState(initailFValuescollective);
    const [flag, setFlag] = useState(true);

    const [collectiveServiceData, setCollectiveServiceData] = useState({});
    const [value, setValue] = useState({});
    const [interTime, setInterTime] = useState(selectedOverLappedSevices.startTime);



    const classes = useStyles();

    const handleCloseModal = () => {
        isClose(false);
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

    useEffect(() => {
        if (flag === false) {
            setFlag(true);
        }
    }, [flag])

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
            tempVar.nameofworkers[0] = id
            setCollectiveValues(tempVar);
        }
        setFlag(false);
    };

    const handleTimeArrayService = (data) => {
        setValue(data);
    };

    const handleUpdateData = async () => {
        console.log("selectedOverLappedSevices ==> ",selectedOverLappedSevices);
        let body = {
            "overLappedServiceId": selectedOverLappedSevices.serviceId,
            "overLappedStartTime": interTime,
            "overLappedEndtime": parseInt(interTime) + parseInt( selectedOverLappedSevices.overLappedServiceDuration)
        }
        console.log("Body ==> ", body);
        const response = await instance.put(`${requests.fetchUpdateService}/${selectedService._id}?lang=${language}`, body, {
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
            successToaster(t("Interleaved Service is Updated!"));
            getService();
            handleCloseModal();
        }
    }

    return (
        <>
            <Dialog
                open={isOpen}
                onClose={() => handleCloseModal()}
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
                                        {t("Duration")} {selectedService.duration} Min.
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
                                        {selectedOverLappedSevices.overLappedServiceName}
                                    </button>
                                    <div className="secondservice_duration">
                                        {t("Duration")} {selectedOverLappedSevices.overLappedServiceDuration} Min.
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
                            {selectedOverLappedSevices.overLappedServiceName}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => handleCloseModal()}
                        className="returnbtn"
                        color="primary"
                    >
                        {t("Cancel")}
                    </Button>
                    <Button
                        onClick={() => handleUpdateData()}
                        className="createbtn" color="primary"
                    >
                        {t("Update")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default InterlappedModal