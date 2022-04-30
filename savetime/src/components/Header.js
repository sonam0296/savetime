import React, { useState } from "react";
import styled, { withTheme } from "styled-components";
import { connect, useSelector } from "react-redux";
import { store } from "../redux/store";
import { darken } from "polished";
import { Link, useHistory } from "react-router-dom";
import {
  Badge,
  Grid,
  Hidden,
  InputBase,
  Menu,
  MenuItem,
  AppBar as MuiAppBar,
  IconButton as MuiIconButton,
  Toolbar,
  FormControl,
  InputLabel,
  NativeSelect,
  Select,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import {
  destroySession,
  setSelectedWorkerData,
  setSelectLanguage,
  setWorkerLoginStatus,
  setLoginData
} from "../redux/actions/actions";
import { Menu as MenuIcon } from "@material-ui/icons";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import requests from "../requests";
import instance from "../axios";
import { centerimage } from "../assets/centerimage.jpg";
import PWDLinkIsSend from "./../Modal/CenterModel/PWDLinkIsSend";

import {
  Bell,
  MessageSquare,
  Search as SearchIcon,
  Power,
} from "react-feather";
import "./header.css";
import { useTranslation } from 'react-i18next';

const AppBar = styled(MuiAppBar)`
  background: ${(props) => props.theme.header.background};
  color: ${(props) => props.theme.header.color};
  box-shadow: ${(props) => props.theme.shadows[1]};
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const Indicator = styled(Badge)`
  .MuiBadge-badge {
    background: ${(props) => props.theme.header.indicator.background};
    color: ${(props) => props.theme.palette.common.white};
  }
`;

const Search = styled.div`
  border-radius: 2px;
  background-color: ${(props) => props.theme.header.background};
  display: none;
  position: relative;
  width: 100%;

  &:hover {
    background-color: ${(props) => darken(0.05, props.theme.header.background)};
  }

  ${(props) => props.theme.breakpoints.up("md")} {
    display: block;
  }
`;

const SearchIconWrapper = styled.div`
  width: 50px;
  height: 100%;
  position: absolute;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 22px;
    height: 22px;
  }
`;

const Input = styled(InputBase)`
  color: inherit;
  width: 100%;

  > input {
    color: ${(props) => props.theme.header.search.color};
    padding-top: ${(props) => props.theme.spacing(2.5)}px;
    padding-right: ${(props) => props.theme.spacing(2.5)}px;
    padding-bottom: ${(props) => props.theme.spacing(2.5)}px;
    padding-left: ${(props) => props.theme.spacing(12)}px;
    width: 160px;
  }
`;

const Flag = styled.img`
  border-radius: 50%;
  width: 22px;
  height: 22px;
`;

function LanguageMenu() {
  const [anchorMenu, setAnchorMenu] = useState(null);
  const history = useHistory();
  const dispatch =useDispatch()
  const { i18n } = useTranslation();
  const mainLanguage = useSelector(state => state.language);
  const [language,setLanguage]=useState(mainLanguage);
  const userId = useSelector((state)=> state.loginData);
  const token = useSelector((state)=> state.token);

  const toggleMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorMenu(null);
  };


   const onLanguageChange = async(e) =>{
        const languageName=e.target.value;
        let body={
          language: languageName
        }
        const response = await instance.post(`${requests.fetchUpdateCenter}/${userId._id}`, body, {
          headers:{
            Authorization: `Bearer ${token}`
          }
        })
        console.log(response.data.data.user.language);
        const languageChange = response.data.data.user.language
        setLanguage(languageChange);
        dispatch(setSelectLanguage(languageName));
        i18n.changeLanguage(languageName);
    };
 
  return (
    <React.Fragment>
      {/* {console.log(language,"lan")} */}
      <IconButton
        aria-owns={Boolean(anchorMenu) ? "menu-appbar" : undefined}
        aria-haspopup="true"
        onClick={toggleMenu}
        color="inherit"
      >
        {/* <Flag src="/static/img/flags/us.png" alt="English" /> */}
      </IconButton>
      <Select
        // id="menu-appbar"
        // anchorEl={anchorMenu}
        // open={Boolean(anchorMenu)}
        // onClose={closeMenu}
        variant="outlined"
        value={language}
        onChange={onLanguageChange}
        style={{width:"170px", height: "40px", marginRight: '15px'}}
      >
        <MenuItem value="en">🇬🇧 Inglés</MenuItem>
        <MenuItem value="es">🇪🇸 Español</MenuItem>
        <MenuItem value="ca"> 🇦🇩 Catalán </MenuItem>
        <MenuItem value="pt">🇵🇹 Portugués </MenuItem>
        <MenuItem value="fr">🇫🇷 Francés</MenuItem>
      </Select>
    </React.Fragment>
  );
}

function UserMenu(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [anchorMenu, setAnchorMenu] = useState(null);

  const toggleMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorMenu(null);
  };

  const handleDashboard = () => {
    history.push("/client/maindashboard");
  };

  const handleProfile = () => {
    history.push("/client/profile-update");
  };

  const handleSignOut = () => {
    history.push("/");
    dispatch(destroySession());
  };

  return (
    <React.Fragment>
      <IconButton
        aria-owns={Boolean(anchorMenu) ? "menu-appbar" : undefined}
        aria-haspopup="true"
        onClick={toggleMenu}
        color="inherit"
      >
        <Power />
      </IconButton>

      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={closeMenu}
      >
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
        <MenuItem onClick={handleDashboard}>Dashboard</MenuItem>
        <MenuItem onClick={handleSignOut} component={Link}>
          Sign out
        </MenuItem>
        {/* {props} */}
      </Menu>
    </React.Fragment>
  );
}
function CenterMenu(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [anchorMenu, setAnchorMenu] = useState(null);

  const toggleMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorMenu(null);
  };

  const handleCenterDetails = () => {
    history.push("/center/center-details");
  };

  // const handleProfile = () => {
  //   history.push("/client/profile-update");
  // };

  const handleSignOut = () => {
    history.push("/");
    dispatch(destroySession());
  };

  return (
    <React.Fragment>
      <IconButton
        aria-owns={Boolean(anchorMenu) ? "menu-appbar" : undefined}
        aria-haspopup="true"
        onClick={toggleMenu}
        color="inherit"
      >
        <Power />
      </IconButton>

      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={closeMenu}
      >
        {/* <MenuItem onClick={handleProfile}>Profile</MenuItem> */}
        <MenuItem onClick={() => handleCenterDetails()}>CenterDetails</MenuItem>
        <MenuItem onClick={handleSignOut} component={Link}>
          Sign out
        </MenuItem>
        {/* {props} */}
      </Menu>
    </React.Fragment>
  );
}

const Header = ({ props, onDrawerToggle, title }) => {
  const loginData = useSelector((state) => state.loginData);
  const history = useHistory();
  const language = useSelector(state => state.language)
  const token = useSelector((state) => state.token);
  const logincenterToken = useSelector(state => state.selectedLoginCenter.token)
  const dispatch = useDispatch();
  const workerLoginStatus = useSelector((state) => state.workerLoginStatus);
  const selectedWorkerData = useSelector((state) => state.selectedWorkerData);
  const centerWorkerList = useSelector((state) => state.centerWorkerList);
  const [selectedworker, setSelectedworker] = useState(selectedWorkerData);
  const selectedLoginCenter = useSelector((state) => state.selectedLoginCenter);

  const [state, setState] = useState({
    age: "",
    name: "hai",
  });

  const handleChange = (event) => {
    const name = event.target.value;
    if (name != selectedworker._id) {
      let newSelectedWorker = centerWorkerList.filter(
        (item) => item._id == name
      );

      if (newSelectedWorker.length > 0) {
        setSelectedworker(newSelectedWorker[0]);
        dispatch(setSelectedWorkerData(newSelectedWorker[0]));
        dispatch(setWorkerLoginStatus(false));
        history.push("/center/workerlogin");
      }
    }
    // setState({
    //   ...state,
    //   [name]: event.target.value,
    // });
  };
  const [modal, setModal] = useState(false);

  const checkPWDisCreatedOrNot = async (e) => {

    e.preventDefault();
    let APIbody = {};
    const response = await instance
      .post(`${requests.fetchCheckAdminPassword}?lang=${language}`, APIbody, {
        headers: {
          Authorization: logincenterToken,
        },
      })
      .catch((error) => {
        let errorMessage = "";
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error.message;
        } else {
          errorMessage = error.response.data.message;
        }
        console.log("ee", error.response);
      });
    if (response && response.data) {
      console.log("Response: ===>  ", response.data.code);
      if (response.data.code == 208) {
        if (selectedLoginCenter.isActive == true) {
          history.push('/center/admin/dashboard')
          console.log("Password already set");
          dispatch(setWorkerLoginStatus(false));
        }
        else {

          console.log("Password already set");
          dispatch(setWorkerLoginStatus(false));
          history.push("/center/admin-login");
        }
      } else {
        setModal(true);
      }
    }
  };

  const handleMail = () => {
    dispatch(setWorkerLoginStatus(false));
    history.push("/center/suggetions")
  }

  return (
    <>
      <React.Fragment>
        {(props) => console.log(props, "props")}
        <AppBar position="sticky" elevation={0}>
          <Toolbar>
            <Grid container alignItems="center">
              <Hidden mdUp>
                <Grid item>
                  <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={onDrawerToggle}
                  >
                    <MenuIcon />
                  </IconButton>
                </Grid>
              </Hidden>
              {loginData.type !== "client" && loginData.type == "center" && (
                <Grid item>
                  <IconButton
                    color="inherit"
                    onClick={(e) => checkPWDisCreatedOrNot(e)}
                  >
                    <Indicator>
                      <div>
                        <svg
                          id="Icon_feather-settings"
                          data-name="Icon feather-settings"
                          xmlns="http://www.w3.org/2000/svg"
                          width="36"
                          height="36"
                          viewBox="0 0 36 36"
                        >
                          <path
                            id="Path_37"
                            data-name="Path 37"
                            d="M22.5,18A4.5,4.5,0,1,1,18,13.5,4.5,4.5,0,0,1,22.5,18Z"
                            fill="none"
                            stroke="#d61c38"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="3"
                          />
                          <path
                            id="Path_38"
                            data-name="Path 38"
                            d="M29.1,22.5a2.475,2.475,0,0,0,.495,2.73l.09.09a3,3,0,1,1-4.245,4.245l-.09-.09a2.5,2.5,0,0,0-4.23,1.77V31.5a3,3,0,1,1-6,0v-.135A2.475,2.475,0,0,0,13.5,29.1a2.475,2.475,0,0,0-2.73.495l-.09.09A3,3,0,1,1,6.435,25.44l.09-.09a2.5,2.5,0,0,0-1.77-4.23H4.5a3,3,0,1,1,0-6h.135A2.475,2.475,0,0,0,6.9,13.5a2.475,2.475,0,0,0-.5-2.73l-.09-.09A3,3,0,1,1,10.56,6.435l.09.09a2.475,2.475,0,0,0,2.73.495h.12A2.475,2.475,0,0,0,15,4.755V4.5a3,3,0,0,1,6,0v.135a2.5,2.5,0,0,0,4.23,1.77l.09-.09a3,3,0,1,1,4.245,4.245l-.09.09a2.475,2.475,0,0,0-.5,2.73v.12A2.475,2.475,0,0,0,31.245,15H31.5a3,3,0,0,1,0,6h-.135A2.475,2.475,0,0,0,29.1,22.5Z"
                            fill="none"
                            stroke="#d61c38"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="3"
                          />
                        </svg>
                      </div>
                    </Indicator>
                  </IconButton>
                </Grid>
              )}

              <Grid item>
                <img
                  alt="Lucy"
                  src="https://savetime-image.s3.eu-west-3.amazonaws.com/savetimelogo-178dfaf7-1ccd-4fe8-b473-82c09333bd87.png"
                  className="header-logo"
                />
                {/* <Search> */}
                {/* <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <Input placeholder="Search topics" />
            </Search> */}
              </Grid>
              {loginData.type !== "client" && (
                <Grid item style={{ marginLeft: "2rem" }}>
                  <span>{title}</span>
                </Grid>
              )}
              {workerLoginStatus == true && Object.keys(selectedworker).length > 0 && (
                <Grid item>
                  {workerLoginStatus == true && centerWorkerList.length > 1 && Object.keys(selectedworker).length > 0 ? (
                    <FormControl
                      style={{
                        marginLeft: "2rem",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                      fullWidth
                    >
                      {/* <InputLabel htmlFor="uncontrolled-native">Name</InputLabel> */}
                      <Select
                        // style={{ width: "200px" }}
                        onClick={(e) => handleChange(e)}
                        defaultValue={selectedworker._id}
                        inputProps={{
                          name: "name",
                          id: "uncontrolled-native",
                        }}
                      >
                        {centerWorkerList.length > 1 &&
                          centerWorkerList.map((item) => (
                            <MenuItem className="MenuItem" value={item._id}>
                              <div >
                                <img
                                  className="img_iconworker"
                                  src={item?.image}
                                />
                                <span className="workername">{item.name}</span>
                              </div>
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <div >
                      <img
                        className="img_iconworker"
                        src={selectedworker?.image}
                      />
                      <span className="workername">{selectedworker.name}</span>
                    </div>
                  )}
                </Grid>
                // <Grid item>
                //   <FormControl
                //     style={{
                //       marginLeft: "2rem",
                //       width: "100%",
                //       display: "flex",
                //       alignItems: "center",
                //     }}
                //     fullWidth
                //   >
                //     {/* <InputLabel htmlFor="uncontrolled-native">Name</InputLabel> */}
                //     <Select
                //       // style={{ width: "200px" }}
                //       onClick={(e) => handleChange(e)}
                //       defaultValue={selectedworker._id}
                //       inputProps={{
                //         name: "name",
                //         id: "uncontrolled-native",
                //       }}
                //     >
                //       {centerWorkerList.length > 0 &&
                //         centerWorkerList.map((item) => (
                //           <MenuItem className="MenuItem" value={item._id}>
                //             <div >
                //               <img
                //                 className="img_iconworker"
                //                 src={item?.image}
                //               />
                //               <span className="workername">{item.name}</span>
                //             </div>
                //           </MenuItem>
                //         ))}
                //     </Select>
                //   </FormControl>
                // </Grid>
              )}
              <Grid item xs />
              {loginData.type !== "client" && loginData.type == "center" && (
                <Grid
                  item
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "2rem",
                  }}
                >
                  <div onClick={() => { history.push("/center/centerImage") }}>
                    <img
                      className="img_icon_centerimage"
                      src={loginData?.image ? loginData.image : centerimage}

                    />
                  </div>
                  <div>{loginData.name}</div>
                </Grid>
              )}
              <Grid item>
                {/* <IconButton color="inherit">
              <Indicator badgeContent={7}>
                <Bell />
              </Indicator>
            </IconButton> */}

                {
                  loginData.type == "client" || loginData.type == "center" && (
                    <IconButton color="inherit">
                      <Indicator onClick={handleMail}>
                        <MailOutlineIcon />
                      </Indicator>
                    </IconButton>
                  )
                }
                {/* <IconButton color="inherit"> */}
                {/* <Indicator badgeContent={7}>
                <Bell />
              </Indicator> */}
                {/* </IconButton> */}

                <LanguageMenu />
                {loginData.type == "client" && <UserMenu />}
                {loginData.type == "center" && <CenterMenu />}
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </React.Fragment>

      {console.log("modal ====> ", modal)}
      {modal === true && <PWDLinkIsSend isOpen={modal} isClose={setModal} />}
    </>
  );
};
export default connect()(withTheme(Header));
