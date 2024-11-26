import axios from 'axios';
import { API_PATHS } from 'config';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true, // When using cookies, you need to set this to true
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem('access_token'));
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
    // console.log(error.response.data.message)
    if (error.response && error.response.data.message === 'Token has expired' && error.response.status === 403) {
      try {
        const response = await axiosInstance.get(API_PATHS.REFRESH);

        if (response.status === 200) {
          localStorage.setItem('access_token', JSON.stringify(response.data.token));
          return axiosInstance.request(error.config);
        }

      } catch (e) {
        console.log(e)
        // Cookies.remove('access_token');
        localStorage.removeItem('access_token');
        window.location.href = '/account/login';
      }
    }
  }
)

export default axiosInstance;

