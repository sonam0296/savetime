import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
} from "@material-ui/core";
import {
  CardActionArea,
  CardContent,
  Card,
  CardActions,
  CardMedia,
} from "@material-ui/core";
import { node } from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "react-avatar";
import { useDispatch, useSelector } from "react-redux";
import instance from "../../../axios";
import { errorToaster, successToaster } from "../../../common/common";
import {
  setLoginData,
  setSelectedCategory,
} from "../../../redux/actions/actions";
import requests from "../../../requests";
import "./managerCenterImages.css";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import HouseOutlinedIcon from "@material-ui/icons/HouseOutlined";
import {
  EmailOutlined,
  LocationOnOutlined,
  PhoneOutlined,
} from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import Header from "../../../components/Header";
import CenterAdminHeader from "../../center-admin/CenterAdminHeader/CenterAdminHeader";

const useStyles = makeStyles({
  root: {
    //   maxWidth: 345,
    width: 300,
  },
  media: {
    height: 140,
  },
});

const ProfileUpload = ({ onChange, src }) => {
  return (
    <>
      <label for="photo-upload" className="custom-file-upload fas">
        <div className="img-wrap img-upload">
          <Avatar size="150" src={src} className="avatar-image" round={true} />
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
          <Avatar size="150" src={src} className="avatar-image" round={true} />
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

function ManagerCenterImages() {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const [category, setCategory] = useState([]);
  const token = useSelector((state) => state.token);
  const [selectcategory, setSelectCategory] = useState([]);
  const [i, setIndex] = useState(null);
  const dispatch = useDispatch();
  const language = useSelector((state) => state.language);
  const center = useSelector((state) => state.loginData);
  const [input, setInput] = useState({});
  const selectedcategorySelector = useSelector(
    (state) => state.selectedcategory
  );
  const centerAdminLoginStatus = useSelector(
    (state) => state.centerAdminLoginStatus
  );
  const [centerAdminHeaderVisible, setCenterAdminHeaderVisible] =
    useState(false);
  const [profileURL, setProfileURL] = useState("");
  const [backImage, setBackImage] = useState("");
  const handleChange = (e, data, index) => {
    e.preventDefault();
    let catarray = [...selectcategory];

    if (selectcategory.includes(data.uniqueId)) {
      catarray = selectcategory.filter((id) => id !== data.uniqueId);

      setSelectCategory([...catarray]);
    } else {
      catarray[index] = e.target.value;
      setIndex(data.uniqueId);
      setSelectCategory([...catarray]);
    }
  };
  useEffect(() => {
    setProfileURL(center.image);
    setBackImage(center.backgroundImage);
  }, [center]);
  useEffect(() => {
    const setCategoryList = () => {
      let catarray = [...selectcategory];
      // let catarray = [...selectedcategorySelector]

      // const cat = center.categoryId
      const cat =
        selectedcategorySelector.length > 0
          ? selectedcategorySelector
          : center.categoryId;
      if (cat && cat.length > 0) {
        for (let i = 0; i < cat.length; i++) {
          catarray[i] = cat[i].id;
        }
      }
      setSelectCategory([...catarray]);
    };
    setCategoryList();
    const listCategory = async () => {
      const response = await instance.get(
        `${requests.fetchCategoryList}?lang=${language}`
      );

      if (response.data && response.data.data) {
        setCategory(response.data.data);
        // dispatch(setSelectedCategory(response.data.data))
      }
    };
    listCategory();
   
  }, []);

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
      } else {
        setBackImage(response.data.data.file);
      }

      console.log(response.data.data.file);
    }

    // setProfileURL(file)
  };

  const handleUpdate = async () => {
    let a = [];

    selectcategory.map((data) => {
      a.push({ id: data });
    });

    input.categoryId = a;
    // input.image = url
    input.emailAddress = center.emailAddress;
    input.type = undefined;
    input.status = undefined;
    input.verified = undefined;
    input.fcm_registration_token = undefined;
    input.stripe_customer = undefined;
    input.createdAt = undefined;
    input._id = undefined;
    input.image = profileURL;
    input.backgroundImage = backImage;
    const response = await instance
      .post(
        `${requests.fetchUpdateCenter}/${center._id}?lang=${language}`,
        input,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .catch((error) => {
        let errorMessage = error.response.data.message;
        errorToaster(errorMessage);
      });

    if (response && response.data) {
      successToaster(t("Center Updated !"));
      dispatch(setSelectedCategory(response.data.data.user.categoryId));
      dispatch(setLoginData(response.data.data.user));
    }
  };
  const handleReturn = () => {
    history.push("/center/centerData");
  };

  return (
    <div>
      {centerAdminLoginStatus === true && centerAdminHeaderVisible === true ? (
        <CenterAdminHeader  />
      ) : (
        <Header  className={t("center-header")} />
      )}
      <Grid container>
        <Grid item xs={0} sm={0} md={2} lg={2} xl={2}></Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={3}
          lg={3}
          xl={3}
          style={{
            display: "flex",
            alignItems: "center",
            height: "90vh",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" style={{ padding: "0.6rem 0.5rem" }}>
            {t("Downtown Sector")}
          </Typography>
          <FormGroup row>
            {category.length > 0 &&
              category.map((data, index) => {
                return (
                  <>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            selectcategory.includes(data.uniqueId)
                              ? true
                              : false
                          }
                          onChange={(e) => handleChange(e, data, index)}
                          value={data.uniqueId}
                        />
                      }
                      label={t(data.categoryName)}
                    />
                  </>
                );
              })}
          </FormGroup>
        </Grid>
        <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
          <Grid container style={{ marginTop: "80px" }}>
            <Grid className="div-1" item xs={12} sm={12} md={6} lg={6} xl={6}>
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
            <Grid className="div-2" item xs={12} sm={12} md={6} lg={6} xl={6}>
              <Card className={classes.root}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={backImage}
                    title="Contemplative Reptile"
                  />

                  <label
                    for="photo-upload"
                    className="custom-file-upload fas"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "-50px",
                    }}
                  >
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
                        <p>{t(center.name)}</p>
                      </div>
                      <div className="deleteIcon">
                        <LocationOnOutlined />
                        <p>{t(center.city)}</p>
                      </div>
                      <div className="deleteIcon">
                        <PhoneOutlined />
                        <p>{t(center.phonenumber)}</p>
                      </div>
                      <div className="deleteIcon">
                        <EmailOutlined />
                        <p>{t(center.emailAddress)}</p>
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
        </Grid>
        <Grid item xs={0} sm={0} md={2} lg={2} xl={2}></Grid>
      </Grid>

      <Grid container style={{justifyContent:'space-between'}}>
        <Grid item xs={0} sm={0} md={2} lg={2} xl={2}></Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={4}
          lg={4}
          xl={4}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={() => handleReturn()}
            style={{
              height: "50px",
              width: "280px",
              backgroundColor: "#D61C38",
              borderRadius: "30px",
              color: "white",
              fontSize: "20px",
              border: "2px solid black",
            }}
          >
            {t("Return")}
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={4}
          lg={4}
          xl={4}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={() => handleUpdate()}
            style={{
              height: "50px",
              width: "280px",
              backgroundColor: "#00ad22",
              borderRadius: "30px",
              color: "white",
              fontSize: "20px",
              border: "2px solid black",
            }}
          >
            {t("Following")}
          </Button>
        </Grid>
        <Grid item xs={0} sm={0} md={2} lg={2} xl={2}></Grid>
      </Grid>
    </div>
  );
}

export default ManagerCenterImages;
