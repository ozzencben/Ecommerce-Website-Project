const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Cart = require("../models/Cart");

// Kullanıcının sepetini getir
router.get("/", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    if (!cart) return res.status(200).json({ items: [] });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sepete ürün ekle
router.post("/", protect, async (req, res) => {
  try {
    const { product, variantId, quantity, price } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === product &&
        item.variantId.toString() === variantId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
      existingItem.price = price;
    } else {
      cart.items.push({ product, variantId, quantity: quantity || 1, price });
    }

    await cart.save();
    const populatedCart = await cart.populate("items.product");
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sepet ürünü güncelle
router.put("/:itemId", protect, async (req, res) => {
  try {
    const { quantity, price } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (quantity !== undefined) item.quantity = quantity;
    if (price !== undefined) item.price = price;

    await cart.save();
    const populatedCart = await cart.populate("items.product");
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sepetten ürün sil
router.delete("/:itemId", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // pull ile item çıkar
    cart.items.pull(req.params.itemId);
    await cart.save();

    const populatedCart = await cart.populate("items.product");
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sepeti temizle
router.delete("/", protect, async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
