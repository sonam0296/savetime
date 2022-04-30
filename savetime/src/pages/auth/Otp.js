import React, { useState } from 'react';
import OtpInput from 'react-otp-input';

import Grid from '@material-ui/core/Grid';
import './otp.css'
import { useToasts } from 'react-toast-notifications';
import { Button } from '@material-ui/core';
import instance from '../../axios';
import requests from '../../requests';
import { setOtp } from '../../redux/actions/actions'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router';
import {
  successToaster,
  errorToaster
} from '../../common/common'
import { useTranslation } from 'react-i18next';

function Otp(props) {
  const {t} = useTranslation();
  const language = useSelector(state => state.language)
  const [otp, setOTP] = useState("");
  const { addToast } = useToasts();
  const history = useHistory();
  const [show, setShow] = useState(false)
  const state = useSelector(state => state.email)
  const dispatch = useDispatch();
  const forgot = useSelector(state => state.forgot)
  const handleChange = (e) => {
    setOTP(e)
  }
  const handleVerify = async (e) => {
    const bodyAPI = {
      "emailAddress": state,
      "otp": otp
    }
    const response = await instance.post(`${requests.fetchVerifyOtp}?lang=${language}`, bodyAPI)
      .catch(
        (error) => {
          let errorMessage = error.response.data.error.message
          errorToaster(errorMessage)
        }
      )
    if (response) {
      setShow(true)
      dispatch(setOtp(otp))
      successToaster(t('Successfully Verified'))
      if (forgot) {
        history.push("/auth/change-password")
      } else {
        history.push("/client/maindashboard")
      }
    }
  }
  return (
    <>
      <div className="otp-data">
        <div className="otp-box" >
          {
            !show ? (<div className="otp-item"   >
              <h3 className="otp-heading" >{t("Verify Your One Time Passcode")}</h3>
              <OtpInput
                value={otp}
                name="otp"
                onChange={(e) => handleChange(e)}
                numInputs={6}
                separator={<span>-</span>}
              />
              <div>
                <Button variant="contained" className='otp-verify-btn'
                  onClick={() => handleVerify()}
                >{t("Verify")}</Button>
              </div>
            </div>) : <h1>{t("Your are verified")}</h1>
          }
        </div>
      </div>
      <div className="otp-back" >
      </div>
    </>
  );
}
export default Otp;
