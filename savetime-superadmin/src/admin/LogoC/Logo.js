import React from 'react'
import { Fragment } from 'react'
import Navigation from '../Navigation'
import LogaClassField from './LogoField'
// import LogaClassField from './LogaClassField'

const LogaClass =()=>
{
    return(
        <Fragment>
            <Navigation/>

            {/* work flied */}
            <LogaClassField/>
        </Fragment>
    )
}

export default LogaClass