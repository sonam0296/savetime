import React from 'react';
import Navigation from '../Navigation';
import AdminFormFields from './AdminFormFields';

const AdminForm = () => {
    return (
        <>
            <div>
                <Navigation />
            </div>
            <div>
                <AdminFormFields />
            </div>

        </>
    )
}

export default AdminForm