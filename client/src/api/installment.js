import axios from './axios';

// Obtener todas las cuotas
export const getInstallmentsRequest = () => axios.get('/installments');

// Obtener una cuota por ID
export const getInstallmentRequest = (id) => axios.get(`/installment/${id}`);

// Crear una nueva cuota
export const createInstallmentRequest = (installment) => axios.post('/installment', installment);

// Actualizar una cuota
export const updateInstallmentRequest = (id, installment) => axios.put(`/installment/${id}`, installment);

// Eliminar una cuota
export const deleteInstallmentRequest = (id) => axios.delete(`/installment/${id}`);
