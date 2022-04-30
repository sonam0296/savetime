import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import './activation.css'
// import {withRouter} from 'react-router-dom'
import CloseIcon from '@material-ui/icons/Close';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function TransitionsModal(props) {
  const {t} = useTranslation();
  const classes = useStyles();
  const [start, setStart] = React.useState(true);


  const handleClose = () => {
    setStart(false);
    const { history } = props;
    history.push("/")

  };
  const handleBackHome = () => {
    const { history } = props;
    if(props.managerStatus==true){
      history.push('/center/centerData')
    }else{

      history.push('/center/center-details')
    }


  };

  return (
    <div>

      {
        start && <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={props.activate}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={props.activate}>
            <div className="paper">
              <CloseIcon className="close-icon" onClick={() => handleClose()} />
              <h2 id="transition-modal-title" className="title" >{t("Please Activate Your Account")} </h2>
              <p id="transition-modal-description" className="description">{t("Activation Links sent form avisos@savetime.es to your account Please make activate. If you are not activate now savetime will allow you to access till newx 7 days.")}</p>
              <Button className="back-btn" variant="contained" color="secondary" onClick={handleBackHome}>
                {t("OK")}
              </Button >
            </div>
          </Fade>

        </Modal>
      }
    </div>
  );
}
export default withRouter(TransitionsModal)