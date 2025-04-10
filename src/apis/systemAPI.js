import axios from 'axios';
const instance = axios.create({
    baseURL: `http://a6af8f64d3b954622b59a3c4846f07ae-267531595.ap-southeast-1.elb.amazonaws.com`
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