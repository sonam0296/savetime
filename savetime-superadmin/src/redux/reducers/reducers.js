import * as types from '../constants';
import { REHYDRATE } from "redux-persist";
import { editCenterData, editServiceData, editWorkerData } from '../actions/actions';


const initialState = {
    currentTheme: 0,
    loginData: {},
    token: null,
    email: null,
    otp: "",
    forgot: false,
    signupuser: {},
    centerdata: {},
    defaultSchedule: {},
    customSchedule: {},
    workerDefaultSchedule: [],
    workerCustomSchedule: [],
    openworkermodel: false,
    workerschedules: {},
    collectiveservice:{},
    workerinput: {},
    personalservice: {},
    editCenterData: {},
    editServiceData: {},
    editWorkerData: {},
    editUserData: {},
    editBillingData: {},
    editBusinessData: {},
    editRateData: {},
    editPaymentData: {},

};

function saveTimeReducer(state = initialState, actions) {
    switch (actions.type) {

        case types.SET_THEME:
            return {
                ...state,
                currentTheme: actions.payload
            };

        case types.USER_LOGIN: {
            return {
                ...state,
                loginData: actions.payload
            }
        }
        case types.SET_TOKEN: {
            return {
                ...state,
                token: actions.payload
            }
        }
        case types.SET_OTP: {
            return {
                ...state,
                otp: actions.payload
            }
        }
        case types.DESTROY_SESSION:
            return {
                ...state,
                loginData: {},
                token: null,
                email: null,
                otp: "",
                forgot: false,
                signupuser: {},
                centerdata: {},
                defaultSchedule: {},
                customSchedule: {},
                workerDefaultSchedule: [],
                workerCustomSchedule: [],
                workerinput: {},
                editCenterData: {},
                editServiceData: {},
                overlappedService: {},
                editWorkerData: {},
                editUserData: {},
                editBillingData: {},
                editBusinessData: {},
                editRateData: {},
                editPaymentData: {},
                ...initialState
            };
        case types.EMAIL: {
            return {
                ...state,
                email: actions.payload
            }
        }
        case types.REGISTER_USER: {
            return {
                ...state,
                signupuser: actions.payload
            }
        }
        case types.REGISTER_CENTER: {
            return {
                ...state,
                centerdata: actions.payload
            }
        }
        case types.SET_FORGOT: {
            return {
                ...state,
                forgot: actions.payload
            }
        }

        case types.DEFAULT_SCHEDULE: {
            return {
                ...state,
                defaultSchedule: actions.payload
            }
        }

        case types.CUSTOM_SCHEDULE: {
            return {
                ...state,
                customSchedule: actions.payload

            }
        }

        case types.WORKER_DEFAULT_SCHEDULE: {
            return {
                ...state,
                workerDefaultSchedule: actions.payload
            }
        }

        case types.WORKER_CUSTOM_SCHEDULE: {
            return {
                ...state,
                workerCustomSchedule: actions.payload
            }
        }

        case types.OPEN_WORKER_MODEL: {
            return {
                ...state,
                openworkermodel: actions.payload
            }
        }

        case types.WORKER_SCHEDULE: {
            return {
                ...state,
                workerschedules: actions.payload

            }
        }

        case types.WORKER_INPUT: {
            return {
                ...state,   
                workerinput: actions.payload

            }
        }
        case types.SETPERSONALSERVICE: {
            //state.personalservice.length
            return {
                ...state,
                personalservice:actions.payload
            }
        }
       
        case types.SETCOLLECTIVESERVICE: {
            return {
                ...state,
                collectiveservice:actions.payload
            }
        }

        case types.EDIT_CENTER_DATA: {
            return {
                ...state,
                editCenterData: actions.payload

            }
        }

        case types.EDIT_SERVICE_DATA: {
            return{
                ...state,
                editServiceData: actions.payload
            }
        }

        case types.OVERLAPPED_SERVICE: {
            return{
                ...state,
                overlappedService: actions.payload
            }
        }

        case types.EDIT_WORKER_DATA: {
            return{
                ...state,
                editWorkerData: actions.payload
            }
        }
        case types.EDIT_USER_DATA: {
            return{
                ...state,
                editUserData: actions.payload
            }
        }

        case types.EDIT_BILLING_DATA: {
            return{
                ...state,
                editBillingData: actions.payload
            }
        }

        case types.EDIT_BUSINESS_DATA: {
            return{
                ...state,
                editBusinessData: actions.payload
            }
        }

        case types.EDIT_RATE_DATA: {
            return{
                ...state,
                editRateData: actions.payload
            }
        }

        case types.EDIT_PAYMENT_DATA: {
            return{
                ...state,
                editPaymentData: actions.payload
            }
        }

        case REHYDRATE:
            return {
                ...state,
                currentTheme: actions.payload && actions.payload.currentTheme ? actions.payload.currentTheme : 0,

                loginData: actions.payload && actions.payload.loginData ? actions.payload.loginData : {},

                workerinput: actions.payload && actions.payload.workerinput ? actions.payload.workerinput : {},

                defaultSchedule: actions.payload && actions.payload.defaultSchedule ? actions.payload.defaultSchedule : {},

                customSchedule: actions.payload && actions.payload.customSchedule ? actions.payload.customSchedule : {},

                workerDefaultSchedule: actions.payload && actions.payload.workerDefaultSchedule ? actions.payload.workerDefaultSchedule : [],

                workerCustomSchedule: actions.payload && actions.payload.workerCustomSchedule ? actions.payload.workerCustomSchedule : [],

                workerschedules: actions.payload && actions.payload.workerschedules ? actions.payload.workerschedules : {},

                token: actions.payload && actions.payload.token ? actions.payload.token : null,

                email: actions.payload && actions.payload.email ? actions.payload.email : null,

                forgot: actions.payload && actions.payload.forgot ? actions.payload.forgot : null,

                otp: actions.payload && actions.payload.otp ? actions.payload.otp : null,

                signupuser: actions.payload && actions.payload.signupuser ? actions.payload.signupuser : {},

                centerdata: actions.payload && actions.payload.centerdata ? actions.payload.centerdata : {},

                openworkermodel: actions.payload && actions.payload.openworkermodel ? actions.payload.openworkermodel : false,
                
                editCenterData: actions.payload && actions.payload.editCenterData ? actions.payload.editCenterData : {},
           
                editServiceData: actions.payload && actions.payload.editServiceData ? actions.payload.editServiceData : {},

                overlappedService: actions.payload && actions.payload.overlappedService ? actions.payload.overlappedService : {},

                editWorkerData: actions.payload && actions.payload.editWorkerData ? actions.payload.editWorkerData : {},
           
                editUserData: actions.payload && actions.payload.editUserData ? actions.payload.editUserData : {},

                editBillingData: actions.payload && actions.payload.editBillingData ? actions.payload.editBillingData : {},

                editBusinessData: actions.payload && actions.payload.editBusinessData ? actions.payload.editBusinessData : {},

                editRateData: actions.payload && actions.payload.editRateData ? actions.payload.editRateData : {},

                editPaymentData: actions.payload && actions.payload.editPaymentData ? actions.payload.editPaymentData : {},

            };

        default:
            return {
                ...state
            }
    }
}

export const reducer = saveTimeReducer;


