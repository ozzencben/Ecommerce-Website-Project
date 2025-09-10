import { useEffect, useState } from "react";
import { CiCalendarDate, CiGrid32 } from "react-icons/ci";
import { TfiFilter } from "react-icons/tfi";
import Loading from "../../../components/loading/Loading";
import OrderDetailModal from "../../../components/order-detail/OrderDetailModal";
import Spacer from "../../../components/spacer/Spacer";
import { handleError } from "../../../helpers/error/ErrorHelper";
import { getAllOrders } from "../../../services/OrderServices";
import "./OrdersAdminStyles.css";

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredStatus, setFilteredStatus] = useState("all");
  const [filteredDate, setFilteredDate] = useState("all");
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpenOverlayModal = (orderId) => {
    setOverlayOpen(true);
    setSelectedOrder(orderId);
  };

  const handleCloseOverlayModal = () => {
    setOverlayOpen(false);
  };

  const handleFilterStatus = (status) => {
    setFilteredStatus(status);
  };

  const handleFilterDate = (dateFilter) => {
    setFilteredDate(dateFilter);
  };

  const filteredOrders = orders.filter((order) => {
    // Status filtre
    const statusMatch =
      filteredStatus === "all" || order.status === filteredStatus;

    // Date filtre
    let dateMatch = true;
    const orderDate = new Date(order.createdAt);
    const today = new Date();

    if (filteredDate === "today") {
      dateMatch = orderDate.toDateString() === today.toDateString();
    } else if (filteredDate === "yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      dateMatch = orderDate.toDateString() === yesterday.toDateString();
    } else if (filteredDate === "thisWeek") {
      const firstDayOfWeek = new Date(today);
      firstDayOfWeek.setDate(today.getDate() - today.getDay());
      dateMatch = orderDate >= firstDayOfWeek && orderDate <= today;
    } else if (filteredDate === "thisMonth") {
      dateMatch =
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear();
    } else if (filteredDate === "lastMonth") {
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      dateMatch = orderDate >= lastMonth && orderDate <= lastMonthEnd;
    }

    return statusMatch && dateMatch;
  });

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setLoading(true);
        const res = await getAllOrders();
        setOrders(res);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllOrders();
  }, []);

  if (loading) {
    return (
      <div className="orders-admin-container">
        <Loading />
      </div>
    );
  }

  return (
    <div className="orders-admin-container">
      <h1 className="orders-admin-title">Siparişler</h1>

      {overlayOpen && (
        <OrderDetailModal
          onClose={handleCloseOverlayModal}
          selectedOrder={selectedOrder}
        />
      )}

      <div className="orders-admin-summary-container">
        <div className="orders-amount-box">
          <h2 className="orders-amount-title">Toplam Siparişler</h2>
          <h3 className="orders-amount">{orders.length}</h3>
        </div>
        <div className="pending-orders">
          <h2 className="pending-orders-title">Bekleyen Siparişler</h2>
          <h3 className="pending-orders-amount">
            {orders.filter((order) => order.status === "pending").length}
          </h3>
        </div>
        <div className="snipped-orders">
          <h2 className="snipped-orders-title">Gönderilen Siparişler</h2>
          <h3 className="snipped-orders-amount">
            {orders.filter((order) => order.status === "snipped").length}
          </h3>
        </div>
        <div className="cancenled-orders">
          <h2 className="cancenled-orders-title">Iptal Edilen Siparişler</h2>
          <h3 className="cancenled-orders-amount">
            {orders.filter((order) => order.status === "cancelled").length}
          </h3>
        </div>
      </div>

      <Spacer size={20} />

      <div className="orders-grid-container">
        <div className="filter-container-orders">
          <div className="status-filter-box">
            <table>
              <thead>
                <tr>
                  <th>
                    <span>Sipariş Durumu</span>
                    <TfiFilter />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td onClick={() => handleFilterStatus("all")}>
                    <span>Tüm Siparişler</span>
                    <CiGrid32 />
                  </td>
                  <td onClick={() => handleFilterStatus("pending")}>
                    <span>Beklemede</span>
                    <CiGrid32 />
                  </td>
                </tr>
                <tr>
                  <td onClick={() => handleFilterStatus("processing")}>
                    <span>Hazırlanıyor</span>
                    <CiGrid32 />
                  </td>
                </tr>
                <tr>
                  <td onClick={() => handleFilterStatus("snipped")}>
                    <span>Kargoda</span>
                    <CiGrid32 />
                  </td>
                </tr>
                <tr>
                  <td onClick={() => handleFilterStatus("completed")}>
                    <span>Sipariş Tamamlandı</span>
                    <CiGrid32 />
                  </td>
                </tr>
                <tr>
                  <td onClick={() => handleFilterStatus("cancelled")}>
                    <span>Sipariş iptal edildi</span>
                    <CiGrid32 />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <Spacer size={20} />

          <div className="date-filter-box">
            <table>
              <thead>
                <tr>
                  <th>
                    <span>Sipariş Tarihi</span>
                    <TfiFilter />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td onClick={() => handleFilterDate("all")}>
                    <span>Tümü</span>
                    <CiCalendarDate />
                  </td>
                  <td onClick={() => handleFilterDate("today")}>
                    <span>Bugün</span>
                    <CiCalendarDate />
                  </td>
                </tr>
                <tr>
                  <td onClick={() => handleFilterDate("yesterday")}>
                    <span>Dün</span>
                    <CiCalendarDate />
                  </td>
                </tr>
                <tr>
                  <td onClick={() => handleFilterDate("thisWeek")}>
                    <span>Bu hafta</span>
                    <CiCalendarDate />
                  </td>
                </tr>
                <tr>
                  <td onClick={() => handleFilterDate("thisMonth")}>
                    <span>Bu ay</span>
                    <CiCalendarDate />
                  </td>
                </tr>
                <tr>
                  <td onClick={() => handleFilterDate("lastMonth")}>
                    <span>Geçen ay</span>
                    <CiCalendarDate />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="orders-table-container">
          <table>
            <thead>
              <tr>
                <th id="order-date">Tarih</th>
                <th>Sipariş Durumu</th>
                <th>Toplam Fiyat</th>
                <th>Detaylar</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td id="order-date">
                    {new Date(order.createdAt).toLocaleString("tr-TR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>
                    {order.status === "pending"
                      ? "Beklemede"
                      : order.status === "processing"
                      ? "Hazırlanıyor"
                      : order.status === "snipped"
                      ? "Gönderildi"
                      : order.status === "cancelled"
                      ? "İptal edildi"
                      : "Tamamlandı"}
                  </td>
                  <td>{order.totalAmount} ₺</td>
                  <td>
                    <button
                      onClick={() => handleOpenOverlayModal(order._id)}
                      className="order-detail-button"
                    >
                      Detaylar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersAdmin;
