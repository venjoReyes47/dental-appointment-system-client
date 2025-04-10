import axios from 'axios';

const instance = axios.create({
    baseURL: `http://192.168.1.9:8080`
});

// Helper function to get cookie value by name
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

instance.interceptors.request.use(
    (config) => {
        const token = getCookie('token');
        config.headers.Authorization = token ? `Bearer ${token}` : '';
        return config;
    }
);

export default instance;    