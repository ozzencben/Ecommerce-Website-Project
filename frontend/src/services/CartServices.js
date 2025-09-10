import api from "../api/api";

// Sepete ürün ekle
export const addToCart = async (
  { product, variantId, quantity, price },
  token
) => {
  try {
    const res = await api.post(
      "/carts",
      { product, variantId, quantity, price },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Hata detayları:", err.response?.data || err.message);
    throw err;
  }
};

// Sepeti getir
export const getCart = async (token) => {
  try {
    const res = await api.get("/carts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Hata detayları:", err.response?.data || err.message);
    throw err;
  }
};

// Sepetten ürün sil
export const removeFromCart = async (itemId, token) => {
  try {
    const res = await api.delete(`/carts/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Hata detayları:", err.response?.data || err.message);
    throw err;
  }
};

// Sepeti temizle
export const clearCart = async (token) => {
  try {
    const res = await api.delete("/carts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Hata detayları:", err.response?.data || err.message);
    throw err;
  }
};
