import React, { useState, useEffect } from "react";
import styled from "styled-components";

import {
  Grid,
  Hidden,
  List,
  ListItemText,
  ListItem as MuiListItem,
} from "@material-ui/core";
import InstagramIcon from "@material-ui/icons/Instagram";
import FacebookIcon from "@material-ui/icons/Facebook";
import "./footer.css";
import { useTranslation } from "react-i18next";
const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing(1) / 4}px
    ${(props) => props.theme.spacing(4)}px;
  width: 100% !important;
  background: ${(props) => props.theme.palette.common.white};
`;

const ListItem = styled(MuiListItem)`
  display: inline-block;
  width: auto;
  padding-left: ${(props) => props.theme.spacing(2)}px;
  padding-right: ${(props) => props.theme.spacing(2)}px;

  &,
  &:hover,
  &:active {
    color: #000;
  }
`;

function Footer(props) {
  const {t} = useTranslation();
  const [path, setpath] = useState("");

  useEffect(() => {
    const arr = window.location.hash.split("#");
    const value = arr[arr.length - 1];
    setpath(value);
  }, []);

  return (
    <>
      {/* <Grid container>
        <div className="head-line"></div>
      </Grid> */}
      <div className="home-footer">
     
        {/* <div className="head-line"></div> */}
   
        {
          <>
            {/* <Hidden smDown> */}
              <Grid container item xs={6} md={6} className="left-side-ftr">
                {path == "/" && (
                  <List className="list">
                    <ListItem component="a" href="http://savetime-web.s3-website.eu-west-3.amazonaws.com/#/center/privacypolicy">
                      <ListItemText primary={t("Privacy Policies")} />
                    </ListItem>
                    <ListItem component="a" href="http://savetime-web.s3-website.eu-west-3.amazonaws.com/#/center/cookies">
                      <ListItemText primary={t("Cookies 🍪")} />
                    </ListItem>
                    <ListItem component="a" href="http://savetime-web.s3-website.eu-west-3.amazonaws.com/#/center/termsandconditions">
                      <ListItemText primary={t("Our policies")} />
                    </ListItem>
                  </List>
                )}
              </Grid>
            {/* </Hidden> */}
            <Grid container item xs={12} md={6} justify="flex-end">
              {path == "/" && (
                <List>
                  <ListItem component="a" href="https://www.facebook.com/savetime.es">
                    <ListItemText>
                      <FacebookIcon className="icons" />
                    </ListItemText>
                  </ListItem>
                  <ListItem component="a" href="https://www.instagram.com/savetime.es/">
                    <ListItemText>
                      <InstagramIcon className="icons" />
                    </ListItemText>
                  </ListItem>
                </List>
              )}
            </Grid>
          </>
        }
      </div>
    </>
  );
}

export default Footer;
