import { useEffect, useState } from "react";
import api from "../../../api/api"; // kategorileri çekmek için
import Loading from "../../../components/loading/Loading";
import UpdateModal from "../../../components/update-product/UpdateModal";
import { handleError } from "../../../helpers/error/ErrorHelper";
import { getAllProducts } from "../../../services/ProductServices";
import "./ProductSStyles.css";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Tüm ürünleri çek
  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const res = await getAllProducts();
      console.log("API response raw:", res);

      const productsArray = Array.isArray(res)
        ? res
        : Array.isArray(res.products)
        ? res.products
        : [];
      if (!Array.isArray(res)) console.warn("Products array değil!", res);

      setProducts(productsArray);
      setFilteredProducts(productsArray);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Kategorileri çek
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    fetchAllProducts();
    fetchCategories();
  }, []);

  const handleOpenUpdateModal = (productId) => {
    setSelectedProductId(productId);
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    setSelectedProductId(null);
  };

  // Arama ve filtreleme
  useEffect(() => {
    if (!Array.isArray(products)) return;

    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category?._id === selectedCategory);
    }

    console.log("Filtered products:", filtered);
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  if (loading) return <Loading />;

  return (
    <div className="product-page-container">
      <div className="filter-container">
        <input
          type="text"
          placeholder="Ürün ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          className="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Ürün Resmi</th>
            <th>Ürün Adı</th>
            <th id="category">Kategori</th>
            <th>Düzenle</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <tr key={product._id}>
                <td>
                  <img
                    className="product-image"
                    src={product.images?.[0]?.url || ""}
                    alt={product.title || "Ürün resmi yok"}
                  />
                </td>
                <td>{product.title || "Başlık yok"}</td>
                <td id="category">
                  {product.category?.name || "Kategori yok"}
                </td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleOpenUpdateModal(product._id)}
                  >
                    Düzenle
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>Ürün bulunamadı.</td>
            </tr>
          )}
        </tbody>
      </table>

      {openUpdateModal && (
        <UpdateModal
          onClose={handleCloseUpdateModal}
          productId={selectedProductId}
          onUpdated={fetchAllProducts}
        />
      )}
    </div>
  );
};

export default Product;
