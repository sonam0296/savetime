import { AppBar, CssBaseline, Toolbar,
     Typography, Grow, Button, Popper, 
     Paper, MenuItem, MenuList
     } from '@material-ui/core';
import React from 'react';
import { red } from '@material-ui/core/colors';
import {Link, useHistory } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { AttachMoneySharp, BusinessOutlined, CreditCardRounded, Euro, EuroSymbolOutlined, HouseOutlined, Image, PeopleOutlineSharp, SubjectOutlined, WorkOutlined } from '@material-ui/icons';
import image from '../assets/adminLogo.png';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { errorToaster, successToaster } from '../common/common';
import instance from '../axios';
import requests from '../requests';
import { connect, useDispatch } from 'react-redux';
import { destroySession } from "../redux/actions/actions";

let token = null
let get_fcm_registration_token = null;

const mapStateToProps = (state) => {
    token = state.token;
}
const useStyles = makeStyles({
    
    root: {
        flexGrow: 1  
    },
    button:{
        flexGrow: 1
    },
    
    title:{
        float:'right',
        color:'black'
    },
    iconsColor:{
        color: red[500],
        marginLeft: '15px'
    },
    imaged: {
        marginLeft: '20px',
        width: '38px',
        height: '39px'
    },
})

const Header = () => {
    const classes = useStyles()
    const history = useHistory()
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleLogout = async (event) => {
        let data = {
            fcm_regi_token: true,
            fcm_registration_token: get_fcm_registration_token,
        }
        const response = await instance
            .post(requests.fetchLogout, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .catch((error) => {
                const errorMessage = error.response.data.error.message;
                errorToaster(errorMessage);
                console.log(errorMessage);
            });
        if (response && response.data)
            dispatch(destroySession());
        successToaster("Logout Successfully");
        // this.props.GET_FCM_REGISTRATION_TOKEN(null);
        setTimeout(() => {
            //   this.setState({ redirect: true });
             history.push('/');
        }, 2000);
    }

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <>
            <div className={classes.root}>
            <CssBaseline />
                {/* App Bar i.e header */}
                <AppBar position="fixed" style={{backgroundColor:"white"}}>
                    <Toolbar>
                        {/* <IconButton > */}
                        <Link to="/admin/dashboard"><BusinessOutlined fontSize="large" className={classes.iconsColor}/></Link>
                        <Link to="/admin/center"><HouseOutlined fontSize="large" className={classes.iconsColor} /></Link>
                        <Link to="/admin/workers"><WorkOutlined fontSize="large" className={classes.iconsColor} /></Link>
                        <Link to="/admin/users"><PeopleOutlineSharp fontSize="large" className={classes.iconsColor} /></Link>
                        <Link to="/admin/rates"><AttachMoneySharp fontSize="large" className={classes.iconsColor} /></Link>
                        <Link to="/admin/payments"><CreditCardRounded fontSize="large" className={classes.iconsColor} /></Link>
                        <Link to="/admin/billing"><EuroSymbolOutlined fontSize="large" className={classes.iconsColor} /></Link>
                        {/* </IconButton> */}
                        <Typography className={classes.button}>A</Typography>
                        <img src={image} className={classes.imaged} />
                        <Typography className={classes.title}>
                        <div>
                                <Button
                                    ref={anchorRef}
                                    aria-controls={open ? 'menu-list-grow' : undefined}
                                    aria-haspopup="true"
                                    onClick={handleToggle}
                                >
                                    Admin
                                </Button>
                                <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                                    {({ TransitionProps, placement }) => (
                                        <Grow
                                            {...TransitionProps}
                                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                        >
                                            <Paper>
                                                <ClickAwayListener onClickAway={handleClose}>
                                                    <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                                        {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
                                                        <MenuItem onClick={handleClose}>My account</MenuItem> */}
                                                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                                    </MenuList>
                                                </ClickAwayListener>
                                            </Paper>
                                        </Grow>
                                    )}
                                </Popper>
                            </div>
                        </Typography>
                    </Toolbar>
                </AppBar>
                </div>
        </>
    )
}

export default connect(mapStateToProps)(Header)