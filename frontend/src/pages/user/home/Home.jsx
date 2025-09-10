import { useCallback, useEffect, useRef, useState } from "react";
import { TfiFilter } from "react-icons/tfi";
import Loading from "../../../components/loading/Loading";
import ProductCard from "../../../components/product-card/ProductCard";
import { handleError } from "../../../helpers/error/ErrorHelper";
import { getAllCategories } from "../../../services/CategoryServices";
import { getAllProducts } from "../../../services/ProductServices";
import "./HomeStyles.css";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // ----------------- Kategorileri getir -----------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res);
      } catch (err) {
        handleError(err);
      }
    };
    fetchCategories();
  }, []);

  // ----------------- Ürünleri getir -----------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getAllProducts({ page, limit: 20 });
        if (page === 1) {
          setProducts(res.products);
        } else {
          setProducts((prev) => [...prev, ...res.products]);
        }
        setHasMore(page < res.totalPages);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page]);

  // ----------------- Infinite scroll -----------------
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  if (loading) {
    return (
      <div className="home-container">
        <Loading />
      </div>
    );
  }

  // ----------------- Filtrelenmiş ürünler -----------------
  const filteredProducts = products.filter((p) => {
    const matchName = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory === "Tümü" || p.category.name === selectedCategory;
    return matchName && matchCategory;
  });

  return (
    <div className="home-container">
      <div className="container-wrapper">
        <div className="search-container-home">
          <input
            type="text"
            placeholder="Ara"
            className="search-input-home"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="parent">
          <div className="div1">
            <table className="category-table-home">
              <thead>
                <tr>
                  <th className="category-header">
                    <span>Filtrele</span>
                    <TfiFilter />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr onClick={() => setSelectedCategory("Tümü")}>
                  <td
                    className={`category-cell ${
                      selectedCategory === "Tümü" ? "active" : ""
                    }`}
                  >
                    <span>Tümü</span>
                  </td>
                </tr>
                {categories.map((cat) => (
                  <tr
                    key={cat._id}
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    <td
                      className={`category-cell ${
                        selectedCategory === cat.name ? "active" : ""
                      }`}
                    >
                      <span>{cat.name}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="div2">
            {filteredProducts.map((product, index) => {
              if (index === filteredProducts.length - 1) {
                return (
                  <div ref={lastElementRef} key={product._id}>
                    <ProductCard product={product} />
                  </div>
                );
              }
              return <ProductCard key={product._id} product={product} />;
            })}
            {!hasMore && filteredProducts.length === 0 && (
              <div>Ürün bulunamadı</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
