import { useState } from "react";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../services/CartServices";
import "./ProductCardStyles.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Her variant için ayrı state
  const [showIcons, setShowIcons] = useState({});

  // variantId parametresini alacak şekilde düzenledim
  const handleAddToCart = async (variantId) => {
    try {
      const selectedVariant = product.variants.find((v) => v._id === variantId);

      const cartItem = {
        product: product._id,
        variantId: variantId,
        quantity: 1,
        price: selectedVariant.price,
      };

      await addToCart(cartItem, localStorage.getItem("token")); // token varsa ekle

      // animasyon tetikle
      setShowIcons((prev) => ({ ...prev, [variantId]: true }));
      setTimeout(() => {
        setShowIcons((prev) => ({ ...prev, [variantId]: false }));
      }, 800);

    } catch (err) {
      if (err.response?.data) {
        console.error("Hata detayları:", err.response.data);
      } else {
        console.error("Hata detayları:", err);
      }
    }
  };

  return (
    <div className="product-card">
      {product.images?.length > 0 ? (
        <img
          src={product.images[0].url}
          alt={product.title}
          className="image"
        />
      ) : null}

      <div className="card-title">
        <h4>{product.title}</h4>
      </div>

      <div className="price-review-box">
        {product.variants?.length > 0
          ? product.variants.map((variant) => {
              const isShowing = showIcons[variant._id] || false;

              return (
                <div className="price-review-container" key={variant._id}>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <span>
                            {variant.size} {variant.unit}
                          </span>
                        </td>
                        <td>
                          <span>{variant.price}₺</span>
                        </td>
                        <td>
                          <span>{variant.stock}</span>
                        </td>
                        <td>
                          <button
                            className="cart-btn"
                            onClick={() => handleAddToCart(variant._id)}
                          >
                            {isShowing ? (
                              <MdOutlineAddShoppingCart
                                className="cart-icon-animated"
                                size={20}
                              />
                            ) : (
                              "Sepete Ekle"
                            )}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })
          : null}
      </div>

      <div className="go-to-detail">
        <button onClick={() => navigate(`/product-detail/${product._id}`)}>
          Detaylara Git
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
