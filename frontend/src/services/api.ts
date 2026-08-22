import axios from 'axios';

// Create an Axios instance connecting to our FastAPI backend
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
});

export const getSystemHealth = async () => {
    const response = await api.get('/health');
    return response.data;
};

export const getForecast = async (days: number = 30) => {
    const response = await api.get(`/forecasting/predict?days=${days}`);
    return response.data;
};

export const getAnomalies = async () => {
    const response = await api.get('/anomalies/detect');
    return response.data;
};

export const simulateScenario = async (days: number = 30, marketing: number = 0, discount: number = 0) => {
    const response = await api.get(`/scenarios/simulate?days=${days}&marketing_boost=${marketing}&discount=${discount}`);
    return response.data;
};

export default api;