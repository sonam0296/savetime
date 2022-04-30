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


import { setCenterAdminLoginStatus, setLoginDataAdmin, setSelectedAdmin, setSelectedLoginCenter, setWorkerLoginStatus } from "../../../redux/actions/actions";

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
import {
  successToaster,
  errorToaster
} from '../../../common/common'
import interactionPlugin from "@fullcalendar/interaction";

import PWDLinkIsSend from "./../../../Modal/CenterModel/PWDLinkIsSend";
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


function Signin() {
  const {t} = useTranslation();
  const language = useSelector(state => state.language)
  const history = useHistory();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const token = useSelector((state) => state.token);
  const logincenterToken = useSelector(state => state.selectedLoginCenter.token)
  const [modal, setModal] = useState(false);
  const [adminlogins, setAdminlogins] = useState([])
  let loginArray=[]
  useEffect(() => {
    dispatch(setWorkerLoginStatus(false))
   
  }, [])
  useEffect(() => {
    if(adminlogins.length>0){
      dispatch(setLoginDataAdmin(adminlogins))
    }
  
  }, [adminlogins])

  const loginForCenter = async (e) => {
    e.preventDefault();
    const bodyApi = {
      "adminPanelPassword": password
    };
    const response = await instance.post(`${requests.fetchCenterAdminLogin}?lang=${language}`, bodyApi, {
      headers: {
        Authorization: `Bearer ${logincenterToken}`,
      },
    })
      .catch(
        (error) => {
          let errorMessage = ""
          if (error.response?.data && error?.response?.data.error) {
            errorMessage = error.response?.data.error.message
          } else {
            errorMessage = error.response?.data.message
          }
          console.log("ee", error.response);
          errorToaster(errorMessage);
        }
      )
    if (response && response.data) {
      // dispatch(setToken(response.data.data.token))
      // dispatch(setLoginData(response.data.data.userData))
      successToaster(t('Login Successful'))
      let loginData =response.data.data
      loginData.isActive=true;
      loginArray.push(loginData)
      setAdminlogins(loginArray)
      dispatch(setSelectedLoginCenter(loginData))
      dispatch(setCenterAdminLoginStatus(true));
      history.push('/center/admin/dashboard');
    }
  }
  const callForgotPasswordAPI = async (e) => {
    e.preventDefault();
    const bodyApi = {
     
    };
    const response = await instance.put(`${requests.fetchCenterAdminForgotPassword}?lang=${language}`, {}, {
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
      console.log("response  ==> ", response);
      setModal(true);
    }
  }

  return (
    <>
    <div className="mainPage-container">
      <Header />

      <Grid className="formContainer">
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="password">{t("Password")}</InputLabel>
          <Input
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", marginBottom: "1rem" }}
          />
        </FormControl>
        <Button
          disabled={!password ? true : false}
          fullWidth
          variant="contained"
          style={{ backgroundColor: "red", color: "white" }}
          onClick={(e) => loginForCenter(e)}
          mt={5}
        >
          {t("Sign in")}
        </Button>
        <Button
          fullWidth
          style={{ color: "red" }}
          mt={4}
          onClick={(e) => callForgotPasswordAPI(e)}
        >
          {t("Forgot password")}
        </Button>
      </Grid>
    </div>
    
    {
      modal===true &&
      <PWDLinkIsSend 
        isOpen={modal}
        isClose={setModal}
      />
    }
    </>
  )
}

export default Signin;
