import {
    Drawer, List, ListItem,
    ListItemText, ListItemIcon,
    Typography, Toolbar, AppBar,
    IconButton, CssBaseline,
    Grow, Button, Popper, Paper,
    MenuItem, MenuList
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { AttachMoneySharp, BusinessOutlined, CreditCardRounded, Euro, EuroSymbolOutlined, HouseOutlined, Image, PeopleOutlineSharp, SubjectOutlined, WorkOutlined } from '@material-ui/icons';
import React from 'react';
import Hidden from '@material-ui/core/Hidden';
import { useHistory, useLocation } from 'react-router-dom';
import { red } from '@material-ui/core/colors';
import image from '../../assets/adminLogo.png';
import MenuIcon from '@material-ui/icons/Menu';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { errorToaster, successToaster } from '../../common/common';
import instance from '../../axios';
import requests from '../../requests';
import { connect, useDispatch } from 'react-redux';
import { destroySession } from "../../redux/actions/actions";

let token = null
let get_fcm_registration_token = null;

const mapStateToProps = (state) => {
    token = state.token;
}

const drawerWidth = 240

const useStyles = makeStyles((theme) => {
    return {
        pages: {
            width: '100%',
            padding: theme.spacing(3)
        },
        root: {
            display: 'flex'
        },
        toolbar: theme.mixins.toolbar,
        drawer: {
            [theme.breakpoints.up('sm')]: {
                width: drawerWidth,
                flexShrink: 0,
            },
            color: 'black'
        },
        drawerPaper: {
            width: drawerWidth,
        },

        active: {
            background: '#f4f4f4'
        },
        title: {
            padding: theme.spacing(5)
        },
        appbar: {
            [theme.breakpoints.up('sm')]: {
                width: `calc(100% - ${drawerWidth}px)`,
                marginLeft: drawerWidth,

            },
            backgroundColor: 'white'
        },
        adminBar: {
            flexGrow: 1
        },
        adminLogo: {
            color: 'black'
        },
        imaged: {
            marginLeft: '20px',
            width: '38px',
            height: '39px'
        },
        menuButton: {
            marginRight: theme.spacing(2),
            [theme.breakpoints.up('sm')]: {
                display: 'none',
            },
            color: 'black'
        },

    }

})

const Sidebar = (props) => {
    const { window } = props
    const classes = useStyles()
    const history = useHistory()
    const theme = useTheme();
    const dispatch = useDispatch();
    const [mobileOpen, setMobileOpen] = React.useState(false);
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

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // useLocation is used to check whether the class is active or not to give the css.
    const location = useLocation()

    const menuItems = [
        {
            text: 'Business',
            icon: <BusinessOutlined style={{ color: red[500] }} />,
            path: '/admin/dashboard'
        },
        {
            text: 'Centers',
            icon: <HouseOutlined style={{ color: red[500] }} />,
            path: '/admin/center'
        },
        {
            text: 'Workers',
            icon: <WorkOutlined style={{ color: red[500] }} />,
            path: '/admin/workers'
        },
        {
            text: 'Users',
            icon: <PeopleOutlineSharp style={{ color: red[500] }} />,
            path: '/admin/users'
        },
        {
            text: 'Rates',
            icon: <AttachMoneySharp style={{ color: red[500] }} />,
            path: '/admin/rates'
        },
        {
            text: 'Payment Status',
            icon: <CreditCardRounded style={{ color: red[500] }} />,
            path: '/admin/payments'
        },
        {
            text: 'Billing',
            icon: <EuroSymbolOutlined style={{ color: red[500] }} />,
            path: '/admin/billing'
        },
    ]

    const drawer = (
        <div>
            <div>
                <Typography variant="h5" className={classes.title}>
                    SaveTime
                </Typography>
            </div>

            <List>
                {menuItems.map(item => (
                    <ListItem
                        key={item.text}
                        button
                        onClick={() => history.push(item.path)}
                        className={location.pathname == item.path ? classes.active : null}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;
    return (
        <>
            <div className={classes.root}>
                <CssBaseline />
                {/* App Bar i.e header */}
                <AppBar className={classes.appbar}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            className={classes.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography className={classes.adminBar}></Typography>
                        <img src={image} className={classes.imaged} />
                        <Typography className={classes.adminLogo}>
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
                <nav className={classes.drawer} aria-label="mailbox folders">
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Hidden smUp implementation="css">
                        <Drawer
                            container={container}
                            variant="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                </nav>
                {/* <div className={classes.pages}>
                    <div className={classes.toolbar}></div>
                <TableContent/>
                </div> */}
            </div>
        </>
    )
}

export default connect(mapStateToProps)(Sidebar)