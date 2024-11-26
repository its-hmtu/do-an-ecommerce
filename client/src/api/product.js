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

const submitReviewApi = async (data) => {
  const response = await axiosInstance.post(`${API_PATHS.SUBMIT_REVIEW}`, data);

  return response.data;
}

const searchProductsApi = async (query) => {
  const response = await axios.get(`${API_PATHS.SEARCH_PRODUCTS}`, {
    params: {
      q: query,
    }
  });

  return response.data.data;
}

export {
  getProductsApi,
  getProductApi,
  submitReviewApi,
  searchProductsApi,
}