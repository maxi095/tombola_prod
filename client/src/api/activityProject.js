import axios from './axios';

export const getActivityProjectsRequest = () => axios.get('/activity-projects');

export const getActivityProjectRequest = (id) => axios.get(`/activity-projects/${id}`);

export const createActivityProjectRequest = (activityProject) => axios.post('/activity-projects', activityProject);

export const updateActivityProjectRequest = (id, activityProject) => axios.put(`/activity-projects/${id}`, activityProject);

export const deleteActivityProjectRequest = (id) => axios.delete(`/activity-projects/${id}`);
