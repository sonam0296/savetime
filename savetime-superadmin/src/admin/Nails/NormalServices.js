import React, { Fragment } from 'react';
import Navigation from '../Navigation'
import NormalServicesField from './NormalServicesField';
const NormalServices =()=>
{
    return(
        <Fragment>
            <Navigation/>
            {/* <p>Normal Services</p> */}
        <NormalServicesField/>
        </Fragment>
    )
}


export default NormalServices