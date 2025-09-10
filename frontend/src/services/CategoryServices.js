import api from "../api/api";

// create category
export const createCategory = async (data) => {
  const res = await api.post("/categories", data);
  return res.data;
};

// get all categories
export const getAllCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};

// update category
export const updateCategory = async (id, data) => {
  const res = await api.put(`/categories/${id}`, data);
  return res.data;
};

// delete category
export const deleteCategory = async (id) => {
  try {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  } catch (err) {
    // Eğer backend 400 veya 500 döndürdüyse detaylı mesaj göster
    if (err.response?.data?.message) {
      console.error("Kategori silme hatası:", err.response.data.message);
      throw new Error(err.response.data.message);
    } else {
      console.error("Kategori silme hatası:", err);
      throw err;
    }
  }
};

export default {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
