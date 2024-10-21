import api from "api";

const getBrands = async () => {
  try {
    const response = await api.get("/brands");

    if (response.data.success === false) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (e) {
    return e.response.data;
  }
}

export { getBrands };