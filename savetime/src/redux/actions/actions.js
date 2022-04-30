import { VerticalAlignTopOutlined } from '@material-ui/icons';
import * as types from '../constants';

export function setTheme(value) {
  return {
    type: types.SET_THEME,
    payload: value
  }
}



export function setSelectLanguage(value) {
  return {
    type: types.SELECT_LANGUAGE,
    payload: value
  }
}
export function setLoginData(value) {
  return {
    type: types.USER_LOGIN,
    payload: value
  }
}
export function setToken(value) {
  return {
    type: types.SET_TOKEN,
    payload: value
  }
}

export function setDefaultSchedule(value) {
  return {
    type: types.DEFAULT_SCHEDULE,
    payload: value
  }
}

export function setCustomSchedule(value) {
  return {
    type: types.CUSTOM_SCHEDULE,
    payload: value
  }
}



export function setForgot(value) {
  return {
    type: types.SET_FORGOT,
    payload: value
  }
}
export function setEmail(value) {
  return {
    type: types.EMAIL,
    payload: value
  }
}
export function setOtp(value) {
  return {
    type: types.SET_OTP,
    payload: value
  }
}

export function destroySession(value) {
  return {
    type: types.DESTROY_SESSION,
    payload: value
  }
}
export function setRegisterUser(value) {
  return {
    type: types.REGISTER_USER,
    payload: value
  }
}
export function setCenterData(value) {
  return {
    type: types.REGISTER_CENTER,
    payload: value
  }
}
export function setWorkerDefaultSchedule(value) {
  return {
    type: types.WORKER_DEFAULT_SCHEDULE,
    payload: value
  }
}
export function setWorkerCustomSchedule(value) {
  return {
    type: types.WORKER_CUSTOM_SCHEDULE,
    payload: value
  }
}

export function setCollectiveDefaultSchedule(value){
  return{
    type: types.COLLECTIVE_DEFAULT_SCHEDULE,
    payload: value
  }
}

export function setCollectiveCustomSchedule(value){
  return{
    type:types.COLLECTIVE_CUSTOM_SCHEDULE,
    payload:value
  }
}

export function openWorkerModel(value) {
  return {
    type: types.OPEN_WORKER_MODEL,
    payload: value
  }
}

export function workerSchedules(value) {
  return {
    type: types.WORKER_SCHEDULE,
    payload: value
  }
}

export function workerInput(value) {
  return {
    type: types.WORKER_INPUT,
    payload: value
  }
}

export function setPersonalService(value){
  return{
    type: types.SETPERSONALSERVICE,
    payload: value
  }
}

export function setCollectiveService(value){
  return{
    type:types.SETCOLLECTIVESERVICE,
    payload:value
  }
}

export function setCollectiveServiceModel(value){
  return{
    type:types.OPEN_COLLECTIVESERVICE_MODEL,
    payload:value
  }
}
export function setSelectedCenter(value){
  return {
    type:types.SELECTED_CENTER,
    payload:value
  }
}

export function setNewWorkerData(value){
  return{
    type:types.WORKER_DATA,
    payload:value
  }
} 
export function selectedRowData (value){
  return {
    type:types.SELECTED_ROW_DATA,
    payload:value
  }
}

export function setCustomData(value){
  return{
    type:types.CUSTOM_DATA,
    payload:value
  }
}  
export function customArraydata (value){
  return {
    type: types.CUSTOM_ARRAY_DATA,
    payload:value
  }
}

export function setStarttime(value){
  return{
    type:types.STIME,
    payload:value
  }
}
export function setEndtime(value){
  return{
    type:types.ETIME,
    payload:value
  }
}
export function setDefaultScheduleTimeArray(value){
  return{
    type:types.DEFAULT_SCHEDULE_TIMEARRAY,
    payload:value
  }
}

export function setDefaultScheduleApiData(value){
  return{
    type:types.DEFAULT_SCHEDULE_API_DATA,
    payload:value
  }
}

export function setUserId(value){
  return{
    type:types.USERID,
    payload:value
  }
}

export function setSelectedCategory(value){
  return{
    type:types.SELECTEDCATEGORY,
    payload:value
  }
}
export function centerDataForArray (value){
  return {
    type: types.CENTER_DATA,
    payload:value
  }
}

export function setEventData (value ){
  return {
    type:types.EVENT_DATA,
    payload:value
  }
}


export function setEventStartDate (value){
  return {
    type:types.EVENT_START_DATE,
    payload:value
  }
}
export function setCustomScheduleTime(value){
  return{
    type:types.CUSTOMSCHEDULETIME,
    payload:value
  }
}

export function setEventEndDate (value){
  return {
    type:types.EVENT_END_DATE,
    payload:value
  }
}
export function setMonthEvents(value){
  return{
    type:types.MONTHEVENTS,
    payload:value
  }
}
export function setCenterAdminLoginStatus (value){
  return {
    type: types.SET_CENTER_ADMIN_LOGIN,
    payload:value
  }
}
export function setUserLoginStatus (value){
  return {
    type: types.SET_USER_LOGIN,
    payload:value
  }
}
export function setAppointDetails (value){
  return {
    type: types.APPOINTMENTDETAILS,
    payload:value
  }
}
export function setAppointBookModel (value){
  return {
    type: types.OPEN_APPOINTMENT_MODEL,
    payload:value
  }
}
export function setSelectedServicesForCenterAdmin (value){
  return {
    type: types.SET_SELECTED_SERVICE_CENTER_ADMIN,
    payload:value
  }
}
export function setSelectedWorkerData (value){
  return {
    type: types.SELECTED_WORKER_DATA,
    payload:value
  }
}

export function setCenterWorkerList(value){
  return{
    type: types.CENTER_WORKER_LIST,
    payload : value
  }
}

export function setWorkerLoginStatus(value){
  return{
    type: types.WORKER_LOGIN_STATUS,
    payload : value
  }
}

export function setWorkerAppoinmentData(value){
  return{
    type: types.WORKER_APPOINTMENT_DATA,
    payload : value
  }
}

export function setTaxData(value){
  return{
    type: types.SET_TAX_DATA,
    payload: value
  }
}

export function setCenterManageAnotherCenter (value){
  return {
    type: types.SET_CENTER_MANAGE_ANOTHER_CENTER,
    payload:value
  }
}

export function setLoginDataAdmin (value){
  return {
    type: types.LOGIN_DATA_ADMIN,
    payload:value
  }
}
export function setSelectedPet (value){
  return {
    type: types.SELECTED_PET,
    payload:value
  }
}
export function setSelectedLoginCenter (value){
  return {
    type: types.SELECTED_LOGIN_CENTER,
    payload:value
  }
}

