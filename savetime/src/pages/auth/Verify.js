import { Button, DialogContent, DialogTitle } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import './verify.css'

function Verify(props) {
  const {t} = useTranslation();
  const [open, setOpen] = React.useState(false);
  const language = useSelector(state => state.language)
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("sm");
  const history = useHistory();

  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleLoginwith = () => {
    history.push("/auth/Otp");
    props.onDeactivate();
  };
  const handleLoginwithout = () => {
    history.push('/client/maindashboard');
    props.onDeactivate();
  };
  

  const handleClose = () => {
    props.onDeactivate();
    // setOpen(false);
  };
  return (
    <div>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={props.activate}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">
          <h2>{t("Please verify with otp")} !</h2>
        </DialogTitle>
        <DialogContent>
        {t("Note : If you choose verify without otp than you can access Savetime till next 7 days.")}
        </DialogContent>

        {/* <DialogActions> */}
        <div style={{display:'flex',justifyContent:'space-around',padding:'10px'}}>
        <Button onClick={()=>handleLoginwith()} color="primary" className="loginWithOtp">
        {t("Login with otp")}
        </Button>
        <Button onClick={()=>handleLoginwithout()} color="primary" className="loginWithoutOtp">
        {t("Login Without otp")}
        </Button>
        </div>
        {/* </DialogActions> */}
      </Dialog>
    </div>
  );
}

export default Verify;
