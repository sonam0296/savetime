import React, { useState, useEffect, useRef } from "react";

//material-ui
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import { Grid, Avatar } from "@material-ui/core";

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { Fade, Typography } from '@material-ui/core';
import { Close } from '@material-ui/icons'

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
import "./setServices.css"
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import { useTranslation } from "react-i18next";


const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));


function SetServiceModal({
    isOpen,
    isClose,
}) {
    const {t} = useTranslation();

    const dispatch = useDispatch();
    const history = useHistory();
    const language = useSelector(state => state.language)
    const loginData = useSelector((state) => state.loginData)
    const token = useSelector((state) => state.token);
    const logincenterToken = useSelector(state => state.selectedLoginCenter.token)
    const workerinput = useSelector(state => state.workerinput);
    const [services, setservices] = useState();

    const classes = useStyles();

    const getServices = async () => {
        let body = {
            "workerId": workerinput._id,
            "centerId": loginData._id
        }
        const response = await instance.post(`${requests.fetchCenterAdminWorkerService}?lang=${language}`, body, {
            headers: {
                Authorization: `Bearer ${logincenterToken}`,
            },
        })
            .catch(
                (error) => {
                    let errorMessage = ""
                    if (error.response.data && error.response.data.error) {
                        errorMessage = error.response.data.error.message
                    } else {
                        errorMessage = error.response.data.message
                    }
                    console.log("ee", error.response);
                    errorToaster(errorMessage);
                }
            )
        if (response && response.data) {
            setservices(response.data.data);
        }
    };

    useEffect(() => {
        getServices();
    }, []);

    const handleRemove = async (service) => {
        let body = {
            "id": workerinput._id,
            "serviceId": service._id
        }
        const response = await instance.put(`${requests.fetchDeleteWorkerServices}?lang=${language}`, body, {
            headers: {
                Authorization: `Bearer ${logincenterToken}`,
            },
        })
            .catch(
                (error) => {
                    let errorMessage = ""
                    if (error.response.data && error.response.data.error) {
                        errorMessage = error.response.data.error.message
                    } else {
                        errorMessage = error.response.data.message
                    }
                    console.log("ee", error.response);
                    errorToaster(errorMessage);
                }
            )
        if (response && response.data) {
            getServices();
            successToaster(t("Record Successfully Deleted!"));
        }
    }

    const redirectToCreateService = async () => {
        history.push("/center/admin/services/create")
    }

    return (
        <>
            <Modal
                className={classes.modal}
                closeAfterTransition
                open={isOpen}
                onClose={isClose}

            >
                <Fade in={isOpen}>
                    <div >
                        <Grid container className="service-papers" >
                            <Grid items xs={12} style={{ position: "relative" }} >
                                <div className="papers-header" >
                                    <Typography variant="h3" >
                                        {t("Services Enable")}
                                    </Typography>
                                </div>
                            </Grid>

                            <Grid items xs={12} lg={6}  >
                                <div className="paper-form" >
                                    <div>
                                        <Avatar
                                            style={{
                                                height: "100px",
                                                width: "100px",
                                                border: "2px solid black"
                                            }}
                                            src={workerinput.image === "" ? process.env.REACT_APP_DEFAULT_IMAGE : workerinput.image}
                                        />
                                    </div>
                                    <div className="createServices"
                                        onClick={() => redirectToCreateService()}
                                    >
                                        <span style={{ paddingLeft: "1rem" }}> {t("Create Services")} </span>
                                        <span>
                                            <AddIcon
                                                style={{ color: "red", fontSize: 25, cursor: "pointer", }}
                                            />
                                        </span>
                                    </div>
                                </div>
                            </Grid>
                            <Grid items xs={12} lg={6}>
                                {
                                    services &&
                                    services.map((service, i) => {
                                        return (
                                            <>
                                                <div className="service_div">
                                                    <div>
                                                        {service.serviceName}
                                                    </div>
                                                    <div>
                                                        <CloseIcon
                                                            style={{ color: "red", fontSize: 25, cursor: "pointer", }}
                                                            onClick={() => handleRemove(service)}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    })
                                }
                            </Grid>

                            <Grid items xs={12}  >
                                <div className="worker-paper-btn">
                                    <Button variant="contained"
                                        //onClick={(e) => handleClose(e)}
                                        style={{ backgroundColor: "red", color: "white" }}>
                                        {t("Return")}
                                    </Button>
                                    <Button variant="contained" style={{ backgroundColor: "green", color: "white" }}
                                    //onClick={(e) => handleSubmit(e)}
                                    >
                                        {t("Update")}
                                    </Button>
                                </div>
                            </Grid>
                        </Grid>

                    </div>
                </Fade>
            </Modal>

        </>
    )
}

export default SetServiceModal