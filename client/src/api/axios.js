import axios from "axios";

const instance = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}`,

    //baseURL: 'https://odonto-production.up.railway.app/api',
    withCredentials: true
})

export default instance