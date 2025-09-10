import { useContext, useEffect, useState } from "react";
import { HiOutlinePrinter } from "react-icons/hi2";
import { RiCloseLargeFill } from "react-icons/ri";
import AuthContext from "../../context/auth/AuthContext";
import { handleError } from "../../helpers/error/ErrorHelper";
import { getOrderById, updateOrderStatus } from "../../services/OrderServices";
import { getUserById } from "../../services/UserServices";
import Spacer from "../spacer/Spacer";
import "./OrderDetailModalStyles.css";

const OrderDetailModal = ({ onClose, selectedOrder, isAdmin = false }) => {
  const { accessToken } = useContext(AuthContext);

  const [user, setUser] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");

  // Kullanıcı bilgilerini çek
  useEffect(() => {
    const fetchUser = async () => {
      if (!orderDetail?.user) return;
      try {
        const res = await getUserById(orderDetail.user._id);
        setUser(res.data);
      } catch (err) {
        handleError(err);
      }
    };
    fetchUser();
  }, [orderDetail]);

  // Sipariş detaylarını çek
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const res = await getOrderById(selectedOrder, accessToken, true);
        setOrderDetail(res);
        setOrderStatus(res.status || "pending");
      } catch (err) {
        handleError(err);
      }
    };
    if (selectedOrder && accessToken) {
      fetchOrderDetail();
    }
  }, [selectedOrder, accessToken]);

  const handleUpdateStatus = async () => {
    try {
      await updateOrderStatus(orderDetail._id, orderStatus, accessToken);
      alert("Sipariş durumu güncellendi ✅");
    } catch (err) {
      handleError(err);
    }
  };

  if (!orderDetail) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="order-detail-modal"
        onClick={(e) => e.stopPropagation()} // İçeriğe tıklanınca kapanmasın
      >
        <RiCloseLargeFill
          className="close-icon"
          onClick={onClose}
          size={30}
          color="white"
        />

        <div className="order-detail-modal-container">
          {/* Kullanıcı Bilgileri */}
          <div className="order-holder">
            <div className="holder-name">
              <span>
                {user?.firstname
                  ? `${user.firstname
                      .charAt(0)
                      .toUpperCase()}${user.firstname.slice(1)}`
                  : ""}
              </span>
              <Spacer horizontal={true} size={5} />
              <span>
                {user?.lastname
                  ? `${user.lastname
                      .charAt(0)
                      .toUpperCase()}${user.lastname.slice(1)}`
                  : ""}
              </span>
            </div>
            <p className="holder-email">{user?.email}</p>
          </div>

          <Spacer />

          {/* Ürünler */}
          <div className="order-items">
            <table>
              <thead>
                <tr>
                  <th>Ürün Resmi</th>
                  <th>Ürün Adı</th>
                  <th>Ürün Adedi</th>
                  <th>Ürün Fiyatı</th>
                </tr>
              </thead>
              <tbody>
                {orderDetail?.items?.length > 0 &&
                  orderDetail.items.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.title}
                          className="order-item-image"
                        />
                      </td>
                      <td>{item.product.title}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price} ₺</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <Spacer />

          {/* Adres Bilgileri */}
          <div className="address-info">
            <p className="fullAddress">{orderDetail?.address.fullAddress}</p>
            <HiOutlinePrinter size={20} color="white" className="print-icon" />
          </div>

          <Spacer />

          <div className="order-status-container">
            <select
              className="order-status-select"
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
            >
              <option value="pending">Beklemede</option>
              <option value="shipped">Kargolandı</option>
              <option value="completed">Tamamlandı</option>
              <option value="canceled">İptal Edildi</option>
            </select>

            <button className="order-status-btn" onClick={handleUpdateStatus}>
              Güncelle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
