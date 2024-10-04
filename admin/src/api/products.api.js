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
    const {data} = await api.get(`/products/${id}`);

    if (data.success === false) {
      throw new Error(data.message);
    }

    return data.data;
  } catch (e) {
    return e.response.data;
  }
}

export { getProducts, getSingleProduct };