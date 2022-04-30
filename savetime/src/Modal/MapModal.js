import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import { Fade, TextField, InputAdornment, Grid, Button } from '@material-ui/core';
import './mapmodal.css'
import './map.css'
import Geocode from "react-geocode";
import { useTranslation } from 'react-i18next';
Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY);
Geocode.setLocationType(process.env.REACT_APP_LOCATION_TYPE);
Geocode.enableDebug();

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export function MapContainer(props) {
  const {t} = useTranslation();
  const classes = useStyles();
  let a = props.open;
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState({})
  const [input, setInput] = useState({});
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [direction, setDirection] = useState("")
  const [town, setTown] = useState("")
  const [postalcode, setPostalcode] = useState("")
  const [markers, setMarkers] = useState([
    {
      name: "Current position",
      position: {
        lat: 21.1702,
        lng: 72.8311
      }
    }
  ])

  const geocodeData = (data) => {
    Geocode.fromAddress(`${data.length > 0 ? data || town : props.countryName}`).then(
      (response) => {
        let { lat, lng } = response.results[0].geometry.location;
        setLat(parseFloat(lat))
        setLng(parseFloat(lng))
        const markers = [...markers];
        markers[0] = { ...markers[0], position: { lat, lng } };
        setLocation(location)
        setMarkers(markers)
      },
      (error) => {
        console.error(error);
      }
    );
  }

  useEffect(() => {
    geocodeData(props.countryName);
  }, [])

  const handleInput = (e) => {
    e.preventDefault();
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const handleTown = (e) => {
    if (e.target.value.length > 0) {
      setTown(e.target.value)
      geocodeData(e.target.value)
    } else {
      geocodeData(props.countryName)
    }
  }
  const handleSubmit = () => {

    const obj = {
      direction: direction,
      postalCode: postalcode,
      city: town,
      lng:lng,
      lat:lat,
    }


    props.handleMapValue(obj)
    props.handleCloseMap();
  }
  const handleDirection = (e) => {
    if (e.target.value.length > 0) {
      geocodeData(e.target.value)
      setDirection(e.target.value)
    } else {
      geocodeData(props.countryName)
      setDirection("")
    }

  }
  const handleClose = (e) => {
    e.preventDefault();
    props.handleCloseMap();
    setOpen(a);
  };
  const onMarkerDragEnd = (coord, index, map) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    const markers = [...markers];
    markers[index] = { ...markers[index], position: { lat, lng } };
    Geocode.fromLatLng(lat, lng).then(
      (response) => {
        const address = response.results[0].formatted_address;
        let city, state, country, postalcode;
        for (let i = 0; i < response.results[0].address_components.length; i++) {
          for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
            switch (response.results[0].address_components[i].types[j]) {
              case "locality":
                city = response.results[0].address_components[i].long_name;
                break;
              case "administrative_area_level_1":
                state = response.results[0].address_components[i].long_name;
                break;
              case "country":
                country = response.results[0].address_components[i].long_name;
                break;
              case "postal_code":
                postalcode = response.results[0].address_components[i].long_name;
                break;
            }
          }
        }

        setDirection(address)
        setTown(city)
        setPostalcode(postalcode)
      },
      (error) => {
        console.error(error);
      }
    );
    setMarkers(markers)
  }
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.openMap}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.openMap}>
          <div className="papers">
            <Grid container spacing={3} >
              <Grid items xs={6} >
                <div className="paper-form" >
                  <TextField
                    label="Country"
                    name="country"
                    id="standard-start-adornment"
                    className="text-field"
                    // onChange={(e) => handleInput(e)}
                    value={props.countryName}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">{t("Country")} :</InputAdornment>,
                    }}
                  />
                  <TextField
                    label="town"
                    name="town"
                    onChange={(e) => handleTown(e)}
                    value={town}
                    id="standard-start-adornment"
                    className="text-field"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">{t("Town")} :</InputAdornment>,
                    }}
                  />
                  <TextField
                    label="Direction"
                    name="direction"
                    id="standard-start-adornment"
                    onChange={(e) => handleDirection(e)}
                    value={direction}
                    className="text-field"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">{t("Direction")} :</InputAdornment>,
                    }}
                  />
                  <TextField
                    label="Postal Code"
                    name="postalCode"
                    id="standard-start-adornment"
                    className="text-field"
                    onChange={(e) => setPostalcode(e.target.value)}
                    value={postalcode}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">{t("Postal Code")} :</InputAdornment>,
                    }}
                  />
                </div>
              </Grid>
              <Grid items xs={6} style={{ position: "relative" }} >
                <Map
                  google={props.google}
                  zoom={8}
                  className="map"
                  center={{
                    lat: lat,
                    lng: lng
                  }}
                >
                  {markers.map((marker, index) => (
                    <Marker
                      position={marker.position}
                      draggable={true}
                      onDragend={(t, map, coord) => onMarkerDragEnd(coord, index, map)}
                      name={marker.name}
                    />
                  ))}
                </Map>
              </Grid>
              <Grid items xs={12} className="map-btn" >
                <div className="paper-btn" >
                  <Button variant="contained"
                    onClick={(e) => handleClose(e)}
                    style={{ backgroundColor: "red", color: "white" }}>
                    {t("Return")}
                  </Button>
                  <Button variant="contained" style={{ backgroundColor: "green", color: "white" }}
                    onClick={handleSubmit}
                  >
                    {t("Following")}
                  </Button>
                </div>
              </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY
})(MapContainer)