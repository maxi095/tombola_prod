import axios from './axios';

export const getActivitiesRequest = () => axios.get('/activity');

export const getActivityRequest = (id) => axios.get(`/activity/${id}`);

export const createActivityRequest = (activity) => axios.post('/activity', activity);

export const updateActivityRequest = (id, activity) => axios.put(`/activity/${id}`, activity);

export const deleteActivityRequest = (id) => axios.delete(`/activity/${id}`);

export const getActivitiesByUserRequest = (userId) => axios.get(`/activities/user/${userId}`);

export const getUsersByActivityRequest = (activityId) => axios.get(`/activities/${activityId}/users`);


