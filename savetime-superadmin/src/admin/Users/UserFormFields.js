import { FormControl, FormControlLabel, FormGroup, InputAdornment,  Switch, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './UserFormFields.css'
import { Link } from 'react-router-dom'
import instance from '../../axios';
import requests from '../../requests';
import { successToaster } from '../../common/common';

const UserFormFields = () => {
    const editUser = useSelector((state) => state.editUserData);
    const token = useSelector((state)=> state.token)
    const [users, setUsers] = useState({
        uniqueId: editUser.uniqueId,
        name: editUser.name,
        image: editUser.image,
        emailAddress: editUser.emailAddress,
        phonenumber: editUser.phonenumber,
        bookingCount: editUser.bookingCount,
        centerCount: editUser.centerCount,
        active: editUser.active,
        userId: editUser._id
    })

    const [state, setState] = React.useState({});

    const onInputChange = (e) => {
        setUsers({
            ...users,
            [e.target.name]: e.target.value
        });
    };

    const onUpdate = async () => {
        let body = {
          emailAddress: users.emailAddress,
          phonenumber: users.phonenumber,
        //   active: users.active,
        }
        const response = await instance.post(`${requests.fetchUpdateCenter}/${users.userId}`, body, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        })
        successToaster("User updated successfully")
        console.log(response, "res")
      }

    const handleChange = (event) => {
        setUsers({ ...users, [event.target.name]: event.target.checked });
    };
    return (
        <>
            <div className="container" style={{ marginTop: '100px' }}>
                <div style={{ textAlign: 'center' }}>
                    <FormControl>
                        <FormGroup>
                            <FormControlLabel
                                label="Inactive"
                                control={<Switch checked={users.active} onChange={handleChange} name="active" />}
                            />
                        </FormGroup>
                    </FormControl>
                </div>
                <div className="row">
                    <div className="col-lg-6 col-md-4 col-sm-2">
                        <div>
                            <div className="row">
                                <div className="col-lg-3 col-md-6 col-sm-9">
                                    <img src={users.image === "" ? process.env.REACT_APP_DEFAULT_IMAGE : users.image} width="100px" height="100px" style={{ marginLeft: '40px', borderRadius: '50%' }} />
                                    {
                                        console.log(process.env.REACT_APP_DEFAULT_IMAGE)
                                    }
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-9" style={{ margin: '30px' }}>
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
                                    <FormControl>
                                        <TextField
                                            id="standard-start-adornment"
                                            required
                                            name="uniqueId"
                                            value={users.uniqueId}
                                            onChange={(e) => onInputChange(e)}
                                            //   className={classes.sideField}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">ID. : </InputAdornment>,
                                            }}
                                        />
                                    </FormControl>
                                </div>
                            </div>
                        </div>
                        <div style={{ margin: '20px' }}>
                            <h2>{users.name}</h2>
                        </div>
                        <div className="rightText">
                            <FormControl>
                                <TextField
                                    id="standard-start-adornment"
                                    required
                                    name="emailAddress"
                                    value={users.emailAddress}
                                    onChange={(e) => onInputChange(e)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">Email : </InputAdornment>,
                                    }}
                                />
                            </FormControl>
                        </div>
                        <div className="rightText">
                            <FormControl>
                                <TextField
                                    id="standard-start-adornment"
                                    required
                                    name="phonenumber"
                                    value={users.phonenumber}
                                    onChange={(e) => onInputChange(e)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">Telf. No  : </InputAdornment>,
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
                                    // value={users.phonenumber}
                                    // onChange={(e) => onInputChange(e)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"> DNI : </InputAdornment>,
                                    }}
                                />
                            </FormControl>
                        </div>
                        <div className="rightText">
                            <FormControl>
                                <TextField
                                    id="standard-start-adornment"
                                    required
                                    name="bookingCount"
                                    value={users.bookingCount}
                                    onChange={(e) => onInputChange(e)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">No of Reservations : </InputAdornment>,
                                    }}
                                />
                            </FormControl>
                            {/* </div>
                        <div className="rightText"> */}
                            <FormControl>
                                <TextField
                                    id="standard-start-adornment"
                                    required
                                    name="bookingCount"
                                    value={users.bookingCount}
                                    onChange={(e) => onInputChange(e)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">Last Activity : </InputAdornment>,
                                    }}
                                />
                            </FormControl>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-4 col-sm-2">
                        <div>
                            <h5>Centers :</h5>
                            <p>{users.centerCount}</p>
                        </div>
                        <div>
                            <img src="https://savetime-image.s3.amazonaws.com/585e4bf3cb11b227491c339a-c3f595ec-ff9b-43a4-840c-3db60fa86041.png" width="50px" height="50px" style={{ marginLeft: '40px', borderRadius: '50%' }} />
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <Link to="/admin/users">
                        <button className="backButton">Go Back</button>
                    </Link>
                    <button className="saveButton" onClick={()=>onUpdate()}>Save Changes</button>
                </div>
            </div>
        </>
    )
}

export default UserFormFields