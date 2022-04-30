import { AppBar, CssBaseline, IconButton, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import MenuIcon from '@material-ui/icons/Menu';

const Header = () => {
    return (
        <>
            <CssBaseline />
                {/* App Bar i.e header */}
                <AppBar position="fixed"  className={classes.appbar}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            className={classes.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography className={classes.adminBar}></Typography>
                        <img src={image} className={classes.imaged} />
                        <Typography className={classes.adminLogo}>
                            Admin
                        </Typography>
                    </Toolbar>
                </AppBar>
        </>
    )
}

export default Header