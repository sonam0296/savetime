import React, { useEffect, useState, lazy, Suspense } from 'react'
import requests from '../../requests'
import instance from '../../axios'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ToastProvider, useToasts } from 'react-toast-notifications';
import { setCenterData } from '../../redux/actions/actions'
import { Paper, Button, Grid, Typography } from '@material-ui/core';
import './activate.css'
import {
  successToaster,
  errorToaster
} from '../../common/common'
import { useTranslation } from 'react-i18next'
function Activate(props) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const handleBack = () => {
    history.push("/center/center-details")
  }

  useEffect(() => {
    const activation = async () => {

      const token = props.match.params.token;
      const url = requests.fetchActivation
      const req = url.concat(token)
      const response = await instance.get(req)
        .catch(
          (error) => {
            let errorMessage = error.response.data.error.message
            errorToaster(errorMessage)
          }
        )
      if (response && response.data && response.data.data) {
        dispatch(setCenterData(response.data.data.user))
        successToaster(t("Your Account is Activated"))
      }
    }
    activation();
  }, [])

  return (
    <div>
      {
        <Grid>

          <Paper className="activate" >
            <div className="activate-logo" >
              <img
                src={"https://savetime-image.s3.eu-west-3.amazonaws.com/savetimelogo-178dfaf7-1ccd-4fe8-b473-82c09333bd87.png"}
                className="logo"
              />
            </div>
            <Typography className="activate-text" >
              {t("Welcome to SaveTime")}
                </Typography>
            <Button className="activate-btn"
              onClick={() => handleBack()}
              variant="contained"
              color="primary"
              mt={2}
              variant="contained" color="secondary"
            >
              {t("Back To Home")}
                </Button>
          </Paper>

        </Grid>
      }
    </div>
  )
}

export default Activate;
