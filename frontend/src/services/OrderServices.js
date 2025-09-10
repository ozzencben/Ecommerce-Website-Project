import api from "../api/api";

// ================================
// USER METHODS
// ================================

// Sepetten yeni sipariş oluştur
export const createOrder = async ({ address, payment }, token) => {
  try {
    const res = await api.post(
      "/orders",
      { address, payment }, // sadece bunlar gönderiliyor
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("OrderServices error:", err.response?.data || err.message);
    throw err;
  }
};

// Giriş yapmış kullanıcının tüm siparişlerini getir
export const getUserOrders = async (token) => {
  try {
    const res = await api.get("/orders", {
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

// Giriş yapmış kullanıcının tek bir siparişini getir
export const getOrderById = async (orderId, token, isAdmin = false) => {
  try {
    const endpoint = isAdmin ? `/orders/admin/${orderId}` : `/orders/${orderId}`;
    const res = await api.get(endpoint, {
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


// ================================
// ADMIN METHODS
// ================================

// Tüm siparişleri getir (admin)
export const getAllOrders = async (token) => {
  try {
    const res = await api.get("/orders/all", {
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



// Sipariş durumu güncelle (admin)
export const updateOrderStatus = async (orderId, status, token) => {
  try {
    const res = await api.put(
      `/orders/${orderId}/status`,
      { status },
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

// Siparişi sil (admin)
export const deleteOrder = async (orderId, token) => {
  try {
    const res = await api.delete(`/orders/${orderId}`, {
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
