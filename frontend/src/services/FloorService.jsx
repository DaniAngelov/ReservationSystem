import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:8080/api/floors';

export const getFloors = () => axios.get(REST_API_BASE_URL);

export const getEvents = (value) => axios.get(REST_API_BASE_URL + '/events', {
  params: {
    sortField: 'name'
  }
});

export const addEvent = (event) => axios.post(REST_API_BASE_URL + '/events',event,{headers: {'Content-Type': 'application/json'}});
