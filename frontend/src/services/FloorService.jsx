import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:8080/api/floors';
const REST_API_EVENTS_BASE_URL = 'http://localhost:8080/api/floors/events';

export const getFloors = (token) => axios.get(REST_API_BASE_URL, { headers: { "Authorization": `Bearer ${token}` } });

export const getEvents = (token) => axios.get(REST_API_EVENTS_BASE_URL, {
  params: {
    sortField: 'name'
  },
  headers: { "Authorization": `Bearer ${token}` }
});

export const getEventsForUser = (username,token) => axios.get(REST_API_EVENTS_BASE_URL + '/user',{
  params: {
    username: username
  },
  headers: { "Authorization": `Bearer ${token}` }
});

export const addEvent = (event,token) => axios.post(REST_API_EVENTS_BASE_URL, event, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } });

export const searchNewEvent = (event,token) => axios.put(REST_API_EVENTS_BASE_URL + '/search', event, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } });

export const uploadFile = (formData, token) => axios.post(REST_API_BASE_URL + '/upload', formData, { headers: { 'Content-Type': 'multipart/form-data', "Authorization": `Bearer ${token}` } });

export const disableEvent = (event,token) => axios.post(REST_API_EVENTS_BASE_URL + '/disable', event, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } });
