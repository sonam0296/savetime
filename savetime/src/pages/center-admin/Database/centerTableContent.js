import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  AppBar,
  Button,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { HouseOutlined, WorkOutlined } from "@material-ui/icons";
import instance from "../../../axios";
import requests from "../../../requests";
import { errorToaster, successToaster } from "../../../common/common";
import { connect, useDispatch, useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import { TablePagination } from "@material-ui/core";
import { CSVLink, CSVDownload } from "react-csv";
import moment from "moment";
import { useTranslation } from 'react-i18next';

let token = null;

const mapStateToProps = (state) => {
  token = state.token;
};

const useStyles = makeStyles((theme) => {
  return {
    root: {
      width: "100%",
      textAlign: "center",
      border: "1px solid red",
      "&.MuiTableCell-root": {
        whiteSpace: "nowrap",
      },
    },
    container: {
      maxHeight: 450,
    },
    title: {
      flexGrow: 1,
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block",
      },
      color: "black",
    },
    search: {
      position: "relative",
      borderRadius: "20px",
      // backgroundColor: alpha(theme.palette.common.white, 0.15),
      // '&:hover': {
      //   backgroundColor: alpha(theme.palette.common.white, 0.25),
      // },
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        width: "auto",
      },
      border: "2px solid black",
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "black",
    },
    inputRoot: {
      color: "inherit",
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch",
        },
      },
      color: "black",
    },
    static: {
      flexGrow: "1",
      backgroundColor: "white",
    },
    menuButton: {
      marginRight: theme.spacing(2),
      color: "red",
    },
    table: {
      width: "100%",
      overflowX: "auto",
      display: "block",
      "&.MuiTableCell-root": {
        border: "1px solid red",
      },
      "&.MuiTableRow-root": {
        whiteSpace: "nowrap",
      },
    },
  };
});

const CenterTableContent = ({ tableData }) => {
  const {t} = useTranslation();
  const language = useSelector(state => state.language)
  const classes = useStyles();
  const loginData = useSelector((state) => state.loginData);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const logincenterToken = useSelector(state => state.selectedLoginCenter.token)
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [csvData, setCsvData] = useState([]);
  const [showExport, setShowExport] = useState(false);
  let CSVData = [];
  useEffect(() => {
    if (tableData.length > 0) {
      setShowExport(true);
    }
    tableData.map((item) => {
      let obj = {
        Date: moment(item.Date, "DD/MM/YYYY").format("MM-DD-YYYY"),
        Time: item.startTime,
        Service: item.serviceData[0].serviceName,
        Customer: item.name,
        Id: item._id,
        Worker: item.workerData[0].name,
        PVR: "PVR",
        Observation: item.suggestion,
      };
      CSVData.push(obj);
     
      //   setCsvData([...csvData,obj])
    });
    setCsvData(CSVData);
  }, [tableData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    // getCenterList()
  }, []);

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
              {t("Customer Record of")} {loginData.name}
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
        <Grid>
          <TableContainer className={classes.container}>
            <Table
              stickyHeader
              aria-label="sticky table"
              className={classes.table}
            >
              <TableHead>
                <TableRow>
                  <TableCell>{t("No")}.</TableCell>
                  <TableCell>{t("Date")}</TableCell>
                  <TableCell>{t("Hour")}</TableCell>
                  <TableCell>{t("Services")}</TableCell>
                  <TableCell>{t("Customer")}</TableCell>
                  <TableCell>{t("Id")}</TableCell>
                  <TableCell>{t("Worker")}</TableCell>
                  <TableCell>{t("PVR")}</TableCell>
                  <TableCell>{t("Observations")}</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {tableData && tableData.length>0 ?
                  tableData.map((item, i) => (
                    <TableRow key={item.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{item.Date}</TableCell>
                      <TableCell>{item.startTime}</TableCell>
                      <TableCell>  {item.serviceData.length > 0 ? item.serviceData[0].serviceName : "-"}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item._id}</TableCell>
                      <TableCell>{item.workerData[0].name}</TableCell>
                      <TableCell>{"PVR"}</TableCell>
                      <TableCell>{item.suggestion}</TableCell>
                    </TableRow>
                  )) : 
                  <>
                  <TableRow >
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}>  </TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                </TableRow>
                  <TableRow >
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}>  </TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                </TableRow>
                  <TableRow >
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}>  </TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                </TableRow>
                  <TableRow >
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}>  </TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                  <TableCell style={{height:'40px'}}></TableCell>
                </TableRow>
                 </> }
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Paper>
      <Grid>
        {/* {showExport == true ? ( */}
          <Button
            style={{
              float: "right",
              border: "2px solid green",
              borderRadius: "30px",
              marginTop: "5px",
            }}
          >
            <CSVLink
              style={{
                textDecoration: "none",
                color: "green",
                borderBottom: "none",
              }}
              className="exportLink"
              data={csvData}
              filename={"TableDatabse.csv"}
            >
              {("Export EXCEL")}
            </CSVLink>
          </Button>
        {/* ) : null} */}
      </Grid>
      {/* <ExportReactCSV csvData={tableData} fileName={"TableDatabse.csv"} /> */}
    </>
  );
};

export default connect(mapStateToProps)(CenterTableContent);
