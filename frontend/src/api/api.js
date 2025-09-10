import axios from "axios";

const BASE_URL = "http://192.168.1.108:5000";

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});

// Request interceptor: Access token ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// Response interceptor: 401 hatalarını yakala
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // 401 hatası geldiğinde AuthProvider içindeki logout tetiklenmeli
    // Bu yüzden burada sadece hatayı reject ediyoruz
    return Promise.reject(error);
  }
);

export default api;
