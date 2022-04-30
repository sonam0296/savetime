import React from "react";
import { useSelector } from "react-redux";
import Helmet from 'react-helmet';
import DateFnsUtils from "@date-io/date-fns";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { StylesProvider } from "@material-ui/styles";
import { ThemeProvider } from "styled-components";
import maTheme from "./theme";
import Routes from "./routes/Routes";
import './index.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const currentTheme = useSelector(state => state.currentTheme);
  return (
    <>
      <Helmet
        titleTemplate="%s |SaveTime"
        defaultTitle="SaveTime"
      />
      <StylesProvider injectFirst>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <MuiThemeProvider theme={maTheme[currentTheme]}>
            <ThemeProvider theme={maTheme[currentTheme]}>
              <Routes />
              <ToastContainer autoClose={5000} />
            </ThemeProvider>
          </MuiThemeProvider>
        </MuiPickersUtilsProvider>
      </StylesProvider>
    </>
  );
}

export default App;
