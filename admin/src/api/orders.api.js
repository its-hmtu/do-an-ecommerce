import api from "api";

const getOrders = async () => {
  try {
    const response = await api.get("/orders");

    if (response.data.success === false) {
      return response.data;
    }

    return response.data;
  } catch (e) {
    return e.response.data;
  }
}

const getSingleOrder = async (id) => {
  try {
    const response = await api.get(`/orders/${id}`);

    if (response.data.success === false) {
      return response.data;
    }

    return response.data;
  } catch (e) {
    return e.response.data;
  }
}
export {
  getOrders,
  getSingleOrder
}