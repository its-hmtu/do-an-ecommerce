import api from "api";

const getProducts = async ({
  page = 1,
  limit = 10,
  q = "",
  category = "",
  sort = "createdAt",
  order = "desc"
}) => {
  try {
    const response = await api.get("/products", {
      params: {
        page,
        limit,
        q,
        category,
        sort,
        order
      }
    });

    if (response.data.success === false) {
      throw new Error(response.data.message);
    }

    return response.data.data;
  } catch (e) {
    return e.response.data;
  }
}

const getSingleProduct = async ({id}) => {
  try {
    const {data} = await api.get(`/products/id/${id}`);

    if (data.success === false) {
      return data;
    }

    return data.data;
  } catch (e) {
    return e.response.data;
  }
}

const createProduct = async (data) => {
  try {
    const response = await api.post("/products", data, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.data.success === false) {
      return response.data;
    }

    return response.data.data;
  } catch (e) {
    return e.response.data;
  }
}

const updateProduct = async ({id, data}) => {
  try {
    console.log("data", data);
    const response = await api.put(`/products/${id}`, data, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.data.success === false) {
      return response.data;
    }

    return response.data.data;
  } catch (e) {
    return e.response.data;
  }
}

const deleteProduct = async ({id}) => {
  try {
    const response = await api.delete(`/products/${id}`);

    if (response.data.success === false) {
      return response.data;
    }

    return response.data.data;
  } catch (e) {
    return e.response.data;
  }
}

const deleteMultipleProducts = async ({product_ids}) => {
  try {
    const response = await api.delete(`/products?ids=${product_ids.join("%2C")}`);

    if (response.data.success === false) {
      return response.data;
    }

    return response.data;
  } catch (e) {
    return e.response;
  }
}

export { getProducts, getSingleProduct, createProduct, updateProduct, deleteProduct, deleteMultipleProducts };