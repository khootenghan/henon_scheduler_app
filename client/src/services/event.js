import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getEvents = (params) => API.get('/events', { params });
export const createEvent = (event) => API.post('/events', event);
export const updateEvent = (event) => API.put(`/events/${event.id}`, event);
export const deleteEvent = (id) => API.delete(`/events/${id}`);