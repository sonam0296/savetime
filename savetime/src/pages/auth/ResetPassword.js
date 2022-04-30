import React, { useState } from "react";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import { useToasts } from 'react-toast-notifications';
import { useDispatch, useSelector } from 'react-redux'
import Helmet from 'react-helmet';
import './resetpassword.css'

import {
  FormControl,
  Input,
  InputLabel,
  Button as MuiButton,
  Paper,
  Typography,
  Container
} from "@material-ui/core";

import { spacing } from "@material-ui/system";
import { setEmail } from "../../redux/actions/actions";
import instance from "../../axios";
import requests from "../../requests";
import {
  successToaster,
  errorToaster
} from '../../common/common'
import { useTranslation } from "react-i18next";
const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;
  // width: 100%;
  margin:auto;
  width:500px;
  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;

function ResetPassword() {
  const {t} = useTranslation();
  const language = useSelector(state => state.language)
  const history = useHistory()
  const dispatch = useDispatch();
  const [email, setemail] = useState("")

  const handleResetpassword = async (e) => {
    e.preventDefault();
    const bodyApi = {
      emailAddress: email
    }
    const response = await instance.post(`${requests.fetchForgotPassword}?lang=${language}`, bodyApi)
      .catch(
        (error) => {
          let errorMessage = ""
          if (error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error.message
          } else {
            errorMessage = error.response.data.message
          }
          errorToaster(errorMessage)
        }
      )
    if (response && response.data) {
      dispatch(setEmail(email))
      successToaster(response.data.data)
      history.push("/auth/otp");
    }
  }
  return (
    <Container style={{marginTop:"200px"}}>
      <Wrapper className="reset-container">
        <Helmet title="Reset Password" />
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          {t("Reset Password")}
      </Typography>
        <Typography component="h2" variant="body1" align="center">
          {t("Enter your email to reset your password")}
      </Typography>
        <form className="reset-form" >
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">{t("Email Address")}</InputLabel>
            <Input id="email" name="email" autoComplete="email"
              autoFocus
              onChange={(e) => setemail(e.target.value)}
              value={email}
            />
          </FormControl>
          <Button
            component={Link}
            to="/"
            onClick={(e) => handleResetpassword(e)}
            fullWidth
            variant="contained"
            mt={2}
            className="reset-btn"
          >
            {t("Reset password")}
        </Button>
        </form>
      </Wrapper>
    </Container>
  );
}

export default ResetPassword;
