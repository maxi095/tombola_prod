import axios from './axios';

export const getClientsRequest = () => axios.get('/clients');
export const getClientRequest = (id) => axios.get(`/clients/${id}`);
export const createClientRequest = (data) => axios.post('/clients', data);
export const updateClientRequest = (id, data) => axios.put(`/clients/${id}`, data);
export const deleteClientRequest = (id) => axios.delete(`/clients/${id}`);
