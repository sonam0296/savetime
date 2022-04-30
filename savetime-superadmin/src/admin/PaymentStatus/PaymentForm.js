import React from 'react';
import Navigation from '../Navigation';
import PaymentFormFields from './PaymentFormFields';

const PaymentForm = () => {
    return (
        <>
            <div>
                <Navigation />
            </div>
            <div>
                <PaymentFormFields/>
            </div>

        </>
    )
}

export default PaymentForm
