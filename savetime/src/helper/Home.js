import { Grid, Button } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";
import { GoogleLogin } from 'react-google-login';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail'
import firebase from '../../firebase'
import { Redirect, withRouter } from 'react-router-dom';
import image from '../../assets/img/loadBackground.webp'
import HouseIcon from '@material-ui/icons/House';
import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';
import { OldSocialLogin as SocialLogin } from 'react-social-login'
import './home.css'
import instance from '../../axios';
import requests from '../../request';
import { useDispatch, useSelector } from 'react-redux'
import { TOKEN, LOGIN_USER, FORGOT } from '../../redux/action'
import { ToastProvider, useToasts } from 'react-toast-notifications';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { PersonPinCircleSharp } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

function Home(props) {

  const [checked, setChecked] = useState(false)
  const [verified, setVerified] = useState(true)
  const [redirect, setRedirect] = useState(false)
  const { addToast } = useToasts();
  const dispatch = useDispatch()
  const [open, setOpen] = useState(true)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const center = useSelector((data) => data.centerdata)
  const classes = useStyles();
  const handleOpenLogin = (e) => {
    e.preventDefault();
    const { history } = props;
    if (history) history.push("/login")
    setChecked(true)
    setOpen(false)
  }

  const handleSocialLogin = async (e) => {
    const { history } = props;
    if (e == "google") {
      var provider = new firebase.auth.GoogleAuthProvider();

    } else {
      var provider = new firebase.auth.FacebookAuthProvider();
    }

    firebase.auth()
      .signInWithPopup(provider)
      .then(async (result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in user info.
        // var user = result.user;
        const user = result.additionalUserInfo.profile;

        const bodyApi = {
          // "socialId": "112078697741148098101",
          // "socialProvider": result.additionalUserInfo.providerId,
          "socialId": user.id,
          "socialProvider": e == "google" ? "google" : "facebook",
          "emailAddress": user.email,
          "name": user.name,
          "userType": "client"
        }
        const response = await instance.post(requests.fetchSocialLogin, bodyApi)
          .catch(
            (error) => {
              let errorMessage = error.response.data.error.message
              addToast(errorMessage, { appearance: 'error', autoDismiss: true })
            }
          )
        if (response && response.data) {
          addToast('login successful', { appearance: 'success', autoDismiss: true });



          dispatch(TOKEN(response.data.data.token))
          dispatch(LOGIN_USER(response.data.data.user))
          setRedirect(true)


        }


      }).catch((error) => {
      });





    // email: "mosamshah601@gmail.com"
    // firstName: "Mosam"
    // id: "103189744911605896997"
    // lastName: "Shah"
    // name: "Mosam Shah"
    // profilePicURL: "https://lh3.googleusercontent.com/a-/AOh14Gg_L32jWPb31Qhbha19AxLXpmfogX1yzvGO3tDEnA=s96-c"
    // if (user) {


    //   const bodyApi = {
    //     // "socialId": "112078697741148098101",
    //     // "socialProvider": "facebook",
    //     "socialId": user.profile.id,
    //     "socialProvider": user.provider,
    //     "email": user.profile.email,
    //     "name": user.profile.name,
    //     "userType": "client"
    //   }
    //   const response = await instance.post(requests.fetchSocialLogin, bodyApi)
    //     .catch(
    //       (error) => {
    //         let errorMessage = error.response.data.error.message
    //         addToast(errorMessage, { appearance: 'error', autoDismiss: true })
    //       }
    //     )
    //   if (response && response.data) {
    //     addToast('login successful', { appearance: 'success', autoDismiss: true });
    //     dispatch(TOKEN(response.data.data.token))
    //     dispatch(LOGIN_USER(response.data.data.user))
    //   }
    // } else {
    // }


  }
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const handleOpenSignUp = () => {
    const { history } = props;
    if (history) history.push("/signup")

  }
  useEffect(() => {
    if (center && center.data) {
      if (center.data.verified) {
        setVerified(center.data.verified)
      } else {
        setVerified(center.data.verified)
      }
    }
  }, [])
  const handleOpenCenter = () => {

    const { history } = props;
    if (history) history.push("/registercenter")

  }
  const start = Boolean(anchorEl);
  return (
    <>

      {redirect && <Redirect to="/maindashboard" />}
      <Grid container className="home" >
        <img
          className="home-image"
          src={image}
        />


      </Grid>


      {
        <div>
          <Grid container className="content" >


            <Grid className="content-1">
              <div>
                <a href="https://www.savetime.es/" >
                  <img
                    src={"https://savetime-image.s3.eu-west-3.amazonaws.com/savetimelogo-178dfaf7-1ccd-4fe8-b473-82c09333bd87.png"}
                    className="logo"
                  />
                </a>
              </div>

            </Grid>
            <Grid className="content-2">
              <SocialLogin
                provider='google'
              // appId="504702210554-cetbad70d10nenkfpn9549e6ligrm0mh.apps.googleusercontent.com"

              // callback={handleSocialLogin}
              >
                <GoogleLoginButton
                  onClick={() => handleSocialLogin("google")}
                  className="social" />
              </SocialLogin>
              {/* 
            <GoogleLogin
              clientId="286274690055-3ir5fktq60nedqvm9nb8lgh0oofgub72.apps.googleusercontent.com"
              buttonText="Log in with Google"
              className="social"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
              // appId="1088597931155576"
              className="social" /> */}


              <SocialLogin
                provider='facebook'
              // appId="826201104782284"
              // callback={handleSocialLogin}
              >
                <FacebookLoginButton
                  className="social"
                  onClick={(e) => handleSocialLogin("facebook")}
                  value={"facebook"}
                />
              </SocialLogin>
              <h3></h3>

              <Button variant="contained" className="signup" onClick={() => handleOpenSignUp()}>
                Sign up with username
          </Button>
            </Grid>
            <Grid className="content-3">
              <div className="home-btn" onClick={() => handleOpenCenter()} >

                <span className="home-txt" >Register To Center</span>
                <HouseIcon className="icon" />
              </div>
            </Grid>
            <Grid className="footer" >
            </Grid>
            <Grid className="social-icon" >
              <InstagramIcon className="social-media" />
              <FacebookIcon className="social-media" />
            </Grid>

          </Grid>
        </div>
      }

      {
        !verified && <>
          <Button variant="contained" className="verify-btn"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
            aria-owns={start ? 'mouse-over-popover' : undefined}
            aria-haspopup="true"
          >
            Center Not verified
        </Button>
          {/* <Badge color="secondary"
          className="verify-btn"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          aria-owns={start ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"

          badgeContent={1}>
          <MailIcon />
        </Badge> */}
          <Popover
            id="mouse-over-popover"
            className="popover"
            classes={{
              paper: classes.paper,
            }}
            open={start}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            <Typography className="popover-text" >Please Verify Your Account Otherwise Account will be suspend in 7 days.</Typography>
          </Popover>


        </>
      }
      <div className="home-back" >
      </div>
      <Button variant="contained" className="login-btn"
        onClick={handleOpenLogin}
      >
        Log in
              </Button>
    </>
  )
}

export default withRouter(Home);

// const handleChange = (e) => {
//  setName(e.target.value)
// }
// const handleSubmit = () => {
//  dispatch(LOGIN_USER(name))
// }