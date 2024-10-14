import api from "api";

const getCategories = async ({
  page = 1,
  limit = 10,
}) => {
  try {
    const response = await api.get("/categories", {
      params: {
        page,
        limit,
      }
    });

    if (response.data.success === false) {
      throw new Error(response.data.message);
    }

    return response.data.data;
  } catch (e) {
    return e.response.data;
  }
};

const getAllCategories = async () => {
  try {
    // const response = await api.get()
  } catch (e) {
    return e.response.data
  }
}

const getSingleCategory = async ({id}) => {
  try {
    const {data} = await api.get(`/categories/${id}`);

    if (data.success === false) {
      throw new Error(data.message);
    }

    return data.data;
  } catch (e) {
    return e.response.data;
  }
}

const deleteCategory = async ({id}) => {
  try {
    const {data} = await api.delete(`/categories/${id}`);

    if (data.success === false) {
      throw new Error(data.message);
    }

    return data.data;
  } catch (e) {
    return e.response.data;
  }
}

export { getCategories, getSingleCategory, deleteCategory };