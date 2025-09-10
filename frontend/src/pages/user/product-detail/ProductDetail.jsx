import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import Loading from "../../../components/loading/Loading";
import Spacer from "../../../components/spacer/Spacer";
import { addToCart } from "../../../services/CartServices";
import { getProductById } from "../../../services/ProductServices";
import AuthContext from "../../../context/auth/AuthContext";
import "./ProductDetailStyles.css";

const ProductDetail = () => {
  const { id } = useParams();
  const { accessToken } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!product) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const res = await getProductById(id);

          setProduct(res);
          setSelectedImage(res.images?.[0]?.url || null);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    } else {
      setSelectedImage(product.images?.[0]?.url || null);
    }
  }, [id, product]);

  const handleAddToCart = async (variant) => {
    if (!accessToken) {
      toast.error("Sepete ürün eklemek için giriş yapmalısınız!");
      return;
    }

    try {
      setAddingToCart(variant._id);
      await addToCart(
        {
          product: product._id,
          variantId: variant._id,
          quantity: 1,
          price: variant.price,
        },
        accessToken
      );
      toast.success("Ürün sepete eklendi!");
    } catch (err) {
      console.error(err);
      toast.error("Sepete eklenemedi!");
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <Loading />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-container">
        <h1>Product not found</h1>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <div className="main-image-container">
        {selectedImage && (
          <img
            src={selectedImage}
            alt={product.title}
            className="main-image"
            onClick={() => setOpenModal(true)}
          />
        )}
      </div>

      <div className="thumbnail-container">
        {product.images?.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={product.title}
            className="thumbnail-image"
            onClick={() => setSelectedImage(image.url)}
          />
        ))}
      </div>

      <div className="product-title-detail">
        <h1>{product.title}</h1>
      </div>

      <div className="product-description-detail">
        <p>{product.description}</p>
      </div>

      {/* modal */}
      {openModal && (
        <div className="modal">
          <img
            src={selectedImage}
            alt={product.title}
            className="modal-image"
            onClick={() => setOpenModal(false)}
          />
        </div>
      )}

      <Spacer size={20} />

      <div className="variants-container-detail">
        <table>
          <thead>
            <tr>
              <th>Gramaj</th>
              <th>Fiyat</th>
              <th>Stok</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {product.variants?.map((variant) => (
              <tr key={variant._id}>
                <td>
                  <span>{variant.size}</span>
                  <Spacer size={2} horizontal={true} />
                  <span>{variant.unit}</span>
                </td>
                <td>
                  <span>{variant.price}₺</span>
                </td>
                <td>
                  <span>{variant.stock}</span>
                </td>
                <td>
                  <button
                    className="add-to-cart-button"
                    onClick={() => handleAddToCart(variant)}
                    disabled={addingToCart === variant._id}
                  >
                    {addingToCart === variant._id
                      ? "Ekleniyor..."
                      : "Sepete Ekle"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductDetail;
