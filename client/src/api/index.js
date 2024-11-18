import axios from 'axios';
import { API_PATHS } from 'config';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true, // When using cookies, you need to set this to true
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    // console.log('Token:', token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  } ,
  (error) => {
    return Promise.reject(error);
  }
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const response = await axiosInstance.get(API_PATHS.REFRESH, {
          withCredentials: true,
        })

        const newAccessToken = response.data.token;

        Cookies.set('access_token', newAccessToken, {
          expires: 10 / (24 * 60), // 10 minutes
          secure: true,
          sameSite: 'Strict',
        });

        error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axios(error.config);
      } catch (e) {
        console.error('Unable to refresh token', e);
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
)

export default axiosInstance;

