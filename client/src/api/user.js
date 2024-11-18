import { Cookie } from "@mui/icons-material";
import axiosInstance from "api";
import axios from "axios";
import {
  API_PATHS
} from 'config'
import Cookies from "js-cookie";

const loginApi = async ({
  email,
  password,
}) => {
  const response = await axiosInstance.post(API_PATHS.LOGIN, {
    email,
    password,
  });

  Cookies.set('access_token', response.data.token, {
    expires: 10 / (24 * 60), // 10 minutes
    secure: true,
    sameSite: 'Strict',
  });
  return response.data;
}

const getUserApi = async () => {
  const response = await axiosInstance.get(API_PATHS.USER);
  return response.data.user;
}

export {
  loginApi,
  getUserApi
}