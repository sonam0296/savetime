import React, { useState, useEffect, useRef } from 'react';
import CenterAdminHeader from './../CenterAdminHeader/CenterAdminHeader';
import Footer from '../../../components/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from "react-router-dom";

import requests from '../../../requests'
import instance from '../../../axios'


import { setLoginData, setToken, setForgot, openWorkerModel, workerInput } from "../../../redux/actions/actions";

import {
    Avatar,
    FormControl,
    FormControlLabel,
    Input,
    InputLabel,
    Button as MuiButton,
    Paper,
    Typography
} from "@material-ui/core";

import { Collapse, DialogTitle, Grid, Button } from '@material-ui/core';
import { centerDataForArray } from '../../../redux/actions/actions';
import {
    successToaster,
    errorToaster
} from '../../../common/common'

import "./centerAdminWorker.css";

import { makeStyles } from '@material-ui/core/styles';
import WorkerModal from '../../../Modal/WorkerModal'
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}));

function CenterAdminWorker() {
    const {t} = useTranslation();
    const language = useSelector(state => state.language)
    const loginData = useSelector((state) => state.loginData);
    const token = useSelector((state) => state.token);
    const logincenterToken = useSelector(state => state.selectedLoginCenter.token)

    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const [workers, setWorkers] = useState([]);
    const [activate, setActivate] = useState(false);
    const [updateworker, setUpdate] = useState()
    const [isUpdate, setIsUpdate] = useState(false);

    useEffect(() => {
        getWorkers();
    }, [])

    const getWorkers = async () => {
        const response = await instance.get(`${requests.fetchGetWorkersForAdmin}${loginData._id}?lang=${language}`, {
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
            let res = response.data.data

            setWorkers(res);
        }
    }

    const closeActivate = async () => {
        dispatch(openWorkerModel(false))
        // dispatch(workerInput({}))
        // dispatch(workerSchedules({}))
        setActivate(false)
    }

    const handleActivate = async () => {
        // debugger
        setActivate(true)
    }

    const handleWorker = async (workerdata) => {
        setWorkers(workerdata)
    }

    const handleUpdateActivate = (e, row) => {
        e.preventDefault();
        console.log("row", row);
        dispatch(workerInput(row))
        setUpdate(row)
        setIsUpdate(true)
        setActivate(true)
      }

    const editWorker = (e,data) => {
        e.preventDefault();
        dispatch(workerInput(data))
        setUpdate(data)
        history.push("/center/admin/workers/update");

    }

    const handleBackButton = () =>{
        history.push("/center/admin/dashboard")
    }

    return (
        <>

            <div className="mainPage-container">
                <CenterAdminHeader
                    title={t("Workers")}
                />

                <Grid item container style={{ marginTop: "4rem" }}>
                    <Grid item xl={6} ld={6} sm={6} xs={12} md={6} style={{
                        textAlign: "center",
                        alignItems: "center", padding: "2px"
                    }}
                    >
                        <center>
                            {
                                workers && workers.map((data, index) => {
                                    return (
                                        <div className="workerShow"
                                            //onClick={(e) => handleUpdateActivate(e, data)}
                                            onClick={(e) => editWorker(e, data)}
                                        >
                                            <span>
                                                <Avatar className="avtarShow"
                                                    alt="Remy Sharp"
                                                    src={data.image === "" ? process.env.REACT_APP_DEFAULT_IMAGE : data.image}
                                                />
                                            </span>
                                            <span className="ShowName">
                                                {data.name} {data.lastname}
                                            </span>
                                        </div>
                                    )
                                })
                            }

                        </center>
                    </Grid>
                    <Grid item xl={6} ld={6} sm={6} xs={12} md={6}>
                        <div>
                            <Button
                                className={"roundButtonWorker"}
                                variant="contained"
                                onClick={(e) => handleActivate(e)}
                            >
                                {t("Create Worker")} +
                            </Button>
                        </div>
                    </Grid>
                </Grid>
                <Grid item xl={12} ld={12} sm={12} xs={12} md={12}
                    style={{ textAlign: "center", marginTop: "3rem" }}
                >
                    <Button
                        className={"roundButtonForBack"}
                        variant="contained"
                        onClick={()=>handleBackButton()}
                    >
                        {t("Back to the center")}
                    </Button>
                </Grid>
            </div>

            {
                activate &&
                <WorkerModal
                    activate={activate}
                    handleWorker={handleWorker}
                    updateworker={updateworker}
                    isUpdate={isUpdate}
                    onDeactive={closeActivate}
                />
            }
            {

            }
        </>
    )
}

export default CenterAdminWorker;