import axios from './axios';

// Obtener todos los vendedores
export const getSellersRequest = () => axios.get('/sellers');

// Obtener un vendedor por ID
export const getSellerRequest = (id) => axios.get(`/sellers/${id}`);

// Crear un nuevo vendedor
export const createSellerRequest = (seller) => axios.post('/sellers', seller);

// Actualizar un vendedor
export const updateSellerRequest = (id, seller) => axios.put(`/sellers/${id}`, seller);

// Eliminar un vendedor
export const deleteSellerRequest = (id) => axios.delete(`/sellers/${id}`);
