import axios from 'axios';
const instance = axios.create({
  baseURL: 'http://ec2-35-180-150-125.eu-west-3.compute.amazonaws.com/api'
});
export default instance;
