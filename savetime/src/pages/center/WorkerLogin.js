import React, { useEffect, useState } from "react";
import "./workerLogin.css";
import { useDispatch, useSelector } from "react-redux";
import requests from "../../requests";
import instance from "../../axios";
import { errorToaster, successToaster } from "../../common/common";
import { useHistory } from "react-router-dom";
import { Grid } from "@material-ui/core";
import Header from "../../components/Header";
import { setWorkerLoginStatus } from "../../redux/actions/actions";
import OtpInput from "react-otp-input";
import { useTranslation } from "react-i18next";

function WorkerLogin() {
  const {t} = useTranslation();
  const language = useSelector(state => state.language)
  const selectedWorkerData = useSelector((state) => state.selectedWorkerData);
  const [input, setInput] = useState({});
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const [password, setPassword] = useState('')
  const logincenterToken = useSelector(state => state.selectedLoginCenter.token)

  const handlePassword = (e) => {
    e.preventDefault();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (password.length > 3) {
      handleSubmit();
    }
  }, [password]);


  useEffect(() => {
    dispatch(setWorkerLoginStatus(false))
    
  }, [])


  const handleSubmit = async () => {
    // const otp = `${input.one}${input.two}${input.three}${input.four}`;
    let obj = {
      workerId: selectedWorkerData._id,
      pinCode: password,
    };

   
    // this.setState({ otp });

    const response = await instance
      .post(`${requests.fetchWorkerLogin}?lang=${language}`, obj, {
        headers: {
          Authorization: logincenterToken,
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
      successToaster(t("Login Successful"));
      dispatch(setWorkerLoginStatus(true));
      history.push("/center/main-page");
    }
  };

  const handleChange = (e) => {
    setPassword(e)
  } 

  const handleAddminstator =()=>{
    
    history.push("/center/admin-login")
  }

  return (
    <div>
      <Header title={t("Enter the Pin Code")} />
      <Grid container className="workerloginmaindiv">
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          className="wrk_subDiv"
        >
          <img
            className="workerimg"
            src={
              selectedWorkerData.image.length > 0
                ? selectedWorkerData.image
                : `https://savetime-image.s3.amazonaws.com/585e4bf3cb11b227491c339a-c3f595ec-ff9b-43a4-840c-3db60fa86041.png`
            }
          />
          <h2>
            {selectedWorkerData.name} {selectedWorkerData.lastname}
          </h2>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          className="inputNumDiv"
        >
          <OtpInput
          className="inputNum"
            value={password}
            onChange={(e)=>handleChange(e)}
            numInputs={4}
            // separator={<span>-</span>}
          />
          {/* <form onSubmit={handleSubmit}> */}
          
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <button onClick={()=>handleAddminstator()} className="addministator">{t("Addministrator")}</button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default WorkerLogin;
