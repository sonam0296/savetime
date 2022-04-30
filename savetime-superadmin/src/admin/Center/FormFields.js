import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, Grid, InputAdornment } from '@material-ui/core';
import requests from '../../requests';
import { connect, useSelector, useDispatch } from 'react-redux';
import instance from '../../axios';
import Img from "./img.png"
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import './FormFields.css'
import { Link, useHistory } from 'react-router-dom'
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { successToaster } from '../../common/common';

let token = null

const mapStateToProps = (state) => {
  token = state.token;
}


const FormFields = () => {

  const editCenterData = useSelector((state) => state.editCenterData)
  const [centers, setCenters] = useState({
    uniqueId: editCenterData.uniqueId,
    emailAddress: editCenterData.emailAddress,
    phonenumber: editCenterData.phonenumber,
    country: editCenterData.country,
    city: editCenterData.city,
    direction: editCenterData.direction,
    postalCode: editCenterData.postalCode,
    name: editCenterData.name,
    workerCount: editCenterData.workerCount,
    image: editCenterData.image,
    workerList: editCenterData.workerList,
    categories: editCenterData.categories,
    active: editCenterData.active,
    categoryList: editCenterData.categoryList
  });
  const dispatch = useDispatch()
  const history = useHistory()
  const [state, setState] = React.useState({
    gilad: true,
    jason: false,
    antoine: true,
  });

  const handleChange = (event) => {
    setCenters({ ...centers, [event.target.name]: event.target.checked });
  };
  const onInputChange = (e) => {
    setCenters({
      ...centers,
      [e.target.name]: e.target.value
    });
  };

  const onUpdate = async () => {
    let body = {
      emailAddress: centers.emailAddress,
      phonenumber: centers.phonenumber,
      city: centers.city,
      direction: centers.direction
    }
    const response = await instance.post(`${requests.fetchUpdateCenter}/${editCenterData._id}`, body, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
    successToaster("Center updated successfully")
    console.log(response, "res")
  }

  const onNormalService = async () => {
    history.push('/admin/normalService')
    // console.log(response, "res")
  }

  const onCollectiveService = async () => {

    history.push('/admin/collectiveService')
    // console.log(response, "res")
  }

  const onInterlevedService = async () => {

    history.push('/admin/interleveldService')
    // console.log(response, "res")
  }

  return (
    <>
      <div className="container" style={{ marginTop: '100px' }}>
        <div style={{ textAlign: 'center' }}>
          <FormControl>
            <FormGroup>
              <FormControlLabel
                label="Active"
                control={<Switch checked={centers.active} onChange={(event) => handleChange(event)} name="active" />}
              />
            </FormGroup>
          </FormControl>
        </div>
        <div className="row">
          <div className="col-lg-6 col-md-4 col-sm-2">
            <div>
              <div className="row">
                {
                  console.log(process.env.REACT_APP_DEFAULT_IMAGE)
                }
                <div className="col-lg-3 col-md-6 col-sm-9">
                  <img
                    src={centers.hasOwnProperty("image") && centers.image !== "" ?
                      centers.image : process.env.REACT_APP_DEFAULT_IMAGE}
                    // src={centers.hasOwnProperty("image") ? centers.image !== "" ?
                    //  centers.image : process.env.REACT_APP_DEFAULT_IMAGE : 
                    //  process.env.REACT_APP_DEFAULT_IMAGE }
                    width="100px" height="100px"
                    style={{ marginLeft: '40px', borderRadius: '50%' }}
                  />
                </div>
                <div className="col-lg-3 col-md-6 col-sm-9" style={{ margin: '30px' }}>
                  <FormControl>
                    <TextField
                      id="standard-start-adornment"
                      required
                      name="name"
                      // value={input.name}
                      // onChange={(e) => onInputChange(e)}
                      //   className={classes.sideField}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">No. : </InputAdornment>,
                      }}
                    />
                  </FormControl>
                  <FormControl>
                    <TextField
                      id="standard-start-adornment"
                      required
                      name="name"
                      value={centers.uniqueId}
                      onChange={(e) => onInputChange(e)}
                      //   className={classes.sideField}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">ID. : </InputAdornment>,
                      }}
                    />
                  </FormControl>
                </div>
              </div>
            </div>
            <div style={{ margin: '20px' }}>
              <h2>{centers.name}</h2>
            </div>
            <div className="rightText">
              <FormControl>
                <TextField
                  id="standard-start-adornment"
                  required
                  name="emailAddress"
                  value={centers.emailAddress}
                  onChange={(e) => onInputChange(e)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Email : </InputAdornment>,
                  }}
                />
              </FormControl>
            </div>
            <div className="rightText">
              <FormControl>
                <TextField
                  id="standard-start-adornment"
                  required
                  name="pinCode"
                  value={centers.phonenumber}
                  onChange={(e) => onInputChange(e)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Telf. No  : </InputAdornment>,
                  }}
                />
              </FormControl>
            </div>
            <div className="rightText">
              <FormControl>
                <TextField
                  id="standard-start-adornment"
                  required
                  name="country"
                  value={centers.country}
                  onChange={(e) => onInputChange(e)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"> Country : </InputAdornment>,
                  }}
                />
              </FormControl>
            </div>
            <div className="rightText">
              <FormControl>
                <TextField
                  id="standard-start-adornment"
                  required
                  name="city"
                  value={centers.city}
                  onChange={(e) => onInputChange(e)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">City : </InputAdornment>,
                  }}
                />
              </FormControl>
            </div>
            <div className="rightText">
              <FormControl>
                <TextField
                  id="standard-start-adornment"
                  required
                  name="direction"
                  value={centers.direction}
                  onChange={(e) => onInputChange(e)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Address : </InputAdornment>,
                  }}
                />
              </FormControl>
            </div>
            <div className="rightText">
              <FormControl>
                <TextField
                  id="standard-start-adornment"
                  required
                  name="postalCode"
                  value={centers.postalCode}
                  onChange={(e) => onInputChange(e)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Postal Code : </InputAdornment>,
                  }}
                />
              </FormControl>
            </div>
          </div>
          <div className="col-lg-6 col-md-4 col-sm-2">
            <div className="rightText">
              <FormControl>
                <TextField
                  id="standard-start-adornment"
                  required
                  name="city"
                  value={centers.city}
                  onChange={(e) => onInputChange(e)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rates : </InputAdornment>,
                  }}
                />
              </FormControl>
            </div>
            <div className="rightText">
              <FormControl>
                <TextField
                  id="standard-start-adornment"
                  required
                  name="pinCode"
                  value={centers.bookingCount}
                  onChange={(e) => onInputChange(e)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Always Free : </InputAdornment>,
                  }}
                />
              </FormControl>
              {/* </div>
                        <div className="rightText"> */}
              <FormControl>
                <TextField
                  id="standard-start-adornment"
                  required
                  name="pinCode"
                  value={centers.bookingCount}
                  onChange={(e) => onInputChange(e)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Next Payment : </InputAdornment>,
                  }}
                />
              </FormControl>
            </div>
            <div className="rightText">
              <FormControl>
                <TextField
                  id="standard-start-adornment"
                  required
                  name="city"
                  value={centers.categories}
                  onChange={(e) => onInputChange(e)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Categories : </InputAdornment>,
                  }}
                />
              </FormControl>
            </div>
            <div>
              {
                centers.categoryList && centers.categoryList.map((data) => {
                  return (
                    <>
                      <div>
                        <img src={data.image === "" ? process.env.REACT_APP_DEFAULT_IMAGE : data.image} width="80px" height="100px" style={{ marginLeft: '20px', borderRadius: '50%' }} />
                      </div>
                    </>
                  )
                })
              }
              {/* <img src={centers.image === "" ? process.env.REACT_APP_DEFAULT_IMAGE : centers.image} width="50px" height="50px" style={{ marginLeft: '40px', borderRadius: '50%' }} />
              <img src={centers.image === "" ? process.env.REACT_APP_DEFAULT_IMAGE : centers.image} width="50px" height="50px" style={{ marginLeft: '40px', borderRadius: '50%' }} /> */}


            </div>
            <div className="rightText">
              <FormControl>
                <TextField
                  id="standard-start-adornment"
                  required
                  name="city"
                  value={centers.workerCount}
                  onChange={(e) => onInputChange(e)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">No of Workers : </InputAdornment>,
                  }}
                />
              </FormControl>
            </div>
            <div style={{ display: 'flex' }}>
              {
                centers.workerList && centers.workerList.map((data) => {
                  return (
                    <>
                      <div>
                        <img src={data.image === "" ? process.env.REACT_APP_DEFAULT_IMAGE : data.image} width="50px" height="50px" style={{ marginLeft: '40px', borderRadius: '50%' }} />
                        <p style={{ textAlign: 'right' }}>{data.name}</p>
                      </div>
                    </>
                  )
                })
              }
            </div>
            <div>
              <h6>Services: </h6>
              <div className="serviceButton">
                <button className="buttonStyle"
                  onClick={(e) => onNormalService(e)}
                >
                  <div style={{ color: '#1C38D6' }}>
                    Normal Services
                  </div>
                  <ArrowRightIcon className="arrow" />
                </button>
              </div>
              <div className="serviceButton">
                <button className="buttonStyle"
                  onClick={(e) => onCollectiveService(e)}
                >
                  <div style={{ color: '#F2B700' }}>
                    Collective Services
                  </div>
                  <ArrowRightIcon className="arrow" />
                </button>
              </div>
              <div className="serviceButton">
                <button className="buttonStyle"
                  onClick={(e) => onInterlevedService(e)}
                >
                  <div style={{ color: '#000000' }}>
                    Interleved Services
                  </div>
                  <ArrowRightIcon className="arrow" />
                </button>
              </div>

            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Link to="/admin/center">
            <button className="backButton">Go Back</button>
          </Link>
          <button className="saveButton" onClick={() => onUpdate()}>Save Changes</button>
        </div>
      </div>
    </>
  )
}

export default connect(mapStateToProps)(FormFields)