import api from "../api/api";

// ================================
// USER PAYMENT METHODS
// ================================

// Yeni ödeme yöntemi oluştur
export const createPayment = async (paymentData, token) => {
  try {
    const res = await api.post("/payments", paymentData, {
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

// Kullanıcının tüm ödeme yöntemlerini getir
export const getUserPayments = async (token) => {
  try {
    const res = await api.get("/payments", {
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

// Ödeme yöntemini güncelle
export const updatePayment = async (paymentId, paymentData, token) => {
  try {
    const res = await api.put(`/payments/${paymentId}`, paymentData, {
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

// Ödeme yöntemini sil
export const deletePayment = async (paymentId, token) => {
  try {
    const res = await api.delete(`/payments/${paymentId}`, {
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
