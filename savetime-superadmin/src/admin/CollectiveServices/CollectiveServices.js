import { FormControl, FormControlLabel, InputAdornment, Switch, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Fragment } from 'react'
import { editCenterData, editServiceData } from '../../redux/actions/actions'
import Navigation from "../Navigation"
import './Collective.css'
import { Link, useHistory } from 'react-router-dom'
import instance from '../../axios'
import requests from '../../requests'
import { connect, useDispatch, useSelector } from 'react-redux';

let token = null

const mapStateToProps = (state) => {
    token = state.token;
}

const CollectiveServices = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const centerEdit = useSelector((state) => state.editCenterData)
    const [checked, setChecked] = React.useState(false);
    const [service, setService] = useState([])
    const [centers, setCenters] = useState({
        name: centerEdit.name,
        image: centerEdit.image,
    });
    const toggleChecked = () => {
        setChecked((prev) => !prev);
    };
    const onFetchNormal = async () => {
        let serviceBody = {
            type: 'collective',
            centerId: centerEdit._id,
        }
        console.log(serviceBody, 'body')
        const response = await instance.post(requests.fetchServices, serviceBody, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        setService(response.data.data)
        console.log(response);
    }
    const onEdit = (e, data) =>{
        dispatch(editServiceData(data));
        history.push('/admin/updateCollective')
    }
    useEffect(() => {
        onFetchNormal()
    }, [])

    return (
        <Fragment>
            <Navigation />
            <div className="container" style={{ marginTop: '100px' }}>
                <div className="row">
                    <div className="col-lg-4 col-md-4 col-sm-2">
                        <div>
                            <img src={centers.image === "" ? process.env.REACT_APP_DEFAULT_IMAGE : centers.image} width="100px" height="100px" style={{ marginLeft: '40px', borderRadius: '50%' }} />
                            {
                                console.log(process.env.REACT_APP_DEFAULT_IMAGE)
                            }
                        </div>
                        <div className="rightText">
                            <b style={{ fontSize: "20px" }}>{centers.name}</b>
                        </div>
                    </div>
                    <div className="col-lg-5 col-md-6 col-sm-2">
                        <h6 style={{ fontSize: "35px", color: "#ebc034" }}>Collective Services </h6>
                        <br />
                        {
                            service && service.map((data) => (
                                <button
                                    className="sheet"
                                    onClick={(e) => onEdit(e, data)}
                                >
                                    <b style={{ color: "#1C38D6" }} >{data.serviceName}</b>
                                    <div>
                                        <FormControlLabel style={{ marginLeft: '250px' }}
                                            control={<Switch size="Large" checked={checked} onChange={toggleChecked} />}
                                        />
                                    </div>
                                </button>
                            ))
                        }
                        <div className="rightText1">
                            <Link to="/admin/update">
                                <button className="backButton">Go Back</button>
                            </Link>
                            <button className="buttonSaveChanges">Save Changes</button>
                        </div>
                    </div>

                </div>

            </div>
        </Fragment>
    )
}


export default connect(mapStateToProps)(CollectiveServices)