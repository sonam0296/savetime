import * as types from '../constants';
import { REHYDRATE } from "redux-persist";


const initialState = {
    currentTheme: 0,
    language: "en",
    loginData: {},
    token: null,
    email: null,
    otp: "",
    forgot: false,
    signupuser: {},
    centerdata: {},
    defaultSchedule: [],
    customSchedule: [],
    workerDefaultSchedule: [],
    workerCustomSchedule: [],
    collectiveDefaultSchedule: [],
    collectiveCustomSchedule: [],
    openworkermodel: false,
    opencollectivemodel: false,
    workerschedules: {},
    collectiveservice: {},
    workerinput: {},
    personalservice: {},
    workerdata: {},
    customdata: {},
    stime: "",
    etime: "",
    defaultSchedule_timearray: [],
    defaultSchedule_apidata: [],
    userID: "",
    selectedcategory:[],
    selectedCenter:{},
    selectedRowData :{},
    customArrayData : [],
    centerData:{},
    eventData: [],
    eventStartDate:"",
    eventEndDate:"",

    customscheduletime:[],
    monthevents:[],
    selectedCenter: {},
    selectedRowData: {},
    customArrayData: [],
    centerData: {},
    centerAdminLoginStatus: false,
    userLoginStatus: false,
    appointmentDetails: {},
    openAppointmentBookModel:false,
    selectedServicesForAdmin: {},
    selectedWorkerData:{},
    centerWorkerList:[],
    workerLoginStatus:false,
    workerAppoinmentData:{},
    setTaxData: {},
    centerManageAnotherCenter: false,
    loginDataAdmin: [],
    selectedPet:{},
    selectedLoginCenter:{},
   
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
                defaultSchedule: [],
                customSchedule: [],
                workerDefaultSchedule: [],
                workerCustomSchedule: [],
                workerinput: [],
                personalservice: {},
                workerdata: {},
                customdata: {},
                stime: "",
                etime: "",
                defaultSchedule_timearray: [],
                defaultSchedule_apidata: [],
                userID: "",
                selectedcategory:[],
                customscheduletime:[],
                monthevents:[],
                eventData: [],
                centerAdminLoginStatus: false,
                userLoginStatus:false,
                appointmentDetails:{},
                openAppointmentBookModel:false,
                selectedServicesForAdmin: {},
                selectedWorkerData:{},
                centerWorkerList:[],
                workerLoginStatus:false,
                workerAppoinmentData:{},
                setTaxData: {},
                centerManageAnotherCenter: false,
                loginDataAdmin: [],
                selectedPet:{},
                selectedLoginCenter:{},
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
                personalservice: actions.payload
            }
        }

        case types.SETCOLLECTIVESERVICE: {
            return {
                ...state,
                collectiveservice: actions.payload
            }
        }

        case types.COLLECTIVE_DEFAULT_SCHEDULE: {
            return {
                ...state,
                collectiveDefaultSchedule: actions.payload
            }
        }

        case types.COLLECTIVE_CUSTOM_SCHEDULE: {
            return {
                ...state,
                collectiveCustomSchedule: actions.payload
            }
        }

        case types.OPEN_COLLECTIVESERVICE_MODEL: {
            return {
                ...state,
                opencollectivemodel: actions.payload
            }
        }

        case types.WORKER_DATA: {
            return {
                ...state,
                workerdata: actions.payload
            }
        }

        case types.CUSTOM_DATA: {
            return {
                ...state,
                customdata: actions.payload
            }
        }

        case types.STIME: {
            return {
                ...state,
                stime: actions.payload
            }
        }

        case types.ETIME: {
            return {
                ...state,
                etime: actions.payload
            }
        }

        case types.DEFAULT_SCHEDULE_TIMEARRAY: {
            return {
                ...state,
                defaultSchedule_timearray: actions.payload
            }
        }

        case types.DEFAULT_SCHEDULE_API_DATA: {
            return {
                ...state,
                defaultSchedule_apidata: actions.payload
            }
        }

        case types.USERID: {
            return {
                ...state,
                userID: actions.payload
            }
        }

        case types.SELECTEDCATEGORY: {
            return {
                ...state,
                selectedcategory: actions.payload
            }
        }
        case types.SELECTED_CENTER: {
            return {
                ...state,
                selectedCenter: actions.payload
            }
        }
        case types.SELECTED_ROW_DATA: {
            return {
                ...state,
                selectedRowData: actions.payload
            }
        }

        case types.CUSTOM_ARRAY_DATA: {
            return {
                ...state,
                customArrayData: actions.payload
            }
        }

        case types.CENTER_DATA: {
            return {
                ...state,
                centerData: actions.payload
            }
        }
        case types.SET_CENTER_ADMIN_LOGIN: {
            return {
                ...state,
                centerAdminLoginStatus: actions.payload
            }
        }

        case types.EVENT_DATA:{
            return {
                ...state,
                eventData:actions.payload
            }
        }

        case types.EVENT_START_DATE:{
            return {
                ...state,
                eventStartDate:actions.payload
            }
        }

        case types.EVENT_END_DATE:{
            return {
                ...state,
                eventEndDate:actions.payload
            }
        }
        case types.CUSTOMSCHEDULETIME:{
            return{
                ...state,
                customscheduletime:actions.payload
            }
        }

        case types.MONTHEVENTS:{
            return{
                ...state,
                monthevents:actions.payload
            }
        }

        case types.SET_USER_LOGIN:{
            return{
                ...state,
                userLoginStatus:actions.payload
            }
        }

        case types.APPOINTMENTDETAILS:{
            return{
                ...state,
                appointmentDetails:actions.payload
            }
        }
        case types.OPEN_APPOINTMENT_MODEL:{
            return{
                ...state,
                openAppointmentBookModel:actions.payload
            }
        }
        case types.SET_SELECTED_SERVICE_CENTER_ADMIN:{
            return{
                ...state,
                selectedServicesForAdmin:actions.payload
            }
        }
        case types.SELECTED_WORKER_DATA:{
            return{
                ...state,
                selectedWorkerData:actions.payload
            }
        }

        case types.CENTER_WORKER_LIST:{
            return{
                ...state,
                centerWorkerList:actions.payload
            }
        }

        case types.WORKER_LOGIN_STATUS:{
            return{
                ...state,
                workerLoginStatus:actions.payload
            }
        }

        case types.WORKER_APPOINTMENT_DATA:{
            return{
                ...state,
                workerAppoinmentData:actions.payload
            }
        }
        case types.SET_TAX_DATA: {
            return{
                ...state,
                setTaxData:actions.payload
            }
        }

        case types.LOGIN_DATA_ADMIN: {
            return{
                ...state,
                loginDataAdmin: actions.payload
            }
        }

        case types.SELECT_LANGUAGE:
            return {
              ...state,
              language: actions.payload,
            };

        case types.SELECTED_PET:
            return {
              ...state,
              selectedPet: actions.payload,
            };

        case types.SELECTED_LOGIN_CENTER:
            return {
              ...state,
              selectedLoginCenter: actions.payload,
            };

        case REHYDRATE:
            return {
                ...state,
                currentTheme: actions.payload && actions.payload.currentTheme ? actions.payload.currentTheme : 0,

                loginData: actions.payload && actions.payload.loginData ? actions.payload.loginData : {},

                workerinput: actions.payload && actions.payload.workerinput ? actions.payload.workerinput : {},

                defaultSchedule: actions.payload && actions.payload.defaultSchedule ? actions.payload.defaultSchedule : [],

                customSchedule: actions.payload && actions.payload.customSchedule ? actions.payload.customSchedule : [],

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

                opencollectivemodel: actions.payload && actions.payload.opencollectivemodel ? actions.payload.opencollectivemodel : false,

                personalservice: actions.payload && actions.payload.personalservice ? actions.payload.personalservice : {},

                collectiveservice: actions.payload && actions.payload.collectiveservice ? actions.payload.collectiveservice : {},

                collectiveDefaultSchedule: actions.payload && actions.payload.collectiveDefaultSchedule ? actions.payload.collectiveDefaultSchedule : [],

                collectiveCustomSchedule: actions.payload && actions.payload.collectiveCustomSchedule ? actions.payload.collectiveCustomSchedule : [],
                
                workerdata : actions.payload && actions.payload.workerdata ? actions.payload.workerdata : {},
                
                customdata : actions.payload && actions.payload.customdata ? actions.payload.customdata : {},

                stime : actions.payload && actions.payload.stime ? actions.payload.stime : "",
               
                etime : actions.payload && actions.payload.etime ? actions.payload.etime : "",

                defaultSchedule_timearray : actions.payload && actions.payload.defaultSchedule_timearray ? actions.payload.defaultSchedule_timearray : [],
               
                defaultSchedule_apidata : actions.payload && actions.payload.defaultSchedule_apidata ? actions.payload.defaultSchedule_apidata : [],
               
                userID : actions.payload && actions.payload.userID ? actions.payload.userID : "",
               
                selectedcategory : actions.payload && actions.payload.selectedcategory ? actions.payload.selectedcategory : [],

                selectedCenter:actions.payload && actions.payload.selectedCenter?actions.payload.selectedCenter:{},
                selectedRowData:actions.payload && actions.payload.selectedRowData?actions.payload.selectedRowData:{},
                customArrayData:actions.payload && actions.payload.customArrayData?actions.payload.customArrayData:[],
                centerData:actions.payload && actions.payload.centerData?actions.payload.centerData:{},
                eventData:actions.payload && actions.payload.eventData ?actions.payload.eventData :[],

                eventStartDate:actions.payload && actions.payload.eventStartData?actions.payload.eventStartData :"",
                eventEndDate:actions.payload && actions.payload.eventEndData?actions.payload.eventEndData :"",
                customscheduletime : actions.payload && actions.payload.customscheduletime ? actions.payload.customscheduletime : [],
                
                monthevents : actions.payload && actions.payload.monthevents ? actions.payload.monthevents : [],

                centerAdminLoginStatus: actions.payload && actions.payload.centerAdminLoginStatus ? actions.payload.centerAdminLoginStatus : false,
                userLoginStatus: actions.payload && actions.payload.userLoginStatus ? actions.payload.userLoginStatus : false,
                appointmentDetails: actions.payload && actions.payload.appointmentDetails ? actions.payload.appointmentDetails : {},
                openAppointmentBookModel: actions.payload && actions.payload.openAppointmentBookModel ? actions.payload.openAppointmentBookModel : false,
                selectedServicesForAdmin: actions.payload && actions.payload.selectedServicesForAdmin ? actions.payload.selectedServicesForAdmin : {},
                selectedWorkerData: actions.payload && actions.payload.selectedWorkerData ? actions.payload.selectedWorkerData : {},
                centerWorkerList: actions.payload && actions.payload.centerWorkerList ? actions.payload.centerWorkerList : [],
                workerLoginStatus: actions.payload && actions.payload.workerLoginStatus ? actions.payload.workerLoginStatus : false,
                workerAppoinmentData: actions.payload && actions.payload.workerAppoinmentData ? actions.payload.workerAppoinmentData : {},
                setTaxData: actions.payload && actions.payload.setTaxData ? actions.payload.setTaxData : false,
                centerManageAnotherCenter: actions.payload && actions.payload.centerManageAnotherCenter ? actions.payload.centerManageAnotherCenter : false,
                loginDataAdmin: actions.payload && actions.payload.loginDataAdmin ? actions.payload.loginDataAdmin : [],
                language: actions.payload && actions.payload.language ? actions.payload.language : 'en',
                selectedPet: actions.payload && actions.payload.selectedPet ? actions.payload.selectedPet : {},
                selectedLoginCenter: actions.payload && actions.payload.selectedLoginCenter ? actions.payload.selectedLoginCenter : {},

            };

        default:
            return {
                ...state
            }
    }
}

export const reducer = saveTimeReducer;


