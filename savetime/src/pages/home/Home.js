import {
  Grid,
  Button,
  Typography,
  makeStyles,
  Popover,
  Paper,
  Divider,
  Container,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import "./home.css";

import {
  FacebookLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";

import firebase from "../../helper/firebase";
import { Redirect, useHistory, withRouter } from "react-router-dom";
import logo from "../../assets/LOGO_PRINICPAL.png";
import HouseIcon from "@material-ui/icons/House";
import { OldSocialLogin as SocialLogin } from "react-social-login";

import instance from "../../axios";
import requests from "../../requests";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setLoginData } from "../../redux/actions/actions";
import { useToasts } from "react-toast-notifications";
import styled from "styled-components";
import Footer from "../../components/Footer";
import { successToaster, errorToaster } from "../../common/common";
import { useTranslation } from "react-i18next";

const Home = (props) => {
  const { t } = useTranslation();
  const language = useSelector(state => state.language)
  const [checked, setChecked] = useState(false);
  const history = useHistory();
  const [verified, setVerified] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const center = useSelector((data) => data.centerdata);
  // const classes = useStyles();
  const handleOpenLogin = (e) => {
    e.preventDefault();
    setChecked(true);
    setOpen(false);
    history.push("/auth/sign-in");
  };

  const handleBookAppointment = () => {
    history.push("/client/maindashboard");
  };
  const handleSocialLogin = async (e) => {
    const { history } = props;
    if (e == "google") {
      var provider = new firebase.auth.GoogleAuthProvider();
    } else {
      var provider = new firebase.auth.FacebookAuthProvider();
    }
    console.log("provide", provider);

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(async (result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;
        // This gives you a Google Access setToken. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in user info.
        // var user = result.user;
        const user = result.additionalUserInfo.profile;

        const bodyApi = {
          // "socialId": "112078697741148098101",
          // "socialProvider": result.additionalUserInfo.providerId,
          socialId: user.id,
          socialProvider: e == "google" ? "google" : "facebook",
          emailAddress: user.email,
          name: user.name,
          userType: "client",
        };
        const response = await instance
          .post(`${requests.fetchSocialLogin}?lang=${language}`, bodyApi)
          .catch((error) => {
            let errorMessage = error.response.data.error.message;
            addToast(errorMessage, { appearance: "error", autoDismiss: true });
          });
        if (response && response.data) {
          successToaster(t("Login Successful"));
          if (response.data.data.user.type === "client") {
            dispatch(setToken(response.data.data.token));
            dispatch(setLoginData(response.data.data.user));
            setRedirect(true);
            history.push("/client/maindashboard");
          } else {
            history.push("/center/center-details");
          }
        }
      })
      .catch((error) => { });
  };
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const handleOpenSignUp = () => {
    history.push("/auth/sign-up");
  };
  useEffect(() => {
    if (center) {
      if (center.verified) {
        setVerified(true);
      } else {
        setVerified(false);
      }
    }
  }, []);
  const handleOpenCenter = () => {
    history.push("/auth/center-signup");
  };
  const start = Boolean(anchorEl);
  return (
    <>
      <div className="main-container">
        <div className="container">
          <div className="content-1">
            <img src={logo} className="logo" />
          </div>
          <div className="content-2">
            <div>
              <p className="middle-title">
                {t("Continue as User")}
              </p>
            </div>
            <div className="login-google">
              <SocialLogin provider="google">
                <GoogleLoginButton
                  onClick={() => handleSocialLogin("google")}
                  className="social"
                />
              </SocialLogin>
            </div>
            <div className="login-facebook">
              <SocialLogin provider="facebook">
                <FacebookLoginButton
                  className="social"
                  onClick={(e) => handleSocialLogin("facebook")}
                  value={"facebook"}
                />
              </SocialLogin>
            </div>
            <div>
              <h2 style={{ textAlign: "center" }}>
                {t("or")}
              </h2>
            </div>
            <div>
              <Button
                // variant="contained"
                className="signup"
                onClick={() => handleOpenSignUp()}
              >
                {t("Register as User")}
              </Button>
            </div>
            <div className="dividerOr">
              <h2 style={{ textAlign: "center" }}>
                {t("or")}
              </h2>
            </div>
            <div>
              <Button
                variant="contained"
                className="book-apt"
                onClick={() => handleBookAppointment()}
              >
                {t("Book Appointment")}
              </Button>
            </div>
            <div>
              <p className="termscondition" onClick={() => window.location.href = "http://savetime-web.s3-website.eu-west-3.amazonaws.com/#/center/termsandconditions"}>
                {t("continue implies that you have read and accept the terms and Conditions of Use")}
                {/* <span style={{color:'#d61c38'}}> the terms and
              conditions of use</span> */}
              </p>
            </div>
          </div>

          <div className="content-3">
            <div>
              <button
                // fullWidth
                onClick={handleOpenLogin}
                className="signup-btn"
                // variant="contained"
                // style={{ backgroundColor: "red", color: "white" }}

                mt={3}
              >
                {t("Login")}
              </button>
            </div>
            {/* <div> */}
            <p className="right-title">
              {t("Continue as Center")}
            </p>
            {/* </div> */}
            <div className="home-btn"
              onClick={() => handleOpenCenter()}
            >
              <p className="home-txt">
                {t("Register To Center")}
              </p>
              <HouseIcon className="icon" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />

      </div>

    </>
  )
}

export default Home