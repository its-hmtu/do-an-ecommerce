import api from "api";

const getOrders = async () => {
  try {
    const response = await api.get("/orders");

    if (response.data.success === false) {
      return response.data;
    }

    return response.data.data;
  } catch (e) {
    return e.response.data;
  }
}

export {
  getOrders
}