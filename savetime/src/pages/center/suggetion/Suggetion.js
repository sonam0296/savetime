import { Button, Dialog, DialogContent, DialogContentText, Grid, InputAdornment, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import instance from "../../../axios";
import { errorToaster, successToaster } from "../../../common/common";
import requests from "../../../requests";
import "./suggetion.css";
import Header from "../../../components/Header";

function Suggetion() {
  const [input, setInput] = useState({});
  const { t } = useTranslation();
  const language = useSelector(state => state.language)
  const token = useSelector((state) => state.token);
  const logincenterToken = useSelector(state => state.selectedLoginCenter.token)
  const [popup, setPopup] = useState(false)
  const [activeButton, setActiveButton] = useState(false)
  const history = useHistory();

  const handelChange = async (e) => {
    e.preventDefault();
    setInput({ ...input, [e.target.name]: e.target.value });
    if(Object.keys(input).length>2){
      setActiveButton(true)
    }
  };

  const handleGoBack = ()=>{
    history.push("/center/center-details")
  }
  const handleSend = async ()=>{
      setPopup(true)
    const response = await instance
    .post(`${requests.fetchSendSuggetion}?lang=${language}`, input, {
      headers: {
        Authorization: token,
      },
    })
    .catch((error) => {
      let errorMessage = error.response.data.message;
      errorToaster(errorMessage);
      console.log(error);
    });
  if (response && response.data) {
    // dispatch(setLoginData(response.data.data.user))
    // dispatch(setUserId(response.data.data.user._id));
    successToaster(t("Suggetion Send"));
  }
  }

  const handleOkayPopupClose =()=>{
      history.push("/center/center-details")
      setPopup(false)
  }
  const handleClose =()=>{
     
      setPopup(false)
  }
  return (
    <div>
        <Header title={t("Suggetions")}/>
      <Grid container style={{ marginTop: "8rem" }}>
        <Grid item xs={0} sm={0} md={2} lg={2} xl={2}></Grid>
        <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
          <TextField
            id="standard-start-adornment"
            name="name"
            value={input.name}
            onChange={(e) => handelChange(e)}
            className="name-field-suggestion"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {t("Name and Surname")}
                </InputAdornment>
              ),
            }}
          />
          {/* <TextField
            id="standard-start-adornment"
            name="emailAddress"
            value={input.emailAddress}
            onChange={(e) => handelChange(e)}
            className="name-field-suggestion"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {t("emailAddress")}
                </InputAdornment>
              ),
            }}
          /> */}
          <TextField
            id="standard-start-adornment"
            name="affair"
            value={input.affair}
            onChange={(e) => handelChange(e)}
            className="name-field-suggestion"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">{t("Affair")}</InputAdornment>
              ),
            }}
          />
          <TextField
            id="standard-start-adornment"
            name="suggestion"
            value={input.suggestion}
            onChange={(e) => handelChange(e)}
            className="name-field-suggestion"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {t("Suggestions")}
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={0} sm={0} md={2} lg={2} xl={2}></Grid>
      </Grid>
      <div className="main-btns">
          <div>
            <button className="goBackBtn" 
            onClick={() => handleGoBack()}
            >
              {t("Go Back")}
            </button>
          </div>
          <div>
            {
              activeButton==true ?
              (
                <Button 
                
                className="cancleAppoinment1"
                onClick={() => handleSend()}
                >
                   {t("Send")}
                </Button>
              ) :
               (
                <Button 
                disabled
                className="cancleAppoinment1"
                 onClick={() => errorToaster("Please Enter All Fields..!!")}
                 >
                    {t("Send")}
                 </Button>
              )
            }
            {/* <button disabled
              className="cancleAppoinment1"
              onClick={()=>errorToaster("Please Fill All Fields")}
              // onClick={() => handleSend()}
            >
              {t("Send")}
            </button> */}
          </div>
        </div>

        <div>
        <Dialog
          // className={classes.dialogPaper}
          //   fullWidth={fullWidth}
          //   maxWidth={maxWidth2}
          open={popup}
          onClose={handleClose}
          aria-labelledby="max-width-dialog-title"
        >
          {/* <DialogTitle id="max-width-dialog-title">Optional sizes</DialogTitle> */}
          <DialogContent>
            <DialogContentText>
              <div
                style={{
                  margin: "30px 78px",
                  marginTop: "37px",
                  marginBottom: " 35px",
                  textAlign: "center",
                  color: "#00ad22",
                  fontSize: "19px",
                }}
              >
               {t("Your suggestion has been sent successfully, thank you very much for collaborating with us")}
              </div>
            </DialogContentText>
            <div
              style={{
                textAlign: "center",
                margin: "30px 67px",
                fontSize: " 19px",
                color: "#00ad22",
              }}
            >
             {t("We will take note of your suggestion and apply it as far as possible.")}
            </div>
          </DialogContent>
          <Grid container style={{ justifyContent: "space-evenly" }}>
            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              {" "}
              <Button
                style={{
                  width: "120px",
                  height: "30px",
                  border: "2px solid black",
                  borderRadius: "20px",
                  backgroundColor: "#00ad22",
                  color: "white",
                  marginBottom: "5px",
                }}
                onClick={handleOkayPopupClose}
                color="primary"
              >
                {t("okay")}
              </Button>
            </Grid>
          </Grid>
        </Dialog>
      </div>
    </div>
  );
}

export default Suggetion;
