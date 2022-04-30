import React from 'react';
import Navigation from '../Navigation';
import RatesFormContent from './RatesFormContent';
import UpdateRatesForm from './UpdateRatesForm';

const RatesForm = () => {
    return(
        <>
            <div>
                <Navigation />
            </div>
            <div>
                <UpdateRatesForm />
            </div>

        </>
    )
}
export default RatesForm