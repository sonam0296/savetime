import { Grid, Button, TextField, InputAdornment } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Header from "../CenterAdminHeader/CenterAdminHeader";
import "./TaxData.css";
import instance from "../../../axios";
import requests from "../../../requests";
import { useDispatch, useSelector } from "react-redux";
import {
  setTaxData,
  setWorkerLoginStatus,
} from "../../../redux/actions/actions";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { errorToaster, successToaster } from "../../../common/common";

const TaxData = () => {
  const { t } = useTranslation();
  const language = useSelector((state) => state.language);
  const token = useSelector((state) => state.token);
  const logincenterToken = useSelector(
    (state) => state.selectedLoginCenter.token
  );
  const selectedLoginCenter = useSelector((state) => state.selectedLoginCenter);
  const TaxData = useSelector((state) => state.setTaxData);
  const [getComanyDetails, setGetComanyDetails] = useState({})
  const history = useHistory();
  const dispatch = useDispatch();
  const [taxData, setTax] = useState({});
  const [flag, setflag] = useState(true)

  useEffect(() => {
    GetTaxDetails();
    dispatch(setWorkerLoginStatus(false));
  }, []);

  useEffect(() => {
      console.log(getComanyDetails,'getComanyDetails')
    if (Object.keys(getComanyDetails).length > 0) {
        taxData.City=getComanyDetails.City
        taxData.PostalCode=getComanyDetails.PostalCode
        taxData.compneyName=getComanyDetails.compneyName
        taxData.country=getComanyDetails.country
        taxData.telephone=getComanyDetails.telephone
        taxData.direction=getComanyDetails.direction
        taxData["NIE/NRF/NRT"] = getComanyDetails["NIE/NRF/NRT"]
        
        setflag(false)
        // setTax(taxData)
    //   setTax(getComanyDetails);
    }
  }, [getComanyDetails]);

  useEffect(() => {
      if(flag==false){
          setflag(true)
      }
    
  }, [flag])

  const handleInput = (e) => {
    setTax({
      ...taxData,
      [e.target.name]: e.target.value,
    });
  };

  const GetTaxDetails = async (e) => {
    // let APIbody = {};
    const response = await instance
      .get(
        `${requests.fetchGetCompanyDetails}/${selectedLoginCenter._id}?lang=${language}`,
        {
          headers: {
            Authorization: `Bearer ${logincenterToken}`,
          },
        }
      )
      .catch((error) => {
        let errorMessage = "";
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error.message;
        } else {
          errorMessage = error.response.data.message;
        }
      });
    if (response && response.data) {
        if(response.data?.data[0]?.companeyData?.length>0){

            setGetComanyDetails(response.data?.data[0]?.companeyData[0])
        }
      // dispatch(setTaxData(response.data.data[0]))
    }
  };

  const updateTaxData = async (e) => {
    taxData.centerId=selectedLoginCenter._id
    const response = getComanyDetails._id ?
    await instance.put(`${requests.fetchUpdateCompany}/${getComanyDetails._id}?lang=${language}`,taxData,{
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
        errorToaster(errorMessage)
      })
      .then(()=>{
          successToaster("Company Details Updated!!")
      })      
      :
    await instance
      .post(`${requests.fetchAddCompany}?lang=${language}`, taxData, {
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
        errorToaster(errorMessage)
      })
      .then(()=>{
        successToaster("Company Data Created!!")
      })
    if (response && response.data) {
      // setTax(response.data.data)
      GetTaxDetails()
      dispatch(setTaxData(response.data.data[0]));
    }
  };
  return (
    <>
      <div className="mainPage-container">
        <Header title={t("Tax Data")} />

        <Grid
          container
          style={{
            marginTop: "80px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* <Grid className="div-1" item xs={12} sm={12} md={6} lg={6} xl={6} > */}
          <div>
            <div className="field">
              <TextField
                fullWidth
                name="compneyName"
                id="standard-start-adornment"
                className="text-field"
                onChange={(e) => handleInput(e)}
                value={taxData.compneyName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {t("Company Name")} :
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="field">
              <TextField
                fullWidth
                name="NIE/NRF/NRT"
                id="standard-start-adornment"
                className="text-field"
                onChange={(e) => handleInput(e)}
                value={taxData["NIE/NRF/NRT"]}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      NIE/NIF/NRT :
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="field">
              <TextField
                fullWidth
                name="telephone"
                id="standard-start-adornment"
                className="text-field"
                onChange={(e) => handleInput(e)}
                value={taxData.telephone}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {t("Phone")} :
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="field">
              <TextField
                fullWidth
                name="country"
                id="standard-start-adornment"
                className="text-field"
                onChange={(e) => handleInput(e)}
                value={taxData.country}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {t("Country")} :
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="field">
              <TextField
                fullWidth
                name="City"
                id="standard-start-adornment"
                className="text-field"
                onChange={(e) => handleInput(e)}
                value={taxData.City}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {t("City")} :
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="field">
              <TextField
                fullWidth
                name="direction"
                id="standard-start-adornment"
                className="text-field"
                onChange={(e) => handleInput(e)}
                value={taxData.direction}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {t("Address")} :
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="field">
              <TextField
                fullWidth
                name="PostalCode"
                id="standard-start-adornment"
                className="text-field"
                onChange={(e) => handleInput(e)}
                value={taxData.PostalCode}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {t("Postal Code")} :
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <div className="worker-btn">
              <Button
                variant="contained"
                style={{ backgroundColor: "#D61C38", color: "white" }}
                onClick={() => {
                  history.push("/center/admin/dashboard");
                }}
              >
                {t("Return")}
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: "#00AD22", color: "white" }}
                onClick={(e) => updateTaxData(e)}
              >
                {t("Following")}
              </Button>
            </div>
          </div>
          {/* </Grid> */}
        </Grid>
      </div>
    </>
  );
};
export default TaxData;
