import axios from './axios';

// Funciones para manejar las dimensiones
export const getDimensionsRequest = () => axios.get('/dimensions');

export const getDimensionRequest = (id) => axios.get(`/dimensions/${id}`);

export const createDimensionRequest = (dimension) => axios.post('/dimensions', dimension);

export const updateDimensionRequest = (id, dimension) => axios.put(`/dimensions/${id}`, dimension);

export const deleteDimensionRequest = (id) => axios.delete(`/dimensions/${id}`);
