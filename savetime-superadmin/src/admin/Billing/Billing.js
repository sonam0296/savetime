import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Sidebar from '../Layouts/Sidebar';
import { Grid } from '@material-ui/core';
import BillingTableContent from './BillingTable';

const useStyles = makeStyles((theme) => {
        return {
            pages: {
                width: '100%',
                padding: theme.spacing(3)
            },
            root: {
                display: 'flex',
                margin: '0 auto',
                justifyContent: 'center',
                alignItems: 'center'
            },
            toolbar: theme.mixins.toolbar,
    }
    
})

const Billing = () => {
    const classes = useStyles()
    const theme = useTheme();
    return (
        <>
        <div className={classes.root}>
        <Grid>
            <Sidebar/>
            </Grid>
            <Grid item sm={9} xs={12}>
            <div className={classes.pages}>
                    <div className={classes.toolbar}></div>
                <BillingTableContent/>
            </div>
            </Grid>
            </div>
        </>
    )
}

export default Billing