import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components";
import Header from './../CenterAdminHeader/CenterAdminHeader';
import Footer from '../../../components/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from "react-router-dom";

// import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./../../center-admin/dashboard/dashboard.css"
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

function Dashboard() {
    const {t} = useTranslation();
    const language = useSelector(state => state.language)
    const history = useHistory();
    const dispatch = useDispatch();
    const [password, setPassword] = useState("");
    const token = useSelector((state) => state.token);
    const logincenterToken = useSelector(state => state.selectedLoginCenter.token)


    const redirectToAddCenter = (e) => {
        e.preventDefault();
        history.push("/center/admin/center-management");

    }

    return (

        <div className="mainPage-container">
            <Header
                title={t("Administrator Panel")}
            />

            <Grid container item sm={12} lg={12} xs={12} row>

                <Grid item sm={1} lg={2} xs={12}>
                </Grid>

                <Grid item sm={10} lg={8} xs={12} >
                    <Grid container item sm={12} lg={12} xs={12} row style={{ textAlign: "center" }}>
                        <Grid item sm={4} lg={4} xs={12}>
                            <Grid item>
                                <Button
                                    className={"roundButtonmain"}
                                    variant="contained"
                                    onClick={() => { history.push("/center/admin/tax-data") }}
                                >
                                    {t("Tax data")}
                                </Button>
                            </Grid >
                            <Grid item>
                                <Button
                                    className={"roundButtonmain"}
                                    variant="contained"
                                    onClick={() => { 
                                        history.push("/center/centerData")
                                        // history.push("/center/admin/center-details")
                                     }}
                                >
                                    {t("Center Data")}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    className={"roundButtonmain"}
                                    variant="contained"
                                    onClick={() => { history.push("/center/admin/centerImage") }}
                                >
                                    {t("Center Images")}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    className={"roundButtonmain"}
                                    variant="contained"
                                    onClick={() => { history.push("/center/admin/center-database") }}
                                >
                                    {t("Center Of Database")}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    className={"roundButtonmain"}
                                    variant="contained"
                                    onClick={() => { history.push("/center/admin/action-dates") }}
                                >
                                    {t("Actions dates")}
                                </Button>
                            </Grid>
                        </Grid>

                        <Grid item sm={4} lg={4} xs={12} >

                            <Grid item>
                                <Button
                                    className={"roundButtonmain"}
                                    variant="contained"
                                    onClick={() => { history.push("/center/admin/events") }}
                                >
                                    {t("Day Management")}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    className={"roundButtonmain"}
                                    variant="contained"
                                    onClick={() => { history.push("/center/admin/workers") }}
                                >
                                    {t("Workers")}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    className={"roundButtonmain"}
                                    variant="contained"
                                    onClick={() => { history.push("/center/admin/services") }}
                                >
                                    {t("Services")}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    className={"roundButtonmain"}
                                    variant="contained"
                                    onClick={() => { history.push("/center/admin/emergencycancle") }}
                                >
                                    {t("Emergency Cancellation")}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    className={"roundButtonmain"}
                                    variant="contained"
                                    onClick={() => { history.push("/center/admin/clients") }}
                                >
                                    {t("Client Files")}
                                </Button>
                            </Grid>
                        </Grid>

                        <Grid item sm={4} lg={4} xs={12}>
                            <Grid item>
                                <Button
                                    className={"roundButtonmain"}
                                    variant="contained"
                                    onClick={() => { history.push("/center/admin/permission") }}
                                >
                                    {t("Center Permissions")}
                                </Button>
                            </Grid>
                            {/* <Grid item>
                                <Button
                                    className={"roundButtonmain"}
                                    variant="contained"
                                >
                                    {t("Clients Database")}
                                </Button>
                            </Grid> */}
                            <Grid item>
                                <Button
                                    className={"roundButtonmain"}
                                    variant="contained"
                                    onClick={() => { history.push("/center/admin/plan") }}
                                >
                                    {t("Contracted Plan")}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    className={"roundButtonmain"}
                                    variant="contained"
                                    onClick={(e) => redirectToAddCenter(e)}
                                >
                                    + {t("Centers")}
                                </Button>
                            </Grid>

                        </Grid>
                    </Grid>
                </Grid>

                <Grid item sm={1} lg={2} xs={12}>
                </Grid>
            </Grid>

            <Grid item xl={12} ld={12} sm={12} xs={12} md={12}
                style={{ textAlign: "center", marginTop: "1rem" }}
            >
                <Button
                    className={"roundButtonForBack"}
                    variant="contained"
                    onClick={() => { history.push("/center/center-details") }}
                >
                    {t("Back to the center")}
                </Button>
            </Grid>


        </div>
    )
}

export default Dashboard;
