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

  if (response.status !== 200) {
    return response.data
  }

  // Cookies.set('access_token', response.data.token, {
  //   expires: 10 / (24 * 60), // 10 minutes
  //   secure: true,
  //   sameSite: 'Strict',
  // });
  localStorage.setItem('access_token', JSON.stringify(response.data.token));
  return response.data;
}

const logoutApi = async () => {
  const response = await axiosInstance.get(API_PATHS.LOGOUT);

  if (response.status !== 200) {
    return response.data
  }

  localStorage.removeItem('access_token');
  return response.data;
}

const registerApi = async ({
  email,
  password,
  username,
  confirm_password,
  first_name,
  last_name,
}) => {
  const response = await axiosInstance.post(API_PATHS.REGISTER, {
    email,
    password,
    username,
    confirm_password,
    first_name,
    last_name,
  });
  return response.data;
}

const getUserApi = async () => {
  const response = await axiosInstance.get(API_PATHS.USER);
  return response.data.user;
}

const getUserCartApi = async () => {
  const response = await axiosInstance.get(API_PATHS.USER_CART);
  return response.data;
}

const updateUserCartApi = async ({
  item_id,
  quantity
}) => {
  const response = await axiosInstance.put(API_PATHS.USER_CART, {
    item_id,
    quantity
  });
  return response.data;
}

export {
  loginApi,
  getUserApi,
  registerApi,
  logoutApi,
  getUserCartApi,
  updateUserCartApi
}