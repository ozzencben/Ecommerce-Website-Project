import { useContext, useState } from "react";
import { HiOutlineQueueList } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth/AuthContext";
import "./NavbarStyles.css";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useContext(AuthContext);

  const [leftMenuOpen, setLeftMenuOpen] = useState(false);
  const closeMenu = () => setLeftMenuOpen(false);

  const hideNavbarPants = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarPants.includes(window.location.pathname);

  const handleNavigate = (path) => {
    navigate(path);
    closeMenu();
  };

  return (
    <div
      className="navbar-container"
      style={{ display: shouldHideNavbar ? "none" : "flex" }}
    >
      <div
        className={`navbar-overlay ${leftMenuOpen ? "open" : ""}`}
        onClick={closeMenu}
      ></div>
      <div className="left-side" onClick={() => setLeftMenuOpen(!leftMenuOpen)}>
        <HiOutlineQueueList size={30} color="white" />
      </div>
      <div className={`left-menu ${leftMenuOpen ? "open" : ""}`}>
        <div className="left-menu-content">
          {isAuthenticated && user.role === "admin" && (
            <ul>
              <li onClick={() => handleNavigate("/admin")}>Admin Anasayfa</li>
              <li onClick={() => handleNavigate("/admin/add-product")}>
                Ürün Ekle
              </li>
              <li onClick={() => handleNavigate("/admin/products")}>Ürünler</li>
              <li onClick={() => handleNavigate("/admin/users")}>
                Kullanıcılar
              </li>
              <li onClick={() => handleNavigate("/admin/orders")}>Siparişler</li>
            </ul>
          )}
          {isAuthenticated && user.role === "user" && (
            <ul>
              <li onClick={() => handleNavigate("/")}>Anasayfa</li>
            </ul>
          )}
          <div className="line"></div>
          <ul>
            <li onClick={logout}>Oturumu Kapat</li>
          </ul>
        </div>
      </div>
      {isAuthenticated && user.role === "user" && (
        <div className="right-side">
          <div className="add-to-cart-icon" onClick={() => navigate("/cart")}>
            <img src="public/add-to-cart.png" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
