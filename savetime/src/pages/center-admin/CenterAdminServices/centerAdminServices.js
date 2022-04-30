import React, { useState, useEffect, useRef } from "react";
import CenterAdminHeader from "./../CenterAdminHeader/CenterAdminHeader";
import Footer from "../../../components/Footer";

import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

import requests from "../../../requests";
import instance from "../../../axios";

import { green } from "@material-ui/core/colors";

import { setSelectedServicesForCenterAdmin } from "../../../redux/actions/actions";

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

import Switch from "@material-ui/core/Switch";

import { Collapse, DialogTitle, Grid, Button } from "@material-ui/core";
import { successToaster, errorToaster } from "../../../common/common";

import "./centerAdminServices.css";

import { makeStyles } from "@material-ui/core/styles";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import UpdateService from "./updateService/personal-service/updateService";
import UpdateCollectiveService from "./updateService/collective-service/updatecollectiveServices";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const GreenSwitch = withStyles({
  switchBase: {
    color: green[300],
    "&$checked": {
      color: green[500],
    },
    "&$checked + $track": {
      backgroundColor: green[500],
    },
  },
  checked: {},
  track: {},
})(Switch);

function CenterAdminServices() {
  const {t} = useTranslation();
  const language = useSelector(state => state.language)
  const loginData = useSelector((state) => state.loginData);
  const token = useSelector((state) => state.token);
  const logincenterToken = useSelector(state => state.selectedLoginCenter.token)

  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const [services, setServices] = useState([]);
  const [personalopen, setPersonalOpen] = useState(false);
  const [flag, setFlag] = useState(false);
  const [selectedService, setSelectedService] = useState({});

  useEffect(() => {
    getService();
  }, []);

  const getService = async () => {
    const response = await instance
      .get(`${requests.fetchCenterAdminServices}${loginData._id}?lang=${language}`, {
        headers: {
          Authorization: `Bearer ${logincenterToken}`,
        },
      })
      .catch((error) => {
        let errorMessage = "";
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error.message;
        } else {
          errorMessage = error.response.data.message;
        }
        console.log("ee", error.response);
        errorToaster(errorMessage);
      });
    if (response && response.data) {
      let res = response.data.data;
      setServices(res);
    }
  };

  const handleChange = async (e, service, index) => {
    // let tempServices = services;
    // tempServices[index].active = e.target.checked;
    // setServices(tempServices);

    let body = {
      active: !service.active,
    };

    const response = await instance
      .put(`${requests.fetchUpdateService}/${service._id}?lang=${language}`, body, {
        headers: {
          Authorization: `Bearer ${logincenterToken}`,
        },
      })
      .catch((error) => {
        let errorMessage = "";
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error.message;
        } else {
          errorMessage = error.response.data.message;
        }
        console.log("ee", error.response);
        errorToaster(errorMessage);
      });
    if (response && response.data) {
      getService();
    }
  };

  const handlePersonalOpen = (data) => {
    setFlag(true);
    setPersonalOpen(true);
    setSelectedService(data);
    dispatch(setSelectedServicesForCenterAdmin(data));
  };

  const handlePersonalClose = () => {
    setFlag(false);
    setPersonalOpen(false);
  };

  useEffect(() => {
    if (personalopen === true) {
      setFlag(true);
    } else {
      setFlag(false);
    }
  }, [flag]);

  const handleBackButton = () =>{
      history.push("/center/admin/dashboard")
  }

  return (
    <>
      <div className="mainPage-container">
        <CenterAdminHeader title={t("Services")} />

        <Grid item container style={{ marginTop: "4rem" }}>
          <Grid
            item
            xl={6}
            ld={6}
            sm={6}
            xs={12}
            md={6}
            style={{
              textAlign: "center",
              alignItems: "center",
              padding: "2px",
            }}
          >
            <center>
              {services &&
                services.map((data, index) => {
                  return (
                    <div
                      className="ServicesShow"
                      // onClick={(e) => handleUpdateActivate(e, data)}
                    >
                      <span className="ShowServiceName">
                        {data.serviceName}
                      </span>

                      <div className="ShowSwitchButton">
                        <span>
                          <FormControlLabel
                            control={
                              <GreenSwitch
                                checked={data.active}
                                onChange={(e) => handleChange(e, data, index)}
                                name="active"
                              />
                            }
                            label=""
                          />
                        </span>
                        <span>
                          <PlayArrowRoundedIcon
                            style={{
                              color: "red",
                              fontSize: 40,
                              cursor: "pointer",
                            }}
                            onClick={() => handlePersonalOpen(data)}
                          />
                        </span>
                      </div>
                    </div>
                  );
                })}
            </center>
          </Grid>
          <Grid item xl={6} ld={6} sm={6} xs={12} md={6}>
            <div>
              <Button
                className={"roundButton"}
                variant="contained"
                onClick={(e) =>
                  history.push("/center/admin/services/interleave")
                }
              >
                {t("Interleaved")}
              </Button>
            </div>
            <div>
              <Button
                className={"roundButton"}
                variant="contained"
                onClick={(e) => history.push("/center/admin/services/create")}
              >
                {t("Create Services")}
              </Button>
            </div>
          </Grid>
        </Grid>
        <Grid
          item
          xl={12}
          ld={12}
          sm={12}
          xs={12}
          md={12}
          style={{ textAlign: "center", marginTop: "3rem" }}
        >
          <Button
            onClick={() => handleBackButton()}
            className={"roundButtonForBack"}
            variant="contained"
          >
            {t("Back to the center")}
          </Button>
        </Grid>
      </div>

      {console.log("selectedService ==>", selectedService)}
      {flag && personalopen && selectedService.type === "personal" && (
        <UpdateService
          isOpen={personalopen}
          isClose={handlePersonalClose}
          selectedService={selectedService}
          getService={getService}
        />
      )}
      {flag && selectedService.type === "collective" && (
        <UpdateCollectiveService
          isOpen={personalopen}
          isClose={handlePersonalClose}
          selectedService={selectedService}
          getService={getService}
        />
      )}
    </>
  );
}

export default CenterAdminServices;
