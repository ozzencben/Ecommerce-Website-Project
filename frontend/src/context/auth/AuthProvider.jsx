import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { handleError } from "../../helpers/error/ErrorHelper";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [isAuthenticated, setIsAuthenticated] = useState(!!accessToken);

  // Logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setAccessToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    delete api.defaults.headers.common["Authorization"];

    navigate("/login");
  };

  // Axios interceptor
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response && error.response.status === 401) {
          handleError(error);
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          const res = await api.get("/users/profile");
          setUser(res.data.data); // burada data objesini aldık
          setIsAuthenticated(true);
          setAccessToken(token);
        } catch (err) {
          handleError(err);
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  // Login
  const login = async (identifier, password) => {
    setLoading(true);
    try {
      const res = await api.post("/users/login", { identifier, password });

      const userData = res.data; // artık direkt user objesi
      setUser(userData);
      setAccessToken(userData.accessToken);
      setIsAuthenticated(true);

      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${userData.accessToken}`;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", userData.accessToken);
      localStorage.setItem("refreshToken", userData.refreshToken);

      return { success: true, data: userData };
    } catch (err) {
      handleError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, accessToken, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
