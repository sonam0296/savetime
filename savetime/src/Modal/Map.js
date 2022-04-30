import React, { Component } from 'react'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import './map.css'
import axios from 'axios'
import Geocode from "react-geocode";
Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY);
Geocode.setLocationType("ROOFTOP");
Geocode.enableDebug();

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [
        {
          name: "Current position",
          position: {
            lat: 21.1702,
            lng: 72.8311
          }
        }
      ],
      selectedPlace: {
        name: "Ahmedabad"
      }
    }
  }
  onHandelAddress = () => {
    // Enable or disable logs. Its optional.
    const lat = this.state.markers[0].position.lat
    const lng = this.state.markers[0].position.lng
    Geocode.fromLatLng(lat, lng).then(
      (response) => {
        const address = response.results[0].formatted_address;
        let city, state, country;
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
            }
          }
        }
      },
      (error) => {
        console.error("error", error);
      }
    ).catch((error) => console.log("geocode error", error));
  }
  onMarkerDragEnd = (coord, index, map) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    this.setState(prevState => {
      const markers = [...this.state.markers];
      markers[index] = { ...markers[index], position: { lat, lng } };
      Geocode.fromLatLng(lat, lng).then(
        (response) => {
          const address = response.results[0].formatted_address;
          let city, state, country;
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
              }
            }
          }
         
        },
        (error) => {
          console.error(error);
        }
      );
      const reverse = axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`).then((result) => console.log("reverse", result))
      return { markers };
    });
  }
  render() {
    return (
      <Map
        google={this.props.google}
        zoom={9}
        className="map"
        // style={mapStyles}
        initialCenter={{ lat: 21.1702, lng: 72.8311 }}
      >
        {this.state.markers.map((marker, index) => (
          <Marker
            position={marker.position}
            draggable={true}
            onDragend={(t, map, coord) => this.onMarkerDragEnd(coord, index, map)}
            name={marker.name}
          />
        ))}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: `${process.env.REACT_APP_GOOGLE_API_KEY}`
})(MapContainer)