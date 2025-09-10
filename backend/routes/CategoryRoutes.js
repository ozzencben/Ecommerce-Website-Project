const express = require("express");
const router = express.Router();
const Category = require("../models/Categories");
const { protect, admin } = require("../middleware/auth");
const Product = require("../models/Products");

// create category
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name, parent } = req.body;
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }
    const category = await Category.create({ name, parent: parent || null });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().populate("parent", "name");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update category
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { name, parent } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    if (name) category.name = name;
    category.parent = parent || null;

    const updatedCategory = await category.save();
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete category
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Bu kategoride ürün var mı kontrol et
    const products = await Product.find({ category: category._id });
    if (products.length > 0) {
      return res.status(400).json({
        message:
          "Bu kategoriye bağlı ürünler bulundu, önce ürünleri taşıyın veya silin.",
      });
    }

    // ❌ eski: await category.remove();
    await Category.deleteOne({ _id: category._id });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
