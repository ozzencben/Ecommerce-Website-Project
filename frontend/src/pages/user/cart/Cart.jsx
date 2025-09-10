import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spacer from "../../../components/spacer/Spacer";
import { handleError } from "../../../helpers/error/ErrorHelper";
import {
  clearCart,
  getCart,
  removeFromCart,
} from "../../../services/CartServices";
import "./CartStyles.css";

const Cart = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);

  const totalPrice = cart?.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalQuantity = cart?.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleQuantityChange = (productId, delta) => {
    if (!cart) return;

    const updatedItems = cart.items.map((item) => {
      if (item._id === productId) {
        const newQuantity = item.quantity + delta;
        return {
          ...item,
          quantity: newQuantity > 0 ? newQuantity : 1,
        };
      }
      return item;
    });

    setCart({ ...cart, items: updatedItems });
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.filter((item) => item._id !== productId),
    }));
  };

  const handleClearCart = () => {
    clearCart();
    setCart({ items: [] });
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getCart();
        setCart(res);
      } catch (err) {
        handleError(err);
      }
    };
    fetchCart();
  }, []);

  return (
    <div className="cart-wrapper">
      <div className="cart-container">
        <table className="cart-table">
          <thead>
            <tr>
              <th>Ürün Görsel</th>
              <th>Ürün Adı</th>
              <th>Gramaj</th>
              <th>Fiyat</th>
              <th>Adet</th>
              <th>Toplam Fiyat</th>
              <th>Listeden Çıkar</th>
            </tr>
          </thead>
          <tbody>
            {cart?.items?.length > 0 ? (
              cart.items.map((item) => {
                const variant = item.variantId
                  ? item.product.variants.find((v) => v._id === item.variantId)
                  : null;

                return (
                  <tr key={item._id}>
                    <td data-label="Ürün Görsel">
                      <img
                        className="product-image-table"
                        src={item.product.images[0].url}
                        alt={item.product?.title || "Ürün"}
                      />
                    </td>
                    <td data-label="Ürün Adı">
                      {item.product?.title || "Ürün adı yok"}
                    </td>
                    <td data-label="Gramaj">
                      {variant ? `${variant.size} ${variant.unit}` : "-"}
                    </td>
                    <td data-label="Fiyat">{item.price}₺</td>
                    <td data-label="Adet" className="quantity-cell">
                      <div className="quantity-wrapper">
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item._id, -1)}
                        >
                          -
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item._id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td data-label="Toplam">{item.price * item.quantity}₺</td>
                    <td>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="empty-cart">
                  Sepetiniz boş
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Spacer size={20} />

        <table className="cart-table cart-summary">
          <thead>
            <tr>
              <th>Toplam Adet</th>
              <th>Kargo Ücreti</th>
              <th>İndirim/Kupon</th>
              <th>Toplam Fiyat</th>
              <th>Sepeti Boşalt</th>
              <th>Ödeme</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Toplam Adet">{totalQuantity}</td>
              <td>-</td>
              <td>-</td>
              <td data-label="Toplam">
                {cart?.items?.length > 0 ? totalPrice + "₺" : "-"}
              </td>
              <td>
                <button onClick={handleClearCart} className="pay-btn">
                  Boşalt
                </button>
              </td>
              <td>
                <button className="pay-btn" onClick={() => navigate("/payment")} >Öde</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cart;
