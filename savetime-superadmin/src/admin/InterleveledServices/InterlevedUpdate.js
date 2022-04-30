import React, { useState } from 'react'
import { FormControl, FormControlLabel, InputAdornment, TextField, Switch, Grid } from '@material-ui/core'
import uparrow from "../../assets/north_black_24dp.svg";
import downarraow from "../../assets/south_black_24dp.svg";
// import './LogaClass.css'
import { connect, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import instance from '../../axios';
import requests from '../../requests';
import { errorToaster } from '../../common/common';
import './InterlevedService.css'
import { editServiceData } from '../../redux/actions/actions';

const initialValueselectedService = {
    serviceID: "",
    serviceName: "",
    serviceDuration: "",
};
const initialValueselectedServiceColumnTwo = [
    // {
    // serviceID:'',
    // serviceName:'',
    // serviceDuration:''
    // }
]
const InterlevedUpdate = () => {
    const history = useHistory()
    const [checked, setChecked] = React.useState(false);
    const token = useSelector((state) => state.token)
    const overlapedService = useSelector((state) => state.overlappedService)
    console.log(overlapedService)
    const [interTime, setInterTime] = useState({
        startTime: overlapedService.startTime,
        overLappedServiceName: overlapedService.overLappedServiceName,
        overLappedServiceDuration: overlapedService.overLappedServiceDuration,

    });
    const [time, setTime] = useState(overlapedService.startTime)
    const updateInterleved = useSelector((state) => state.editServiceData);
    const [updatedService, setUpdateService] = useState({
        serviceName: updateInterleved.serviceName,
        duration: updateInterleved.duration,
        price: updateInterleved.price,
        name: updateInterleved.name
    })
    console.log(updatedService)
    const onUpdate = async () => {
        let body = {
            serviceName: updatedService.serviceName,
            duration: updatedService.serviceName
        }
        const response = await instance.put(`${requests.fetchUpdateService}/${updateInterleved._id}`, body, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        console.log(response, "res")
    }

    const incNum = () => {
        setTime(time + 5);
    };

    const decNum = () => {
        if (time > 0) {
            setTime(time - 5);
        } else {
            errorToaster("You Reach Limit");
            setTime(0);
        }
    };

    const onGoBack = () => {
        history.goBack()
    }

    const toggleChecked = () => {
        setChecked((prev) => !prev);
    };
    return (
        <>
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <p>Indicate how long you spend with the client in column 1 <br /> before you
                    can attend the client in column 2</p>
            </div>
            <Grid container style={{ marginTop: '100px' }}>
                {
                    console.log(updatedService)
                }


                <div className="interleaved">
                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        <div>
                            <img src={updatedService.image === "" ? process.env.REACT_APP_DEFAULT_IMAGE : updatedService.image} width="100px" height="100px" style={{ marginLeft: '40px', borderRadius: '50%' }} />
                            {
                                console.log(process.env.REACT_APP_DEFAULT_IMAGE)
                            }
                        </div>
                        <div className="rightText">
                            <b style={{ fontSize: "20px" }}>{updatedService.name}</b>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2} lg={2}>
                        <div className="firstservice">
                            <button className="firstservice_btn">
                                {updatedService.serviceName}

                            </button>
                            <div className="firstservice_duration">
                                Duration {updatedService.duration} Min.
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2} lg={2}>
                        <div className="quantity">
                            <img
                                src={uparrow}
                                className="uparrow"
                                alt="uparrow"
                                onClick={() => incNum()}
                            />
                            <div>{time} min</div>
                            <img
                                src={downarraow}
                                className="downarrow"
                                alt="downarraow"
                                onClick={() => decNum()}
                            />
                        </div>

                        {/* <input name="quantity" type="text" className="quantity_input" value={interTime} /> */}
                    </Grid>
                    <Grid item xs={12} sm={12} md={2} lg={2}>
                        <div className="secondservice">
                            <button className="secondservice_btn">

                                {interTime.overLappedServiceName}
                            </button>
                            <div className="secondservice_duration">
                                Duration {interTime.overLappedServiceDuration} Min.
                            </div>
                        </div>
                    </Grid>
                    <div className="col-lg-2 col-md-6 col-sm-2">
                        <FormControlLabel
                            control={<Switch size="Large" checked={checked} onChange={toggleChecked} />}
                            label="Active"
                        />
                    </div>
                </div>
            </Grid>
            <div style={{ textAlign: 'center' }} className="rightText1">

                        <button className="backButton"
                            onClick={() => onGoBack()}>
                            Go Back</button>

                        <button className="saveButton"
                            onClick={() => onUpdate()}
                        >Save Changes</button>
                    </div>
        </>
    )
}

export default InterlevedUpdate