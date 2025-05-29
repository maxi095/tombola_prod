import axios from './axios';

export const getDashboardRequest = (editionID) => axios.get(`/dashboard/${editionID}`);

