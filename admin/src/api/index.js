import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
})

const handleDecode = () => {
  let storage = JSON.parse(sessionStorage.getItem("token"));
  console.log(storage);
  let decoded = {};

  try {
    decoded = jwtDecode(storage);
  } catch (error) {
    console.error(error);
    sessionStorage.removeItem("token");
    storage = null;
  }

  return { decoded, storage };
}

api.interceptors.request.use(async (config) => {
  const { decoded, storage } = handleDecode();
  if (!storage) {
    return config;
  }
  const currentTimeInSeconds = Date.now() / 1000;

  if (decoded?.exp && decoded.exp < currentTimeInSeconds) {
    try {
      const data = await refresh();
      sessionStorage.setItem("token", JSON.stringify(data?.token));
      config.headers.Authorization = `Bearer ${data?.token}`;
    } catch (e) {
      console.error("Error refreshing token", e);
      throw e;
    }
  } else {
    config.headers.Authorization = `Bearer ${storage}`;
  }
  return config;
},
  (error) => {
    return Promise.reject(error);
  }
);

const refresh = async () => {
  try {
    const response = await api.get("/api/refresh", {
      withCredentials: true,
    });
    if (response.data.success === false) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (e) {
    return e.response.data;
  }
}

const adminLogin = async ({email, password}) => {
  try {
    const response = await api.post("/admin/login", {email, password});
    if (parseInt(response.data.status) != 200) {
      throw new Error(response.data.message);
    }
    
    sessionStorage.setItem("token", JSON.stringify(response.data.token));
    return response.data;
  } catch (e) {
    return e.response.data
  }
}

const getCurrentAdmin = async () => {
  try {
    const response = await api.get("/admin/me");
    if (response.data.success === false) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (e) {
    return e.response.data
  }
}

const getRoles = async () => {
  try {
    const response = await api.get("/admin/roles");
    if (response.data.success === false) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (e) {
    return e.response.data;
  }
}

export { adminLogin, getRoles, getCurrentAdmin };