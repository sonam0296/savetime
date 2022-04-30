import React, { useState } from 'react'
import { FormControl, FormControlLabel, InputAdornment, TextField, Switch } from '@material-ui/core'

import './LogaClass.css'
import { connect, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import instance from '../../axios';
import requests from '../../requests';
import { successToaster } from '../../common/common';

let token = null

const mapStateToProps = (state) => {
    token = state.token;
}
const LogaClassField = () => {
    const history = useHistory()
    const [checked, setChecked] = React.useState(false);
    const collectiveUpdate = useSelector((state) => state.editServiceData);
    const centerEdit = useSelector((state) => state.editCenterData);
    const [updateCenter, setUpdateCenter] = useState({
        name: centerEdit.name,
        image: centerEdit.image
    })
    const [updateService, setUpdateService] = useState({
        serviceName: collectiveUpdate.serviceName,
        duration: collectiveUpdate.duration,
        price: collectiveUpdate.price,
        name: collectiveUpdate.name,
        maxPerson: collectiveUpdate.maxPerson
    })

    const onUpdate = async () => {
        let body = {
            serviceName: updateService.serviceName,
            duration: updateService.duration,
            price: updateService.price,
            active: updateService.active
        }
        const response = await instance.put(`${requests.fetchUpdateService}/${collectiveUpdate._id}`, body, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        successToaster("Service Updated Successfully")
        console.log(response, "res")
    }

    const onInputChange = (e) => {
        setUpdateService({
            ...updateService,
            [e.target.name]: e.target.value
        });
    };

    const onGoBack = () => {
        history.goBack()
    }

    const toggleChecked = () => {
        setUpdateService((prev) => !prev);
    };

    return (
        <div className="container" style={{ marginTop: '100px' }}>
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
                    <br />
                    <div className="righttext">
                        <FormControl>
                            <TextField
                                id="standard-start-adornment"
                                required
                                name="maxPerson"
                                value={updateService.maxPerson}
                                onChange={(e) => onInputChange(e)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">No. of Person : </InputAdornment>,
                                }}
                            />
                        </FormControl>
                    </div>

                    <div style={{ textAlign: 'center' }} className="rightText1">

                        <button className="backButton"
                            onClick={() => onGoBack()}>
                            Go Back</button>

                        <button className="saveButton"
                            onClick={() => onUpdate()}
                        >Save Changes</button>
                    </div>
                </div>
                <div className="col-lg-2 col-md-6 col-sm-2">
                    <FormControlLabel
                        control={<Switch size="Large" checked={updateService.active} onChange={toggleChecked} />}
                        label="Active"
                    />
                </div>
            </div>

        </div>

    )
}

export default connect(mapStateToProps)(LogaClassField)