import { FormControl, FormControlLabel, FormGroup, InputAdornment, Switch, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import instance from '../../axios';
import { successToaster } from '../../common/common';
import requests from '../../requests';
import './AdminFormFields.css'

const AdminFormFields = () => {
    const editBusiness = useSelector(state => state.editBusinessData);
    const token = useSelector((state) => state.token)
    const [business, setBusiness] = useState({
        telephone: editBusiness.telephone,
        country: editBusiness.country,
        uniqueId: editBusiness.uniqueId,
        direction: editBusiness.direction,
        centerCount: editBusiness.centerCount,
        active: editBusiness.active,
        businessId: editBusiness._id,
        centerList: editBusiness.centerData,
        image: editBusiness.image,
        ["NIE/NIF/NRT"]: editBusiness["NIE/NIF/NRT"]
    })

    const handleChange = (event) => {
        setBusiness({ ...business, [event.target.name]: event.target.checked });
    };

    const onUpdate = async () => {
        let body = {
            direction: business.direction,
            telephone: business.telephone
        }
        const response = await instance.put(`${requests.fetchUpdateBusiness}/${business.businessId}`, body, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        successToaster("Company Added SuccessFully")
        console.log(response, "company response")
    }

    const onInputChange = (e) => {
        setBusiness({
            ...business,
            [e.target.name]: e.target.value
        });
    };
    return (
        <>
            <div className="container" style={{ marginTop: '100px' }}>
                <h3 style={{ textAlign: 'center' }}>Frank Provost, SL</h3>
                <div style={{ textAlign: 'center' }}>
                    <FormControl>
                        <FormGroup>
                            <FormControlLabel
                                label="Active"
                                control={<Switch checked={business.active} onChange={handleChange} name="active" />}
                            />
                        </FormGroup>
                    </FormControl>
                </div>
                <div className="row">
                    <div className="col-lg-6 col-md-4 col-sm-2">
                        <div className="oneLineStyle">
                            <FormControl style={{ marginRight: '10px' }}>
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
                                    name="uniqueId"
                                    value={business.uniqueId}
                                    onChange={(e) => onInputChange(e)}
                                    //   className={classes.sideField}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">ID. : </InputAdornment>,
                                    }}
                                />
                            </FormControl>
                        </div>
                        <div className="rightText">
                            <FormControl style={{ marginLeft: '-10px' }}>
                                <TextField
                                    id="standard-start-adornment"
                                    required
                                    name="NIE/NIF/NRT"
                                    value={business["NIE/NIF/NRT"]}
                                    onChange={(e) => onInputChange(e)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">NIE/NIF/NRT : </InputAdornment>,
                                    }}
                                />
                            </FormControl>
                        </div>
                        <div className="rightText">
                            <FormControl style={{ marginLeft: '-10px' }}>
                                <TextField
                                    id="standard-start-adornment"
                                    required
                                    name="telephone"
                                    value={business.telephone}
                                    onChange={(e) => onInputChange(e)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">Telf. No  : </InputAdornment>,
                                    }}
                                />
                            </FormControl>
                        </div>
                        <div className="rightText">
                            <FormControl style={{ marginLeft: '-10px' }}>
                                <TextField
                                    id="standard-start-adornment"
                                    required
                                    name="country"
                                    value={business.country}
                                    onChange={(e) => onInputChange(e)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"> Country : </InputAdornment>,
                                    }}
                                />
                            </FormControl>
                        </div>
                        <div className="rightText">
                            <FormControl style={{ marginLeft: '-10px' }}>
                                <TextField
                                    id="standard-start-adornment"
                                    required
                                    name="direction"
                                    value={business.direction}
                                    onChange={(e) => onInputChange(e)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">Direction : </InputAdornment>,
                                    }}
                                />
                            </FormControl>
                        </div>
                        <div className="rightText">
                            <FormControl style={{ marginLeft: '-10px' }}>
                                <TextField
                                    id="standard-start-adornment"
                                    required
                                    name="pinCode"
                                    value={business.bookingCount}
                                    onChange={(e) => onInputChange(e)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">Postal Code : </InputAdornment>,
                                    }}
                                />
                            </FormControl>
                        </div>
                        <div className="oneLineStyle">
                            <FormControl style={{ marginRight: '10px' }}>
                                <TextField
                                    id="standard-start-adornment"
                                    required
                                    name="name"
                                    // value={input.name}
                                    // onChange={(e) => onInputChange(e)}
                                    //   className={classes.sideField}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">No. of Reservations : </InputAdornment>,
                                    }}
                                />
                            </FormControl>
                            <FormControl>
                                <TextField
                                    id="standard-start-adornment"
                                    required
                                    name="name"
                                    // value={input.name}
                                    // onChange={(e) => onInputChange(e)}
                                    //   className={classes.sideField}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">Last Activity : </InputAdornment>,
                                    }}
                                />
                            </FormControl>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-4 col-sm-2">
                        <div className="rightText">
                            <FormControl style={{ marginLeft: '-10px' }}>
                                <TextField
                                    id="standard-start-adornment"
                                    required
                                    name="pinCode"
                                    value={business.bookingCount}
                                    onChange={(e) => onInputChange(e)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">Rates : </InputAdornment>,
                                    }}
                                />
                            </FormControl>
                        </div>
                        <div className="oneLineStyle">
                            <FormControl style={{ marginRight: '10px' }}>
                                <TextField
                                    id="standard-start-adornment"
                                    required
                                    name="name"
                                    // value={input.name}
                                    // onChange={(e) => onInputChange(e)}
                                    //   className={classes.sideField}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">Always Free : </InputAdornment>,
                                    }}
                                />
                            </FormControl>
                            <FormControl>
                                <TextField
                                    id="standard-start-adornment"
                                    required
                                    name="name"
                                    // value={input.name}
                                    // onChange={(e) => onInputChange(e)}
                                    //   className={classes.sideField}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">Next Pages : </InputAdornment>,
                                    }}
                                />
                            </FormControl>
                        </div>
                        <div style={{ margin: '20px' }}>
                            <h5>Centers :</h5>
                            {/* <p>{business.centerCount}</p> */}
                        </div>
                        {
                            business.centerList && business.centerList.map((data) => {
                                return (
                                    <>
                                        <div>
                                            <img src={data.image === "" ? process.env.REACT_APP_DEFAULT_IMAGE : data.image} width="50px" height="50px" style={{ marginLeft: '40px', borderRadius: '50%' }} />
                                            <p style={{ margin: '20px'}}>{data.name}</p>
                                        </div>
                                    </>
                                )
                            })
                        }
                        {/* <div>
                            <img src={business.image === "" ? process.env.DEFAULT_IMAGE : business.image} width="50px" height="50px" />
                            <img src={business.image === "" ? process.env.DEFAULT_IMAGE : business.image} width="50px" height="50px" />
                            <img src={business.image === "" ? process.env.DEFAULT_IMAGE : business.image} width="50px" height="50px" />
                            <img src={business.image === "" ? process.env.DEFAULT_IMAGE : business.image} width="50px" height="50px" />

                        </div> */}
                    </div>
                </div>
                <div style={{ textAlign: 'center', margin: '30px' }}>
                    <Link to="/admin/dashboard">
                        <button className="backButton">Go Back</button>
                    </Link>
                    <button className="saveButton" onClick={() => onUpdate()}>Save Changes</button>
                </div>
            </div>
        </>
    )
}

export default AdminFormFields