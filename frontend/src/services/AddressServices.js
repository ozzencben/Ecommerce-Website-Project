import api from "../api/api";

// ================================
// USER ADDRESSES
// ================================

// Yeni adres oluştur
export const createAddress = async (addressData, token) => {
  try {
    const res = await api.post("/addresses", addressData, {
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

// Kullanıcının tüm adreslerini getir
export const getUserAddresses = async (token) => {
  try {
    const res = await api.get("/addresses", {
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

// Adresi güncelle
export const updateAddress = async (addressId, addressData, token) => {
  try {
    const res = await api.put(`/addresses/${addressId}`, addressData, {
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

// Adresi sil
export const deleteAddress = async (addressId, token) => {
  try {
    const res = await api.delete(`/addresses/${addressId}`, {
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
