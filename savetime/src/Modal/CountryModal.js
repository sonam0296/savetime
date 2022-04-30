import React from 'react'
import contry from '../helper/countries.json'
import ReactCountryFlag from "react-country-flag"
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import "./country.css"
import { Fade, TextField, InputAdornment, Grid, Button, Typography } from '@material-ui/core';
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
function CountryModal(props) {
  const classes = useStyles();
  const handleFlag = (e, country) => {
    props.handleCountryName(country)
    props.closeCountryModal();
  }

  return (
    <div>
      {
        <div>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={props.open}
            // onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={true}>
              <div className="country-papers" >
                <div className="country-flag"  >
                  {
                    Object.keys(contry).map((c) => {
                      return (
                        <>
                          <Grid item xs={4} >
                            <div className="flag-text" onClick={(e) => handleFlag(e, contry[c])} >
                              <ReactCountryFlag
                                countryCode={c}
                                svg
                                style={{
                                  width: '2em',
                                  height: '2em',
                                }}
                                className="flags"
                                onClick={(e) => handleFlag(e, contry[c])}
                                title={c}

                                aria-label={contry[c]}
                              />
                              <p onClick={(e) => handleFlag(e, contry[c])}>{contry[c]}</p>
                            </div>
                          </Grid>
                        </>
                      )
                    })
                  }
                </div>
              </div>

            </Fade>

          </Modal>
        </div>
      }
    </div>
  )
}

export default CountryModal;
