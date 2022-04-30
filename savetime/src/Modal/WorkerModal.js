import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import {
  Fade,
  TextField,
  InputAdornment,
  Grid,
  Button,
  Typography,
} from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import "./mapmodal.css";
import "./workmodal.css";
import Switch from "@material-ui/core/Switch";
import Avatar from "react-avatar";
import instance from "../axios";
import requests from "../requests";
import Schedule from "../pages/center/Schedule";
import { useSelector, useDispatch } from "react-redux";
import { Close, LocalGasStationRounded } from "@material-ui/icons";
import {
  openWorkerModel,
  setWorkerCustomSchedule,
  workerSchedules,
  workerInput,
  setNewWorkerData,
  setStarttime,
  setEndtime,
  setWorkerDefaultSchedule,
} from "../redux/actions/actions";
import { successToaster, errorToaster } from "../common/common";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const ProfileUpload = ({ onChange, src }) => {
  return (
    <>
      <label for="photo-upload" className="custom-file-upload fas">
        <div className="img-wrap img-upload">
          <Avatar
            size="150"
            facebook-id="invalidfacebookusername"
            src={src}
            className="avatar-image"
            round={true}
          />
        </div>
        <input
          id="photo-upload"
          style={{ display: "none" }}
          type="file"
          onChange={onChange}
        />
      </label>
    </>
  );
};

export default function TransitionsModal(props) {
  const { t } = useTranslation();
  const language = useSelector((state) => state.language);
  const classes = useStyles();
  let a = props.open;
  const { addToast } = useToasts();
  const [profileURL, setProfileURL] = React.useState("");
  const [value, setValue] = useState({});
  const [data, setData] = useState([]);
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState({});
  const [state, setState] = useState(true);
  const [confirmPinCodeState, setconfirmPinCodeState] = useState(false);
  const [workersData, setWorkersData] = useState({});
  const token = useSelector((state) => state.token);
  const workerDefaultSchedule = useSelector(
    (state) => state.workerDefaultSchedule
  );
  const workerCustomSchedule = useSelector(
    (state) => state.workerCustomSchedule
  );
  const user = useSelector((state) => state.loginData);
  const workerinput = useSelector((state) => state.workerinput);
  const workerschedulesSelector = useSelector((state) => state.workerschedules);
  const dispatch = useDispatch();
  // const openworkermodel = useSelector((state) => state.openworkermodel)

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleClose = (e) => {
    dispatch(setStarttime(""));
    dispatch(setEndtime(""));
    e.preventDefault();
    props.onDeactive();
    dispatch(workerInput({}));
    dispatch(setWorkerDefaultSchedule([]));
  };
  const imageupload = async (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    const fd = new FormData();
    fd.append("image", file);
    const response = await instance
      .post(`${requests.fetchImageUpload}?lang=${language}`, fd, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.message;
        errorToaster(t(errorMessage));
      });
    if (response && response.data) {
      console.log(response.data, "response");
      setProfileURL(response.data.data.file);
    }
  };
  const handleTimeArray = (data) => {
    setValue(data);
  };
  const handleActive = (e) => {
    setState({ ...state, [e.target.name]: e.target.checked });
  };
  const handelChange = async (e) => {
    e.preventDefault();
    setInput({ ...input, [e.target.name]: e.target.value });
    if (Object.keys(input).length >= 3 && input?.confirmpinCode?.length >= 3) {
      dispatch(workerInput(input));
      const obj = {
        name: input.name,
        lastname: input.lastname,
        pinCode: input.pinCode,
        defaultSchedule: workerDefaultSchedule,
        customSchedule: workerCustomSchedule,
        image: profileURL,
        centerIds: user._id,
        active: true,
        isPincodeActive: state,
      };
      dispatch(setNewWorkerData(obj));
      setWorkersData(input);
    }
  };

  useEffect(() => {
    if (input?.pinCode?.length >= 3) input.confirmpinCode = input.pinCode;
  }, []);

  useEffect(() => {
    setInput(workerinput);
    input.confirmpinCode = `${workerinput?.pinCode}`;
    setconfirmPinCodeState(true)
    if (props.isUpdate) {
      const obj = {
        defaultSchedule: props.updateworker.defaultSchedule,
        customDate: props.updateworker.customDate,
      };
      dispatch(workerSchedules(obj));
      setValue(obj);
      setProfileURL(props.updateworker.image);
      setInput(props.updateworker);
      setState(props.updateworker.isPincodeActive);
    }
  }, []);

  const getWorkers = async () => {
    const response = await instance
      .get(`${requests.fetchGetWorkers}/${user._id}?lang=${language}`, {
        headers: {
          Authorization: token,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.message;
        errorToaster(t(errorMessage));
      });

    if (response && response.data) {
      props.handleWorker(response.data.data);
      setData(response.data.data);

      props.onDeactive();

      // addToast("worker created", { appearance: 'success', autoDismiss: true })
    }
  };

  const handleSubmit = async () => {
    const obj = {
      name: input.name,
      lastname: input.lastname,
      pinCode: input.pinCode,
      defaultSchedule: workerDefaultSchedule,
      customDate: workerCustomSchedule,
      image: profileURL
        ? profileURL
        : "https://savetime-image.s3.eu-west-3.amazonaws.com/Person-b5c47224-332f-4862-8268-1e822350ff51.png",
      centerIds: user._id,
      active: true,
      isPincodeActive: state,
    };

    if (input._id) {
      obj.workerId = input._id;
      obj.centerIds = undefined;

      obj.defaultSchedule =
        workerDefaultSchedule.length > 0
          ? workerDefaultSchedule
          : workerschedulesSelector.defaultSchedule;
      obj.customDate =
        workerCustomSchedule.length > 0
          ? workerCustomSchedule
          : workerschedulesSelector.customDate;
      const response = await instance
        .put(`${requests.fetchUpdateWorkers}?lang=${language}`, obj, {
          headers: {
            Authorization: token,
          },
        })
        .catch((error) => {
          let errorMessage = error.response.data.message;
          errorToaster(t(errorMessage));
        });
      if (response && response.data) {
        successToaster(t("Updated Worker"));
        dispatch(openWorkerModel(false));
        dispatch(workerInput({}));
        dispatch(setWorkerDefaultSchedule([]));
      }
      getWorkers();
    } else {
      if (input.pinCode == input.confirmpinCode) {
        const response = await instance
          .post(`${requests.fetchCreateWorker}?lang=${language}`, obj, {
            headers: {
              Authorization: token,
            },
          })
          .catch((error) => {
            let errorMessage = error.response.data.message;
            errorToaster(t(errorMessage));
          });
        if (response && response.data) {
          getWorkers();
          dispatch(openWorkerModel(false));
          successToaster(t("Worker Created"));
          dispatch(workerInput({}));
          dispatch(setWorkerDefaultSchedule([]));
        }
      } else {
        errorToaster(t("PIN mismatch"));
      }
    }
  };

  return (
    <div>
      <Modal
        // aria-labelledby="transition-modal-title"
        // aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.activate}
        onClose={handleClose}
        closeAfterTransition
      // BackdropComponent={Backdrop}
      // BackdropProps={{
      //   timeout: 500,
      // }}
      >
        <Fade in={props.activate}>
          <div>
            <Grid container className="worker-papers">
              <Grid items xs={12} style={{ position: "relative" }}>
                <div className="papers-header">
                  <Typography variant="h1">{t("Create Worker")}</Typography>
                </div>
                <div className="close-icon">
                  {/* <Close className="close" onClick={(e) => handleClose(e)} /> */}
                  <i
                    class="fas fa-times close"
                    onClick={(e) => handleClose(e)}
                  ></i>
                </div>
              </Grid>
              {/* <Grid items xs={6} lg={6} sm={6} xl={6} row > */}
              <Grid items xs={12} lg={6}>
                <div className="paper-form">
                  <div>
                    <ProfileUpload
                      onChange={(e) => imageupload(e)}
                      src={
                        profileURL.length > 0
                          ? profileURL
                          : "https://savetime-image.s3.eu-west-3.amazonaws.com/Person-b5c47224-332f-4862-8268-1e822350ff51.png"
                      }
                    />
                  </div>

                  <TextField
                    id="standard-start-adornment"
                    required
                    name="name"
                    value={input.name}
                    onChange={(e) => handelChange(e)}
                    className="name-field"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">{t("Name")}</InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    id="standard-start-adornment"
                    required
                    name="lastname"
                    value={input.lastname}
                    // value={input.lastname}
                    onChange={(e) => handelChange(e)}
                    className="name-field"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {t("Surname")}
                        </InputAdornment>
                      ),
                    }}
                  />
                  {workerinput._id ? (
                    <TextField
                      id="standard-start-adornment"
                      className="name-field"
                      name="pinCode"
                      value={input.pinCode ? "****" : ""}
                      onChange={(e) => handelChange(e)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {t("Pin Code")}
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <Switch
                            onChange={(e) => setState(e.target.checked)}
                            checked={state}
                            //props.updateworker.active==true ? true :
                            // onChange={handleChange}
                            name="active"
                            inputProps={{ "aria-label": "secondary checkbox" }}
                          />
                        ),
                      }}
                    />
                  ) : (
                    <>
                      <TextField
                        id="standard-start-adornment"
                        className="name-field"
                        name="pinCode"
                        value={input.pinCode}
                        onChange={(e) => handelChange(e)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {t("Pin Code")}
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <Switch
                              onChange={(e) => setState(e.target.checked)}
                              checked={state}
                              // onChange={handleChange}
                              name="active"
                              inputProps={{
                                "aria-label": "secondary checkbox",
                              }}
                            />
                          ),
                        }}
                      />
                      {confirmPinCodeState == true ? (
                        <TextField
                          id="standard-start-adornment"
                          name="confirmpinCode"
                          value={input.confirmpinCode}
                          onChange={(e) => handelChange(e)}
                          className="name-field"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                {t("Confirm Pin Code")}
                              </InputAdornment>
                            ),
                          }}
                        />
                      ) : (
                        <TextField
                          id="standard-start-adornment"
                          name="confirmpinCode"
                          value={input.confirmpinCode}
                          onChange={(e) => handelChange(e)}
                          className="name-field"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                {t("Confirm Pin Code")}
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                      {/* <TextField
                        id="standard-start-adornment"
                        name="confirmpinCode"
                        value={input.confirmpinCode}
                        onChange={(e) => handelChange(e)}
                        className="name-field"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              confirm Pin Code
                            </InputAdornment>
                          ),
                        }}
                      /> */}
                    </>
                  )}
                  {/* {state==true ? 
                  <>
                   <TextField
                    id="standard-start-adornment"
                   
                    name="confirmpinCode"
                    value={input.confirmpinCode}
                    onChange={(e) => handelChange(e)}
                    className="name-field"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">confirm Pin Code</InputAdornment>,
                    }}
                    /> </> : null } */}
                  {/* </>  */}
                </div>
              </Grid>
              <Grid items xs={12} lg={6} className="paper-schedule">
                <Schedule
                  type={"worker"}
                  handleTimeArray={handleTimeArray}
                  data={{ typeOfSchedule: "default" }}
                  Schedules={value}
                  workersData={workersData}
                />
              </Grid>
              {/* </Grid> */}
              {/* <Grid items xs={6} style={{ position: "relative" }} >

                <Map />

              </Grid> */}
              <Grid items xs={12}>
                <div className="worker-paper-btn">
                  <Button
                    variant="contained"
                    onClick={(e) => handleClose(e)}
                    // className="worker_return"
                    style={{ backgroundColor: "#D61C38", color: "white" }}
                  >
                    {t("Return")}
                  </Button>
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "#00ad22",
                      color: "white",
                      marginLeft: "-8rem",
                    }}
                    // className="worker_following"
                    onClick={(e) => handleSubmit(e)}
                  >
                    {t("Following")}
                  </Button>
                </div>
              </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
