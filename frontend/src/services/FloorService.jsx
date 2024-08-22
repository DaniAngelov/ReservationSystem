import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:8080/api/floors';

export const getFloors = (token) => axios.get(REST_API_BASE_URL, { headers: { "Authorization": `Bearer ${token}` } });

export const getEvents = (token) => axios.get(REST_API_BASE_URL + '/events', {
  params: {
    sortField: 'name'
  },
  headers: { "Authorization": `Bearer ${token}` }
});

export const addEvent = (event,token) => axios.post(REST_API_BASE_URL + '/events', event, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } });

export const uploadFile = (formData, token) => axios.post(REST_API_BASE_URL + '/upload', formData, { headers: { 'Content-Type': 'multipart/form-data', "Authorization": `Bearer ${token}` } });
