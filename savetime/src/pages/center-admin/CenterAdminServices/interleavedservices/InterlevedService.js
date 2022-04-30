import { FormControlLabel, Switch } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom'
import './InterlevedService.css'
import instance from '../../../../axios';
import requests from '../../../../requests';
import { connect, useDispatch, useSelector } from 'react-redux';
import CenterAdminHeader from './../../CenterAdminHeader/CenterAdminHeader';

import { Collapse, DialogTitle, Grid, Button } from '@material-ui/core';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import {
    successToaster,
    errorToaster
} from '../../../../common/common'
import InterlappedModal from './interlappedModal'
import { useTranslation } from 'react-i18next'

let token = null

const mapStateToProps = (state) => {
    token = state.token;
}

const InterlevedService = () => {
    const {t} = useTranslation();
    const language = useSelector(state => state.language)
    const dispatch = useDispatch();
    const loginData = useSelector((state) => state.loginData);
    const history = useHistory();
    const logincenterToken = useSelector(state => state.selectedLoginCenter.token)
    const [services, setServices] = useState([]);
    const [flag, setFlag] = useState(false)
    const [interLappedModal, setInterLappedModal] = useState(false);
    const [selectedSevices, setSelectedService] = useState({});
    const [selectedOverLappedSevices, setSelectedOverlappedService] = useState({});


    useEffect(() => {
        getService();
    }, [])

    const getService = async () => {
        const response = await instance.get(`${requests.fetchCenterAdminServices}${loginData._id}?lang=${language}`, {
            headers: {
                Authorization: `Bearer ${logincenterToken}`,
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

    const handleModalOpen = (overLapped, services) => {
        setFlag(true);
        setInterLappedModal(true);
        setSelectedOverlappedService(overLapped);
        setSelectedService(services);
    }

    const handleModalClose = () => {
        setFlag(false);
        setInterLappedModal(false);
        setSelectedOverlappedService({});
        setSelectedService({});
    }

    useEffect(() => {
        if (interLappedModal === true) {
            setFlag(true);
        } else {
            setFlag(false);
        }
    }, [flag])


    return (
        <Fragment>

            {/* <Navigation /> */}
            <div className="mainPage-container">

                <CenterAdminHeader
                    title={t("Services")}
                />

                <Grid container item sm={12} lg={12} xs={12} row>

                    <Grid item sm={2} lg={2} xs={12}>
                    </Grid>

                    <Grid item sm={8} lg={8} xs={12} >
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
                                                                        style={{ color: "red", fontSize: 30, cursor: "pointer", }}
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
                                                                        style={{ color: "red", fontSize: 30, cursor: "pointer", marginRight: "1rem" }}
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
                <InterlappedModal
                    isOpen={interLappedModal}
                    isClose={handleModalClose}
                    selectedService={selectedSevices}
                    selectedOverLappedSevices={selectedOverLappedSevices}
                    getService={getService}
                />
            }

        </Fragment>
    )
}

export default connect(mapStateToProps)(InterlevedService)
