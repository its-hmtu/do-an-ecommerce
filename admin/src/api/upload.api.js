import api from "api";

const uploadFile = async (files, cb) => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    })

    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        cb(percentCompleted);
      },
    });

    if (response.data.success === false) {
      throw new Error(response.data.message);
    }

    return response.data.data;
  } catch (e) {
    return e.response.data;
  }
}
const uploadSingleFile = async (file, cb) => {
  try {
    const formData = new FormData();
    formData.append("images", file);

    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        cb(percentCompleted);
      },
    });

    if (response.data.success === false) {
      throw new Error(response.data.message);
    }

    return response.data.data;
  } catch (e) {
    return e.response.data;
  }
}

const removeImage = async (id) => {
  try {
    const response = await api.delete(`/upload/${id}`);

    if (response.data.success === false) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (e) {
    return e.response.data;
  }
}

export { uploadFile, uploadSingleFile, removeImage };