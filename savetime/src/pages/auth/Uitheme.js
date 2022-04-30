import { Button, Grid } from '@material-ui/core';
import React from 'react'
import "./style.css";
import { useHistory } from 'react-router-dom';


function Uitheme() {
  const history = useHistory();

  const handleSample = () => {
    history.push("/auth/sign-in")
  }


  return (
    <>
      <div>
        <div className="home-container"  >
          <div className="home-content" >
            <Grid container className="items" >
              <Grid item xs={12} sm={12} md={4} xl={4} lg={4} >
                <div>
                  <img
                    className="home-logo"
                    src={"https://savetime-image.s3.eu-west-3.amazonaws.com/LOGO_SAVETIME_3_blanco-5308215e-79ba-4df4-9335-730d642a5350.png"}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={4} xl={4} lg={4} >

              </Grid>
              <Grid item xs={12} sm={12} md={4} xl={4} lg={4} >

              </Grid>

            </Grid>
          </div>
          <div className="home-image"  >
            <img
              className="bg-image"
              src={"https://savetime-image.s3.amazonaws.com/Fondo%20pantalla%201%20Registro%20centros-46b309f1-39ad-44ee-81fd-2a550b11966e.png"}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Uitheme
