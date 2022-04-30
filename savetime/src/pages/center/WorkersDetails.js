import React, { useEffect, useState } from "react";
import "./workerDetails.css";
import instance from "../../axios";
import requests from "../../requests";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { setCenterWorkerList, setSelectedWorkerData, setWorkerLoginStatus } from "../../redux/actions/actions";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";

function WorkersDetails() {
  const { t } = useTranslation();
  const language = useSelector(state => state.language)
  const token = useSelector((state) => state.token);
  const logincenterToken = useSelector(state => state.selectedLoginCenter.token)
  const centerId = useSelector((state) => state.loginData._id);
  const [workerList, setWorkerList] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch()
  const workerLoginStatus = useSelector((state)=> state.workerLoginStatus);

  useEffect(() => {
    getWorkers();
    dispatch(setWorkerLoginStatus(false))
  }, []);

  const getWorkers = async () => {
    try {
      const responce = await instance.get(
        `${requests.fetchGetWorkers}/${centerId}?lang=${language}`,
        {
          headers: {
            Authorization: logincenterToken,
            "Content-Type": "application/json",
          },
        }
      );
      if (responce && responce.data) {
        setWorkerList(responce.data.data);
        dispatch(setCenterWorkerList(responce.data.data))
      }
    } catch (err) {
      console.log(err, "getworker err");
    }
  };

  const handleWorkerLogin = (e, item) => {
    dispatch(setSelectedWorkerData(item))
    if (workerLoginStatus === false) {
      history.push("/center/workerlogin")
    }
    else {
      history.push("/center/main-page")
    }
  }
  const handleAddminstator = () => {

    history.push("/center/admin-login")
  }
  return (
    <div>
      <Header title={t("Select Worker")} />
      <div>
        <h1 className="title">{t("Select worker with whom you want to operate")}</h1>
      </div>
      <div className="workermaindiv">
        {workerList.map((item) => {
          let workerData = {
            _id: item._id,
            name: item.name,
            lastName: item.lastname,
            image: item.image,
            pinCode: item.pinCode,
          }
          return (
            <div onClick={(e) => handleWorkerLogin(e, workerData)} className="wrk_subDiv">
              <img className="workerimg" src={item.image.length > 0 ? item.image : `https://savetime-image.s3.amazonaws.com/585e4bf3cb11b227491c339a-c3f595ec-ff9b-43a4-840c-3db60fa86041.png`} />
              <h3>{item.name} {item.lastName}</h3>
            </div>
          )
        })}


      </div>
      <div>
        <button onClick={() => handleAddminstator()} className="addministator">{t("Addministrator")}</button>
      </div>
    </div>
  );
}

export default WorkersDetails;
