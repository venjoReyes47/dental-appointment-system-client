import instance from "./systemAPI";


// Authentication -----------------------------------------------
export const login = async (email, password) => {
    try {
        const response = await instance.post('/api/users/login', { email, password });
        console.log(response.data.data.tokens)
        if (response.data) {
            // Set cookie with secure and sameSite attributes for better security
            const cookieOptions = [
                `path=/`,
                `max-age=${7 * 24 * 60 * 60}`, // 7 days
                'secure',
                'samesite=strict'
            ].join('; ');
            document.cookie = `token=${response.data.data.tokens.accessToken}; ${cookieOptions}`;
        }
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Login failed';
    }
};

export const register = async (userData) => {
    try {
        const response = await instance.post('/api/users/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Registration failed';
    }
};

export const logout = async () => {
    try {
        await instance.post('/auth/logout');
        // Clear the token cookie
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    } catch (error) {
        console.error('Logout failed:', error);
    }
};

export const checkAuth = async () => {
    try {
        const response = await instance.get('/api/users/verify-token');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Authentication check failed';
    }
};


// Dentist ----------------------------------------------

export const getDentist = async () => {
    try {
        const response = await instance.get('/api/dentists/');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message
    }
};


export const updateDentist = async (id, form) => {
    try {
        const response = await instance.put(`/api/dentists/${id}`, form);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message
    }
};

export const deleteDentist = async (id) => {
    try {
        const response = await instance.delete(`/api/dentists/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message
    }
};



// Appointment -------------------------------------------------------------------
export const saveAppointment = async (data) => {
    try {
        const response = await instance.post('/api/appointments', data);
        return response.data;
    } catch (error) {
        console.log(error)
        throw error.response?.data?.error
    }
};


export const getDentistAppointment = async (id) => {
    try {
        const response = await instance.get(`/api/appointments/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message
    }
};

export const getPatientAppointment = async (id) => {
    try {
        const response = await instance.get(`/api/appointments/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message
    }
};


export const updateAppointment = async (id, data) => {
    try {
        const response = await instance.put(`/api/appointments/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message
    }
};


// Services --------------------------
export const getServices = async () => {
    try {
        const response = await instance.get('/api/services/');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message
    }
};

export const updateService = async (id, form) => {
    try {
        const response = await instance.put(`/api/services/${id}`, form);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message
    }
};


export const deleteService = async (id) => {
    try {
        const response = await instance.delete(`/api/services/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message
    }
};

export const createService = async (data) => {
    try {
        const response = await instance.post('/api/services/', data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message
    }
};

