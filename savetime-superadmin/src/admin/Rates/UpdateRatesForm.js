import { FormControl, FormControlLabel, FormGroup, InputAdornment, Switch, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import instance from '../../axios';
import { successToaster } from '../../common/common';
import requests from '../../requests';

const UpdateRatesForm = () => {
    const [state, setState] = React.useState({
        gilad: true,
        jason: false,
        antoine: true,
    });
    // const [name, setName] = useState("")
    // const [price, setPrice] = useState("")
    // const [year, setYear] = useState("")
    const token = useSelector((state)=> state.token)
    const rateData = useSelector((state) => state.editRateData)
    const[rates, setRates] = useState({
        name: rateData.planName,
        price: rateData.price,
        duration: rateData.duration,
        rateId: rateData._id,
        isDisable: rateData.isDisable
    })
    console.log(rateData)
    const onInputChange = (e) => {
        setRates({
          ...rates,
          [e.target.name]: e.target.value
        });
      };

    const handleChange = (event) => {
        setRates({ ...rates, [event.target.name]: event.target.checked });
    };

    const onUpdate = async () => {
        let body = {
          planName: rates.name,
          price: rates.price,
          duration: rates.duration
        }
        const response = await instance.put(`${requests.fetchUpdatePlan}/${rates.rateId}`, body, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        })
        successToaster("Rates updated successfully")
        console.log(response, "res")
      }

    return (
        <>
            <div className="container" style={{ marginTop: '100px' }}>
                <div style={{ textAlign: 'center' }}>
                    <FormControl>
                        <FormGroup>
                            <FormControlLabel
                                label="Active"
                                control={<Switch checked={rates.isDisable} onChange={handleChange} name="isDisable" />}
                            />
                        </FormGroup>
                    </FormControl>
                </div>
            </div>
            <div className="container" style={{marginTop: '50px'}}>
                <div style={{ textAlign: 'center', margin: '50px' }}>
                    <FormControl style={{width: '600px'}}>
                        <TextField
                            id="standard-start-adornment"
                            required
                            name="name"
                            value={rates.name}
                            onChange={(e) => onInputChange(e)}
                            //   className={classes.sideField}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">Name : </InputAdornment>,
                            }}
                        />


                    </FormControl>
                </div>
                <div style={{ textAlign: 'center', margin: '50px' }}>
                    <FormControl style={{width: '600px'}}>
                        <TextField
                            id="standard-start-adornment"
                            required
                            name="price"
                            value={rates.price}
                            onChange={(e) => onInputChange(e)}
                            //   className={classes.sideField}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">Price : </InputAdornment>,
                            }}
                        />
                    </FormControl>
                </div>
                <div style={{ textAlign: 'center', margin: '50px' }}>
                    <FormControl style={{width: '600px'}}>
                        <TextField
                            id="standard-start-adornment"
                            required
                            name="duration"
                            value={rates.duration}
                            onChange={(e) => onInputChange(e)}
                            //   className={classes.sideField}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">Duration : </InputAdornment>,
                            }}
                        />
                    </FormControl>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <Link to="/admin/rates">
                        <button className="backButton">Go Back</button>
                    </Link>
                    <button className="saveButton" onClick={() => onUpdate()}>Save Changes</button>
                </div>
            </div>
        </>
    )
}
export default UpdateRatesForm