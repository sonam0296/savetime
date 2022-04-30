import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Switch from "@material-ui/core/Switch";
import { useToasts } from "react-toast-notifications";
import CountryModal from "../../Modal/CountryModal";
import MapModal from "../../Modal/MapModal";
import Activation from "../../Modal/ActivationModal";
import {
  setRegisterUser,
  setEmail,
  setForgot,
  setCenterData,
  setLoginData,
  setToken,
  setSelectedLoginCenter,
} from "../../redux/actions/actions";
import country from "../../helper/countries.json";
import Helmet from "react-helmet";
import instance from "../../axios";
import request from "../../requests";
import SelectTimezoneMaterialUi from "select-timezone-material-ui";
import "./centerregistration.css";
import {
  FormControl,
  Input,
  Stepper,
  Step,
  StepLabel,
  InputLabel,
  Button as MuiButton,
  Paper,
  Typography,
  InputAdornment,
  IconButton,
  Container,
  TextField,
} from "@material-ui/core";
import { spacing } from "@material-ui/system";
import ReactFlagsSelect from "react-flags-select";
import { successToaster, errorToaster } from "../../common/common";

//For number with country code
import "react-phone-number-input/style.css";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import { useTranslation } from "react-i18next";

const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)}px;
  margin: auto;
  width: 700px;
  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(6)}px;
  }
`;
const steps = ["step-1", "step-2"];
function CenterRegistration() {
  const { t } = useTranslation();
  const language = useSelector((state) => state.language);
  const centerAdminLoginStatus = useSelector(
    (state) => state.centerAdminLoginStatus
  );
  const loginData = useSelector((state) => state.loginData);
  const [input, setInput] = useState({});
  const [open, setOpen] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const [activate, setActivate] = useState(false);
  const [countryName, setCountryName] = useState("");
  const [activeStep, setactiveStep] = useState(0);
  const [timezone, setTimeZone] = useState(null);
  const [enable, setEnable] = useState(false);
  const [flag, setFlag] = useState(false);
  const [selected, setSelected] = useState("");
  const [phonenumber, setPhoneNumber] = useState();
  const [managerStatus, setManagerStatus] = useState(false);
  const logincenterToken = useSelector(state => state.selectedLoginCenter.token)

  const dispatch = useDispatch();

  const history = useHistory();
  const handleInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    if (activeStep == 0) {
      if (Object.keys(input).length == 5) {
        setEnable(true);
      }
      if (e.target.value.length == 0) {
        setEnable(false);
      }
    } else {
      if (Object.keys(input).length == 10) {
        setFlag(true);
      }
      if (e.target.value.length == 0) {
        setFlag(false);
      }
    }
    for (const key in input) {
      if (Object.hasOwnProperty.call(input, key)) {
        const element = input[key];
        if ((element && element.length == 0) || element == "") {
          if (activeStep == 0) {
            setEnable(false);
          } else {
            setFlag(false);
          }
        }
      }
    }
  };

  useEffect(() => {
    setInput({ ...input, phonenumber: phonenumber });
  }, [phonenumber]);
  useEffect(() => {
    input.isExternalUrl = managerStatus;
  }, [managerStatus]);


  const handleCountry = (e) => {
    setSelected(e);
    let c = "";
    Object.keys(country).find((data) => (data == e ? (c = country[data]) : ""));
    input.country = c;
    setInput(input);
    setCountryName(c);
  };

  const handleCloseMap = (e) => {
    setOpenMap(false);
  };

  const closeCountryModal = () => {
    setOpen(false);
  };

  const handleCountryName = (c) => {};

  const handleMapValue = (value) => {
    input.direction = value.direction;
    input.postalCode = value.postalCode;
    input.city = value.city;
    input.location = {
      type: "Point",
      coordinates: [value.lng, value.lat],
    };
    setInput(input);
  };

  const handleActivate = (e) => {
    e.preventDefault();
    setactiveStep(1);
  };
  const handleBackstep = (e) => {
    e.preventDefault();
    setactiveStep(0);
  };

  const hadleOpenMap = (e) => {
    e.preventDefault();
    setOpenMap(true);
  };
  const handleTimezone = (e) => {
    setTimeZone(e);
    input.timezone = e;
    setInput(input);

    if (Object.keys(input).length == 10) {
      setFlag(true);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    input.type = "center";
    if (centerAdminLoginStatus === true) {
      input.isCreatedByCenterAdmin = true;
      input.centerId = loginData._id;
    }

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
    if (response && response.data && response.status !== 208) {
      successToaster(t("Sign Up Successfully"));
      setForgot(false);
      dispatch(setEmail(response.data.data.emailAddress));
      dispatch(setCenterData(response.data.data));
      dispatch(setLoginData(response.data.data));
      dispatch(setToken(response.data.data.token));
      let obj={}
      obj=response.data.data
      dispatch(setSelectedLoginCenter(obj))
      setActivate(true);
      // history.push("/otp");
      if (centerAdminLoginStatus === true) {
        history.push("/center/admin/center-management");
      } else {
        // history.push('/center/center-details')
      }
    } else {
      errorToaster(response.data.error.message);
    }
  };
  return (
    <Container style={{ marginTop: "100px" }}>
      <Wrapper className="center-signup">
        <Helmet title="CenterRegistration" />
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          {t("Get started")}
        </Typography>
        {/* <Typography component="h2" variant="body1" align="center">
        Start creating the best possible user experience for you customers
      </Typography> */}
        <Stepper alternativeLabel activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form className="centers">
          {activeStep == 0 ? (
            <>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="name">{t("Center Name")}</InputLabel>
                <Input
                  id="name"
                  name="name"
                  autoFocus
                  value={input.name}
                  onChange={(e) => handleInput(e)}
                  className="registration_input"
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                {/* <InputLabel htmlFor="Country">Country</InputLabel> */}
                {/* <InputLabel htmlFor="Country">Country</InputLabel>
              <Input
                id="country"
                name="country"
                value={countryName}
                name="country"
                onClick={(e) => handleCountry(e)}

              /> */}
                <ReactFlagsSelect
                  selected={selected}
                  searchable
                  onSelect={(e) => handleCountry(e)}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">{t("Email Address")}</InputLabel>
                <Input
                  name="emailAddress"
                  id="email"
                  value={input.emailAddress}
                  onChange={(e) => handleInput(e)}
                  autoComplete="emailAddress"
                  className="registration_input"
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

                {/* <InputLabel htmlFor="phonenumber">Phonenumber</InputLabel>
                <Input
                  name="phonenumber"
                  id="phonenumber"
                  value={input.phonenumber}
                  onChange={(e) => handleInput(e)}
                  autoComplete="phonenumber"
                /> */}
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">{t("Password")}</InputLabel>
                <Input
                  name="password"
                  type="password"
                  id="password"
                  value={input.password}
                  onChange={(e) => handleInput(e)}
                  autoComplete="current-password"
                  className="registration_input"
                />
              </FormControl>

              {enable ? (
                <Button
                  component={Link}
                  style={{ backgroundColor: "#D61C38", color: "white" }}
                  onClick={(e) => handleActivate(e)}
                  // to="/"
                  fullWidth
                  variant="contained"
                  color="primary"
                  mt={3}
                >
                  {t("Next")}
                </Button>
              ) : (
                <Button
                  // component={Link}
                  // onClick={(e) => handleActivate(e)}
                  disabled
                  // to="/"
                  fullWidth
                  variant="contained"
                  // color="primary"
                  mt={3}
                >
                  {t("Next")}
                </Button>
              )}
              <Button
                component={Link}
                // onClick={(e) => handleA(e)}
                style={{ backgroundColor: "#D61C38", color: "white" }}
                to="/"
                fullWidth
                variant="contained"
                color="primary"
                mt={2}
              >
                {t("Return")}
              </Button>
            </>
          ) : (
            <div>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="direction">{t("Direction")}</InputLabel>
                <Input
                  name="direction"
                  onClick={hadleOpenMap}
                  value={
                    input.direction && input.direction.length > 0
                      ? input.direction
                      : ""
                  }
                  defaultValue={""}
                  id="direction"
                  onChange={(e) => handleInput(e)}
                  autoComplete="direction"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        // onClick={() => handleOpen()}
                        // onClick={handleClickShowPassword}
                        // onMouseDown={handleMouseDownPassword}
                      >
                        <img
                          onClick={hadleOpenMap}
                          src={
                            "https://savetime-image.s3.eu-west-3.amazonaws.com/map-ab166169-15d4-40db-873d-62b370757685.png"
                          }
                          width="25px"
                          height="25px"
                        />
                        {/* {values.showPassword ? <Visibility /> : <VisibilityOff />} */}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                {/* <InputLabel htmlFor="Timezone">Timezone</InputLabel> */}
                {/* <TimezonePicker
                absolute={false}
                defaultValue="Europe/Moscow"
                placeholder="Select timezone..."
                onChange={(e) => handleInput(e)}
                /> */}
                <SelectTimezoneMaterialUi
                  label={t("Timezone")}
                  helperText="Please select a timezone from the list"
                  showTimezoneOffset={true}
                  onChange={(e) => handleTimezone(e)}
                  value={timezone}
                  defaultValue={""}
                  // defaultTimezoneName={loginData.timezone}
                  
                />
                {/* <Input
                name="timezone"
                value={input.timezone && input.timezone.length > 0 ? input.timezone : ""}
                defaultValue={""}
                onChange={(e) => handleInput(e)}
                id="timezone"
                autoComplete="timezone"
              /> */}
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="City">{t("City")}</InputLabel>
                <Input
                  id="City"
                  name="city"
                  value={input.city && input.city.length > 0 ? input.city : ""}
                  defaultValue={""}
                  onChange={(e) => handleInput(e)}
                  className="registration_input"
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="postalCode">{t("Postal Code")}</InputLabel>
                <Input
                  id="postalCode"
                  name="postalCode"
                  autoComplete="postalCode"
                  value={
                    input.postalCode && input.postalCode.length > 0
                      ? input.postalCode
                      : ""
                  }
                  defaultValue={""}
                  onChange={(e) => handleInput(e)}
                  className="registration_input"
                />
              </FormControl>
              <TextField
                id="standard-start-adornment"
                className="name-field"
                // name="pinCode"
                value=""
                // onChange={(e) => handleInput(e)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {t("You have appinment Manager")}
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <Switch
                      onChange={(e) => setManagerStatus(e.target.checked)}
                      checked={managerStatus}
                      //props.updateworker.active==true ? true :
                      // onChange={handleChange}
                      name="active"
                      inputProps={{ "aria-label": "secondary checkbox" }}
                    />
                  ),
                }}
              />
              {managerStatus == true ? (
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="externalUrl">
                    {t("Appoinment manager Link")}
                  </InputLabel>
                  <Input
                    id="externalUrl"
                    name="externalUrl"
                    autoComplete="externalUrl"
                    value={
                      input.externalUrl && input.externalUrl.length > 0
                        ? input.externalUrl
                        : ""
                    }
                    defaultValue={""}
                    onChange={(e) => handleInput(e)}
                    className="registration_input_center"
                  />
                </FormControl>
              ) : null}
              {flag ? (
                <Button
                  component={Link}
                  onClick={(e) => handleSubmit(e)}
                  to="/"
                  fullWidth
                  variant="contained"
                  style={{ backgroundColor: "#D61C38", color: "white" }}
                  // color="primary"
                  mt={2}
                >
                  {t("Sign up")}
                </Button>
              ) : (
                <Button
                  component={Link}
                  // onClick={(e) => handleSubmit(e)}
                  // to="/"
                  disabled
                  fullWidth
                  variant="contained"
                  color="primary"
                  mt={2}
                >
                  {t("Sign up")}
                </Button>
              )}
              <Button
                component={Link}
                onClick={(e) => handleBackstep(e)}
                // to="/"
                fullWidth
                variant="contained"
                className="next-btn"
                // color="primary"
                mt={2}
              >
                {t("Go Back")}
              </Button>
            </div>
          )}
        </form>

        {open && (
          <CountryModal
            open={open}
            closeCountryModal={closeCountryModal}
            handleCountryName={handleCountryName}
          />
        )}

        {openMap && (
          <MapModal
            openMap={openMap}
            handleCloseMap={handleCloseMap}
            handleMapValue={handleMapValue}
            countryName={countryName}
          />
        )}

        {activate && <Activation activate={activate} managerStatus={managerStatus}/>}
      </Wrapper>
    </Container>
  );
}

export default CenterRegistration;
