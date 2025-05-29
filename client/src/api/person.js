import axios from './axios';

export const getSellersRequest = () => axios.get('/sellers');

export const getSellerRequest = (id) => axios.get(`/seller/${id}`);

export const createSellerRequest = (seller) => axios.post('/seller', seller);

export const updateSellerRequest = (id, seller) => axios.put(`/seller/${id}`, seller);

export const deleteSellerRequest = (id) => axios.delete(`/seller/${id}`);


export const getClientsRequest = () => axios.get('/clients');

export const getClientRequest = (id) => axios.get(`/client/${id}`);

export const createClientRequest = (client) => axios.post('/client', client);

export const updateClientRequest = (id, client) => axios.put(`/client/${id}`, client);

export const deleteClientRequest = (id) => axios.delete(`/client/${id}`);

