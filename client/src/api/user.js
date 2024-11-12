import axios from './axios';

export const getUsersRequest = () => axios.get('/users');

export const getUserRequest = (id) => axios.get(`/users/${id}`);

export const createUserRequest = (user) => axios.post('/users', user);

export const updateUserRequest = (id, user) => axios.put(`/users/${id}`, user);

export const deleteUserRequest = (id) => axios.delete(`/users/${id}`);

export const getStudentsRequest = () => axios.get('/students');

export const createStudentRequest = (user) => axios.post('/students', user);

export const getDirectorsRequest = () => axios.get('/directors');

export const createDirectorRequest = (user) => axios.post('/directors', user);

