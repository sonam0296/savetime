import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { AppBar, IconButton, InputBase, Toolbar, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { HouseOutlined, AttachMoneySharp, AddRounded } from '@material-ui/icons';
import instance from '../../axios';
import requests from '../../requests';
import { errorToaster, successToaster } from '../../common/common';
import { connect, useDispatch } from 'react-redux';
import { Grid } from '@material-ui/core'
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import { editCenterData, editRateData } from '../../redux/actions/actions';

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
            // backgroundColor: alpha(theme.palette.common.white, 0.15),
            // '&:hover': {
            //   backgroundColor: alpha(theme.palette.common.white, 0.25),
            // },
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
        }
    }
});


const BillingTableContent = () => {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [data, setData] = useState([]);
    const [isActive, setIsActive] = useState(false);
    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState();
    const history = useHistory()
    const [length, setLength] = useState([10, 9, 5, 6, 1, 2, 3, 4, 7, 8])
    const dataLength = data.slice(0, 10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const getWorkerList = async () => {
        let bodyAPI = {

        };
        const response = await instance.get(`${requests.fetchRates}?limit=20&pageNo=1`, bodyAPI, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        console.log(response.data.data, "Response getting");
        setData(response.data.data)
    }

    const onEdit = (e, item) => {
        dispatch(editRateData(item));
        history.push('/admin/updateRates')
    }

    const onAdd = (e, item) => {
        history.push('/admin/addRates')
    }

    const handleOnSearch = async (e) => {
        setSearchValue(e.target.value)
        const response = await instance.get(`${requests.fetchRates}?search=${e.target.value}&limit=20&pageNo=1`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        console.log(response.data.data, "Response ");
        setData(response.data.data)
    }

    const handlechangeRadio = async (e, item, index) => {
        const name = e.target.name;
        const value =
            e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setIsActive({
            [name]: value,
        });
        let body = {
            workerId: item._id,
            active: value
        }
        const response = await instance.put(requests.fetchWorkerStatus, body, {
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

    useEffect(() => {
        getWorkerList()
    }, [])

    return (
        <Paper className={classes.root}>
            <AppBar position="static" className={classes.static}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => getWorkerList("ALL")}
                    >
                        <AttachMoneySharp />
                    </IconButton>
                    <Typography className={classes.title} variant="h6" noWrap>
                        Rates
                    </Typography>
                    <div className={classes.search}>

                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            value={searchValue}
                            placeholder="Search???"
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

                            {/* <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, border: '2px solid red' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow> */}
                            <TableRow style={{ border: '2px solid #D50032' }}>

                                <TableCell
                                    style={{ border: '2px solid #D50032' }}
                                >
                                    No.
                                </TableCell>
                                <TableCell
                                    style={{ border: '2px solid #D50032' }}
                                >
                                    ID
                                </TableCell>
                                <TableCell
                                    style={{ border: '2px solid #D50032', width: '200px' }}
                                >
                                    Name
                                </TableCell>
                                <TableCell
                                    style={{ border: '2px solid #D50032', width: '200px' }}
                                >
                                    Annual Monthly
                                </TableCell>
                                <TableCell style={{ border: '2px solid #D50032' }}>
                                    ???
                                </TableCell>

                                <TableCell
                                    style={{ border: '2px solid #D50032' }}
                                >
                                    Edit
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data && data.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell style={{ border: '2px solid #D50032' }} >
                                        {index + 1}
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032', width: '150px' }} >
                                        {item.uniqueId}
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032', width: '300px' }} >
                                        {item.planName}
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032', width: '250px' }}>
                                        {item.duration}
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032', width: '150px' }} >
                                        {item.price}
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032', width: '100px' }} >
                                        <EditRoundedIcon
                                            onClick={(e) => onEdit(e, item)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {length && length.map((item, index)=>(
                                <TableRow>
                                    <TableCell style={{ border: '2px solid #D50032' }} >
                                        
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032', width: '150px' }} >
                                        
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032', width: '300px' }} >
                                        
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032', width: '250px' }}>
                                        
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032', width: '150px' }} >
                                        
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032', width: '100px' }} >
                                        <AddRounded
                                            onClick={(e) => onAdd(e, item)}
                                        />
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Paper>
    );
}

export default connect(mapStateToProps)(BillingTableContent)