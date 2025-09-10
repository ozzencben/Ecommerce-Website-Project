import api from "../api/api";

//--------------------------------------------------
// 1️⃣ REGISTER
//--------------------------------------------------
export const register = async (data) => {
  const res = await api.post("/users/register", data);
  return res.data;
};

//--------------------------------------------------
// 2️⃣ LOGIN
//--------------------------------------------------
export const login = async (data) => {
  const res = await api.post("/users/login", data);
  return res.data;
};

//--------------------------------------------------
// 3️⃣ CHECK EMAIL AVAILABILITY
//--------------------------------------------------
export const checkAvailability = async (email) => {
  try {
    const res = await api.post("/users/check-availability", { email });
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 400) {
      return { error: err.response.data.message };
    }
    return { error: "Sunucu hatası" };
  }
};

//--------------------------------------------------
// 4️⃣ CHECK USERNAME AVAILABILITY
//--------------------------------------------------
export const checkAvailabilityUsername = async (username) => {
  try {
    const res = await api.post("/users/check-availability-username", {
      username,
    });
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 400) {
      return { error: err.response.data.message };
    }
    return { error: "Sunucu hatası" };
  }
};

//--------------------------------------------------
// 5️⃣ GET ALL USERS (Admin only)
//--------------------------------------------------
export const getAllUsers = async () => {
  try {
    const res = await api.get("/users/all-users");

    // Eğer res.data bir array değilse, içinde users array varsa onu al
    if (Array.isArray(res.data)) {
      return res.data;
    } else if (Array.isArray(res.data.users)) {
      return res.data.users;
    } else {
      return []; // Hiç array yoksa boş array döndür
    }
  } catch (err) {
    console.error("getAllUsers error:", err);
    return []; // Hata durumunda da boş array döndür
  }
};

//--------------------------------------------------
// 6️⃣ GET CURRENT USER PROFILE
//--------------------------------------------------
export const getUserProfile = async () => {
  try {
    const res = await api.get("/users/profile");
    return res.data; // { success: true, data: user }
  } catch (err) {
    if (err.response) {
      return { error: err.response.data.message || "Sunucu hatası" };
    }
    return { error: "Sunucu hatası" };
  }
};

//--------------------------------------------------
// 7️⃣ GET USER BY ID (Admin or Owner)
//--------------------------------------------------
export const getUserById = async (id) => {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data; // { success: true, data: user }
  } catch (err) {
    if (err.response) {
      return { error: err.response.data.message || "Sunucu hatası" };
    }
    return { error: "Sunucu hatası" };
  }
};

//--------------------------------------------------
// 8️⃣ UPDATE USER (Admin or Owner)
//--------------------------------------------------
export const updateUser = async (id, data) => {
  try {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  } catch (err) {
    if (err.response) {
      return { error: err.response.data.message || "Sunucu hatası" };
    }
    return { error: "Sunucu hatası" };
  }
};

//--------------------------------------------------
// 9️⃣ DELETE USER (Admin only)
//--------------------------------------------------
export const deleteUser = async (id) => {
  try {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  } catch (err) {
    if (err.response) {
      return { error: err.response.data.message || "Sunucu hatası" };
    }
    return { error: "Sunucu hatası" };
  }
};

//--------------------------------------------------
// 🔟 REFRESH TOKEN
//--------------------------------------------------
export const refreshToken = async (token) => {
  try {
    const res = await api.post("/users/refresh-token", { token });
    return res.data;
  } catch (err) {
    if (err.response) {
      return { error: err.response.data.message || "Sunucu hatası" };
    }
    return { error: "Sunucu hatası" };
  }
};
