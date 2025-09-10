import { useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import CustomInput from "../../../components/input/CustomInput";
import Spacer from "../../../components/spacer/Spacer";
import { handleError } from "../../../helpers/error/ErrorHelper";
import {
  createCategory,
  getAllCategories,
} from "../../../services/CategoryServices";
import { createProduct } from "../../../services/ProductServices";
import "./AddProductStyles.css";

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [categoryValue, setCategoryValue] = useState(""); // category _id
  const [categoryName, setCategoryName] = useState(""); // display için
  const [showDropdown, setShowDropdown] = useState(false);
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [variantInput, setVariantInput] = useState({
    unit: "kg",
    size: "",
    price: "",
    stock: "",
  });
  const [disabledButton, setDisabledButton] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res);
    } catch (err) {
      handleError(err);
    }
  };

  const handleSelectCategory = (category) => {
    setCategoryValue(category._id); // ObjectId gönderilecek
    setCategoryName(category.name); // Görsel için
    setShowDropdown(false);
  };

  const handleAddCategory = async (name, e) => {
    e.stopPropagation();
    if (!name.trim()) return;
    try {
      const newCategory = await createCategory({ name });
      setCategoryValue(newCategory._id);
      setCategoryName(newCategory.name);
      fetchAllCategories();
    } catch (err) {
      handleError(err);
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(previews);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setVariantInput((prev) => ({ ...prev, [name]: value }));
  };

  const addVariant = () => {
    if (!variantInput.size || !variantInput.price || !variantInput.stock)
      return;
    setVariants((prev) => [...prev, { ...variantInput }]);
    setVariantInput({ unit: "kg", size: "", price: "", stock: "" });
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (
      !title ||
      !categoryValue ||
      images.length === 0 ||
      variants.length === 0
    ) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      setDisabledButton(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", categoryValue); // artık ObjectId
      formData.append("variants", JSON.stringify(variants));

      images.forEach((img) => {
        if (img?.file) formData.append("images", img.file);
      });

      const res = await createProduct(formData);
      alert("Ürün başarıyla oluşturuldu!");
      console.log(res);

      // Reset
      setTitle("");
      setDescription("");
      setCategoryValue("");
      setCategoryName("");
      setImages([]);
      setVariants([]);
    } catch (err) {
      handleError(err);
    } finally {
      setDisabledButton(false);
    }
  };

  return (
    <div className="add-product-container">
      <div className="add-product-form">
        <CustomInput
          placeholder="Ürün Adı"
          name="name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Spacer />
        <CustomInput
          placeholder="Ürün Açıklaması"
          name="description"
          multiline={true}
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Spacer />

        {/* Category Dropdown */}
        <div
          className="select-category-container"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          <span className="category-name">
            {categoryName || "Kategori Seçin"}
          </span>
          <IoChevronDown size={20} color="#ccc" />

          {showDropdown && (
            <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div
                    key={category._id}
                    className="dropdown-item"
                    onClick={() => handleSelectCategory(category)}
                  >
                    {category.name}
                  </div>
                ))
              ) : (
                <div className="dropdown-item">Kategori bulunamadı</div>
              )}
              <div className="add-category-menu">
                <input
                  placeholder="Yeni kategori ekle"
                  className="add-category-input"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  className="add-category-button"
                  onClick={(e) => handleAddCategory(categoryName, e)}
                >
                  Ekle
                </button>
              </div>
            </div>
          )}
        </div>
        <Spacer />

        {/* Images */}
        <CustomInput
          placeholder="Ürün Fotoğrafları"
          name="images"
          type="file"
          multiple={true}
          onChange={handleImagesChange}
        />
        <div className="image-preview-container">
          {images.map((img, index) => (
            <div key={index} className="image-preview">
              <img src={img.preview} alt={`preview-${index}`} />
              <button onClick={() => removeImage(index)}>X</button>
            </div>
          ))}
        </div>
        <Spacer />

        {/* Variant Input */}
        <div className="variants-container">
          <select
            name="unit"
            value={variantInput.unit}
            onChange={handleVariantChange}
            className="variant-select"
          >
            <option value="kg">kg</option>
            <option value="L">L</option>
          </select>
          <input
            type="number"
            name="size"
            placeholder="Boyut"
            value={variantInput.size}
            onChange={handleVariantChange}
            className="variant-input"
          />
          <input
            type="number"
            name="price"
            placeholder="Fiyat"
            value={variantInput.price}
            onChange={handleVariantChange}
            className="variant-input"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stok"
            value={variantInput.stock}
            onChange={handleVariantChange}
            className="variant-input"
          />
          <button className="add-variant-button" onClick={addVariant}>
            Ekle
          </button>
        </div>

        {/* Variant Summary */}
        <div className="variants-summary">
          {variants.map((v, index) => (
            <div key={index} className="variant-item">
              <span>{`${v.size}${v.unit} - ${v.price}₺ - Stok: ${v.stock}`}</span>
              <button
                className="remove-variant-button"
                onClick={() => removeVariant(index)}
              >
                Sil
              </button>
            </div>
          ))}
        </div>

        <Spacer size={20} />
        <button
          className="add-variant-button"
          onClick={handleSubmit}
          disabled={disabledButton}
        >
          {disabledButton ? "Ürün Ekleniyor..." : "Ürün Ekle"}
        </button>
      </div>
      <Spacer size={40} />
    </div>
  );
};

export default AddProduct;
