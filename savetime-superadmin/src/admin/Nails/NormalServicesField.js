import React, { useState, useEffect } from 'react'
import { FormControl, FormControlLabel, InputAdornment, TextField, Switch } from '@material-ui/core'

import './NormalServicesFields.css'
import { connect, useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import instance from '../../axios';
import requests from '../../requests';
import { errorToaster, successToaster } from '../../common/common';
import { editCenterData } from '../../redux/actions/actions';

const NormalServicesField = () => {
    const dispatch = useDispatch()
    const history = useHistory();
    const [flag, setFlag] = useState(true)
    const serviceEdit = useSelector((state) => state.editServiceData);
    const centerEdit = useSelector((state) => state.editCenterData);
    const [updateCenter, setUpdateCenter] = useState({
        name: centerEdit.name,
        image: centerEdit.image
    })
    const token = useSelector((state) => state.token)
    const [updateService, setUpdateService] = useState({
        serviceName: serviceEdit.serviceName,
        duration: serviceEdit.duration,
        price: serviceEdit.price,
        active: serviceEdit.active
    })

    const onUpdate = async () => {
        console.log(updateService)
        let body = {
            serviceName: updateService.serviceName,
            duration: updateService.duration,
            price: updateService.price,
            active: updateService.active
        }
        console.log(body)
        const response = await instance.put(`${requests.fetchUpdateService}/${serviceEdit._id}`, body, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
            .catch(
                (error) => {
                    let errorMessage = ""
                    if (error.response.data && error.response.data.error) {
                        errorMessage = error.response.data.error.message
                    } else {
                        errorMessage = error.response.data.message
                    }
                    console.log("ee", error.response);
                    errorToaster(errorMessage);
                }
            )
        if (response && response.data) {
            console.log("Response Table Data ==> ", response);
            // setUpdateService(response.data.data);
            let temp = centerEdit
            let newData = centerEdit
            temp.serviceList.map((service, i) => {
                if (service._id === serviceEdit._id) {
                    newData.serviceList[i] = response.data.data
                }
            })
            console.log(newData)
            successToaster("Service Updated Successfully")
            dispatch(editCenterData(newData))
            console.log(centerEdit)
        }
    }

    const onInputChange = (e) => {
        setUpdateService({
            ...updateService,
            [e.target.name]: e.target.value
        });
    };

    const onGoBack = () => {
        history.push('/admin/normalService')
    }

    const toggleChecked = (e) => {
        setFlag(false)
        let tempData = updateService
        console.log(e.target.checked)
        tempData.active = e.target.checked
        setUpdateService(tempData)
    };

    useEffect(() => {
        if (flag === false) {
            setFlag(true)
        }
    }, [flag])

    return (
        <div className="container" style={{ marginTop: '100px' }}>
            {
                console.log(serviceEdit)
            }
            <div className="row">
                <div className="col-lg-4 col-md-4 col-sm-2">
                    <div>
                        <img src={updateCenter.image === "" ? process.env.REACT_APP_DEFAULT_IMAGE : updateCenter.image} width="100px" height="100px" style={{ marginLeft: '40px', borderRadius: '50%' }} />
                        {
                            console.log(process.env.REACT_APP_DEFAULT_IMAGE)
                        }
                    </div>
                    <div className="rightText">
                        <b style={{ fontSize: "20px" }}>{updateCenter.name}</b>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-2">
                    <h6 style={{ fontSize: "50px", color: "blue" }}>{updateService.serviceName} </h6>
                    <br />
                    <div className="righttext">
                        <FormControl>
                            <TextField
                                id="standard-start-adornment"
                                required
                                name="serviceName"
                                value={updateService.serviceName}
                                onChange={(e) => onInputChange(e)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Name : </InputAdornment>,
                                }}
                            />
                        </FormControl>
                    </div>
                    <br />
                    <div className="righttext">
                        <FormControl>
                            <TextField
                                id="standard-start-adornment"
                                required
                                name="duration"
                                value={updateService.duration}
                                onChange={(e) => onInputChange(e)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Duration:</InputAdornment>,
                                }}
                            />
                        </FormControl>
                    </div>

                    <br />
                    <div className="righttext">
                        <FormControl>
                            <TextField
                                id="standard-start-adornment"
                                required
                                name="price"
                                value={updateService.price}
                                onChange={(e) => onInputChange(e)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Price : </InputAdornment>,
                                }}
                            />
                        </FormControl>
                    </div>

                    <div style={{ textAlign: 'center' }} className="rightText1">
                        <Link to="/admin/normalService">
                            <button className="backButton"
                            // onClick={() => onGoBack()}
                            >Go Back</button>
                        </Link>
                        <button className="saveButton"
                            onClick={() => onUpdate()}
                        >Save Changes</button>
                    </div>
                </div>
                <div className="col-lg-2 col-md-6 col-sm-2">
                    {flag === true &&
                        <FormControlLabel
                            control={<Switch size="Large" checked={updateService.active} onChange={(e) => toggleChecked(e)} />}
                            label="Active"
                        />
                    }
                </div>
            </div>

        </div>

    )
}

export default NormalServicesField