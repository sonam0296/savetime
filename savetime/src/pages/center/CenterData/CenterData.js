import {
  Button,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ReactFlagsSelect from "react-flags-select";
import { useTranslation } from "react-i18next";
import "react-phone-number-input/style.css";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import { useDispatch, useSelector } from "react-redux";
import SelectTimezoneMaterialUi from "select-timezone-material-ui";
import "./centerData.css";
import Switch from "@material-ui/core/Switch";
import country from "../../../helper/countries.json";
import MapModal from "../../../Modal/MapModal";
import CenterAdminHeader from "../../center-admin/CenterAdminHeader/CenterAdminHeader";
import Header from "../../../components/Header";
import instance from "../../../axios";
import requests from "../../../requests";
import { errorToaster, successToaster } from "../../../common/common";
import { setLoginData, setSelectedCategory } from "../../../redux/actions/actions";
import { useHistory } from "react-router-dom";

function CenterData() {
  const {t} = useTranslation();
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
  const history = useHistory();
  const [selected, setSelected] = useState("");
  const [phonenumber, setPhoneNumber] = useState();
  const [state, setState] = useState(false);
  const token = useSelector(state => state.token)
  const logincenterToken = useSelector(state => state.selectedLoginCenter.token)
  const dispatch = useDispatch();

  const [centerAdminHeaderVisible, setCenterAdminHeaderVisible] =
    useState(false);

  const handleInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  // for (var i in Object.keys(country)) {
  //   if (Object.keys(country)[i] == loginData?.country) {
  //     console.log(i,'iiii')
  //   }
  // }
 

  useEffect(() => {
    // setInput(loginData);
    input.name=loginData.name
    input.city=loginData.city
    input.postalCode=loginData.postalCode
    input.emailAddress=loginData.emailAddress
    input.direction=loginData.direction
    input.externalUrl=loginData.externalUrl
    setInput(input)

    setCountryName(loginData.country);

    for (var i in country) {
      if (country[i] === loginData.country) {
        setSelected(i)
         
      }
  }
    setPhoneNumber(loginData.phonenumber);
    setTimeZone(loginData.timezone);
    input.timezone=loginData.timezone

    
    setState(loginData.isExternalUrl);
  }, [loginData]);
  const hadleOpenMap = (e) => {
    e.preventDefault();
    setOpenMap(true);
  };

  const handleTimezone = (e) => {
    setTimeZone(e);
    input.timezone = e;
    setInput(input);
    console.log(e,"eee")

    if (Object.keys(input).length == 10) {
      setFlag(true);
    }
  };

  const handleCountry = (e) => {
      
    setSelected(e);
    let c = "";
    Object.keys(country).find((data) => (data == e ? (c = country[data]) : ""));
    input.country = c;
    setInput(input);
    setCountryName(c);
    console.log(e,'ee')
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

  const handleUpdate = async () =>{


    input.type = undefined
    input.status = undefined
    input.verified = undefined
    input.fcm_registration_token = undefined
    input.stripe_customer = undefined
    input.createdAt = undefined
    input._id = undefined
    input.expireTime=undefined
    input.isExternalUrl= state && state==true ? state : false
    const response = await instance.post(`${requests.fetchUpdateCenter}/${loginData._id}?lang=${language}`, input,
      {
        headers: {
          Authorization: logincenterToken
        }
      }
    ).catch(
      (error) => {
        let errorMessage = error.response.data.message
        errorToaster(errorMessage)
      }
    )

    if (response && response.data) {
      successToaster(t("Center Updated !"))
      dispatch(setSelectedCategory(response.data.data.user.categoryId))
      dispatch(setLoginData(response.data.data.user))
      history.push('/center/centerDataManager')
      // if(e?.target.innerHTML=="Following"){
      //   console.log(e.target.innerHTML)
      //   history.push("/center/services")

      // }
    }
  }

  const handleBackToHome = () =>{
    if(centerAdminLoginStatus === true){
      history.push('/center/admin/dashboard')

    }
  }

  return (
    <div>
      {centerAdminLoginStatus === true && centerAdminHeaderVisible === true ? (
        <CenterAdminHeader title={t("Center Data")} />
      ) : (
        <Header title={t("Center Data")} className="center-header" />
      )}
      <Grid container>
        <Grid item xs={0} sm={0} md={1} lg={1} xl={1}></Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="name">{t("Center Name")}</InputLabel>
            <Input
              id="name"
              name="name"
              autoFocus
              value={input.name}
              onChange={(e) => handleInput(e)}
              className="registration_input_center"
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
            <InputLabel htmlFor="name">{t("City")}</InputLabel>
            <Input
              id="city"
              name="city"
              autoFocus
              value={input.city}
              onChange={(e) => handleInput(e)}
              className="registration_input_center"
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
              className="registration_input_center"
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
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="faceBook">{t("Facebook Link")}</InputLabel>
            <Input
              id="centerFacebookLink"
              name="centerFacebookLink"
              autoComplete="faceBook"
              value={
                input.centerFacebookLink && input.centerFacebookLink.length > 0
                  ? input.centerFacebookLink
                  : ""
              }
              defaultValue={""}
              onChange={(e) => handleInput(e)}
              className="registration_input_center"
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="instaGram">{t("Instagram Link")}</InputLabel>
            <Input
              id="centerInstagramLink"
              name="centerInstagramLink"
              autoComplete="instaGram"
              value={
                input.centerInstagramLink && input.centerInstagramLink.length > 0
                  ? input.centerInstagramLink
                  : ""
              }
              defaultValue={""}
              onChange={(e) => handleInput(e)}
              className="registration_input_center"
            />
          </FormControl>
        </Grid>
        <Grid item xs={0} sm={0} md={2} lg={2} xl={2}></Grid>

        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
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
              className="registration_input_center"
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
              // id="Europe/Andorra (GMT+02:00)"
              // value={timezone && timezone.length>0 ? timezone : loginData?.timezone}
              // defaultValue={timezone}
              // timezoneName="Europe/Andorra (GMT+02:00)"
              defaultTimezoneName={loginData?.timezone}
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
            <InputLabel htmlFor="email">{t("Email Address")}</InputLabel>
            <Input
              name="emailAddress"
              id="email"
              value={input.emailAddress}
              onChange={(e) => handleInput(e)}
              autoComplete="emailAddress"
              className="registration_input_center"
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">{t("Password")}</InputLabel>
            <Input
              name="password"
              type="password"
              id="password"
              value={
                input.password && input.password.length > 0
                  ? input.password
                  : ""
              }
              onChange={(e) => handleInput(e)}
              autoComplete="current-password"
              className="registration_input_center"
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="confirmpassword">
              {t("confirmPassword")}
            </InputLabel>
            <Input
              name="confirmpassword"
              type="confirmpassword"
              id="confirmpassword"
              value={input.confirmPassword}
              onChange={(e) => handleInput(e)}
              autoComplete="current-confirmpassword"
              className="registration_input_center"
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
                  onChange={(e) => setState(e.target.checked)}
                  checked={state}
                  //props.updateworker.active==true ? true :

                  name="active"
                  inputProps={{ "aria-label": "secondary checkbox" }}
                />
              ),
            }}
          />
        {
          state==true ? (
            <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="managerLink">
              {t("managerLink Link")}
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
          ) : null
        }
         
        </Grid>
        {openMap && (
          <MapModal
            openMap={openMap}
            handleCloseMap={handleCloseMap}
            handleMapValue={handleMapValue}
            countryName={countryName}
          />
        )}
        <Grid item xs={0} sm={0} md={1} lg={1} xl={1}></Grid>
      </Grid>
      <Grid container style={{ marginTop: "6rem", width: "100%" }}>
        <Grid item xs={0} sm={0} md={1} lg={1} xl={1}></Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={5}
          lg={5}
          xl={5}
          className="centerDetails_return_item"
        >
          <Button
            variant="contained"
            className="centerDetails_returnBtn"
            onClick={(e) => handleBackToHome(e)}
          >
            {t("Return")}
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={5}
          lg={5}
          xl={5}
          className="centerDetails_following_item"
        >
          <Button
            variant="contained"
            className="centerDetails_following2"
            onClick={(e)=>handleUpdate(e)}
          >
            {t("Save")}
          </Button>
        </Grid>
        <Grid item xs={0} sm={0} md={1} lg={1} xl={1}></Grid>
      </Grid>
    </div>
  );
}

export default CenterData;
