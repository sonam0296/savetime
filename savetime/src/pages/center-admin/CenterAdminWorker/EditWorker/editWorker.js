import {
  Dialog,
  DialogContent,
  DialogContentText,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import "./editWorker.css";
import instance from "../../../../axios";
import requests from "../../../../requests";
import { connect, useDispatch, useSelector } from "react-redux";
import CenterAdminHeader from "./../../CenterAdminHeader/CenterAdminHeader";

import {
  Collapse,
  DialogTitle,
  Grid,
  Button,
  TextField,
} from "@material-ui/core";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";

import {
  openWorkerModel,
  workerInput,
} from "../../../../redux/actions/actions";

import WorkerModal from "../../../../Modal/WorkerModal";

import { successToaster, errorToaster } from "../../../../common/common";

import { withStyles } from "@material-ui/core/styles";
import SetServiceModal from "../SetServices/setServiceModal";
import { useTranslation } from "react-i18next";

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    "&$checked": {
      transform: "translateX(12px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: "green",
        borderColor: "green",
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

const EditWorker = () => {
  const {t} = useTranslation();
  const language = useSelector(state => state.language)
  const dispatch = useDispatch();
  const loginData = useSelector((state) => state.loginData);
  const token = useSelector((state) => state.token);
  const logincenterToken = useSelector(state => state.selectedLoginCenter.token)
  const workerinput = useSelector((state) => state.workerinput);

  const [isActive, setIsActive] = useState(workerinput.active);
  const history = useHistory();

  const [workers, setWorkers] = useState([]);
  const [services, setServices] = useState([]);
  const [activate, setActivate] = useState(false);
  const [updateworker, setUpdate] = useState(workerinput);
  const [isUpdate, setIsUpdate] = useState(false);

  const [canclepopup, setCanclepopup] = useState(false);
  const [canclepopupconfirm, setCanclepopupconfirm] = useState(false);

  const [serviceModal, setServiceModal] = useState(false);
  const [state, setState] = useState(workerinput.isPincodeActive);

  const closeActivate = async () => {
    dispatch(openWorkerModel(false));
    // dispatch(workerInput({}))
    // dispatch(workerSchedules({}))
    setActivate(false);
  };


  const handleActivate = async () => {
    setActivate(true);
  };

  const handleWorker = async (workerdata) => {
    setWorkers(workerdata);
  };

  const handleUpdateActivate = (e) => {
    e.preventDefault();
    setIsUpdate(true);
    setActivate(true);
  };

  const openServiceModal = async () => {
    setServiceModal(true);
  };

  const closeServiceModal = async () => {
    setServiceModal(false);
  };

  const handleDeleteWorker = () => {
    setCanclepopup(true);
  };

  const handleNotificationConfirm = () => {
    handleDeativateWorker();
    setCanclepopupconfirm(false);
    // isClose(false);
  };

  const handleClose = () => {};
  // useForceUpdate();

  const handleCanclePopupClose = () => {
    setCanclepopup(false);
    // setOpen(false);
  };
  const handleDeativateWorker = async () => {
    setCanclepopup(false);

    const response = await instance
      .put(`${requests.fetchDeleteWorker}/${workerinput._id}?lang=${language}`, 
      {
        headers: {
          Authorization: `Bearer ${logincenterToken}`,
        },
      })
      .catch((error) => {
        console.log("ee", error.response);
        let errorMessage = error.response.data.message;
        errorToaster(errorMessage);
      });
    if (response && response.data) {
      successToaster(t("Worker Deleted!"));
      history.push("/center/admin/workers");
      // handlePersonalClose();
      // getService();
    }
    //API CALL
  };
  const handleDeactivateandAdvise = () => {
    setCanclepopupconfirm(true);
  };
  const handleConfirmPopupClose = () => {
    handleDeativateWorker();
    setCanclepopupconfirm(false);
  };

  const handlePinCodeChange = async (e)=>{

    setState(e.target.checked)
    
    let obj={
      isPincodeActive:!state,
      workerId:workerinput._id
    }
    console.log(obj,'obj')
    const response = await instance
    .put(requests.fetchUpdateWorkers, obj, {
      headers: {
        Authorization: logincenterToken,
      },
    })
    .catch((error) => {
      let errorMessage = error.response.data.message;
      errorToaster(errorMessage);
    });
  if (response && response.data) {
    console.log(response.data,'data')
    successToaster(t("Updated Worker"));
    history.push("/center/admin/workers");
    // dispatch(openWorkerModel(false));
    // dispatch(workerInput({}));
    // dispatch(setWorkerDefaultSchedule([]));
  }
  }

  const handleGoback =()=>{
    history.push("/center/admin/workers");
    dispatch(workerInput({}))
  }

  return (
    <Fragment>
      {/* <Navigation /> */}
      <div className="mainPage-container">
        <CenterAdminHeader title="Edit Worker" />

        <Grid container item sm={12} lg={12} xs={12} row>
          <Grid item sm={2} lg={2} xs={12}></Grid>

          <Grid item sm={8} lg={8} xs={12}>
            <Grid
              container
              item
              sm={12}
              lg={12}
              xs={12}
              row
              style={{
                textAlign: "center",
                marginTop: "3rem",
                marginBottom: "3rem",
              }}
            >
              <Grid
                item
                sm={12}
                md={12}
                lg={12}
                xs={12}
                style={{ textAlign: "-webkit-center" }}
              >
                <div className="buttonForActive">
                  {/* <span>Active
                                        <AntSwitch
                                            checked={isActive}
                                            onChange={(e) => setIsActive(e.target.checked)} name="isActive"
                                        />
                                    </span> */}
                  <FormControl component="fieldset">
                    <FormGroup aria-label="position" row>
                      <FormControlLabel
                        value="start"
                        control={
                          <AntSwitch
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            name="isActive"
                          />
                        }
                        label="Active"
                        labelPlacement="start"
                      />
                    </FormGroup>
                  </FormControl>
                </div>
              </Grid>

              <Grid
                item
                sm={12}
                md={12}
                lg={12}
                xs={12}
                style={{ textAlign: "-webkit-center" }}
              >
                <div
                  className="buttonShowBlckBorder"
                  // onClick={() => handleModalOpen(overLapped, service)}
                >
                  <span></span>
                  <span> {t("Data")} </span>

                  <span>
                    <ArrowRightIcon
                      style={{ color: "red", fontSize: 30, cursor: "pointer" }}
                      onClick={(e) => handleUpdateActivate(e)}
                    />
                  </span>
                </div>
              </Grid>
              <Grid
                item
                sm={12}
                md={12}
                lg={12}
                xs={12}
                style={{ textAlign: "-webkit-center" }}
              >
                <div
                  className="buttonShowBlckBorder"
                  // onClick={() => handleModalOpen(overLapped, service)}
                >
                  <span></span>
                  <span> {t("Services")} </span>

                  <span>
                    <ArrowRightIcon
                      style={{ color: "red", fontSize: 30, cursor: "pointer" }}
                      onClick={() => openServiceModal()}
                    />
                  </span>
                </div>
              </Grid>
              <Grid
                item
                sm={12}
                md={12}
                lg={12}
                xs={12}
                style={{ textAlign: "-webkit-center" }}
              >
                <div
                  className="buttonShowBlckBorder"
                  // onClick={() => handleModalOpen(overLapped, service)}
                >
                  <span style={{ paddingLeft: "1rem" }}>{t("Pin")}</span>
                  <span>
                  <TextField
                        id="standard-start-adornment"
                        className="name-field"
                        name="pinCode"
                        value={workerinput.pinCode}
                        // onChange={(e) => handelChange(e)}
                        InputProps={{
                         
                          endAdornment: (
                            <Switch
                              // onChange={(e) => setState(e.target.checked)}
                              checked={state}
                              onChange={(e)=>handlePinCodeChange(e)}
                              name="active"
                              inputProps={{
                                "aria-label": "secondary checkbox",
                              }}
                          
                            />
                            ),
                          }}
                        />
                            </span>
                            {/* <TextField id="standard-basic" /> */}

                  {/* <span>
                    <ArrowRightIcon
                      style={{ color: "red", fontSize: 30, cursor: "pointer" }}
                    />
                  </span> */}
                </div>
              </Grid>
              <Grid
                item
                sm={12}
                md={12}
                lg={12}
                xs={12}
                style={{ textAlign: "-webkit-center" }}
              >
                <div
                  className="RemoveButton"
                  onClick={() => handleDeleteWorker()}
                >
                  <span style={{ paddingLeft: "1rem" }}> {t("Remove")} </span>
                </div>
              </Grid>
              <Grid
                item
                sm={12}
                md={12}
                lg={12}
                xs={12}
                style={{ textAlign: "-webkit-center" }}
              >
                <div
                  className="BackButton"
                  onClick={() => handleGoback()}
                >
                  <span style={{ paddingLeft: "1rem" }}> {t("Go Back")} </span>
                </div>
              </Grid>
            </Grid>
          </Grid>

          <Grid item sm={2} lg={8} xs={12}></Grid>
        </Grid>

        {/* Delete worker confirmation popups */}

        <div>
          <Dialog
            // className={classes.dialogPaper}
            //   fullWidth={fullWidth}
            //   maxWidth={maxWidth2}
            open={canclepopup}
            onClose={handleClose}
            aria-labelledby="max-width-dialog-title"
          >
            {/* <DialogTitle id="max-width-dialog-title">Optional sizes</DialogTitle> */}
            <DialogContent>
              <DialogContentText>
                <div
                  style={{
                    margin: "62px 0px",
                    fontSize: "22px",
                    color: "#d61c38",
                    textAlign: "center",
                  }}
                >
                  {t("Are you sure you want to deactivate the worker")} 
                </div>
              </DialogContentText>
              <div className="warningworker">
                {t("The worker @ will not appear visible and clients will not be able to book appointments with him @ until you activate it again")}
              </div>
            </DialogContent>
            <Grid container style={{ justifyContent: "space-evenly" }}>
              <Grid item xs={12} md={4} lg={4}>
                {" "}
                <Button
                  className="returnBtnGobackworker"
                  onClick={handleCanclePopupClose}
                  color="primary"
                >
                  {t("Go Back")}
                </Button>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                {" "}
                <Button
                  className="returnBtnCancleworker"
                  onClick={handleDeativateWorker}
                  color="primary"
                >
                  {t("Deactivate")}
                </Button>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                {" "}
                <Button
                  className="returnBtncancleadviceworker"
                  onClick={handleDeactivateandAdvise}
                  color="primary"
                >
                  {t("Deactivate and Cancel Appointments")}
                </Button>
              </Grid>
            </Grid>
          </Dialog>
        </div>

        <div>
          <Dialog
            // className={classes.dialogPaper}
            //   fullWidth={fullWidth}
            //   maxWidth={maxWidth2}
            open={canclepopupconfirm}
            onClose={handleClose}
            aria-labelledby="max-width-dialog-title"
          >
            {/* <DialogTitle id="max-width-dialog-title">Optional sizes</DialogTitle> */}
            <DialogContent>
              {/* <DialogContentText>
            Are you sure you want to terminate the service?
            </DialogContentText> */}
              <div
                style={{
                  margin: "1px 41px",
                  fontSize: "19px",
                  textAlign: "center",
                  marginBottom: "86px",
                  marginTop: " 38px",
                  color: "#d61c38",
                }}
              >
               {t(" Do you want to send an email to your clients information about the cancellation of appointments?")}
              </div>
            </DialogContent>
            <Grid
              container
              style={{ justifyContent: "space-evenly", marginBottom: "36px" }}
            >
              <Grid
                item
                xs={12}
                md={6}
                lg={6}
                style={{ display: "flex", justifyContent: "center" }}
              >
                {" "}
                <Button
                  style={{
                    width: "120px",
                    height: "30px",
                    backgroundColor: "#d61c38",
                    color: "white",
                    borderRadius: "21px",
                    border: "2px solid black",
                  }}
                  // className="returnBtnGoback"
                  onClick={handleConfirmPopupClose}
                  color="primary"
                >
                  {t("No")}
                </Button>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                lg={6}
                style={{ display: "flex", justifyContent: "center" }}
              >
                {" "}
                <Button
                  style={{
                    width: "120px",
                    height: "30px",
                    backgroundColor: "#00ad22",
                    color: " white",
                    borderRadius: "21px",
                    border: "2px solid black",
                  }}
                  className="returnBtnCancle"
                  onClick={handleNotificationConfirm}
                  // color="primary"
                >
                  {t("Yes")}
                </Button>
              </Grid>
            </Grid>
          </Dialog>
        </div>
      </div>

      {activate && (
        <WorkerModal
          activate={activate}
          handleWorker={handleWorker}
          updateworker={updateworker}
          isUpdate={isUpdate}
          onDeactive={closeActivate}
        />
      )}
      {serviceModal && (
        <SetServiceModal isOpen={serviceModal} isClose={closeServiceModal} />
      )}
    </Fragment>
  );
};

export default EditWorker;
