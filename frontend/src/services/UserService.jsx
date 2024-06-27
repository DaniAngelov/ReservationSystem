import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:8080/api/users';

export const createUser = (user) => axios.post(REST_API_BASE_URL,user);

export const loginUser = (user) => axios.put(REST_API_BASE_URL + '/login',user);