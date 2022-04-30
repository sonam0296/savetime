import { FormControlLabel, Switch } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Fragment } from 'react'
import Navigation from '../Navigation';
import { Link, useHistory } from 'react-router-dom'
import './Normal.css'
import instance from '../../axios';
import requests from '../../requests';
import { connect, useDispatch, useSelector } from 'react-redux';
import { editServiceData} from '../../redux/actions/actions'

let token = null

const mapStateToProps = (state) => {
    token = state.token;
}

const Normal = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const editService = useSelector((state) => state.editCenterData)
    const [checked, setChecked] = React.useState(false);
    const [service, setService] = useState([])
    const [centers, setCenters] = useState({
        uniqueId: editService.uniqueId,
        name: editService.name,
        image: editService.image,
        active: editService.active
    });
    const toggleChecked = (e) => {
        setCenters({...centers, [e.target.name]: e.target.value});
    };
    const onFetchNormal = async () => {
        let serviceBody = {
            type: 'personal',
            centerId: editService._id,
        }
        console.log(serviceBody, 'body')
        const response = await instance.post(requests.fetchServices, serviceBody, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        setService(response.data.data)
        console.log(response.data.data);
    }
    const onEdit = (e, data) => {
        dispatch(editServiceData(data));
        history.push('/admin/updateService')
    }

    useEffect(() => {
        onFetchNormal()
    }, [])

    return (

        <Fragment>
            {
                console.log(service)
            }
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
                    <div className="col-lg-6 col-md-6 col-sm-2">
                        <h6 style={{ fontSize: "35px", color: "#1C38D6" }}>Normal Services </h6>
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
                                            control={<Switch size="Large"  checked={centers.active} 
                                            onChange={()=>toggleChecked()} name="active"/>}
                                        />
                                    </div>
                                </button>
                            ))
                        }
                        {/* <div className="sheet">
                            {
                                service && service.map((data) => (

                                    <div>
                                        <b style={{ color: "#1C38D6" }}>{data.serviceName}</b>
                                        <div>
                                            <FormControlLabel style={{ marginLeft: '250px' }}
                                                control={<Switch size="Large" checked={checked} onChange={toggleChecked} />}
                                            />
                                        </div>
                                    </div>
                                ))
                            }

                        </div> */}

                        <div style={{ textAlign: 'center' }}>
                            <Link to="/admin/update">
                                <button className="backButton">Go Back</button>
                            </Link>
                            <button className="saveButton">Save Changes</button>
                        </div>
                    </div>

                </div>

            </div>
        </Fragment>
    )
}

export default connect(mapStateToProps)(Normal)
