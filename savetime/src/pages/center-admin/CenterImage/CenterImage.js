import { Button, CardActionArea, CardContent, Grid, Typography, Card, CardActions, CardMedia } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import Header from './../CenterAdminHeader/CenterAdminHeader';
import Img from '../../../assets/LOGO_PRINICPAL.png'
import './CenterImage.css'
import backgrounImg from '../../../assets/loadBackground.webp'
import { makeStyles } from '@material-ui/core/styles';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded'
import HouseOutlinedIcon from '@material-ui/icons/HouseOutlined'
import { EmailOutlined, LocationOnOutlined, PhoneOutlined } from '@material-ui/icons';
import Avatar from "react-avatar";
import instance from '../../../axios';
import requests from '../../../requests';
import { errorToaster, successToaster } from '../../../common/common';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { setLoginData, setSelectedLoginCenter, setWorkerLoginStatus } from '../../../redux/actions/actions';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles({
    root: {
        //   maxWidth: 345,
        width: 300
    },
    media: {
        height: 140,
    },
});

const ProfileUpload = ({ onChange, src }) => {
    return (
        <>
            <label for="photo-upload" className="custom-file-upload fas" >
                <div className="img-wrap img-upload">
                    <Avatar
                        size="150"

                        src={src}
                        className="avatar-image"
                        round={true}
                    />
                </div>
                <input
                    id="photo-upload"
                    style={{ display: "none" }}
                    type="file"
                    onChange={onChange}
                />
            </label>
        </>
    );
};

const ProfileBackImage = ({ onChange, src }) => {
    return (
        <>
            <label for="image-upload" className="custom-file-upload fas">
                <div className="img-wrap img-upload">
                    <Avatar
                        size="150"

                        src={src}
                        className="avatar-image"
                        round={true}
                    />
                </div>
                <input
                    id="image-upload"
                    style={{ display: "none" }}
                    type="file"
                    onChange={onChange}
                />
            </label>
        </>
    );
};


const CenterImage = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [profileURL, setProfileURL] = useState("");
    const [backImage, setBackImage] = useState("");
    const token = useSelector((state) => state.token);
    const dispatch = useDispatch()
    const logincenterToken = useSelector(state => state.selectedLoginCenter.token)
    const selectedCenter = useSelector(state => state.selectedLoginCenter)
    const history = useHistory()
    const userData = useSelector((state) => state.loginData)
    const [data, setData] = useState({
        name: userData.name,
        city: userData.city,
        phonenumber: userData.phonenumber,
        emailAddress: userData.emailAddress,
        centerId: userData._id,
        backgroundImage: userData.backgroundImage,
        image: userData.image,
    })

    useEffect(() => {
        setProfileURL(userData.image)
        setBackImage(userData.backgroundImage)
      
    }, [userData])

    const imageupload = async (e, status) => {
        // debugger
        const reader = new FileReader();
        const file = e.target.files[0];
        const fd = new FormData();
        fd.append("image", file);

        const response = await instance
            .post(requests.fetchImageUpload, fd, {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            })
            .catch((error) => {
                let errorMessage = error.response.data.message;
                errorToaster(errorMessage);
            });
        if (response && response.data) {
            if (status === "profileImage") {
                setProfileURL(response.data.data.file);
            }
            else {
                setBackImage(response.data.data.file)
            }

            console.log(response.data.data.file)
        }

        // setProfileURL(file)
    };


    const onUpdate = async () => {
        let body = {
            image: profileURL,
            backgroundImage: backImage
        }
        const response = await instance
            .post(`${requests.fetchUpdateUser}/${selectedCenter._id}`, body, {
                headers: {
                    Authorization: logincenterToken,
                },
            })
            .catch((error) => {
                let errorMessage = error.response.data.message;
                errorToaster(errorMessage);
            });
        if (response && response.data) {
            console.log(response.data.data)
            successToaster(t("Center Images Updated!!"))
            setData(response.data.data);
            dispatch(setLoginData(response.data.data.user))
            dispatch(setSelectedLoginCenter(response.data.data.user))
        }

    }


    useEffect(() => {
        if (Object.keys(userData).length > 0) {
            setProfileURL(userData.image)
            setBackImage(userData.backgroundImage)
            // console.log(userData.backgroundImage)
        }
    }, [])
    return (
        <>
            <div className="mainPage-container">
                <Header
                    title={t("Center Image")}
                />
                <Grid container style={{ marginTop: '80px' }}>
                    <Grid className="div-1" item xs={12} sm={12} md={6} lg={6} xl={6} >
                        <div>
                            <div className="deleteIcon">
                                <p>{t("Logo")}</p>
                                <DeleteRoundedIcon />
                            </div>
                            <div>
                                <ProfileUpload
                                    onChange={(e) => imageupload(e, "profileImage")}
                                    src={
                                        profileURL?.length > 0
                                            ? profileURL
                                            : "https://savetime-image.s3.eu-west-3.amazonaws.com/Person-b5c47224-332f-4862-8268-1e822350ff51.png"
                                    }
                                />
                            </div>
                            <div className="deleteIcon">
                                <p>{t("HeadBoard")}</p>
                                <DeleteRoundedIcon />
                            </div>
                            <div>
                                {/* <input type="file" onChange={(e) => backgroundImageupload(e)}/> */}
                                <ProfileBackImage
                                    onChange={(e) => imageupload(e, "backImage")}
                                    // onBackChange={(e) => backgroundImageupload(e)}
                                    src={
                                        backImage?.length > 0
                                            ? backImage
                                            : "https://savetime-image.s3.eu-west-3.amazonaws.com/Person-b5c47224-332f-4862-8268-1e822350ff51.png"
                                    }
                                />
                            </div>
                        </div>
                    </Grid>
                    <Grid className="div-2" item xs={12} sm={12} md={6} lg={6} xl={6} >
                        <Card className={classes.root}>
                            <CardActionArea>
                                <CardMedia
                                    className={classes.media}
                                    image={backImage}
                                    title="Contemplative Reptile"
                                />

                                <label for="photo-upload" className="custom-file-upload fas" style={{display: 'flex',
                                    justifyContent: 'center', marginTop: '-50px'
                                    }} >
                                    <div className="img-wrap img-upload">
                                        <Avatar
                                            size="100"

                                            src={profileURL}
                                            className="avatar-image"
                                            round={true}
                                        />
                                    </div>
                                </label>
                                {/* <ProfileUpload
                                    
                                    src={data.image}
                                /> */}
                                {/* <img src={backgrounImg} /> */}
                                <hr />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        <div className="deleteIcon">
                                            <HouseOutlinedIcon />
                                            <p>{t(userData.name)}</p>
                                        </div>
                                        <div className="deleteIcon">
                                            <LocationOnOutlined />
                                            <p>{t(userData.city)}</p>
                                        </div>
                                        <div className="deleteIcon">
                                            <PhoneOutlined />
                                            <p>{t(userData.phonenumber)}</p>
                                        </div>
                                        <div className="deleteIcon">
                                            <EmailOutlined />
                                            <p>{t(userData.emailAddress)}</p>
                                        </div>
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            {/* <CardActions>
                                <Button size="small" color="primary">
                                    Share
                                </Button>
                                <Button size="small" color="primary">
                                    Learn More
                                </Button>
                            </CardActions> */}
                        </Card>
                    </Grid>

                </Grid>
                <div className="worker-btn" >
                    <Button
                        variant="contained"
                        style={{ backgroundColor: "#D61C38", color: "white" }}
                        onClick={() => { history.push("/center/admin/dashboard") }}
                    >
                        {t("Return")}
                    </Button>
                    <Button
                        variant="contained"
                        style={{ backgroundColor: "#00AD22", color: "white" }}
                        onClick={(e) => onUpdate(e)}

                    >
                        {t("Update")}
                    </Button>
                </div>
            </div>

        </>
    )
}

export default CenterImage