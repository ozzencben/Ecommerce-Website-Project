import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/auth/AuthContext";

export default function RoleRoute({
  children,
  roles = [],
  redirect = "/",
  publicOnly = false,
}) {
  const { user, isAuthenticated } = useContext(AuthContext);

  // Public-only route (login olmayan kullanıcılar için)
  if (publicOnly) {
    return !isAuthenticated ? children : <Navigate to={redirect} replace />;
  }

  // Private route (sadece login olanlar)
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Rol kontrolü varsa
  if (roles.length > 0 && (!user?.role || !roles.includes(user.role))) {
    return <Navigate to={redirect} replace />;
  }

  return children;
}
