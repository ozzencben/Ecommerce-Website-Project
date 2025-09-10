import { useContext, useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import Loading from "../../../components/loading/Loading";
import AuthContext from "../../../context/auth/AuthContext";
import { handleError } from "../../../helpers/error/ErrorHelper";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "../../../services/CategoryServices";
import { getAllOrders } from "../../../services/OrderServices";
import "./MainPageStyles.css";

const MainPage = () => {
  const { accessToken } = useContext(AuthContext);
  const [token, setToken] = useState(accessToken);

  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [categoryInputValue, setCategoryInputValue] = useState("");
  const [showCategorySection, setShowCategorySection] = useState(false);

  const [showOrdersSection, setShowOrdersSection] = useState(false);
  const [orders, setOrders] = useState([]);

  const handleCreateCategory = async (name) => {
    if (!name || !name.trim()) return; // name string mi kontrol et
    try {
      setLoading(true);
      const newCategory = await createCategory({ name });
      setCategories((prev) => [...prev, newCategory]); // yeni kategoriyi ekle
      setCategoryInputValue(""); // inputu temizle
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      setLoading(true);
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      // Hata varsa kullanıcıya alert ile göster
      alert(err.message || "Kategori silinirken bir hata oluştu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCategorySection = () => {
    setShowCategorySection((prev) => !prev);
  };

  const handleToggleOrdersSection = () => {
    setShowOrdersSection((prev) => !prev);
  };

  useEffect(() => {
    const fetchAllOrders = async (token) => {
      try {
        setLoading(true);
        const res = await getAllOrders(token);
        console.log("orders data :", res);
        setOrders(res);
      } catch (err) {
        handleError(err);
      }
    };
    fetchAllOrders();
  }, [token]);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        setLoading(true);
        const res = await getAllCategories();
        setCategories(res);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, []);

  if (loading) {
    return (
      <div className="main-page-container">
        <Loading />
      </div>
    );
  }

  return (
    <div className="main-page-container">
      <div className="main-parent">
        <table className="table1">
          <thead>
            <tr>
              <th>
                <span>Düzenle</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td onClick={handleToggleCategorySection}>
                <span>Kategori</span> <CiEdit />
              </td>
            </tr>
            <tr>
              <td>
                <span>Stok</span> <CiEdit />
              </td>
            </tr>
            <tr>
              <td onClick={handleToggleOrdersSection} >
                <span>Siparişler</span> <CiEdit />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="table2">
          {showCategorySection && (
            <table className="category-table">
              <thead>
                <tr>
                  <th>
                    <span>Kategoriler</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <tr key={category._id}>
                      <td className="category-row">
                        <span>{category.name}</span>
                        <button
                          className="delete-btn-category"
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>Herhangi bir kategori yok</td>
                  </tr>
                )}
                <tr>
                  <td className="add-category-row">
                    <input
                      className="category-input"
                      placeholder="Kategori Ekle"
                      value={categoryInputValue}
                      onChange={(e) => setCategoryInputValue(e.target.value)}
                    />
                    <button
                      className="category-button"
                      onClick={() => handleCreateCategory(categoryInputValue)}
                    >
                      Ekle
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          {showOrdersSection && (
            <table className="order-table" >
              <thead>
                <tr>
                  <th>
                    <span>Siparişler</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td className="order-row">
                        <span>{order.user.email}</span>
                        <span>{order.status}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>Herhangi bir sipariş yok</td>
                  </tr>
                )}
              </tbody>
            </table>
          ) } 
        </div>
      </div>
    </div>
  );
};

export default MainPage;
