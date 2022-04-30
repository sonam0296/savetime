import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import {
  setRegisterUser,
  setEmail,
  setForgot,
  setLoginData,
  setToken,
} from "../../redux/actions/actions";
import Helmet from "react-helmet";
import instance from "../../axios";
import request from "../../requests";
import {
  FormControl,
  Input,
  InputLabel,
  Button as MuiButton,
  Paper,
  Typography,
  Container,
} from "@material-ui/core";
import { spacing } from "@material-ui/system";
import "./signup.css";
import { successToaster, errorToaster } from "../../common/common";

//For number with country code
import "react-phone-number-input/style.css";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import Verify from "./Verify";
import { useTranslation } from "react-i18next";

const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)}px;
  margin: auto;
  width: 40%;
  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)}px;
  }
`;

function SignUp() {
  const {t} = useTranslation();
  const [input, setInput] = useState({});
  const language = useSelector(state => state.language)
  const dispatch = useDispatch();
  const [phonenumber, setPhoneNumber] = useState();
  const [activate, setActivate] = useState(false);
  const history = useHistory();
  const handleInput = (e) => {
    e.preventDefault();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const onCloseVerify = () => {
    setActivate(false);
  };

  useEffect(() => {
    setInput({ ...input, phonenumber: phonenumber });
  }, [phonenumber]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    input.type = "client";
    setInput(input);
    const response = await instance
      .post(`${request.fetchCreateUser}?lang=${language}`, input)
      .catch((error) => {
        let errorMessage = "";
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error.message;
        } else {
          errorMessage = error.response.data.message;
        }
        errorToaster(errorMessage);
      });
    if (response && response.data.data && response.status !== 208) {
      console.log(response, "response");
      successToaster(t("Successfully Submited"));
      setActivate(true);
      // history.push("/auth/Otp");
      setForgot(false);
      dispatch(setEmail(response.data.data.emailAddress));
      dispatch(setRegisterUser(response.data.data));
      dispatch(setLoginData(response.data.data));
      dispatch(setToken(response.data.data.token));
    } else {
      errorToaster(response.data.error.message);
    }
  };
  return (
    <Container style={{ marginTop: "100px" }}>
      <Wrapper className="signup-container">
        <Helmet title="Sign Up" />
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          {t("Get Started")}
        </Typography>
        <form>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="name">{t("Name")}</InputLabel>
            <Input
              className="userSignup"
              id="name"
              name="name"
              autoFocus
              onChange={(e) => handleInput(e)}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <PhoneInput
              international
              placeholder="PhoneNumber"
              value={phonenumber}
              onChange={setPhoneNumber}
              error={
                phonenumber
                  ? isPossiblePhoneNumber(phonenumber)
                    ? undefined
                    : "Invalid phone number"
                  : "Phone number required"
              }
            />
            {/* <InputLabel htmlFor="PhoneNumber">PhoneNumber</InputLabel>
            <Input id="PhoneNumber" name="phonenumber" onChange={(e) => handleInput(e)} /> */}
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="idCard">DNI</InputLabel>
            <Input
              className="userSignup"
              id="idCard"
              name="idCard"
              onChange={(e) => handleInput(e)}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">{t("Email Address")}</InputLabel>
            <Input
              className="userSignup"
              id="email"
              name="emailAddress"
              autoComplete="email"
              onChange={(e) => handleInput(e)}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">{t("Password")}</InputLabel>
            <Input
              className="userSignup"
              name="password"
              type="password"
              id="password"
              onChange={(e) => handleInput(e)}
              autoComplete="current-password"
            />
          </FormControl>
          <Button
            component={Link}
            onClick={(e) => handleSubmit(e)}
            to="/"
            fullWidth
            variant="contained"
            style={{ backgroundColor: "#D61C38", color: "white" }}
            mt={2}
          >
            {t("Sign up")}
          </Button>
        </form>
        {activate == true && (
          <Verify activate={activate} onDeactivate={onCloseVerify} />
        )}
      </Wrapper>
    </Container>
  );
}

export default SignUp;
