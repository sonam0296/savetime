import React, { useState } from "react";
import styled, { withTheme } from "styled-components";
import { connect, useSelector } from "react-redux";
import { darken } from "polished";
import { Link, useHistory } from "react-router-dom";
import { useWindowSize } from "react-use";
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
  Select,
  FormControl,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import {
  destroySession,
  setLoginData,
  setSelectedLoginCenter,
  setSelectLanguage,
  setWorkerLoginStatus,
} from "../../../redux/actions/actions";
import { Menu as MenuIcon } from "@material-ui/icons";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import requests from "../../../requests";
import instance from "../../../axios";
import PWDLinkIsSend from "./../../../Modal/CenterModel/PWDLinkIsSend";

import {
  Bell,
  MessageSquare,
  Search as SearchIcon,
  Power,
} from "react-feather";
import "./centerAdminHeader.css";
import { useTranslation } from "react-i18next";
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
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const mainLanguage = useSelector((state) => state.language);
  const [language, setLanguage] = useState(mainLanguage);

  const toggleMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorMenu(null);
  };

  const onLanguageChange = (e) => {
    const languageName = e.target.value;
    console.log(languageName, "name");
    console.log("language change");
    setLanguage(languageName);
    dispatch(setSelectLanguage(languageName));
    i18n.changeLanguage(languageName);
  };

  return (
    <React.Fragment>
      {console.log(language, "lan")}
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
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="es">Spanish</MenuItem>
        <MenuItem value="ca">Catalan</MenuItem>
        <MenuItem value="pt">Portugues</MenuItem>
        <MenuItem value="fr">French</MenuItem>
      </Select>
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
    history.push("/center/center-details");
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

const Header = ({ onDrawerToggle, title }) => {
  const loginData = useSelector((state) => state.loginData);
  const language = useSelector((state) => state.language);
  const history = useHistory();
  const token = useSelector((state) => state.token);
  const logincenterToken = useSelector(state => state.selectedLoginCenter.token)
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch()
  const { width, height } = useWindowSize();
  const loginDataAdmins = useSelector((state) => state.loginDataAdmin);
  const selectedLoginCenter = useSelector((state) => state.selectedLoginCenter);
  const [selectedLoginCenterState, setSelectedLoginCenterState] = useState(selectedLoginCenter)
  
  const handleChange = (event) => {
    const dropdownSelectId = event.target.value;
    if (dropdownSelectId != selectedLoginCenterState._id) {
      let newSelectedCenter = loginDataAdmins.filter(
        (item) => item._id === dropdownSelectId
      );

console.log(newSelectedCenter,'newSelectedCenter')

      if (newSelectedCenter.length > 0) {
        setSelectedLoginCenterState(newSelectedCenter[0]);
        dispatch(setSelectedLoginCenter(newSelectedCenter[0]));
        dispatch(setLoginData(newSelectedCenter[0]))
        dispatch(setWorkerLoginStatus(false))
        history.push("/center/admin/dashboard")
      }
    }
    // setState({
    //   ...state,
    //   [name]: event.target.value,
    // });
  };

  const checkPWDisCreatedOrNot = async (e) => {
    e.preventDefault();
    let APIbody = {};
    const response = await instance
      .post(`${requests.fetchCheckAdminPassword}?lang=${language}`, APIbody, {
        headers: {
          Authorization: `Bearer ${logincenterToken}`,
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
        console.log("Password already set");
        history.push("/center/admin-login");
      } else {
        setModal(true);
      }
    }
  };

  return (
    <>
      <React.Fragment>
        {(props) => console.log(props)}
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

              <Grid item>
                <IconButton
                  color="inherit"
                  onClick={(e) => checkPWDisCreatedOrNot(e)}
                >
                  <Indicator>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="46.294"
                      height="36"
                      viewBox="0 0 46.294 36"
                    >
                      <path
                        id="Icon_awesome-home"
                        data-name="Icon awesome-home"
                        d="M22.533,10.591,7.716,22.795V35.966A1.286,1.286,0,0,0,9,37.252l9.006-.023a1.286,1.286,0,0,0,1.279-1.286V28.251a1.286,1.286,0,0,1,1.286-1.286h5.143A1.286,1.286,0,0,1,27,28.251v7.686a1.286,1.286,0,0,0,1.286,1.29l9,.025a1.286,1.286,0,0,0,1.286-1.286V22.786L23.762,10.591a.98.98,0,0,0-1.23,0Zm23.405,8.295-6.719-5.538V2.216a.964.964,0,0,0-.964-.964h-4.5a.964.964,0,0,0-.964.964V8.052l-7.2-5.92a3.858,3.858,0,0,0-4.9,0L.349,18.886a.964.964,0,0,0-.129,1.358L2.27,22.735a.964.964,0,0,0,1.359.131L22.533,7.3a.98.98,0,0,1,1.23,0l18.9,15.57a.964.964,0,0,0,1.358-.129l2.049-2.491a.964.964,0,0,0-.137-1.361Z"
                        transform="translate(0.001 -1.252)"
                      />
                    </svg>
                  </Indicator>
                </IconButton>

                <IconButton
                  color="inherit"
                  onClick={(e) => checkPWDisCreatedOrNot(e)}
                >
                  <Indicator>
                    <svg
                      id="Icon_feather-settings"
                      data-name="Icon feather-settings"
                      xmlns="http://www.w3.org/2000/svg"
                      width="36"
                      height="36"
                      viewBox="0 0 36 36"
                    >
                      <path
                        id="Path_39"
                        data-name="Path 39"
                        d="M22.5,18A4.5,4.5,0,1,1,18,13.5,4.5,4.5,0,0,1,22.5,18Z"
                        fill="none"
                        stroke="#000"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                      />
                      <path
                        id="Path_40"
                        data-name="Path 40"
                        d="M29.1,22.5a2.475,2.475,0,0,0,.495,2.73l.09.09a3,3,0,1,1-4.245,4.245l-.09-.09a2.5,2.5,0,0,0-4.23,1.77V31.5a3,3,0,1,1-6,0v-.135A2.475,2.475,0,0,0,13.5,29.1a2.475,2.475,0,0,0-2.73.495l-.09.09A3,3,0,1,1,6.435,25.44l.09-.09a2.5,2.5,0,0,0-1.77-4.23H4.5a3,3,0,1,1,0-6h.135A2.475,2.475,0,0,0,6.9,13.5a2.475,2.475,0,0,0-.5-2.73l-.09-.09A3,3,0,1,1,10.56,6.435l.09.09a2.475,2.475,0,0,0,2.73.495h.12A2.475,2.475,0,0,0,15,4.755V4.5a3,3,0,0,1,6,0v.135a2.5,2.5,0,0,0,4.23,1.77l.09-.09a3,3,0,1,1,4.245,4.245l-.09.09a2.475,2.475,0,0,0-.5,2.73v.12A2.475,2.475,0,0,0,31.245,15H31.5a3,3,0,0,1,0,6h-.135A2.475,2.475,0,0,0,29.1,22.5Z"
                        fill="none"
                        stroke="#000"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                      />
                    </svg>
                  </Indicator>
                </IconButton>
              </Grid>
              {width > 768 && (
                <Grid item>
                  <span>{title}</span>
                </Grid>
              )}
              <Grid item xs />
              {loginDataAdmins &&
                loginDataAdmins?.length >1 ? (
                  <Grid item>
                    <FormControl
                      style={{
                        // marginLeft: "2rem",
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
                        defaultValue={selectedLoginCenterState._id}
                        inputProps={{
                          name: "name",
                          id: "uncontrolled-native",
                        }}
                      >
                        {loginDataAdmins.length > 0 &&
                          loginDataAdmins.map((item) => (
                            <MenuItem  value={item._id}>
                              <div>
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
                    </Grid>
                  ) : null}
              <Grid item>
                <IconButton color="inherit">
                  <Indicator>
                    <MailOutlineIcon />
                  </Indicator>
                </IconButton>
                <LanguageMenu />
                {/* <UserMenu /> */}
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
