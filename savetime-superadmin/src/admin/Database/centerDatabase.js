import React, { useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import CenterTableContent from './centerTableContent';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useSelector } from 'react-redux';

import requests from '../../requests';
import instance from '../../axios';

import {
    successToaster,
    errorToaster
} from '../../common/common';
import moment from 'moment';
import Navigation from '../Navigation';



const useStyles = makeStyles((theme) => {
    return {
        pages: {
            width: '100%',
            padding: theme.spacing(3),
            textAlign: 'center',
            alignItem: 'center'
        },
        root: {
            display: 'flex'
        },
        toolbar: theme.mixins.toolbar,
    }

})


const CenterDatabase = () => {
    const classes = useStyles()
    const theme = useTheme();

    const editBusines = useSelector((state) => state.editBillingData);
    const token = useSelector((state) => state.token);

    const [serviceProps, setServiceProps] = useState([]);
    const [nieProps, setnieProps] = useState([]);
    const [countryProps, setcountryProps] = useState([]);
    const [uniqIDProps, setuniqIDProps] = useState([]);
    const [workerProps, setWorkerProps] = useState([]);
    const [countryCountProps, setcountryCountProps] = useState([]);
    const [appoementIdProps, setAppoementIdProps] = useState([]);

    const [tableData, setTableData] = useState([]);


    const [selectedDate, setSelectedDate] = useState(new Date());

    const [searchingDate, setSerchingDate] = useState(moment(selectedDate).format('DD-MM-YYYY'));
    const [selectedTime, setSelectedTime] = useState(moment(selectedDate).format('HH:mm'));
    const [flagForTime, setFlagForTime] = useState(false);

    const [selectedServices, setSelectedServices] = useState("");
    const [selectedCountryName, setSelectedCountryName] = useState("");
    const [selectedNoOfCenter, setSelectedNoOfCenter] = useState("");
    const [selectedNIE, setSelectedNIE] = useState("");
    const [selectedUniqId, setSelectedUniqId] = useState("");
    const [selectedWorker, setSelectedWorker] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [selectedAppoiementId, setSelectedAppoiementId] = useState("");
    const [selectedPrice, setSelectedPrice] = useState("");




    const price = [
        { title: '0-499', value: "0-500" },
        { title: '500-999', value: "500-999" },
        { title: '1000-1499', value: "1000-1499" },
        { title: '1500-1999', value: "1500-1999" },
        { title: '2000-2499', value: "2000-2499" },
    ];

    const priceProps = {
        options: price,
        getOptionLabel: (option) => option.title,
    };

    const top100Films = [
        { title: 'The Shawshank Redemption', year: 1994 },
        { title: 'The Godfather', year: 1972 },
        { title: 'The Godfather: Part II', year: 1974 },
        { title: 'The Dark Knight', year: 2008 },
        { title: '12 Angry Men', year: 1957 },
        { title: "Schindler's List", year: 1993 },
        { title: 'Pulp Fiction', year: 1994 },
        { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
        { title: 'The Good, the Bad and the Ugly', year: 1966 },
        { title: 'Fight Club', year: 1999 },
    ];

    const defaultProps = {
        options: top100Films,
        getOptionLabel: (option) => option.title,
    };

    // const handleDateChange = (date) => {
    //     let tempDate = new Date(date);
    //     setSelectedDate(date);
    //     let finalDate = moment(tempDate).format('DD-MM-YYYY');
    //     setSerchingDate(finalDate);
    // };

    const handleTimeChange = (date) => {
        let tempDate = new Date(date);
        setSelectedDate(date);
        let finalTime = moment(tempDate).format('HH:mm');
        setSelectedTime(finalTime);
        setFlagForTime(true)
    };

    useEffect(() => {
        getServices();
        // getWorkers();
        // getAppomentId();
        getTableData({
            "centerId": editBusines,
            // "Date": "29-07-2021",
        });
    }, []);

    const getServices = async () => {
        const response = await instance.post(`${requests.fetchBusiness}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        // console.log(response, "211")
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
            console.log("Response ==> ", response);
            let serviceDataOption = [];
            let nieDataOption = [];
            let uniqIdDataOption = [];
            let countryDataOption = [];
            let countryCountDataOption = [];
            let res = response.data.data
            res.map((service) => {
                let serviceData = {
                    title: service.compneyName ? service.compneyName : "" ,
                    value: service._id,

                }
                serviceDataOption.push(serviceData);
            })
            console.log(res, "res")
            const serviceOption = {
                options: serviceDataOption,
                getOptionLabel: (option) => option?.title,
            };
            setServiceProps(serviceOption);

            res.map((service) => {
                let nieData = {
                    title: service["NIE/NIF/NRT"] ? service["NIE/NIF/NRT"] : "" ,
                    value: service._id,

                }
                nieDataOption.push(nieData);
            })
            console.log(res, "res")
            const nieOption = {
                options: nieDataOption,
                getOptionLabel: (option) => option?.title,
            };
            setnieProps(nieOption);

            res.map((service) => {
                let serviceData = {
                    title: service?.uniqueId,
                    value: service._id,

                }
                uniqIdDataOption.push(serviceData);
            })
            console.log(res, "res")
            const uniqIdOption = {
                options: uniqIdDataOption,
                getOptionLabel: (option) => option?.title,
            };
            setuniqIDProps(uniqIdOption);

            res.map((service) => {
                let serviceData = {
                    title: service?.country,
                    value: service._id,

                }
                countryDataOption.push(serviceData);
            })
            console.log(res, "res")
            const contryData = {
                options: countryDataOption,
                getOptionLabel: (option) => option?.title,
            };
            setcountryProps(contryData);

            res.map((service) => {
                let serviceData = {
                    title: `${service?.centerCount}`,
                    value: service._id,

                }
                countryCountDataOption.push(serviceData);
            })
            console.log(res, "res")
            const contrycountData = {
                options: countryCountDataOption,
                getOptionLabel: (option) => option?.title,
            };
            setcountryCountProps(contrycountData);
        }

    }

    const getWorkers = async () => {
        const response = await instance.post(`${requests.fetchBusiness}/${editBusines._id}`,{}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        console.log(response, "211")
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
        // if (response && response.data) {
        //     let workerDataOption = [];
        //     let res = response.data.data
        //     res.map((data) => {
        //         let workerData = {
        //             title: data.name,
        //             value: data._id
        //         }
        //         workerDataOption.push(workerData);
        //     })
        //     const workerOption = {
        //         options: workerDataOption,
        //         getOptionLabel: (option) => option.title,
        //     };
        //     setWorkerProps(workerOption);
        // }
    }


    const getAppomentId = async () => {
        const response = await instance.post(`${requests.fetchBusiness}/${editBusines._id}`, {},{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        console.log(response, "211")
        //     .catch(
        //         (error) => {
        //             let errorMessage = ""
        //             if (error.response.data && error.response.data.error) {
        //                 errorMessage = error.response.data.error.message
        //             } else {
        //                 errorMessage = error.response.data.message
        //             }
        //             console.log("ee", error.response);
        //             errorToaster(errorMessage);
        //         }
        //     )
        // if (response && response.data) {
        //     let appoementIdOption = [];
        //     let res = response.data.data
        //     res.map((data) => {
        //         let appoementData = {
        //             title: data._id,
        //             value: data._id
        //         }
        //         appoementIdOption.push(appoementData);
        //     })
        //     const appoementOption = {
        //         options: appoementIdOption,
        //         getOptionLabel: (option) => option.title,
        //     };
        //     setAppoementIdProps(appoementOption);
        // }
    }

    const getTableData = async (body) => {
        let apiBody = body;
        const response = await instance.post(`${requests.fetchBusiness}`, apiBody, {
            headers: {
                Authorization: `Bearer ${token}`,
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
            setTableData(response.data.data);
        }

    }

    const applyFilter = async (e) => {
        e.preventDefault();
        let body = {
            // "centerId": loginData._id,
            "Date": searchingDate,
        }
        if(flagForTime===true){
            body.time=selectedTime 
        }
        if(selectedServices!==""){
            body.serviceId = selectedServices
        }
        if(selectedWorker!==""){
            body.workerId=selectedWorker
        }
        if(selectedPrice!="")
        {
            body.price=selectedPrice
        }
        if(selectedAppoiementId!=""){
            body.appointmentId= selectedAppoiementId
        }
        getTableData(body);
    }

    return (
        <>
        {console.log(serviceProps,'servicePRops')}
        {console.log(uniqIDProps,'uniqIDProps')}
        {console.log(nieProps,'nieProps')}
        {console.log(countryCountProps,'country')}
            <div className="mainPage-container" style={{marginTop: '100px'}}>
                {/* <h6>Center Database</h6> */}
                {/* <Navigation
                    title="Center Of Database "
                /> */}
                <Grid style={{ paddingLeft: "8rem", paddingRight: "8rem" }} container item sm={12} lg={12} xs={12} row>
                    <Grid container item sm={12} lg={12} xs={12} row spacing={8}
                        style={{ paddingBottom: "2rem" }} >
                        {/* <Grid container item sm={3} xl={3} lg={3} xs={3} col >
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="Date"
                                    emptyLabel= "Date"
                                    // value={selectedDate}
                                    // onChange={handleDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid> */}
                        {/* <Grid container item sm={3} xl={3} lg={3} xs={3} col>
                            <KeyboardTimePicker
                                margin="normal"
                                id="time-picker"
                                label="Time picker"
                                value={selectedDate}
                                onChange={handleTimeChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change time',
                                }}
                            />
                        </Grid> */}
                        <Grid container item sm={3} xl={3} lg={3} xs={3} col>
                            <Autocomplete
                                fullWidth
                                {...serviceProps}
                                id="selectedServices"
                                onChange={(event, newValue) => {
                                    setSelectedServices(newValue.value)
                                }}
                                // onChange={()=>getServices()}
                                renderInput={(params) => <TextField
                                    {...params}
                                    label="Company" margin="normal"
                                />
                                }
                            />
                        </Grid>
                        {/* {console.log("selectedServices ==> ", selectedServices)} */}
                        <Grid container item sm={3} xl={3} lg={3} xs={3} col>
                            <Autocomplete
                                fullWidth
                                {...nieProps}
                                id="customer"
                                onChange={(event, newValue) => {
                                    setSelectedNIE(newValue.value)
                                }}
                                renderInput={(params) => <TextField {...params} 
                                label="NIE/NIF/NRT" margin="normal" />}
                            />
                        </Grid>
                    </Grid>

                    <Grid container item sm={12} lg={12} xs={12} row spacing={8}
                        style={{ paddingBottom: "2rem" }}>
                        <Grid container item sm={3} xl={3} lg={3} xs={3} col>
                            <Autocomplete
                                fullWidth
                                {...uniqIDProps}
                                id="id"
                                onChange={(event, newValue) => {
                                    setSelectedUniqId(newValue.value)
                                }}
                                renderInput={(params) => <TextField {...params} label="Id" 
                                margin="normal" />}
                            />
                        </Grid>
                        <Grid container item sm={3} xl={3} lg={3} xs={3} col>
                            <Autocomplete
                                fullWidth
                                {...countryCountProps}
                                id="worker"
                                onChange={(event, newValue) => {
                                    setSelectedNoOfCenter(newValue.value)
                                }}
                                renderInput={(params) => <TextField {...params} label="No of Centers" margin="normal" />}
                            />
                        </Grid>
                        <Grid container item sm={3} xl={3} lg={3} xs={3} col>
                            <Autocomplete
                                fullWidth
                                {...priceProps}
                                id="price"
                                onChange={(event, newValue) => {
                                    setSelectedPrice(newValue.value)
                                }}
                                renderInput={(params) => <TextField {...params} label="Price" margin="normal" />}
                            />
                        </Grid>
                        <Grid container item sm={3} xl={3} lg={3} xs={3} col>
                            <Autocomplete
                                fullWidth
                                {...countryProps}
                                id="price"
                                onChange={(event, newValue) => {
                                    setSelectedCountryName(newValue.value)
                                }}
                                renderInput={(params) => <TextField {...params} label="Country" margin="normal" />}
                            />
                        </Grid>
                        <Grid container item sm={3} xl={3} lg={3} xs={3} col>
                            <Button
                                type="button"
                                style={{
                                    color: "#E9222F",
                                    backgroundColor: "#f0f0f0",
                                    border: "1px solid #E9222F",
                                    borderTopLeftRadius: "50px 50px",
                                    borderBottomLeftRadius: "50px 50px",
                                    borderTopRightRadius: "50px 50px",
                                    borderBottomRightRadius: "50px 50px",
                                    width: "8rem",
                                    marginRight: "2rem",
                                    marginLeft: "2rem",
                                    marginTop: "1rem",
                                    marginBottom: "0.5rem",
                                }}
                                variant="contained"
                                onClick={(e) => applyFilter(e)}
                            >
                                Apply filter
                            </Button>
                        </Grid>
                    </Grid>

                </Grid>
                <Grid container item sm={12} lg={12} xs={12} row>

                    <Grid item sm={1} lg={2} xs={12}>
                    </Grid>

                     <Grid item sm={10} lg={8} xs={12}>

                        <div className={classes.pages}>
                            <div className={classes.toolbar}></div>
                            <CenterTableContent
                                tableData={tableData}
                            />
                        </div>
                    </Grid>
                    <Grid item sm={1} lg={2} xs={12}>
                    </Grid>
                </Grid>

            </div>
        </>
    )
}

export default CenterDatabase