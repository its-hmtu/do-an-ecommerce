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

export { getCategories };