import * as types from '../constants';

export function setTheme(value) {
  return {
    type: types.SET_THEME,
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

export function editCenterData(value){
  return{
    type:types.EDIT_CENTER_DATA,
    payload:value
  }
}

export function editServiceData(value){
  return{
    type: types.EDIT_SERVICE_DATA,
    payload: value
  }
}

export function overlappedService(value){
  return{
    type: types.OVERLAPPED_SERVICE,
    payload: value
  }
}

export function editWorkerData(value){
  return{
    type: types.EDIT_WORKER_DATA,
    payload: value
  }
}

export function editUserData(value){
  return{
    type: types.EDIT_USER_DATA,
    payload: value
  }
}

export function editBillingData(value){
  return{
    type: types.EDIT_BILLING_DATA,
    payload: value
  }
}

export function editBusinessData(value){
  return{
    type: types.EDIT_BUSINESS_DATA,
    payload: value
  }
}

export function editRateData(value){
  return{
    type: types.EDIT_RATE_DATA,
    payload: value
  }
}

export function editPaymentData(value){
  return{
    type: types.EDIT_PAYMENT_DATA,
    payload: value
  }
}