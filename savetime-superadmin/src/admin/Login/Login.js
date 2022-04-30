import React, { Fragment, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import { spacing } from "@material-ui/system";
import { setLoginData, setToken, setForgot, openWorkerModel, workerInput } from "../../redux/actions/actions";
import { useDispatch } from "react-redux";
import requests from '../../requests'
import instance from '../../axios'
import back from './back.png'

import './Login.css';
import {
    successToaster,
    errorToaster
} from '../../common/common'
import {
    FormControl,
    Input,
    Grid,
    InputLabel,
    Button as MuiButton,
    Paper,
    Typography,
    Container
} from "@material-ui/core";

const Button = styled(MuiButton)(spacing);

const Login = () => {
    const [users, setUsers] = useState({})

    const history = useHistory();
    const dispatch = useDispatch();

    const handleInput = (e) => {
        e.preventDefault();
        setUsers({ ...users, [e.target.name]: e.target.value });
    }

    const handleSignIn = async (e) => {

        e.preventDefault();
        const bodyApi = users;
        const response = await instance.post(requests.fetchLoginUser, bodyApi)
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
            successToaster('Login successful')
            if (response.data.data.userData.type == "admin") {
                dispatch(workerInput({}))
                dispatch(openWorkerModel(false))
                history.push('/admin/dashboard');
            } else {
                console.log("Login as Admin");
            }
        }
    };

    return (
        <Fragment>
            <div className="unScrobale">
                <img src={back} className="img-fluid image" />
                <div className="centered">
                    <Container>
                        <FormControl margin="normal" required fullWidth={true} >
                            <InputLabel htmlFor="email">Email Address</InputLabel>
                            <Input 
                                id="email"
                                type = "email"
                                name="emailAddress"
                                value={users.emailAddress}
                                onChange={(e) => handleInput(e)}
                            />
                        </FormControl>
                        <FormControl margin="normal" required fullWidth={true}>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input
                                type = "password"
                                name="password"
                                autoComplete="current-password"
                                value={users.password}
                                onChange={(e) => handleInput(e)}
                            />
                        </FormControl>
                        <Button
                            to="/"
                            size="+"
                            variant="contained"
                            onClick={handleSignIn}
                            style={{ backgroundColor: "#D50032", color: "white", borderRadius: "25px", margin: '0 auto', display: "flex" }}
                            mt={10}
                        >
                            Log In
                        </Button>
                    </Container>
                </div>
            </div>
        </Fragment>
    )
}


export default Login