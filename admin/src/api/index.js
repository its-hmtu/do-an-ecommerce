import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(sessionStorage.getItem("token"));
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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // console.log(error.response.data.message)
    if (error.response && error.response.data.message === 'Token has expired' && error.response.status === 403) {
      try {
        const response = await api.get("/api/refresh", {
          withCredentials: true,
        });

        if (response.status === 200) {
          sessionStorage.setItem("token", JSON.stringify(response.data.token));
          return api.request(error.config);
        }

      } catch (e) {
        console.log(e)
        // Cookies.remove('access_token');
        sessionStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  }
)

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

const adminLogout = async () => {
  try {
    const response = await api.post("/admin/logout");
    if (response.data.success === false) {
      throw new Error(response.data.message);
    }
    
    return response.data;
  } catch (e) {
    return e.response.data;
  }
}

export { adminLogin, adminLogout, getRoles, getCurrentAdmin, api as default };