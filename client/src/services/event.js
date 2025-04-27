import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NODE_ENV == 'production' ? 'https://henon-scheduler-app-hankhoo-2a66f2927e9b.herokuapp.com/api' : 'http://localhost:5000/api',
});

console.log(process.env.NODE_ENV, 'NODE_ENV');

export const getEvents = (params) => API.get('/events', { params });
export const createEvent = (event) => API.post('/events', event);
export const updateEvent = (event) => API.put(`/events/${event.id}`, event);
export const deleteEvent = (id) => API.delete(`/events/${id}`);