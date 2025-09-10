// ProductServices.js
import api from "../api/api";

export const createProduct = async (formData) => {
  try {
    const res = await api.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Eğer res.data undefined ise boş array döndür
    return res.data || [];
  } catch (err) {
    if (err.response?.data) {
      console.error("Hata detayları:", err.response.data);
    } else {
      console.error("Hata detayları:", err);
    }
    throw err;
  }
};

// ProductServices.js
export const getAllProducts = async ({ page = 1, limit = 20 } = {}) => {
  const res = await api.get(`/products?page=${page}&limit=${limit}`);
  return res.data; // { products, total, page, totalPages }
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const updateProduct = async ({
  id,
  title,
  description,
  category,
  variants,
  newImages, // File array
  removeImages = [], // silinecek image public_id dizisi
  token, // authorization token
}) => {
  try {
    const formData = new FormData();
    if (title) formData.append("title", title);
    if (description) formData.append("description", description);
    if (category) formData.append("category", category);
    if (variants) formData.append("variants", JSON.stringify(variants));
    if (removeImages.length > 0)
      formData.append("removeImages", JSON.stringify(removeImages));
    if (newImages?.length > 0) {
      newImages.forEach((file) => {
        formData.append("images", file);
      });
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // token varsa ekle
      },
    };

    const res = await api.put(`/products/${id}`, formData, config);
    return res.data;
  } catch (err) {
    if (err.response?.data) {
      console.error("Hata detayları:", err.response.data);
    } else {
      console.error("Hata detayları:", err);
    }
    throw err;
  }
};

export const deleteProduct = async (id, token) => {
  try {
    const res = await api.delete(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // token varsa ekle
      },
    });
    return res.data;
  } catch (err) {
    if (err.response?.data) {
      console.error("Hata detayları:", err.response.data);
    } else {
      console.error("Hata detayları:", err);
    }
    throw err;
  }
};
