import React, { useState } from "react";
import { DateRange } from "react-date-range";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  TextField,
  MenuItem,
  Select,
} from "@material-ui/core";

import "./emergencyCancle.css";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";

function EmergencyCancle() {
  const {t} = useTranslation();
  const [time, setTime] = useState(null);
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);
  return (
    <div>
        <Header/>   
      <Grid container className="emg-container">
        <Grid item className="left-item">
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setDates([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={dates}
          />
        </Grid>
        <Grid item className="right-item">
          <div className="right-subItems">
            <div className="slectors">
              <FormControl className="select-service">
                <Select
                  // value={service}
                  // onChange={handleChange}
                  displayEmpty
                  // className={classes.selectEmpty}
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value="">
                    <em>{t("Select Service")}</em>
                  </MenuItem>
                  {/* {workerService.map((item) => (
                <MenuItem value={item.serviceName}>{item.serviceName}</MenuItem>
              ))} */}
                </Select>
              </FormControl>

              <FormControl className="select-worker">
                <Select
                  // value={service}
                  // onChange={handleChange}
                  displayEmpty
                  // className={classes.selectEmpty}
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value="">
                    <em>{t("Select Service")}</em>
                  </MenuItem>
                  {/* {workerService.map((item) => (
                <MenuItem value={item.serviceName}>{item.serviceName}</MenuItem>
              ))} */}
                </Select>
              </FormControl>
            </div>
            <div className="infoText">
              {/* Text */}
              <h4>{t("Appoinment will be cancled from start date to end Date")}</h4>
            </div>
            <div className="startTime">
              {/* Start Time */}
              {t("From Day startDate at")}
              <form noValidate>
                <TextField
                  id="time"
                  label="Time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  defaultValue="07:30"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                />
              </form>
            </div>
            <div className="endTime">
              {/* End Time */}
              {t("untill the EndDate at")}
              <form noValidate>
                <TextField
                  id="time"
                  label="Time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  defaultValue="07:30"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                />
              </form>
            </div>
            <div className="allDayBtn">
              {/* Button */}

              <Button className="returnBtn" color="primary">
                {t("All Day")}
              </Button>
            </div>
          </div>
        </Grid>
        <div className="main-btns">
          <div>
            <button className="goBackBtn" >
            {t("To Back")}
            </button>
          </div>
          <div>
            <button className="cancleAppoinment" >
             {t("Cancle Appoinment")}
            </button>
          </div>
        </div>

      </Grid>
    </div>
  );
}

export default EmergencyCancle;
