import axiosInstance from "api";
import axios from "axios";
import {API_PATHS} from "config";

const getProductsApi = async () => {
  const response = await axiosInstance.get(`${API_PATHS.PRODUCTS}`, {
    params: {
      limit: 10,
      page: 1,
    }
  })

  return response.data.data;
}

const getProductApi = async (slug) => {
  const response = await axiosInstance.get(`${API_PATHS.PRODUCT}/${slug}`);

  return response.data.data;
}

export {
  getProductsApi,
  getProductApi,
}