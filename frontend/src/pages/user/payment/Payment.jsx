import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Spacer from "../../../components/spacer/Spacer";
import AuthContext from "../../../context/auth/AuthContext";
import { handleError } from "../../../helpers/error/ErrorHelper";
import {
  createAddress,
  getUserAddresses,
} from "../../../services/AddressServices";
import { getCart } from "../../../services/CartServices";
import { createOrder } from "../../../services/OrderServices";
import {
  createPayment,
  getUserPayments,
} from "../../../services/PaymentServices";
import { getUserById } from "../../../services/UserServices";
import "./PaymentStyles.css";

const Payment = () => {
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  const [cart, setCart] = useState(null);
  const [user, setUser] = useState(null);
  const [userAdresses, setUserAdresses] = useState(null);
  const [paymentMethods, setpaymentMethods] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [addressData, setAddressData] = useState({
    recipientName: "",
    phone: "",
    province: "",
    district: "",
    postalCode: "",
    street: "",
    buildingNumber: "",
    apartmentNumber: "",
    neighborhood: "",
  });

  const [paymentData, setPaymentData] = useState({
    type: "creditCard",
    paymentName: "",
    cardHolder: "",
    cardNumber: "",
    last4Digits: "",
    expiryMonth: "",
    expiryYear: "",
    CCV: "",
    isDefault: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePayment = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePayment = async () => {
    const isEmpty = Object.values(paymentData).some((val) => val === "");
    if (isEmpty) return toast.error("Lütfen bos alanları doldurun");

    try {
      const res = await createPayment(paymentData, accessToken);
      setpaymentMethods((prev) => [...prev, res]);
      setPaymentData({
        type: "creditCard",
        paymentName: "",
        cardHolder: "",
        cardNumber: "",
        last4Digits: "",
        expiryMonth: "",
        expiryYear: "",
        CCV: "",
        isDefault: false,
      });
    } catch (err) {
      handleError(err);
    }
  };

  const handleCreateAddress = async () => {
    try {
      const res = await createAddress(addressData, accessToken); // ✅ düzeltildi
      setUserAdresses((prev) => [...prev, res]);
      setShowAddressForm(false);
      setSelectedAddress(res._id);
      setAddressData({
        recipientName: "",
        phone: "",
        province: "",
        district: "",
        postalCode: "",
        street: "",
        buildingNumber: "",
        apartmentNumber: "",
        neighborhood: "",
      });
    } catch (err) {
      handleError(err);
    }
  };

  const fakePayment = async () => {
    if (!selectedAddress) return toast.error("Lütfen bir adres seçin");
    if (!selectedPaymentMethod)
      return toast.error("Lütfen bir ödeme yöntemi seçin");
    if (!cart || cart.items.length === 0) return toast.error("Sepetiniz boş");

    try {
      const orderPayload = {
        items: cart.items.map((item) => ({
          product: item.product._id,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: cart.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
        address: selectedAddress, // backend ile uyumlu
        payment: selectedPaymentMethod, // backend ile uyumlu
      };

      console.log("Order payload:", orderPayload);

      const res = await createOrder(orderPayload, accessToken);
      console.log("Order created:", res);
      navigate(0);
      toast.success("Ödeme başarılı! ✅ Siparişiniz oluşturuldu");
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await getUserPayments();
        setpaymentMethods(res);
      } catch (err) {
        handleError(err);
      }
    };
    fetchPayments();
  }, []);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await getUserAddresses(user.id, accessToken);
        setUserAdresses(res);
      } catch (err) {
        handleError(err);
      }
    };
    if (user) fetchAddresses();
  }, [user, accessToken]);

  const totalPrice = cart?.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalQuantity = cart?.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // 1️⃣ Cart yükleme
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

  // 2️⃣ Cart yüklendikten sonra user'ı çek
  useEffect(() => {
    const fetchUser = async () => {
      if (!cart?.user) return;
      try {
        const res = await getUserById(cart.user);
        setUser(res.data);
      } catch (err) {
        handleError(err);
      }
    };
    fetchUser();
  }, [cart]);

  return (
    <div className="payment-container">
      <div className="cart-summary-payment-container">
        <table className="cart-summary-payment">
          <thead>
            <tr>
              <th>Toplam Adet</th>
              <th>Kargo Ücreti</th>
              <th>İndirim/Kupon</th>
              <th>Toplam Fiyat</th>
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
            </tr>
          </tbody>
        </table>

        <Spacer size={20} />

        <div className="select-info">
          {/* --- ADDRESS --- */}
          <div className="select-address">
            <h3 className="section-title">Teslimat Adresi</h3>
            <div className="registered-address">
              {userAdresses?.length > 0 ? (
                userAdresses.map((add) => (
                  <label
                    key={add._id}
                    className={`registered-address-item ${
                      selectedAddress === add._id ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={add._id}
                      checked={selectedAddress === add._id}
                      onChange={() => setSelectedAddress(add._id)}
                    />
                    <span>{add.fullAddress}</span>
                  </label>
                ))
              ) : (
                <span>Adres yok</span>
              )}
            </div>

            <button
              className="new-address-button"
              onClick={() => setShowAddressForm(!showAddressForm)}
            >
              {showAddressForm ? "Adres Formunu Kapat" : "Yeni Adres Ekle"}
            </button>

            {showAddressForm && (
              <div className="form-address-payment">
                <input
                  placeholder="Alıcı Adı"
                  name="recipientName"
                  value={addressData.recipientName}
                  onChange={handleChange}
                  className="form-address-payment-input"
                />
                <Spacer />
                <input
                  placeholder="Telefon Numarası"
                  name="phone"
                  value={addressData.phone}
                  onChange={handleChange}
                  className="form-address-payment-input"
                />
                <Spacer />
                <input
                  placeholder="Şehir"
                  name="province"
                  value={addressData.province}
                  onChange={handleChange}
                  className="form-address-payment-input"
                />
                <Spacer />
                <input
                  placeholder="İlçe"
                  name="district"
                  value={addressData.district}
                  onChange={handleChange}
                  className="form-address-payment-input"
                />
                <Spacer />
                <input
                  placeholder="Posta Kodu"
                  name="postalCode"
                  value={addressData.postalCode}
                  onChange={handleChange}
                  type="number"
                  className="form-address-payment-input"
                />
                <Spacer />
                <input
                  placeholder="Mahalle"
                  name="neighborhood"
                  value={addressData.neighborhood}
                  onChange={handleChange}
                  className="form-address-payment-input"
                />
                <Spacer />
                <input
                  placeholder="Sokak"
                  name="street"
                  value={addressData.street}
                  onChange={handleChange}
                  className="form-address-payment-input"
                />
                <Spacer />
                <div className="input-box">
                  <input
                    placeholder="Bina No"
                    name="buildingNumber"
                    value={addressData.buildingNumber}
                    onChange={handleChange}
                    type="number"
                    className="form-address-payment-input-number"
                  />
                  <input
                    placeholder="Daire No"
                    name="apartmentNumber"
                    value={addressData.apartmentNumber}
                    onChange={handleChange}
                    type="number"
                    className="form-address-payment-input-number"
                  />
                </div>

                <Spacer size={20} />
                <button
                  className="address-save-button"
                  onClick={handleCreateAddress}
                >
                  Adresi Kaydet
                </button>
              </div>
            )}
          </div>

          {/* --- PAYMENT --- */}
          <div className="select-payment">
            <h3 className="form-title">Ödeme Yöntemi</h3>

            <Spacer size={20} />

            <div className="payment-methods">
              <label>
                <input
                  type="radio"
                  name="type"
                  value="creditCard"
                  checked={paymentData.type === "creditCard"}
                  onChange={handleChangePayment}
                />
                Kredi Kartı
              </label>
              <label>
                <input
                  type="radio"
                  name="type"
                  value="eft"
                  checked={paymentData.type === "eft"}
                  onChange={handleChangePayment}
                />
                EFT/Havale
              </label>
              <label>
                <input
                  type="radio"
                  name="type"
                  value="paypal"
                  checked={paymentData.type === "paypal"}
                  onChange={handleChangePayment}
                />
                PayPal
              </label>
            </div>

            {paymentData.type === "creditCard" && (
              <div className="payment-form">
                <input
                  placeholder="Ödeme Yöntem İsmi"
                  name="paymentName"
                  value={paymentData.paymentName}
                  onChange={handleChangePayment}
                  className="form-payment-input"
                />
                <input
                  type="text"
                  name="cardHolder"
                  placeholder="Kart Sahibi Adı"
                  value={paymentData.cardHolder}
                  onChange={handleChangePayment}
                  className="form-payment-input"
                />
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Kart Numarası"
                  value={paymentData.cardNumber}
                  onChange={handleChangePayment}
                  className="form-payment-input"
                />
                <div className="input-box">
                  <input
                    type="text"
                    name="expiryMonth"
                    placeholder="AA"
                    value={paymentData.expiryMonth}
                    onChange={handleChangePayment}
                    className="form-payment-input-number"
                  />
                  <input
                    type="text"
                    name="expiryYear"
                    placeholder="YY"
                    value={paymentData.expiryYear}
                    onChange={handleChangePayment}
                    className="form-payment-input-number"
                  />
                </div>
                <div className="input-box">
                  <input
                    type="text"
                    name="last4Digits"
                    placeholder="Son 4 Hane"
                    value={paymentData.last4Digits}
                    onChange={handleChangePayment}
                    className="form-payment-input-number"
                  />
                  <input
                    type="text"
                    name="CCV"
                    placeholder="CCV"
                    value={paymentData.CCV}
                    onChange={handleChangePayment}
                    className="form-payment-input-number"
                  />
                </div>
                <Spacer />
                <button
                  className="address-save-button"
                  onClick={handleCreatePayment}
                >
                  Ödeme Yöntemi Kaydet
                </button>
                <label className="default-checkbox">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={paymentData.isDefault}
                    onChange={(e) =>
                      setPaymentData((prev) => ({
                        ...prev,
                        isDefault: e.target.checked,
                      }))
                    }
                  />
                  Varsayılan olarak kaydet
                </label>

                <Spacer />

                <div className="or-paragraph">
                  <span title="Bilgi">&#9432;</span>
                  <span>
                    {"  "}Eğer kayıtlı bir ödeme yönteminiz yoksa veya yeni bir
                    ödeme yöntemi girmek isterseniz aşağıdaki formu
                    düzenleyebilirsiniz.
                  </span>
                </div>
              </div>
            )}

            <Spacer size={20} />

            <div className="registered-payment-methods">
              {paymentMethods?.length > 0 ? (
                paymentMethods.map((payment) => (
                  <div
                    key={payment._id}
                    className={`registered-payment-methods-item ${
                      selectedPaymentMethod === payment._id ? "active" : ""
                    }`}
                    onClick={() => setSelectedPaymentMethod(payment._id)} // ✅ tüm satır tıklanabilir
                  >
                    <div className="registered-payment-methods-item-radio">
                      <input
                        type="radio"
                        name="payment"
                        value={payment._id}
                        checked={selectedPaymentMethod === payment._id}
                        readOnly // ✅ artık sadece UI için, değişim satır üzerinden
                      />
                      <span>{payment.paymentName}</span>
                    </div>
                    <span>**** **** ****{payment.last4Digits}</span>
                  </div>
                ))
              ) : (
                <p className="no-registered-payment-methods">
                  Kayıtlı bir ödeme yönteminiz yok.
                </p>
              )}

              <Spacer />

              <button className="address-save-button" onClick={fakePayment}>
                Ödeme Yap
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
