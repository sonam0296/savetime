import {
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import Switch from "@material-ui/core/Switch";
import "./clients.css";
import instance from "../../axios";
import requests from "../../requests";
import { useDispatch, useSelector } from "react-redux";
import { errorToaster } from "../../common/common";
import TextField from '@material-ui/core/TextField';
import ClientData from "./ClientData";
import Header from "../../components/Header";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { setWorkerLoginStatus } from "../../redux/actions/actions";
const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    "&$checked": {
      transform: "translateX(16px)",
      color: theme.palette.common.white,
      "& + $track": {
        backgroundColor: "#52d869",
        opacity: 1,
        border: "none",
      },
    },
    "&$focusVisible $thumb": {
      color: "#52d869",
      border: "6px solid #fff",
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"]),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

function Clients() {
  const {t} = useTranslation();
  const language = useSelector(state => state.language)
  const [state, setState] = React.useState({
    checkedB: true,
  });
  const token = useSelector((state) => state.token);
  const logincenterToken = useSelector(state => state.selectedLoginCenter.token)
  const centerAdminLoginStatus = useSelector(
    (state) => state.centerAdminLoginStatus
  );
  const [search, setSearch] = useState('')
  const history = useHistory();
  const dispatch = useDispatch()
  const [centerList, setCenterList] = useState([]);
  const [selectedClientDetails, setSelectedClientDetails] = useState({})
  const [activate, setActivate] = useState(false)

  const closeActivate =  () => {
   
    getClients();
    setActivate(false)
  }


  const handleChange = async (event, client, index) => {
    let obj = {
      id: client._id,
      active: !client.active,
    };

    const response = await instance.put(`${requests.fetchClientStatus}?lang=${language}`, obj, 
      {
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
        errorToaster(errorMessage);
      });
    if (response && response.data) {
      getClients();
    }

    // setState(e.target.checked)
    // setState({ [event.target.name]: event.target.checked });
  };

  useEffect(() => {
    getClients();
    dispatch(setWorkerLoginStatus(false))
  }, []);
  useEffect(() => {
    getClients();
  }, [search.length==0]);

  const handleSearch = async (e) => {
    try {
      e.preventDefault();
     

      setSearch(e.target.value);
      // if (e.target.value.length > 2) {
      const response = await instance
        .post(
          `${requests.fetchCenter}?search=${e.target.value}&lang=${language}`,
          {
            type: "client",
          },
          {
            headers: {
              Authorization: logincenterToken,
            },
          }
        )
        .catch((error) => {
          let errorMessage = "";
          if (error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error.message;
          } else {
            errorMessage = error.response.data.message;
          }

          errorToaster(errorMessage);
        });

      setCenterList(response.data.data);
      // }
    } catch (error) {}
  };
  const getClients = async () => {
    const response = await instance
      .post(
        `${requests.fetchSearchResult}?lang=${language}`,
        {
          type: "client",
        },
        {
          headers: {
            Authorization: logincenterToken,
            "Content-Type": "application/json",
          },
        }
      )
      .catch((error) => {
      });
    if (response) {
      setCenterList(response.data.data);
    }
  };

  const handleClient = (clientData) =>{
    setSelectedClientDetails(clientData)
    setActivate(true)
  }
  const handleGoback = () =>{
    if(centerAdminLoginStatus==true){
      history.push('/center/admin/dashboard')
    }else{

    
    history.push('/center/main-page')
    }
  }

  return (
    <div>
      <Header title={t("Day Management")}/>
      <div className="clientsListDropdowm">
        <TextField
          onChange={(e)=>handleSearch(e)}
          value={search}
          id="standard-size-small"
          placeholder=" Search Clients"
          size="small"
        />
      </div>
      <div className="clientListMaindiv">
        {centerList.map((item, index) => {
          let clientData={
            id:item._id,
            image:item.image,
            name:item.name,
            phonenumber:item.phonenumber,
            emailAddress:item.emailAddress,
            active:item.active

          }
          return(
          <div  className ={ (item.active==true ? "client-info-active ": "client-info-inactive")}  >
            <img src={item.image} onClick={()=>handleClient(clientData)} />
            <div className="client-data">
              <h4>{item.name}</h4>
              <p>{item.phonenumber}</p>
              <p>{item.emailAddress}</p>
              <div className="switch">
              {item.active == true ? 
                <span style={{ color:'#00ad22', marginRight: "10px", marginTop: "7px" }}>
                  {t("Active")}
                  
                </span> :
                <span style={{ color:'#d61c38', marginRight: "10px", marginTop: "7px" }}>
                  {t("InActive")}
                </span>
                }
                <FormGroup>
                  <FormControlLabel
                    //   label="Activate"
                    control={
                      <IOSSwitch
                        checked={item.active}
                        onChange={(e) => handleChange(e, item, index)}
                        name="active"
                      />
                    }
                  />
                </FormGroup>
              </div>
            </div>
          </div>
         ) })}
        {/* <div className="client-info-inactive">
          <img src={addlogo} />
          <div className="client-data">
            <h4>Sanket Pawar</h4>
            <p>1234455677</p>
            <p>pawarsanket668@gmail.com</p>
            <div className="switch">
              <span style={{ marginRight: "10px", marginTop: "7px" }}>
                Activate
              </span>
              <FormGroup>
               <FormControlLabel
                  //   label="Activate"
                  control={
                    <IOSSwitch
                      checked={state.checkedB}
                      onChange={handleChange}
                      name="checkedB"
                    />
                  }
                />
              </FormGroup>
            </div>
          </div>
        </div> */}
      </div>
      <div className="main-btns">
        <div>
          <button onClick={()=>handleGoback()} className="returnbtn_main">{t("Go Back")}</button>
        </div>
        <div>
          <button className="createbtn_main">{t("Save")}</button>
        </div>
      </div>
      {
        activate &&
        <ClientData 
        isOpen={activate}
        selectedClientDetails={selectedClientDetails}
        onDeactivate={closeActivate}
        />
      }
    </div>
  );
}

export default Clients;
