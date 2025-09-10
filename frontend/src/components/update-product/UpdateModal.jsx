import { useContext, useEffect, useState } from "react";
import { RiCloseLargeLine } from "react-icons/ri";
import api from "../../api/api";
import AuthContext from "../../context/auth/AuthContext";
import { handleError } from "../../helpers/error/ErrorHelper";
import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "../../services/ProductServices";
import Loading from "../loading/Loading";
import Spacer from "../spacer/Spacer";
import "./UpdateModalStyles.css";

const UpdateModal = ({ onClose, productId, onUpdated }) => {
  const { accessToken } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState("");
  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);

  // Kategorileri çek
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        handleError(err);
      }
    };
    fetchCategories();
  }, []);

  // Ürünü çek
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductById(productId);

        setProductName(res.title);
        setCategory(res.category._id);
        setDescription(res.description);
        setVariants(res.variants);

        // Görselleri state'e ekle ve toRemove: false yap
        const imgs = (res.images || []).map((img) => ({
          ...img,
          toRemove: false,
        }));
        setImages(imgs);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleVariantChange = (id, field, value) => {
    setVariants((prev) =>
      prev.map((v) => (v._id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      _id: Date.now() + Math.random(),
      toRemove: false,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (id) => {
    setImages((prev) =>
      prev.map((img) => (img._id === id ? { ...img, toRemove: true } : img))
    );
  };

  const handleUpdateProduct = async () => {
    try {
      setLoading(true);

      // Silinecek eski görseller
      const removeImages = images
        .filter((img) => !img.file && img.toRemove)
        .map((img) => img.public_id);

      // Yeni yüklenen görseller
      const newImages = images.filter((img) => img.file).map((img) => img.file);

      await updateProduct({
        id: productId,
        title: productName,
        description,
        category,
        variants,
        newImages,
        removeImages,
        token: accessToken,
      });

      onUpdated?.();
      onClose();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      setLoading(true);
      await deleteProduct(productId, accessToken);
      onUpdated?.();
      onClose();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="modal-container">
        <Loading />
      </div>
    );

  return (
    <div className="modal-container" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <RiCloseLargeLine
          size={30}
          color="white"
          className="close-button"
          onClick={onClose}
        />
        <div className="modal-content">
          <div className="modal-form">
            <input
              className="variant-input-row"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <Spacer />

            <select
              className="variant-input-row"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Kategori Seçin</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Spacer />

            <textarea
              id="description"
              className="variant-input-row"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
            <Spacer />

            <div className="images-container">
              {images
                .filter((img) => !img.toRemove)
                .map((img) => (
                  <div className="image-item" key={img._id}>
                    <img
                      src={img.preview || img.url}
                      alt="product"
                      className="image-preview"
                    />
                    <button
                      type="button"
                      className="image-remove-btn"
                      onClick={() => handleRemoveImage(img._id)}
                    >
                      X
                    </button>
                  </div>
                ))}
            </div>
            <Spacer />
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="file-input"
            />

            <div className="variants-container">
              {variants.map((variant) => (
                <div className="variant-item" key={variant._id}>
                  <span className="variant-span">
                    {variant.size} {variant.unit}
                  </span>
                  <div className="variant-price-wrapper">
                    <input
                      className="variant-input-modal"
                      value={variant.price}
                      onChange={(e) =>
                        handleVariantChange(
                          variant._id,
                          "price",
                          e.target.value
                        )
                      }
                      type="number"
                    />
                    <span>₺</span>
                  </div>
                  <input
                    value={variant.stock}
                    onChange={(e) =>
                      handleVariantChange(variant._id, "stock", e.target.value)
                    }
                    className="variant-input-modal"
                    type="number"
                  />
                </div>
              ))}
              <button className="edit-btn-modal" onClick={handleUpdateProduct}>
                Güncelle
              </button>
              <button className="edit-btn-modal" onClick={handleDeleteProduct}>
                Sil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
