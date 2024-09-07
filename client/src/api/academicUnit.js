import axios from './axios';

export const getAcademicUnitsRequest = () => axios.get('/academic-units');

export const getAcademicUnitRequest = (id) => axios.get(`/academic-units/${id}`);

export const createAcademicUnitRequest = (academicUnit) => axios.post('/academic-units', academicUnit);

export const updateAcademicUnitRequest = (id, academicUnit) => axios.put(`/academic-units/${id}`, academicUnit);

export const deleteAcademicUnitRequest = (id) => axios.delete(`/academic-units/${id}`);

