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

const emailVerifyApi = async ({ email, code }) => {
  const response = await axiosInstance.post(API_PATHS.VERIFY_EMAIL, {
    email,
    code,
  });

  return response.data;
};

const getUserApi = async () => {
  const response = await axiosInstance.get(API_PATHS.USER);
  return response.data.user;
};

const updateUserApi = async (data) => {
  const response = await axiosInstance.put(API_PATHS.USER, data);

  return response.data;
}

const changePasswordApi = async (data) => {
  const response = await axiosInstance.put(API_PATHS.USER_PASSWORD, data);

  return response.data;
}

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

const getUserOrdersApi = async () => {
  const response = await axiosInstance.get(API_PATHS.USER_ORERS);

  return response.data.data;
}

const updateAddressSetDefaultApi =  async (addressId) => {
  const response = await axiosInstance.put(
    `${API_PATHS.ADDRESS_SET_DEFAULT.replace(":id", addressId)}`
  )

  return response.data
}

const updateAdrressApi = async ({
  id: addressId,
  data
}) => {
  const response = await axiosInstance.put(
    `${API_PATHS.ADDRESS}/${addressId}`,
    data
  )

  return response.data
}

const createAddressApi = async ({data}) => {
  const response = await axiosInstance.post(
    `${API_PATHS.ADDRESS}`,
    data
  )

  return response.data
}

const deleteAddressApi = async (addressId) => {
  const response = await axiosInstance.delete(
    `${API_PATHS.ADDRESS}/${addressId}`
  )

  return response.data
}

export {
  loginApi,
  getUserApi,
  registerApi,
  logoutApi,
  getUserCartApi,
  updateUserApi,
  changePasswordApi,
  updateUserCartApi,
  addItemToCartApi,
  removeFromCartApi,
  updateCartSubTotalApi,
  createOrderApi,
  createCheckoutSessionApi,
  getUserOrdersApi,
  emailVerifyApi,
  updateAddressSetDefaultApi,
  updateAdrressApi,
  createAddressApi,
  deleteAddressApi
};
