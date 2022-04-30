import React, { useState, useEffect } from "react";
import styled from "styled-components";

import {
  Grid,
  Hidden,
  List,
  ListItemText,
  ListItem as MuiListItem
} from "@material-ui/core";
import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';
import './footer.css'
const Wrapper = styled.div`
  padding: ${props => props.theme.spacing(1) / 4}px
    ${props => props.theme.spacing(4)}px;
  width:100% !important;
  background: ${props => props.theme.palette.common.white};
`;

const ListItem = styled(MuiListItem)`
  display: inline-block;
  width: auto;
  padding-left: ${props => props.theme.spacing(2)}px;
  padding-right: ${props => props.theme.spacing(2)}px;

  &,
  &:hover,
  &:active {
    color: #000;
  }
`;

function Footer(props) {

  const [path, setpath] = useState("")


  useEffect(() => {
    const arr = window.location.hash.split("#")
    const value = arr[arr.length - 1]
    setpath(value)
  }, [])

  return (
    <>

      < div className="home-footer" >

        {
          <>
            <Hidden smDown >
              <Grid container item xs={12} md={6}>
                {path == "/" && <List className="list" >
                  <ListItem component="a" href="#">
                    <ListItemText primary="Continue implies that you have read and accept the terms and conditions of use" />
                  </ListItem>
                </List>}
              </Grid>
            </Hidden >
            <Grid container item xs={12} md={6} justify="flex-end">
              {path == "/" && <List >
                <ListItem component="a" href="#">
                  <ListItemText >
                    <FacebookIcon className="icon" />
                  </ListItemText>
                </ListItem>
                <ListItem component="a" href="#">
                  <ListItemText>
                    <InstagramIcon className="icon" />
                  </ListItemText>
                </ListItem>
              </List>}
            </Grid>
          </>
        }
      </div >
    </>
  );
}

export default Footer;
