import React, { Fragment } from 'react';
import Navigation from '../Navigation'
import InterlevedUpdate from './InterlevedUpdate';
const InterlevedUpdateService =()=>
{
    return(
        <Fragment>
            <Navigation/>
            {/* <p>Normal Services</p> */}
        <InterlevedUpdate/>
        </Fragment>
    )
}


export default InterlevedUpdateService