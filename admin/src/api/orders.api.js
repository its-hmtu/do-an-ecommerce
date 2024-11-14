import api from "api";

const getOrders = async ({
  page = 1,
  limit = 10,
  q = "",
  sort = "createdAt",
  order = "desc",
}) => {
  try {
    const response = await api.get("/orders", {
      params: {
        page,
        limit,
        q,
        sort,
        order
      }
    });

    if (response.data.success === false) {
      return response.data;
    }

    return response.data;
  } catch (e) {
    return e.response.data;
  }
};

const getSingleOrder = async (id) => {
  try {
    const response = await api.get(`/orders/order/${id}`);

    if (response.data.success === false) {
      return response.data;
    }

    return response.data;
  } catch (e) {
    return e.response.data;
  }
};

const getOrdersByStatus = async (status) => {
  try {
    const response = await api.get(`/orders/status?q=${status}`);

    if (response.data.success === false) {
      return response.data;
    }

    return response.data;
  } catch (e) {
    return e.response.data;
  }
}

const shipOrder = async (id) => {
  try {
    const response = await api.put(`/orders/ship-order?order_id=${id}`);

    if (response.data.success === false) {
      return response.data;
    }

    return response.data;
  } catch (e) {
    return e.response.data;
  }
};

const massShipOrder = async (ids) => {
  try {
    const response = await api.put(`/orders/mass-ship-order`, {
      order_ids: ids,
    });

    if (response.data.success === false) {
      return response.data;
    }

    return response.data;
  } catch (e) {
    return e.response.data;
  }
}

const exportToExcel = async ({
  status = "",
  paid = 0,
  start_date = "",
  end_date = "",
}) => {
  try {
    const response = await api.get("/orders/export", {
      params: {
        status,
        paid,
        start_date,
        end_date,
      },
      responseType: "blob",
    });

    if (response.data.success === false) {
      return response;
    }

    return response;
  } catch (e) {
    return e.response.data;
  }
}

export { getOrders, getSingleOrder, shipOrder, massShipOrder, getOrdersByStatus, exportToExcel };
