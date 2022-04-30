import React from "react";

import Login from "../admin/Login/Login";
import AdminDashboard from "../admin/Dashboard/AdminDashboard";
import Center from "../admin/Center/Center";
import Workers from "../admin/Workers/Workers";
import UsersDash from "../admin/Users/UsersDash";
import Rates from "../admin/Rates/Rates";
import PaymentStatuses from "../admin/PaymentStatus/PaymentStatuses";
import Billing from "../admin/Billing/Billing";
import FormFields from "../admin/Center/CenterForm"
import WorkersFormField from "../admin/Workers/WorkersFormField";
import WorkersForm from "../admin/Workers/WorkersForm";
import UserForm from "../admin/Users/UserForm";
import AdminForm from "../admin/Dashboard/AdminForm";
import Normal from "../admin/Normal/Normal";
import NormalServices from "../admin/Nails/NormalServices"
import CollectiveServices from "../admin/CollectiveServices/CollectiveServices";
import LogaClass from "../admin/LogoC/Logo";
import InterlevedService from "../admin/InterleveledServices/InterlevedService";
import InterleveledUpdate from "../admin/InterleveledServices/InterlevedUpdate";
import CenterDatabase from "../admin/Database/centerDatabase";
import InterlevedUpdateService from "../admin/InterleveledServices/InterlevedUpdateService";
import Interleved from "../admin/InterleveledServices/Interleved";
import RatesForm from "../admin/Rates/RatesForm";
import RatesFormContent from "../admin/Rates/RatesFormContent";
import PaymentForm from "../admin/PaymentStatus/PaymentForm";
import BillingForm from "../admin/Billing/BillingForm";
import PrivateRoute from "../PrivateRoute";

const adminRoutes = {
    id: "admin",
    path: "/",
    // icon: < Users / > ,
    children: [
        {
            path: "/",
            name: "AdminDashboard",
            component: AdminDashboard
        },
        {
            path: "/admin/dashboard",
            name: "AdminDashboard",
            component: AdminDashboard

        },
        {
             path: "/admin/center",
             name: "Center",
             component: Center
        },
        {
             path: "/admin/workers",
             name: "Workers",
             component: Workers
        },
        {
             path: "/admin/users",
             name: "UsersDash",
             component: UsersDash
        },
        {
             path: "/admin/rates",
             name: "Rates",
             component: Rates
        },
        {
             path: "/admin/payments",
             name: "PaymentStatuses",
             component: PaymentStatuses
        },
        {
             path: "/admin/billing",
             name: "Billing",
             component: Billing
        },
        {
             path: "/admin/update",
             name: "FormFields",
             component: FormFields
        },
        {
             path: "/admin/workerUpdate",
             name: "WorkersForm",
             component: WorkersForm
        },
        {
             path: "/admin/userUpdate",
             name: "UserForm",
             component: UserForm
        },
        {
             path: "/admin/businessUpdate",
             name: "AdminForm",
             component: AdminForm
        },
        {
            path: "/admin/normalService",
            name: "Normal",
            component: Normal
        },
        {
            path: "/admin/updateService",
            name: "NormalServices",
            component: NormalServices
        },
        {
            path: "/admin/collectiveService",
            name: "CollectiveServices",
            component: CollectiveServices
        },
        {
            path: "/admin/updateCollective",
            name: "LogaClass",
            component: LogaClass
        },
        {
            path: "/admin/interleveldService",
            name: "Interleved",
            component: Interleved
        },
        {
            path: "/admin/updateInterleved",
            name: "InterlevedUpdateService",
            component: InterlevedUpdateService
        },
        {
            path: "/admin/updateBilling",
            name: "BillingForm",
            component: BillingForm
        },
        {
            path: "/admin/addRates",
            name: "RatesFormContent",
            component: RatesFormContent
        },
        {
            path: "/admin/updateRates",
            name: "UpdateRatesForm",
            component: RatesForm
        },
        {
            path: "/admin/updatePayment",
            name: "PaymentForm",
            component: PaymentForm

       },
    ],
    
       
    
}
const authRoutes = {
        id: "admin",
        path: "/",
        name: "Login",
        component: Login
}



// Routes using the Auth layout
export const authLayoutRoutes = [authRoutes];
export const adminLayoutRoutes = [adminRoutes];
export const sidebarRoutes = [adminRoutes];

{/* HomeRoute,  */}


