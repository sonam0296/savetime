import { FormControlLabel, Grid, Switch } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Fragment } from 'react'
import Navigation from '../Navigation';
import { Link, useHistory } from 'react-router-dom'
import './InterlevedService.css'
import instance from '../../axios';
import requests from '../../requests';
import { connect, useDispatch, useSelector } from 'react-redux';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { errorToaster } from '../../common/common';
import InterlevedUpdate from './InterlevedUpdate';
import { editServiceData, overlappedService } from '../../redux/actions/actions';

let token = null

const mapStateToProps = (state) => {
    token = state.token;
}

const InterlevedService = () => {
    const dispatch = useDispatch();
    const centerEdit = useSelector((state) => state.editCenterData);
    const history = useHistory();
    const editInterleved = useSelector((state)=> state.editServiceData)
    const [services, setServices] = useState([]);
    const [flag, setFlag] = useState(false)
    const [interLappedModal, setInterLappedModal] = useState(false);
    // const [selectedSevices, setSelectedService] = useState({});
    const [selectedOverLappedSevices, setSelectedOverlappedService] = useState({
        
    });

    const [selectedSevices, setSelectedService] = useState({});



    useEffect(() => {
        getService();
    }, [])

    const getService = async () => {
       
        const response = await instance.get(`${requests.fetchCenterService}/${centerEdit._id}`,{
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
            let res = response.data.data
            let personalService = res.filter((service) => service.type === "personal")
            console.log("Personal sevices ==> ", personalService);
            setServices(personalService);
        }
    }

    // const onFetchNormal = async () => {
    //     let serviceBody = {
    //         type: 'personal',
    //         centerId: editCenterData._id,
    //     }
    //     console.log(serviceBody, 'body')
    //     const response = await instance.post(requests.fetchServices, serviceBody, {
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         },
    //     })
    //     setService(response.data.data)
    //     console.log(response.data.data);
    // }
    const onEdit = (e) => {
        // dispatch(editServiceData(data));
        // history.push('/admin/updateInterleved')
    }

    const handleModalOpen = (overLapped, services) => {
        dispatch(overlappedService(overLapped));
        dispatch(editServiceData(services))
        history.push('/admin/updateInterleved')
    }
    {
        console.log(editServiceData);
    }

    const handleModalClose = () => {
        // setFlag(false);
        // setInterLappedModal(false);
        // setSelectedOverlappedService({});
        // setSelectedService({});
    }

    useEffect(() => {
        if (interLappedModal === true) {
            setFlag(true);
        } else {
            setFlag(false);
        }
    }, [flag])

    // useEffect(() => {
    //     onFetchNormal()
    // }, [])

    return (

        <Fragment>
            {
                console.log(services)
            }
            {/* <Navigation /> */}
            <div className="mainPage-container">

                <Grid container item sm={12} lg={12} xs={12} row>

                    <Grid item sm={3} lg={3} xs={12}>
                        <div>
                            <img src={selectedSevices.image === "" ? process.env.REACT_APP_DEFAULT_IMAGE : selectedSevices.image} width="100px" height="100px" style={{ marginLeft: '40px', borderRadius: '50%' }} />
                            {
                                console.log(process.env.REACT_APP_DEFAULT_IMAGE)
                            }
                        </div>
                        <div className="rightText">
                            <b style={{ fontSize: "20px" }}>{selectedSevices.name}</b>
                        </div>
                    </Grid>

                    <Grid item sm={8} lg={8} xs={12} >
                        <h4>Interleved Services</h4>
                        <Grid container item sm={12} lg={12} xs={12} row
                            style={{ textAlign: "center", marginTop: "3rem", marginBottom: "3rem" }}
                        >

                            {
                                services &&
                                services.map((service, index) => {
                                    if (service.overLappedServices.length > 0) {
                                        return (
                                            service.overLappedServices.map((overLapped, i) => {
                                                return (
                                                    <>
                                                        <Grid item sm={12} md={12} lg={6} xs={12} style={{ textAlign: "-webkit-center" }}>
                                                            <div className="InterlappedServicesShow"
                                                                onClick={() => handleModalOpen(overLapped, service)}
                                                            >
                                                                <span className="arrow">
                                                                    <ArrowRightIcon
                                                                        style={{ color: "#D50032", fontSize: 30, cursor: "pointer", }}
                                                                    />
                                                                </span>
                                                                <div
                                                                    style={{ display: "flex", flexDirection: "column", width: "35%" }}
                                                                >
                                                                    <span className="ShowServiceName">
                                                                        {service.serviceName}
                                                                    </span>
                                                                    <span className="ShowServiceDuration">
                                                                        {service.duration} Min.
                                                                    </span>
                                                                </div>

                                                                <div
                                                                    style={{ width: "20%", display: "flex", flexDirection: "column" }}
                                                                >
                                                                    <span className="showMin">
                                                                        {overLapped.startTime} Min.
                                                                    </span>
                                                                    <span>

                                                                    </span>
                                                                </div>
                                                                <div
                                                                    style={{ width: "35%", display: "flex", flexDirection: "column" }}
                                                                >
                                                                    <span className="ShowServiceName">
                                                                        {overLapped.overLappedServiceName}
                                                                    </span>
                                                                    <span className="ShowServiceDuration">
                                                                        {overLapped.overLappedServiceDuration} Min.
                                                                    </span>
                                                                </div>
                                                                <span className="arrow">
                                                                    <ArrowLeftIcon
                                                                        style={{ color: "#D50032", fontSize: 30, cursor: "pointer", marginRight: "1rem" }}
                                                                    />
                                                                </span>
                                                            </div>
                                                        </Grid >
                                                    </>
                                                )
                                            })
                                        )
                                    }
                                })
                            }

                        </Grid>
                    </Grid>
                    <Grid item sm={2} lg={8} xs={12}>
                    </Grid>
                </Grid>
                <div style={{ textAlign: 'center' }}>
                    <Link to="/admin/update">
                        <button className="backButton">Go Back</button>
                    </Link>
                    <button className="saveButton">Save Changes</button>
                </div>

            </div>
            {
                flag &&
                interLappedModal === true &&
                <InterlevedUpdate
                    isOpen={interLappedModal}
                    isClose={handleModalClose}
                    selectedService={selectedSevices}
                    selectedOverLappedSevices={selectedOverLappedSevices}
                    getService={getService}
                />
            }        </Fragment>
    )
}

export default connect(mapStateToProps)(InterlevedService)
