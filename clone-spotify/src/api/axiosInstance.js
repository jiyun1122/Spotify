import axios from 'axios';
import { getAccessToken } from './spotify';

const axiosInstance = axios.create({
  baseURL: "https://api.spotify.com/v1",
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    console.log("토큰: ",token)
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;