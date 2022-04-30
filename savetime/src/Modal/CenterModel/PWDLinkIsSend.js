import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Fade, TextField, InputAdornment, Grid, Button, Typography } from '@material-ui/core';
import { useToasts } from 'react-toast-notifications';
import Switch from '@material-ui/core/Switch';
import Avatar from 'react-avatar';
import { Close, LocalGasStationRounded } from '@material-ui/icons'
import {
  successToaster,
  errorToaster
} from '../../common/common'
import { useTranslation } from 'react-i18next';


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


export function PWDLinkIsSend({
    isOpen,
    isClose
}) {
  const classes = useStyles();
  const {t} = useTranslation();

  return (
    <div>
      <Modal
        className={classes.modal}
        open={isOpen}
        onClose={() => isClose(false)}
        closeAfterTransition
        style={{textAlign:"center"}}
      >
        <Fade in={isOpen}>
          <div style={{backgroundColor: 'white', padding:"2rem"}} >


            <Grid container>
              {/* <Grid items xs={12} style={{ position: "relative" }} >
                <div className="close-icon"  >
                  <Close className="close" 
                    onClick={(e) => isClose(false)} 
                  />
                </div>

              </Grid> */}
              {/* <Grid items xs={6} lg={6} sm={6} xl={6} row > */}
             
                <Grid items xs={12}  >
                    <div>
                        <h3>
                            {t("Set password link successfully send on your mail, please check your mail")}.
                        </h3>
                    </div>
                    <div>
                    <Button variant="contained" style={{ backgroundColor: "green", color: "white", textAlign:"center" }}
                        onClick={() => isClose(false)}
                    >
                        {t("Okay")}
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

export default PWDLinkIsSend