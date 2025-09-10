const express = require("express");
const router = express.Router();
const Product = require("../models/Products");
const { protect, admin } = require("../middleware/auth");
const { deleteFromCloudinary } = require("../helpers/CloudinaryHelper");
const { multipleUpload } = require("../middleware/upload");

//--------------------------------------------------
// 1️⃣ CREATE PRODUCT (Admin only)
//--------------------------------------------------
router.post(
  "/",
  protect,
  admin,
  multipleUpload("images", "products"),
  async (req, res) => {
    try {
      const { title, description, category, variants } = req.body;

      const images =
        req.files?.cloudinary.map((file) => ({
          url: file.secure_url,
          public_id: file.public_id,
        })) || [];

      const product = await Product.create({
        title,
        description,
        category,
        variants: JSON.parse(variants),
        images,
        createdBy: req.user._id,
      });

      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

//--------------------------------------------------
// 2️⃣ GET ALL PRODUCTS
//--------------------------------------------------
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const products = await Product.find({ isActive: true })
    .populate("category")
    .populate("createdBy")
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments({ isActive: true });

  res.json({
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
});

//--------------------------------------------------
// 3️⃣ GET PRODUCT BY ID
//--------------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("createdBy");

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//--------------------------------------------------
// 4️⃣ UPDATE PRODUCT (Admin only)
//--------------------------------------------------
router.put(
  "/:id",
  protect,
  admin,
  multipleUpload("images", "products"),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      const { title, description, category, variants, removeImages } = req.body;

      if (title) product.title = title;
      if (description) product.description = description;
      if (category) product.category = category;
      if (variants) product.variants = JSON.parse(variants);

      // Remove selected images
      if (removeImages) {
        const removeArray = JSON.parse(removeImages);
        product.images = product.images.filter((img) => {
          if (removeArray.includes(img.public_id)) {
            deleteFromCloudinary(img.public_id);
            return false;
          }
          return true;
        });
      }

      // Add new images
      if (req.files?.cloudinary?.length > 0) {
        for (const file of req.files.cloudinary) {
          product.images.push({
            url: file.secure_url,
            public_id: file.public_id,
          });
        }
      }

      const updatedProduct = await product.save();
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

//--------------------------------------------------
// 5️⃣ DELETE PRODUCT (Admin only)
//--------------------------------------------------
// routes/productRoutes.js
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    // Ürünü bul
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Cloudinary'deki tüm görselleri sil
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        try {
          await deleteFromCloudinary(img.public_id);
        } catch (cloudErr) {
          console.error("Cloudinary silme hatası:", cloudErr);
        }
      }
    }

    // Ürünü veritabanından sil
    await product.deleteOne(); // Mongoose 7 uyumlu

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Ürün silme hatası:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

module.exports = router;
