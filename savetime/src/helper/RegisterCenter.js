import React, { useState } from 'react';
import { withRouter } from 'react-router-dom'
import {
  makeStyles,
  withStyles,
  Button,
  TextField,
  Grid,
  Typography
} from '@material-ui/core';
import './registercenter.css'
import { useToasts } from 'react-toast-notifications';
import request from '../../../request'
import instance from '../../../axios'
import { EMAIL, FORGOT, CENTER_DATA } from '../../../redux/action'
import ActivationModal from '../../Modal/ActivationModal'
import { useDispatch } from 'react-redux'
import mapimage from '../../../assets/img/gmp2.png'
import Map from '../../Modal/MapModal'
import CountryModal from '../../Modal/CountryModal'
const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },

  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'green',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'green',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'yellow',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'green',
      },
    },
  },
})(TextField);

function RegisterCenter(props) {
  const [open, setOpen] = useState(false)
  const classes = useStyles();
  const [openmap, setOpenmap] = useState(false)
  const [activeStep, setActiveStep] = React.useState(0);
  const [input, setInput] = React.useState({});
  const { addToast } = useToasts();
  const dispatch = useDispatch()
  const [enable, setEnable] = useState(false)
  const [country, setCountry] = useState(false)
  const [countryName, setCountryName] = useState()
  const handleCountry = (e) => {
    e.preventDefault();
    setCountry(true)
  }
  const handleCloseCountry = () => {

    setCountry(false)
  }
  const handleOpen = () => {
    setOpenmap(true)
  }
  const handleCloseMap = () => {
    setOpenmap(false)
  }
  const handleInput = (event) => {
    event.preventDefault();
    setInput((input) => ({ ...input, [event.target.name]: event.target.value }))
    if (Object.keys(input).length == 10) {
      setEnable(true)
    }
    if (event.target.value.length == 0) {
      setEnable(false)
    }
    for (const key in input) {
      if (Object.hasOwnProperty.call(input, key)) {
        const element = input[key];
        if (element && element.length == 0 || element == "") {
          setEnable(false)
        }
      }
    }
    if (event.target.name == "confirmPassword") {
      if (event.target.value.length == input.password.length) {
        if (input.password !== event.target.value) {
          setEnable(false)
          addToast("passwod missmatch", { appearance: "error", autoDismiss: true })
        }
      } else {
        setEnable(false)
      }
    }
    if (event.target.name == "password") {
      if (input.confirmPassword && input.confirmPassword.length > 0) {
        if ((event.target.value !== input.confirmPassword)) {
          setEnable(false)
        }
      } else {
        setEnable(false)
      }
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(FORGOT(false))
    const { history } = props;
    input.type = "center"
    input.confirmPassword = undefined
    setInput(input)
    const response = await instance.post(request.fetchCreateUser, input)
      .catch(
        (error) => {
          let errorMessage = error.response.data.message
          addToast(errorMessage, { appearance: 'error', autoDismiss: true })
        }
      )
    if (response && response.data) {
      setActiveStep(activeStep + 1)
      dispatch(EMAIL(response.data.data.emailAddress))
      dispatch(CENTER_DATA(response.data))
      addToast("Successfully Submited", { appearance: 'success', autoDismiss: true })
      setOpen(true)

    }
  }
  const handleBackStep = (e) => {
    e.preventDefault();
    const { history } = props;
    history.push("/")
    setActiveStep(0)
  }
  const handleCountryName = (name) => {
    setCountryName(name)
    input.country = name
    setInput(input)
  }
  return (
    <>
      <Grid container className="center" >
        <div className="center-header" >
          <Typography variant="h6" className="center-header-text" >
            Fill in the center details
          </Typography>
        </div>
        <div className={classes.paper}>
          <form className="center-form" noValidate autoComplete='off'>
            <Grid item xs={6} container spacing={7} className="grid-1" >
              <CssTextField
                id="standard-full-width"
                label="Center Name"
                required
                name="name"
                value={input.name}
                onChange={(e) => handleInput(e)}
                style={{ margin: 8 }}
                placeholder="Name of the centre"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                  color: "white"
                }}
              />
              <CssTextField
                id="standard-full-width"
                autoComplete='off'
                label="Country"
                required
                style={{ margin: 8 }}
                placeholder="Country"
                onClick={(e) => handleCountry(e)}
                fullWidth
                name="country"
                value={countryName}
                defaultValue={""}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                  color: "white"
                }}
              />
              <CssTextField
                id="standard-full-width"
                autoComplete='off'
                label="City"
                required
                style={{ margin: 8 }}
                placeholder="City"
                fullWidth
                name="city"
                value={input.city && input.city.length > 0 ? input.city : ""}
                defaultValue={""}
                onChange={(e) => handleInput(e)}

                margin="normal"
                InputLabelProps={{
                  shrink: true,
                  color: "white"
                }}
              />
              <CssTextField
                id="standard-full-width"
                autoComplete='off'
                label="PostalCode"
                required
                style={{ margin: 8 }}
                placeholder="PostalCode"
                fullWidth
                name="postalCode"
                value={input.postalCode && input.postalCode.length > 0 ? input.postalCode : ""}
                defaultValue={""}
                onChange={(e) => handleInput(e)}

                margin="normal"
                InputLabelProps={{
                  shrink: true,
                  color: "white"
                }}
              />
              <CssTextField
                id="standard-full-width"
                autoComplete='off'
                label="Phone"
                required
                style={{ margin: 8 }}
                placeholder="Mobile no"
                fullWidth
                name="phonenumber"
                value={input.phonenumber && input.phonenumber.length > 0 ? input.phonenumber : ""}
                defaultValue={""}
                onChange={(e) => handleInput(e)}

                margin="normal"
                InputLabelProps={{
                  shrink: true,
                  color: "white"
                }}
              />
            </Grid>
            <Grid item xs={6} container spacing={7} className="grid-2" >
              <CssTextField
                id="standard-full-width"
                autoComplete='off'
                label="Direction of Center"
                required
                style={{ margin: 8 }}
                placeholder="Direction of Center"
                fullWidth
                name="direction"
                value={input.direction && input.direction.length > 0 ? input.direction : ""}
                defaultValue={""}
                onChange={(e) => handleInput(e)}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                  color: "white"
                }}
              />
              <img
                onClick={() => handleOpen()}
                src={mapimage}
                width="50px"
                height="50px"
              />
              <CssTextField
                id="standard-full-width"
                label="Time Zone"
                autoComplete='off'
                required
                style={{ margin: 8 }}
                placeholder="GMT"
                fullWidth
                name="timezone"
                value={input.timezone && input.timezone.length > 0 ? input.timezone : ""}
                defaultValue={""}
                onChange={(e) => handleInput(e)}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                  color: "white"
                }}
              // InputProps={{
              //   startAdornment: <InputAdornment position="start">GMT:</InputAdornment>,
              // }}
              />
              <CssTextField
                id="standard-full-width"
                label="Email"
                style={{ margin: 8 }}
                placeholder="Email"
                required
                type="email"
                name="emailAddress"
                value={input.emailAddress}
                onChange={(e) => handleInput(e)}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <CssTextField
                id="standard-full-width"
                label="Password"
                required
                style={{ margin: 8 }}
                placeholder="Password"
                type="password"
                name="password"
                value={input.password}
                onChange={(e) => handleInput(e)}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <CssTextField
                id="standard-full-width"
                label="Confirm Password"
                style={{ margin: 8 }}
                placeholder="Confirm Password"
                name="confirmPassword"
                value={input.confirmPassword}
                onChange={(e) => handleInput(e)}
                type="password"
                required
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />


            </Grid>
          </form>
        </div>
      </Grid>
      <div className="grid-3" >
        {enable ? (<Button
          type="submit"
          style={{ backgroundColor: "green", color: "white" }}
          variant="contained"
          color="primary"
          className="submit"
          onClick={(e) => handleSubmit(e)}
        >
          Sign Up
        </Button>) :
          (<Button
            type="submit"
            disabled
            variant="contained"
            className="submit"
          >
            Sign Up
          </Button>)}
        <Button
          style={{ backgroundColor: "red", color: "white" }}
          variant="contained"
          color="primary"
          className="submit"
          onClick={(e) => handleBackStep(e)}
        >
          Back
        </Button>
      </div>
      {country && <CountryModal country={country} handleCountryName={handleCountryName} handleCloseCountry={handleCloseCountry} />}
      {openmap && <Map open={openmap} onClose={handleCloseMap} />}
      {open && <ActivationModal open={open} />}
    </>
  );
}
export default withRouter(RegisterCenter);


