import { Cookie } from "@mui/icons-material";
import axiosInstance from "api";
import axios from "axios";
import { API_PATHS } from "config";
import Cookies from "js-cookie";

const loginApi = async ({ email, password }) => {
  const response = await axiosInstance.post(API_PATHS.LOGIN, {
    email,
    password,
  });

  if (response.status !== 200) {
    return response.data;
  }

  // Cookies.set('access_token', response.data.token, {
  //   expires: 10 / (24 * 60), // 10 minutes
  //   secure: true,
  //   sameSite: 'Strict',
  // });
  localStorage.setItem("access_token", JSON.stringify(response.data.token));
  return response.data;
};

const logoutApi = async () => {
  const response = await axiosInstance.get(API_PATHS.LOGOUT);

  if (response.status !== 200) {
    return response.data;
  }

  localStorage.removeItem("access_token");
  return response.data;
};

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
};

const getUserApi = async () => {
  const response = await axiosInstance.get(API_PATHS.USER);
  return response.data.user;
};

const getUserCartApi = async () => {
  const response = await axiosInstance.get(API_PATHS.USER_CART);
  return response.data;
};

const addItemToCartApi = async ({
  option_id,
  quantity,
  product_id,
  cart_id,
}) => {
  const response = await axiosInstance.post(API_PATHS.USER_CART, {
    option_id,
    quantity,
    product_id,
    cart_id,
  });

  return response.data;
};

const updateUserCartApi = async ({ cart_id, item_id, quantity }) => {
  const response = await axiosInstance.put(API_PATHS.USER_CART, {
    cart_id,
    item_id,
    quantity,
  });
  return response.data;
};

const removeFromCartApi = async (ids) => {
  const response = await axiosInstance.delete(API_PATHS.USER_CART, {
    data: {
      ids,
    },
  });

  return response.data;
};

const updateCartSubTotalApi = async (subtotal) => {
  const response = await axiosInstance.put(`${API_PATHS.USER_CART}/subtotal`, {
    subtotal,
  });

  return response.data;
};

const createOrderApi = async ({ subtotal, items, address }) => {
  const response = await axiosInstance.post(API_PATHS.ORDER, {
    subtotal,
    items,
    address,
  });

  // console.log(response.data.data);

  return response.data;
};

const createCheckoutSessionApi = async ({ orderId, items }) => {
  const response = await axiosInstance.post(
    `${API_PATHS.CREATE_CHECKOUT_SESSION}`,
    {
      orderId,
      items,
    }
  );

  return response.data.clientSecret;
};

export {
  loginApi,
  getUserApi,
  registerApi,
  logoutApi,
  getUserCartApi,
  updateUserCartApi,
  addItemToCartApi,
  removeFromCartApi,
  updateCartSubTotalApi,
  createOrderApi,
  createCheckoutSessionApi,
};
