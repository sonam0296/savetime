import React, { useEffect, useState } from 'react';
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
import { HouseOutlined, WorkOutlined } from '@material-ui/icons';
import instance from '../../axios';
import requests from '../../requests';
import { errorToaster, successToaster } from '../../common/common';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import { TablePagination } from '@material-ui/core';

let token = null

const mapStateToProps = (state) => {
    token = state.token;
}

const useStyles = makeStyles((theme) => {
    return {
        root: {
            width: '100%',
            textAlign: 'center',
            border: "1px solid #D50032",
            "&.MuiTableCell-root": {
                whiteSpace: "nowrap"
            }
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
        },
        menuButton: {
            marginRight: theme.spacing(2),
            color: '#D50032'
        },
        table: {
            width: '100%',
            overflowX: 'auto',
            display: 'block',
            "&.MuiTableCell-root": {
                border: "1px solid #D50032",
            },
            "&.MuiTableRow-root": {
                whiteSpace: "nowrap"
            },

        }
    }
});

const CenterTableContent = ({ tableData }) => {
    const classes = useStyles();
    const loginData = useSelector((state) => state.loginData);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = useState([]);
    const [data, setData] = useState([]);
    const dispatch = useDispatch();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        // getCenterList()
    }, [])

    return (
        <>
            <Paper className={classes.root}>
                <AppBar position="static" className={classes.static}>
                    <Toolbar>
                        {/* <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="open drawer"
                        >
                            <WorkOutlined />
                        </IconButton> */}
                        <Typography className={classes.title} variant="h6" noWrap>
                            Billing {loginData.name}
                        </Typography>
                        {/* <div className={classes.search}>    
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </div> */}
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
                                        Company Name
                                    </TableCell>
                                    <TableCell
                                        style={{ border: '2px solid #D50032', width: '200px' }}
                                    >
                                        NIE/NIF/NRT
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032' }}>
                                        Country
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032' }}>
                                        Telf.No
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032' }}>
                                        Rates
                                    </TableCell>
                                    <TableCell style={{ border: '2px solid #D50032' }}>
                                        No of Centers
                                    </TableCell>

                                    <TableCell
                                        style={{ border: '2px solid #D50032' }}
                                    >
                                        No of Reservations
                                    </TableCell>
                                    <TableCell
                                        style={{ border: '2px solid #D50032' }}
                                    >
                                        Edit
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData && tableData.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell style={{ border: '2px solid #D50032' }} >
                                        {index + 1}
                                        </TableCell>
                                        <TableCell style={{ border: '2px solid #D50032', width: '100px' }} >
                                            {item.uniqueId}
                                        </TableCell>
                                        <TableCell style={{ border: '2px solid #D50032', width: '200px' }} >
                                            {item.compneyName}
                                        </TableCell>
                                        <TableCell style={{ border: '2px solid #D50032', width: '250px' }}>
                                            {/* {item.} */}
                                        </TableCell>
                                        <TableCell style={{ border: '2px solid #D50032' }} >
                                            {item.country}
                                        </TableCell>
                                        <TableCell style={{ border: '2px solid #D50032' }} >
                                            {item.telephone}
                                        </TableCell>
                                        <TableCell style={{ border: '2px solid #D50032' }} >
                                            {/* {item.country} */}
                                        </TableCell>
                                        <TableCell style={{ border: '2px solid #D50032' }} >
                                            {item.centerCount}
                                        </TableCell>

                                        <TableCell style={{ border: '2px solid #D50032' }} >
                                            {item.bookingCount}
                                        </TableCell>
                                    </TableRow>))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Grid>
            </Paper>
        </>
    );
}

export default CenterTableContent