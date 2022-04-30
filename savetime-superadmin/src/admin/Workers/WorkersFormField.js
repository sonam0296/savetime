import { FormControl, InputAdornment, TextField } from '@material-ui/core'
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './WorkersFormField.css';
import Switch from '@material-ui/core/Switch';
import { Link } from 'react-router-dom'
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import instance from '../../axios';
import requests from '../../requests';
import { successToaster } from '../../common/common';

const WorkersFormField = () => {

    const editWorker = useSelector((state) => state.editWorkerData)
    const token = useSelector((state) => state.token)
    const [workers, setWorkers] = useState({
        name: editWorker.name,
        pinCode: editWorker.pinCode,
        image: editWorker.image,
        uniqueId: editWorker.uniqueId,
        centerData: editWorker.centerData,
        active: editWorker.active,
        description: editWorker.description,
        serviceData: editWorker.serviceData,
        workerId: editWorker._id
    })
    const handleChange = (event) => {
        setWorkers({ ...workers, [event.target.name]: event.target.checked });
    };

    const toggleChecked = (e) => {
        setWorkers({ ...workers, [e.target.name]: e.target.checked });
    };

    const onUpdate = async () => {
        let body = {
            workerId: editWorker._id,
            description: workers.description,
            pinCode: workers.pinCode,
            //   active: users.active,
        }
        const response = await instance.put(requests.fetchUpdateWorkers, body, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        successToaster("Worker updated successfully")
        console.log(response, "res")
    }

    const onInputChange = (e) => {
        setWorkers({
            ...workers,
            [e.target.name]: e.target.value
        });
    };
    return (
        <>
            <div className="container" style={{ marginTop: '100px' }}>
                <h3 style={{ textAlign: 'center' }}>Frank Provost, SL</h3>
                <div className="row" style={{ marginTop: '50px' }}>
                    <div className="col-lg-6 col-md-4 col-sm-2">
                        <div>
                            <div>
                                <img src={workers.image === "" ? process.env.REACT_APP_DEFAULT_IMAGE : workers.image} width="100px" height="100px" style={{ marginLeft: '40px', borderRadius: '50%' }} />
                            </div>
                            <div style={{ margin: '20px' }}>
                                <h2>{workers.name}</h2>
                            </div>
                            <div style={{ float: 'right', marginTop: '-180px', marginRight: "50px" }}>
                                {
                                    workers.centerData && workers.centerData.map((data) => {
                                        return (
                                            <>
                                                <div>
                                                    <img src={data.image === "" ? process.env.REACT_APP_DEFAULT_IMAGE : data.image} width="100px" height="100px" style={{ marginLeft: '40px', borderRadius: '50%' }} />
                                                </div>
                                                <div style={{ margin: '20px' }}>
                                                    <h2>{data.name}</h2>
                                                </div>
                                            </>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="rightText">
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
                        </div>
                        <div className="rightText">
                            <FormControl>
                                <TextField
                                    id="standard-start-adornment"
                                    required
                                    name="uniqueId"
                                    value={workers.uniqueId}
                                    onChange={(e) => onInputChange(e)}
                                    //   className={classes.sideField}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">ID : </InputAdornment>,
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
                                    value={workers.pinCode}
                                    onChange={(e) => onInputChange(e)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">Pin Code : </InputAdornment>,
                                    }}
                                />
                            </FormControl>
                        </div>
                        <div className="rightText">
                            <FormControl>
                                <TextField
                                    id="standard-start-adornment"
                                    required
                                    name="description"
                                    value={workers.description}
                                    onChange={(e) => onInputChange(e)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">Description : </InputAdornment>,
                                    }}
                                />
                            </FormControl>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-4 col-sm-2" >
                        <div style={{ display: 'flex', marginLeft: '20px' }}>
                            <h6>Active :</h6>
                            <FormControl style={{ marginLeft: '20px', marginTop: '-10px' }}>
                                <FormGroup>
                                    <FormControlLabel

                                        control={<Switch checked={workers.active} onChange={(event) => handleChange(event)} name="active" />}
                                    />
                                </FormGroup>
                            </FormControl>
                        </div>

                        <div>
                            <h6 style={{ marginLeft: '20px', marginTop: "20px" }}>Services: </h6>
                            {
                                workers.serviceData && workers.serviceData.map((service) => {
                                    return (
                                        <>
                                            <div className="serviceButton">
                                                <button className="buttonStyle">
                                                    <div>
                                                        <b style={{ padding: '10px' }}>{service.serviceName}</b>
                                                    </div>
                                                    <div>
                                                        <FormControl style={{ display: 'inline' }}>
                                                            <FormGroup>
                                                                <FormControlLabel style={{ marginLeft: '100px', marginTop: '-25px' }}
                                                                    control={<Switch size="Large" checked={workers.active} onChange={(e) => toggleChecked(e)} name="active" />}
                                                                />
                                                            </FormGroup>
                                                        </FormControl>
                                                    </div>
                                                    <ArrowRightIcon className="arrow" />
                                                </button>
                                            </div>
                                        </>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <Link to="/admin/workers">
                        <button className="backButton">Go Back</button>
                    </Link>
                    <button className="saveButton" onClick={() => onUpdate()}>Save Changes</button>
                </div>
            </div>
        </>
    )
}

export default WorkersFormField