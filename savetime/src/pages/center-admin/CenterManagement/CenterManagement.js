import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Header from "./../CenterAdminHeader/CenterAdminHeader";
import Footer from "../../../components/Footer";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";

// import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import "../CenterManagement/centerManagement.css";
import * as moment from "moment";

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!

import requests from "../../../requests";
import instance from "../../../axios";

import {
  setLoginData,
  setToken,
  setForgot,
  openWorkerModel,
  workerInput,
  setWorkerLoginStatus,
} from "../../../redux/actions/actions";

import {
  Avatar,
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
  Button as MuiButton,
  Paper,
  Typography,
} from "@material-ui/core";

import { Collapse, DialogTitle, Grid, Button } from "@material-ui/core";
import { centerDataForArray } from "../../../redux/actions/actions";
import { successToaster, errorToaster } from "../../../common/common";
import interactionPlugin from "@fullcalendar/interaction";
import { useTranslation } from "react-i18next";
// import "@fullcalendar/daygrid/main.css";

//const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)}px;

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)}px;
  }
`;

const BigAvatar = styled(Avatar)`
  width: 92px;
  height: 92px;
  text-align: center;
  margin: 0 auto ${(props) => props.theme.spacing(5)}px;
`;

function CenterManagement() {
    const history = useHistory();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const language = useSelector(state => state.language)
    const [password, setPassword] = useState("");
    const token = useSelector((state) => state.token);
    const logincenterToken = useSelector(state => state.selectedLoginCenter.token)
    const loginData = useSelector((state)=> state.loginData);
    
    const redirectToCreateCenter = (e) => {
        e.preventDefault();
        history.push("/auth/center-signup");
    }

    const [centerId, setCenterId] = useState({
        id: loginData._id
    })
    const handleDelete = async (e) => {
        const response = await instance.put(`${requests.fetchDelete}/${centerId.id}?lang=${language}`, {}, {
            headers: {
                Authorization: `Bearer ${logincenterToken}`
            }
        })
        console.log(response)
        history.push('/auth/sign-in')
    }

    const redirectToLogin = (e) => {
        e.preventDefault();
        history.push("/center/admin/login");
    }

    useEffect(() => {
        dispatch(setWorkerLoginStatus(false));
      
    }, [])

    const handleBackButton = () =>{
        history.push("/center/admin/dashboard")
    }

    return (

        <div className="mainPage-container">
            <Header
                title={t("+ Center")}
            />

            <Grid item container className="CenterManagementContainer">
                <Grid item xl={12} ld={12} sm={12} xs={12} md={12}>
                    <div className="showButtonInColumn">
                        <div>
                            <Button
                                className={"roundButton"}
                                variant="contained"
                                onClick={(e) => redirectToCreateCenter(e)}
                            >
                                {t("Register New Center")}
                            </Button>
                        </div>
                        <div>
                            <Button
                                className={"roundButton"}
                                variant="contained"
                                onClick={(e) => redirectToLogin(e)}
                            >
                                {t("Manage Another Center")}
                            </Button>
                        </div>
                        <div>
                            <Button
                                className={"roundButton"}
                                variant="contained"
                                onClick={(e)=>handleDelete(e)} 
                            >
                                {t("Delete Center")}
                            </Button>
                        </div>
                    </div>
                </Grid>
            </Grid>
            <Grid item xl={12} ld={12} sm={12} xs={12} md={12}
                style={{ textAlign: "center", marginTop: "1rem" }}
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
    )
}

export default CenterManagement;
