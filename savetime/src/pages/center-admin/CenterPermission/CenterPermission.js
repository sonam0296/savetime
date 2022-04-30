import React, { useState } from "react";
import { AppBar, Button, Grid } from "@material-ui/core";
import "./CenterPermission.css";
import Header from "../../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import requests from "../../../requests";
import instance from "../../../axios";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  setLoginData,
  setSelectedCategory,
} from "../../../redux/actions/actions";
import { successToaster } from "../../../common/common";
const CenterPermission = () => {
  const { t } = useTranslation();
  const language = useSelector((state) => state.language);
  const token = useSelector((state) => state.token);
  const logincenterToken = useSelector(state => state.selectedLoginCenter.token)
  const loginData = useSelector((state) => state.loginData);
  const permissionData = useSelector((state) => state.loginData.permissions);
  const [permissions, setpermissions] = useState(permissionData);
  const [center, setCenter] = useState({
    centerId: loginData._id,
  });
  const dispatch = useDispatch();
  const [flag, setFlag] = useState(null);
  const history = useHistory();

  const updateBoolean = (item, i) => {
    setFlag(i);
    Object.keys(permissions).forEach((data) => {
      if (data == item) {
        if (permissions[data] == true) {
          permissions[data] = false;
        } else {
          permissions[data] = true;
        }
      }
    });
    setpermissions({ ...permissions });
  };
  const updatePermission = async () => {
    let body = {
      permissions: permissions,
    };
    try {
      const response = await instance.post(
        `${requests.fetchUpdateCenter}/${loginData._id}?lang=${language}`,
        body,
        {
          headers: {
            Authorization: logincenterToken,
            "Content-Type": "application/json",
          },
        }
      );
      if (response && response.data) {
          successToaster(t("Center Permissions Updated!"))
        setCenter(response.data.data);
        dispatch(setSelectedCategory(response.data.data.user.categoryId));
        dispatch(setLoginData(response.data.data.user));
        // dispatch()
      }
      history.push('/center/admin/dashboard')
    } catch (err) {}
  };
  return (
    <>
      <div className="mainPage-container">
        <Header title={t("Center Permission")} />

        <Grid
          container
          style={{
            marginTop: "40px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column"
          }}>
            {Object.keys(permissions).map((item, i) => (
              //    loginData.permissions && loginData.permissions.map((data)=> (
              <div>
                <Button
                  className={
                    permissions[item] == true
                      ? "serviceButton"
                      : "serviceButton2"
                  }
                  onClick={() => updateBoolean(item, i)}
                >
                  {item == "centerData"
                    ? t("Center Data")
                    : item == "accessTOAdmin"
                    ? t("Access To Admin")
                    : item == "actualSubscription"
                    ? t("Actual Subscription")
                    : item == "centerImages"
                    ? t("Center Images")
                    : item == "clientFile"
                    ? t("Client File")
                    : item == "dayManagement"
                    ? t("Day Management")
                    : item == "emergencyCancellation"
                    ? t("Emergency Cancellation")
                    : item == "fiscalData"
                    ? t("Fiscal Data")
                    : item == "moreCenters"
                    ? t("More Centers")
                    : item == "permissionToWorkers"
                    ? t("Permission To Workers")
                    : item == "registryOfInternalActions"
                    ? t("Registry Of Internal Action")
                    : item == "services"
                    ? t("Services")
                    : null}
                </Button>
              </div>
            ))}
            <div className="worker-btn-permission">
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#D61C38",
                  color: "white",
                  width: "181px",
                  height: "45px",
                  borderRadius: "30px",
                  fontSize: "20px",
                  border:'2px solid black'
                }}
                onClick={() => {
                  history.push("/center/admin/dashboard");
                }}
              >
                {t("Return")}
              </Button>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#00AD22",
                  color: "black",
                  width: "181px",
                  height: "45px",
                  borderRadius: "30px",
                  fontSize: "20px",
                  border:'2px solid black'
                }}
                onClick={() => updatePermission()}
              >
                {t("Following")}
              </Button>
            </div>
          </div>
        </Grid>
      </div>
    </>
  );
};

export default CenterPermission;
