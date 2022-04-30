import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components";
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from "react-router-dom";

// import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./signinForAdmin.css"
import * as moment from 'moment'

import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!

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
import interactionPlugin from "@fullcalendar/interaction";
import { useTranslation } from 'react-i18next';
// import "@fullcalendar/daygrid/main.css";

//const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;

const BigAvatar = styled(Avatar)`
  width: 92px;
  height: 92px;
  text-align: center;
  margin: 0 auto ${props => props.theme.spacing(5)}px;
`;


function SetPassword() {
    const {t} = useTranslation();
    const language = useSelector(state => state.language)
    const history = useHistory();
    const dispatch = useDispatch();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [token,setToken] = useState("");
    const userToken = useSelector((state) => state.token)
    const logincenterToken = useSelector(state => state.selectedLoginCenter.token)


    useEffect(() => {
        const path = history.location.pathname;
        console.log("Path Name ===> ", path);
        const path_array = path.split("/");
        console.log("array ===> ", path_array);
        if(path_array.length === 4){
            setToken(path_array[3]);
        }
    },[])
    const SavePassword = async (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            const bodyApi = {
                "adminPanelPassword": password
            };
            console.log("Token ====> ", token);
            console.log("User Token ====> ", logincenterToken);
            const response = await instance.post(`${requests.fetchSetAdminCenterPassword}?token=${token}&?lang=${language}`, bodyApi,
                    {
                        headers: {
                            Authorization: `Bearer ${logincenterToken}`,
                        },
                    }
                )
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
                successToaster(t('Login Successful'))
                console.log("response  ==> ", response);
                history.push("/center/admin-login");
            }
        }else{
            errorToaster(t("Password and Confirm Password does't match"));
            setConfirmPassword("");
        }

    }

    return (

        <div className="mainPage-container">
            <Header />

            <Grid className="formContainer">
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="password">{t("Password")}</InputLabel>
                    <Input
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: "100%", }}
                    />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="confirm password">{t("Confirm Password")}</InputLabel>
                    <Input
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{ width: "100%", marginBottom: "2rem" }}
                    />
                </FormControl>
                <Button
                    disabled={!password && !confirmPassword ? true : false}
                    fullWidth
                    variant="contained"
                    style={{ backgroundColor: "red", color: "white" }}
                    onClick={(e) => SavePassword(e)}
                    mt={5}
                >
                    {t("Save")}
                </Button>
            </Grid>
        </div>
    )
}

export default SetPassword;
