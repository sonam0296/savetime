import React, { useState } from "react";
import styled from "styled-components";
import { useToasts } from 'react-toast-notifications';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useHistory } from "react-router-dom";
import { spacing } from "@material-ui/system";
import { setLoginData, setToken, setForgot, openWorkerModel, workerInput, setAppointBookModel, setSelectedAdmin, setSelectedLoginCenter } from "../../redux/actions/actions";
import { useDispatch, useSelector } from "react-redux";
import requests from '../../requests'
import instance from '../../axios'
import Helmet from 'react-helmet';
import './signin.css'
import {
    Avatar,
    Checkbox,
    FormControl,
    FormControlLabel,
    Input,
    InputLabel,
    Button as MuiButton,
    Paper,
    Typography
} from "@material-ui/core";

import {
    successToaster,
    errorToaster
} from '../../common/common'
import { useTranslation } from "react-i18next";

const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;
  margin:auto;
  width:40%;
  margin-top:100px;
  @media (max-width: 600px) {
    margin-top:100px ;
    width:100% !important;
  }

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

function SignIn() {
    const {t} = useTranslation();
    const language = useSelector(state => state.language)
    const history = useHistory();
    const [input, setLogin] = useState({})
    const dispatch = useDispatch();
    const loginData = useSelector((state) => state.loginData)
    const [selectedCenter, setSelectedCenter] = useState({})

    const userLoginStatus = useSelector(state => state.userLoginStatus)

    const handleInput = (e) => {
        e.preventDefault();
        setLogin({ ...input, [e.target.name]: e.target.value })
    }

    const handleReset = (e) => {
        dispatch(setForgot(true))
        history.push("/reset-password")
    }

    const handleSignIn = async (e) => {

        e.preventDefault();
        const bodyApi = input;
        const response = await instance.post(`${requests.fetchLoginUser}?lang=${language}`, bodyApi)
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
            dispatch(setToken(response.data.data.token))
            dispatch(setLoginData(response.data.data.userData))

            successToaster(t('Login Successful'))
            if (response.data.data.userData.type == "center") {
                let obj={}
                obj=response.data.data.userData
                obj.token=response.data.data.token;
                dispatch(setSelectedLoginCenter(obj))
                if(response.data.data.userData.isExternalUrl==true){
                    history.push('/center/centerData'); 
                }else{

                    dispatch(workerInput({}))
                    dispatch(openWorkerModel(false))
                    // history.push('/center/center-details');
                    history.push('/center/workersDetails');
                }
            } else {
                console.log(userLoginStatus)
                if(userLoginStatus==true){
                  dispatch(setAppointBookModel(true))
                  history.push('/client/appointment')
                   
                }else{

                    history.push('/client/maindashboard');
                }
            }
        }
    };
    return (

        <Wrapper>
            <Helmet title="Sign In" />
            <img alt="Lucy" src="https://savetime-image.s3.eu-west-3.amazonaws.com/savetimelogo-178dfaf7-1ccd-4fe8-b473-82c09333bd87.png"
                className="login-logo"

            />
            <Typography component="h1" variant="h4" align="center" gutterBottom>
                {t("Welcome back!")}
            </Typography>
            <Typography component="h2" variant="body1" align="center">
                {t("Sign in to your account to continue")}
            </Typography>
            <form>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="email">{t("Email Address")}</InputLabel>
                    <Input
                    style={{width:'100%'}}
                    name="emailAddress" autoComplete="email"
                        onChange={(e) => handleInput(e)}
                        value={input.emailAddress}
                        autoFocus />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="password">{t("Password")}</InputLabel>
                    <Input
                        style={{width:'100%'}}
                        name="password"
                        type="password"
                        onChange={(e) => handleInput(e)}
                        value={input.password}
                        autoComplete="current-password"

                    />
                </FormControl>
                <Button
                    component={Link}
                    fullWidth
                    variant="contained"
                    style={{ backgroundColor: "#D61C38", color: "white" }}
                    mt={5}
                    onClick={handleSignIn}
                >
                    {t("Sign in")}
                </Button>
                <Button
                    component={Link}
                    onClick={handleReset}
                    fullWidth
                    style={{ color: "#D61C38" }}
                    mt={4}
                >
                    {t("Forgot password")}
                </Button>
            </form>
        </Wrapper>
    );
}

export default SignIn;
