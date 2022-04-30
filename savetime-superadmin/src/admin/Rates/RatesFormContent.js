import { FormControl, FormControlLabel, FormGroup, InputAdornment, Switch, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import instance from '../../axios';
import { successToaster } from '../../common/common';
import requests from '../../requests';
import Navigation from '../Navigation';

const RatesFormContent = () => {
    const token = useSelector((state) => state.token)
    const [state, setState] = React.useState({});
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [year, setYear] = useState("")

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    const onAddRates = async () => {
        let body ={
            planName: name,
            price: price,
            duration: year
        }
        const response = await instance.post(requests.fetchAddPlan, body, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        
        successToaster("Rates added successfully")
        console.log(response)
    }
    return (
        <>
            <div>
                <Navigation />
            </div>
            <div className="container" style={{ marginTop: '100px' }}>
                <div style={{ textAlign: 'center' }}>
                    <FormControl>
                        <FormGroup>
                            <FormControlLabel
                                label="Removed"
                                control={<Switch checked={state.gilad} onChange={handleChange} name="gilad" />}
                            />
                        </FormGroup>
                    </FormControl>
                </div>
            </div>
            <div className="container" style={{ marginTop: '50px' }}>
                <div style={{ textAlign: 'center', margin: '50px' }}>
                    <FormControl style={{ width: '600px' }}>
                        <TextField
                            id="standard-start-adornment"
                            required
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            //   className={classes.sideField}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">Name : </InputAdornment>,
                            }}
                        />


                    </FormControl>
                </div>
                <div style={{ textAlign: 'center', margin: '50px' }}>
                    <FormControl style={{ width: '600px' }}>
                        <TextField
                            id="standard-start-adornment"
                            required
                            name="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            //   className={classes.sideField}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">Price : </InputAdornment>,
                            }}
                        />
                    </FormControl>
                </div>
                <div style={{ textAlign: 'center', margin: '50px' }}>
                    <FormControl style={{ width: '600px' }}>
                        <TextField
                            id="standard-start-adornment"
                            required
                            name="year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            //   className={classes.sideField}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">Duration : </InputAdornment>,
                            }}
                        />
                    </FormControl>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <Link to="/admin/users">
                        <button className="backButton">Go Back</button>
                    </Link>
                    <button className="saveButton" onClick={() => onAddRates()}>Save Changes</button>
                </div>
            </div>
        </>
    )
}
export default RatesFormContent