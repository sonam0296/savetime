import React, { Fragment } from 'react';
import Navigation from '../Navigation'
import InterlevedService from './InterlevedService';
const Interleved =()=>
{
    return(
        <Fragment>
            <Navigation/>
            {/* <p>Normal Services</p> */}
        <InterlevedService/>
        </Fragment>
    )
}


export default Interleved