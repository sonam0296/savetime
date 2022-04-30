import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { AppBar, Button, IconButton, InputBase, Toolbar, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { HouseOutlined } from '@material-ui/icons';
import instance from '../../axios';
import requests from '../../requests';
import { errorToaster, successToaster } from '../../common/common';
import { connect, useDispatch } from 'react-redux';
import { Grid } from '@material-ui/core'
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import { Link, useHistory } from 'react-router-dom';
import TablePagination from '@material-ui/core/TablePagination';
import {editCenterData} from '../../redux/actions/actions'
import '../Users/UserTable.css'


let token = null

const mapStateToProps = (state) => {
    token = state.token;
}


const useStyles = makeStyles((theme) => {
    return {
        root: {
            width: '100%',
        },
        container: {

            maxHeight: 450,
        },
        title: {
            flexGrow: 1,
            display: 'none',
            [theme.breakpoints.up('sm')]: {
                display: 'block',
            },
            color: 'black'
        },
        search: {
            position: 'relative',
            borderRadius: '20px',
            marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(1),
                width: 'auto',
            },
            border: '2px solid black'
        },
        searchIcon: {
            padding: theme.spacing(0, 2),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'black'
        },
        inputRoot: {
            color: 'inherit',
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                width: '12ch',
                '&:focus': {
                    width: '20ch',
                },
            },
            color: 'black'
        },
        static: {
            flexGrow: '1',
            backgroundColor: 'white',
            border: '2px solid #D50032'
        },
        menuButton: {
            marginRight: theme.spacing(2),
            color: '#D50032'
        },
        table: {
            width: '100%',
            display: 'block',
            overflowX: 'auto'
        },
        button: {
            position: 'relative',
            borderRadius: '20px',
            // backgroundColor: alpha(theme.palette.common.white, 0.15),
            // '&:hover': {
            backgroundColor: 'white !important',
            color: '#D50032 !important',
            // },
            marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(1),
                width: 'auto',
            },

        },
    }
});


const CenterTableContent = () => {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [searchValue, setSearchValue] = useState();
    const [status, setStatus] = useState("ALL");
    const [isActive, setIsActive] = useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const dispatch = useDispatch()
    const history = useHistory()

    const getCenterList = async (statusCode) => {
        setStatus(statusCode)
        let bodyAPI = {

        };
        if (statusCode == "ALL") {
            bodyAPI = {}
        }
        else if (statusCode == "isDeleted") {
            bodyAPI = {
                isDeleted: true,
            }
        }
        else if (statusCode == "isActive") {
            bodyAPI = {
                active: false
            }
        }
        const response = await instance.post(`${requests.fetchList}?limit=20&pageNo=1`, bodyAPI, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        console.log(response.data.data, "Response getting");
        setData(response.data.data)

    }


    const handlechangeRadio = async(e, item, index) => {
        const name = e.target.name;
        const value =
          e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setIsActive({
          [name]: value,
        });
        let body = {
            id: item._id,
            active: value
        }
        const response = await instance.put(requests.fetchStatuses, body, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        let tempData = data;
        tempData[index].active = value
        setData(tempData);
       

        console.log(value, "hello");
        console.log(response, "res");
      };

    const handleOnSearch = async (e) => {
        setSearchValue(e.target.value)
        const response = await instance.post(`${requests.fetchList}?search=${e.target.value}&limit=20&pageNo=1`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        console.log(response.data.data, "Response getting");
        setData(response.data.data)
    }

    const onEdit = (e, item) =>{
        dispatch(editCenterData(item));
        history.push('/admin/update')
    }

    useEffect(() => {
        getCenterList("All")
    }, [])

    return (
       
        <Paper className={classes.root}>
             {
            console.log(data)
        }
            <AppBar position="static" className={classes.static}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => getCenterList("ALL")}
                    >
                        <HouseOutlined />
                    </IconButton>
                    <Typography
                        className={classes.title}
                        variant="h6"
                        noWrap
                    >
                        Centers
                    </Typography>

                    <div className={classes.button}>
                        {status == "isDeleted" ?
                            <Button
                                variant="outlined"
                                style={{ color: '#D50032', borderRadius: '20px', border: '2px solid #D50032' }}
                                onClick={() => getCenterList("ALL")}
                            >
                                Eliminated Centers X
                            </Button>
                            :
                            <Button
                                variant="outlined"
                                style={{ color: '#D50032', borderRadius: '20px', border: '2px solid #D50032' }}
                                onClick={() => getCenterList("isDeleted")}
                            >
                                Eliminated Centers
                            </Button>
                        }


                    </div>

                    <div className={classes.button} >
                        {
                            status == "isActive" ?
                                <Button
                                    variant="outlined"
                                    style={{ color: '#D50032', borderRadius: '20px', border: '2px solid #D50032' }}
                                    onClick={() => getCenterList("ALL")}
                                >
                                    Deactivated Centers X
                                </Button>
                                :
                                <Button
                                    variant="outlined"
                                    style={{ color: '#D50032', borderRadius: '20px', border: '2px solid #D50032' }}
                                    onClick={() => getCenterList("isActive")}
                                >
                                    Deactivated Centers
                                </Button>
                        }

                    </div>

                    <div className={classes.search}>

                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            value={searchValue}
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={(e) => handleOnSearch(e)}
                        />
                    </div>
                </Toolbar>
            </AppBar>
            <Grid >
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table" className={classes.table}>
                        <TableHead>
                            <TableRow style={{ border: '2px solid #D50032' }}>

                                <TableCell
                                    style={{ border: '2px solid #D50032' }}
                                >
                                    No
                                </TableCell>
                                <TableCell
                                    style={{ border: '2px solid #D50032' }}
                                >
                                    ID
                                </TableCell>
                                <TableCell
                                    style={{ border: '2px solid #D50032' }}
                                >
                                    Name
                                </TableCell>
                                <TableCell
                                    style={{ border: '2px solid #D50032' }}
                                >
                                    Email
                                </TableCell>
                                <TableCell
                                    style={{ border: '2px solid #D50032' }}
                                >
                                    Telp
                                </TableCell>
                                <TableCell
                                    style={{ border: '2px solid #D50032' }}
                                >
                                    Country
                                </TableCell>
                                <TableCell
                                    style={{ border: '2px solid #D50032' }}
                                >
                                    City
                                </TableCell>
                                <TableCell
                                    style={{ border: '2px solid #D50032' }}
                                >
                                    Rates
                                </TableCell>
                                <TableCell
                                    style={{ border: '2px solid #D50032' }}
                                >
                                    Ult.Vez
                                </TableCell>
                                <TableCell
                                    style={{ border: '2px solid #D50032' }}
                                >
                                    No of Workers
                                </TableCell>
                                <TableCell
                                    style={{ border: '2px solid #D50032' }}
                                >
                                    No of Reservations
                                </TableCell>
                                <TableCell
                                    style={{ border: '2px solid #D50032' }}
                                >
                                    Active
                                </TableCell>
                                <TableCell
                                    style={{ border: '2px solid #D50032' }}
                                >
                                    Edit
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {/* {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return ( */}
                        <TableBody>
                            {data && data.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell style={{ border: '2px solid #D50032' }} >
                                        {index + 1}
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032' }} >
                                        {item.uniqueId}
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032' }} >
                                        {item.name}
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032' }}>
                                        {item.emailAddress}
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032' }}>
                                        {item.phonenumber}
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032' }} >
                                        {item.country}
                                    </TableCell>

                                    <TableCell style={{ border: '2px solid #D50032' }}>
                                        {item.city}
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032' }}>
                                        {/* {item.city} */}
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032' }}>
                                        {/* {item.city} */}
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032' }} >
                                        {item.workerCount}
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032' }} >
                                        {item.bookingCount}
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032' }} className="custom-toggle">
                                    <label class="switch">
                                        {item.active === true ? (
                                            <input
                                                defaultChecked
                                                type="checkbox"
                                                name="status"
                                                value={item.active}
                                                onChange={(e) => handlechangeRadio(e, item, index)}
                                            />
                                        ) : (
                                            <input
                                                type="checkbox"
                                                name="status"
                                                value={item.active}
                                                onChange={(e) => handlechangeRadio(e, item, index)}
                                            />
                                        )}
                                        <span className="slider round" />
                                        </label>
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032' }} >
                                        {/* <Link to="/admin/update"> */}
                                            <EditRoundedIcon 
                                            onClick={(e)=>onEdit(e, item)}
                                            />
                                        {/* </Link> */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
              {/* )
            })} */}
                    </Table>
                </TableContainer>

            </Grid>
        </Paper>
    );
}

export default connect(mapStateToProps)(CenterTableContent)