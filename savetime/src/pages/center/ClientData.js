import React, { useEffect, useState } from "react";
import "./clientData.css";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button, FormControlLabel, FormGroup, Grid, Typography } from "@material-ui/core";
import requests from "../../requests";
import instance from "../../axios";
import { useSelector } from "react-redux";
import Switch from "@material-ui/core/Switch";
import { errorToaster } from "../../common/common";
import { useTranslation } from "react-i18next";
const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    "&$checked": {
      transform: "translateX(16px)",
      color: theme.palette.common.white,
      "& + $track": {
        backgroundColor: "#52d869",
        opacity: 1,
        border: "none",
      },
    },
    "&$focusVisible $thumb": {
      color: "#52d869",
      border: "6px solid #fff",
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"]),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const useStyles = makeStyles({
  table: {
    // minWidth: 800,
    width: 900,
  },
});

function ClientData({ isOpen, selectedClientDetails, onDeactivate }) {
  const {t} = useTranslation();
  const language = useSelector(state => state.language)
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [clientStatus, setClientStatus] = useState("");
  const token = useSelector((state) => state.token);
  const [maxWidth, setMaxWidth] = React.useState("md");
  const [clientDetails, setClientDetails] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [flag, setFlag] = useState(true);
  const [data, setData] = useState([]);
  const logincenterToken = useSelector(state => state.selectedLoginCenter.token)
  const [clientDataState, setclientDataState] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    let result = clientList.filter(
      (item) => item._id == selectedClientDetails.id
    );
    setClientStatus(result[0]?.active);

    setFlag(true);
  }, [clientList]);

  const getClients = async () => {
    const response = await instance
      .post(
        `${requests.fetchSearchResult}?lang=${language}`,
        {
          type: "client",
        },
        {
          headers: {
            Authorization: logincenterToken,
            "Content-Type": "application/json",
          },
        }
      )
      .catch((error) => {});
    if (response) {
      setClientList(response.data.data);
    }
  };

  const handleChange = async (e, client) => {
    let status = e.target.checked;
    // setState(status)
    let obj = {
      id: client.id,
      active: status,
    };

    const response = await instance
      .put(`${requests.fetchClientStatus}?lang=${language}`, obj, {
        headers: {
          Authorization: `Bearer ${logincenterToken}`,
        },
      })
      .catch((error) => {
        let errorMessage = "";
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error.message;
        } else {
          errorMessage = error.response.data.message;
        }
        console.log("ee", error.response);
        errorToaster(errorMessage);
      });
    if (response && response.data) {
      getClients();
    }

    // setState(e.target.checked)
    // setState({ [event.target.name]: event.target.checked });
  };

  const getClientData = async () => {
    let obj = {
      userId: selectedClientDetails.id,
    };

    const response = await instance
      .post(`${requests.fetchClientData}?lang=${language}`, obj, {
        headers: {
          Authorization: logincenterToken,
          "Content-Type": "application/json",
        },
      })
      .catch((error) => {});
    if (response) {
      setData(response.data.data);

      // setCenterList(response.data.data);
    }
  };

  useEffect(() => {
    if (data.length > 0) {
      setclientDataState(true);
    }
  }, [data]);

  useEffect(() => {
    getClientData();
    setClientStatus(selectedClientDetails.active);
  }, []);

  const handleClose = () => {
    setOpen(false);
    onDeactivate();
  };
  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <div className="close-icon">
            {/* <Close className="close" onClick={(e) => handleClose(e)} /> */}
            <i class="fas fa-times close" onClick={(e) => handleClose(e)}></i>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {/* Worker Data */}
            {/* <div className="clientListMaindiv"> */}
            <div
              className={
                selectedClientDetails.active == true
                  ? "client-info-active-details "
                  : "client-info-inactive-details"
              }
            >
              <img src={selectedClientDetails.image} />
              <div className="client-data">
                <h2>{selectedClientDetails.name}</h2>
                <h4>{selectedClientDetails.phonenumber}</h4>
                <p>{selectedClientDetails.emailAddress}</p>
                <div className="switch">
                  {clientStatus == true ? (
                    <span
                      style={{
                        color: "#00ad22",
                        marginRight: "10px",
                        marginTop: "7px",
                      }}
                    >
                      {t("Active")}
                    </span>
                  ) : (
                    <span
                      style={{
                        color: "#d61c38",
                        marginRight: "10px",
                        marginTop: "7px",
                      }}
                    >
                      {t("InActive")}
                    </span>
                  )}
                  <FormGroup>
                    <FormControlLabel
                      //   label="Activate"
                      control={
                        <IOSSwitch
                          checked={flag == true && clientStatus}
                          onChange={(e) =>
                            handleChange(e, selectedClientDetails)
                          }
                          name="active"
                        />
                      }
                    />
                  </FormGroup>
                </div>
              </div>
            </div>

            {/* </div> */}
          </DialogContentText>
          <Typography style={{textAlign:'center'}} variant="h6" noWrap>
          {t("Reservation Summary")} {selectedClientDetails.name}
            </Typography>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              {/* <TableHead>
                {t("Reservation Summary")} {selectedClientDetails.name}
              </TableHead> */}
              <TableHead>
                {/* <TableRow style={{ width: "100%", textAlign: "center", marginLeft:"3rem" }}>
                  Resarvation Summary {selectedClientDetails.name}
                  <TableCell style={{width:'100%',textAlign:"center"}}>Workker Data</TableCell>
                </TableRow> */}
                <TableRow>
                  <TableCell>{t("Workers")}</TableCell>
                  <TableCell align="center">{t("Dates")}</TableCell>
                  <TableCell align="center">{t("Time")}</TableCell>
                  <TableCell align="center">{t("Observations")}</TableCell>
                  {/* <TableCell align="center">Protein&nbsp;(g)</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {clientDataState == false ? (
                  <>
                    <TableRow>
                      <TableCell style={{ width: "2.5rem", height: "3rem" }}>
                        {/* {item.workerData[0].name}  */}
                      </TableCell>
                      <TableCell style={{ width: "1rem", height: "3rem" }}>
                        {/* {item.Date} */}
                      </TableCell>
                      <TableCell style={{ width: "1rem", height: "3rem" }}>
                        {/* {item.startTime} */}
                      </TableCell>
                      <TableCell style={{ width: "5rem", height: "3rem" }}>
                        {/* {item.emailAddress} */}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ width: "2.5rem", height: "3rem" }}>
                        {/* {item.workerData[0].name}  */}
                      </TableCell>
                      <TableCell style={{ width: "1rem", height: "3rem" }}>
                        {/* {item.Date} */}
                      </TableCell>
                      <TableCell style={{ width: "1rem", height: "3rem" }}>
                        {/* {item.startTime} */}
                      </TableCell>
                      <TableCell style={{ width: "5rem", height: "3rem" }}>
                        {/* {item.emailAddress} */}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ width: "2.5rem", height: "3rem" }}>
                        {/* {item.workerData[0].name}  */}
                      </TableCell>
                      <TableCell style={{ width: "1rem", height: "3rem" }}>
                        {/* {item.Date} */}
                      </TableCell>
                      <TableCell style={{ width: "1rem", height: "3rem" }}>
                        {/* {item.startTime} */}
                      </TableCell>
                      <TableCell style={{ width: "5rem", height: "3rem" }}>
                        {/* {item.emailAddress} */}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ width: "2.5rem", height: "3rem" }}>
                        {/* {item.workerData[0].name}  */}
                      </TableCell>
                      <TableCell style={{ width: "1rem", height: "3rem" }}>
                        {/* {item.Date} */}
                      </TableCell>
                      <TableCell style={{ width: "1rem", height: "3rem" }}>
                        {/* {item.startTime} */}
                      </TableCell>
                      <TableCell style={{ width: "5rem", height: "3rem" }}>
                        {/* {item.emailAddress} */}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ width: "2.5rem", height: "3rem" }}>
                        {/* {item.workerData[0].name}  */}
                      </TableCell>
                      <TableCell style={{ width: "1rem", height: "3rem" }}>
                        {/* {item.Date} */}
                      </TableCell>
                      <TableCell style={{ width: "1rem", height: "3rem" }}>
                        {/* {item.startTime} */}
                      </TableCell>
                      <TableCell style={{ width: "5rem", height: "3rem" }}>
                        {/* {item.emailAddress} */}
                      </TableCell>
                    </TableRow>
                  </>
                ) : (
                  <>
                    {data &&
                      data.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell style={{ width: "2.5rem" }}>
                            {item.workerData[0].name}
                          </TableCell>
                          <TableCell style={{ width: "1rem" }}>
                            {item.Date}
                          </TableCell>
                          <TableCell style={{ width: "1rem" }}>
                            {item.startTime}
                          </TableCell>
                          <TableCell style={{ width: "5rem" }}>
                            {/* {item.emailAddress} */}
                          </TableCell>
                        </TableRow>
                      ))}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>{" "}
        </DialogContent>
        <Grid container>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}
            className="rtn-btn-client"
          >
            <Button
              onClick={handleClose}
              color="primary"
              className="returnbtn_client"
            >
              {t("Go Back")}
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}
            className="flw-btn-client"
          >
            <Button
              onClick={handleClose}
              color="primary"
              className="createbtn_client"
            >
              {t("Following")}
            </Button>
          </Grid>
        </Grid>
        {/* <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}

export default ClientData;
// {
//   "userId":"61012dfd15cb22581453f079"
// }
