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

export const getSpecificEvent = (eventName, token) => axios.get(REST_API_EVENTS_BASE_URL + '/get-event', {
  params: {
    eventName: eventName
  },
  headers: { "Authorization": `Bearer ${token}` }
});

export const getEventsForUser = (username, token) => axios.get(REST_API_EVENTS_BASE_URL + '/user', {
  params: {
    username: username
  },
  headers: { "Authorization": `Bearer ${token}` }
});

export const getEventsForOrganizer = (organizer, token) => axios.get(REST_API_EVENTS_BASE_URL + '/organizer', {
  params: {
    organizer: organizer
  },
  headers: { "Authorization": `Bearer ${token}` }
});

export const addEvent = (request, token) => axios.post(REST_API_EVENTS_BASE_URL, request, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } });

export const searchNewEvent = (request, token) => axios.put(REST_API_EVENTS_BASE_URL + '/search', request, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } });

export const uploadFile = (formData, token) => axios.post(REST_API_BASE_URL + '/upload', formData, { headers: { 'Content-Type': 'multipart/form-data', "Authorization": `Bearer ${token}` } });

export const disableUserEvent = (request, token) => axios.put(REST_API_EVENTS_BASE_URL + '/disable', request, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } });

export const deleteUserEvent = (request, token) => axios.put(REST_API_EVENTS_BASE_URL + '/user', request, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } });

export const deleteEvent = (request, token) => axios.put(REST_API_EVENTS_BASE_URL + '/delete-inactive-event', request, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } });

export const endEvent = (request, token) => axios.put(REST_API_EVENTS_BASE_URL + '/event-end', request, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } });

export const addFeedbackForm = (request, token) => axios.put(REST_API_EVENTS_BASE_URL + '/feedback', request, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } });

export const addRoomImage = (request, token) => axios.put(REST_API_EVENTS_BASE_URL + '/add-room-image', request, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } });

export const exportData = (token) => axios.get(REST_API_BASE_URL + '/export', { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } });
