const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const Order = require("../models/Orders");
const Cart = require("../models/Cart");

// ======================================
// USER ROUTES
// ======================================

// Create a new order from cart
// POST /api/orders
router.post("/", protect, async (req, res) => {
  try {
    const { address, payment } = req.body; // frontend'den gelecek

    // Kullanıcının sepetini al
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Toplam tutarı hesapla
    const totalAmount = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Siparişi oluştur
    const order = await Order.create({
      user: req.user._id,
      items: cart.items.map((item) => ({
        product: item.product._id,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      address,
      payment,
    });

    // Sepeti temizle
    cart.items = [];
    await cart.save();

    const populatedOrder = await order.populate([
      { path: "items.product" },
      { path: "address" },
      { path: "payment" },
    ]);

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Kullanıcının kendi siparişlerini getir
// GET /api/orders
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .populate("address")
      .populate("payment");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ======================================
// ADMIN ROUTES
// ======================================

// Tüm siparişleri getir (önce yazılmalı!)
// GET /api/orders/all
router.get("/all", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("items.product")
      .populate("address")
      .populate("payment");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/admin/:id
router.get("/admin/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "username email")
      .populate("items.product")
      .populate("address")
      .populate("payment");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Sipariş durumunu güncelle
// PUT /api/orders/:id/status
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    const updatedOrder = await order.save();
    const populatedOrder = await updatedOrder
      .populate("user", "username email")
      .populate("items.product")
      .populate("address")
      .populate("payment");

    res.status(200).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Siparişi sil
// DELETE /api/orders/:id
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ======================================
// COMMON ROUTES
// ======================================

// Tek sipariş getir
// GET /api/orders/:id
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id, // user kendi siparişine erişebilir
    })
      .populate("items.product")
      .populate("address")
      .populate("payment");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
