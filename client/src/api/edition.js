import axios from './axios';

export const getEditionsRequest = () => axios.get('/editions');

export const getEditionRequest = (id) => axios.get(`/edition/${id}`);

export const createEditionRequest = (edition) => axios.post('/edition', edition);

export const updateEditionRequest = (id, edition) => axios.put(`/edition/${id}`, edition);

export const deleteEditionRequest = (id) => axios.delete(`/edition/${id}`);

