import axios from "axios";
const API_URL = "https://sureze.ddns.net:3000";

const apiClient = axios.create({
    baseURL: API_URL,
})
apiClient.interceptors.request.use((config) => {
    const oidcKey = `oidc.user:${API_URL}:Billing_React`
    const userJson = localStorage.getItem(oidcKey);
    if (userJson) {
        const user = JSON.parse(userJson);
        config.headers.Authorization = `Bearer ${user.access_token}`;
    }
    return config;
})

export default apiClient;