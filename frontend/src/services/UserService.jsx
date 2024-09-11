import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:8080/api/users';

export const createUser = (user) => axios.post(REST_API_BASE_URL + '/register', user);

export const loginUser = (user) => axios.put(REST_API_BASE_URL + '/login', user);

export const reserveSpot = (user,token) => axios.put(REST_API_BASE_URL + '/reserve', user, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } });

export const releaseSpot = (user,token) => axios.put(REST_API_BASE_URL + '/release', user, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } });

export const enableTwoFA = (request,token) => axios.put(REST_API_BASE_URL + '/enable-2fa', request, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } });

export const generateTwoFA = (request,token) => axios.put(REST_API_BASE_URL + '/generate-2fa', request, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } });

export const verifyTwoFA = (request,token) => axios.put(REST_API_BASE_URL + '/verify-code', request, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } });

export const sendMessageToEmail = (userEmailDTO) => axios.put(REST_API_BASE_URL + '/forgotten-password', userEmailDTO, { headers: { 'Content-Type': 'application/json'} });

export const updateUserPassword = (userPassDTO) => axios.put(REST_API_BASE_URL + '/update-password', userPassDTO, { headers: { 'Content-Type': 'application/json'} });

export const enableOneTimePass = (request,token) => axios.put(REST_API_BASE_URL + '/enable-one-time-pass', request, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } });

export const generateOneTimePass = (request,token) => axios.put(REST_API_BASE_URL + '/generate-one-time-pass', request, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } });

export const verifyOneTimePass = (request,token) => axios.put(REST_API_BASE_URL + '/verify-one-time-code', request, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } });

export const addLinkToPage = (request,token) => axios.put(REST_API_BASE_URL + '/add-link-to-page', request, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } });

export const getUsers = (token) => axios.get(REST_API_BASE_URL + '/get-users', { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } });

export const getUserByUsername = (user, token) => axios.get(REST_API_BASE_URL + '/user-points', {
  params: {
    username: user
  },
  headers: { "Authorization": `Bearer ${token}` }
});

export const searchNewGuest = (request, token) => axios.put(REST_API_BASE_URL + '/search', request, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } });