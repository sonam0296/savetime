import React, { useState } from "react";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import { useToasts } from 'react-toast-notifications';
import { useDispatch, useSelector } from 'react-redux'
import Helmet from 'react-helmet';

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
import './changepassword.css';
import {
  successToaster,
  errorToaster
} from '../../common/common'
import { useTranslation } from "react-i18next";
const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;
  width: 100%;
  margin:auto;
  width:700px;
  margin-top:100px;
  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;

function ResetPassword() {
  const {t} = useTranslation();
  const history = useHistory()
  const dispatch = useDispatch();
  const state = useSelector(state => state.email)
  const language = useSelector(state => state.language)

  const otp = useSelector(state => state.otp)
  const { addToast } = useToasts();
  const [password, setpassword] = useState("")

  const handleChangepassword = async (e) => {
    e.preventDefault();
    const bodyApi = {
      emailAddress: state,
      otp: otp,
      resetPassword: password
    }
    const response = await instance.post(`${requests.fetchResetPassword}?lang=${language}`, bodyApi)
      .catch(
        (error) => {
          let errorMessage = error.response.data.message
          errorToaster(errorMessage)
        }
      )
    if (response && response.data) {
      successToaster(response.data.data)
      history.push("/auth/sign-in");

    }
  }
  return (
    <Container style={{marginTop:"200px"}}>
      <Wrapper className="change-container" >
        <Helmet title="Reset Password" />
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          {t("Reset Password")}
      </Typography>
        <Typography component="h2" variant="body1" align="center">
          {t("Enter your your new password")}
      </Typography>
        <form>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">{t("New Password")}</InputLabel>
            <Input id="password" name="password"
              autoComplete="password"
              type="password"
              autoFocus
              onChange={(e) => setpassword(e.target.value)}
              value={password}
            />
          </FormControl>
          <Button
            component={Link}
            // to="/"
            onClick={(e) => handleChangepassword(e)}
            fullWidth
            className="reset-btn"
            variant="contained"
            color="primary"
            mt={2}
          >
            New password
        </Button>
        </form>
      </Wrapper>
    </Container>
  );
}

export default ResetPassword;
