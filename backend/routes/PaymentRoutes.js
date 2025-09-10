const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Payment = require("../models/Payments");

// create payment method
router.post("/", protect, async (req, res) => {
  try {
    const payment = await Payment.create({
      ...req.body,
      user: req.user._id,
    });

    if (payment.isDefault) {
      await Payment.updateMany(
        { user: req.user._id, _id: { $ne: payment._id } },
        { isDefault: false }
      );
    }

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get user payment methods
router.get("/", protect, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update payment method
router.put("/:id", protect, async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    Object.assign(payment, req.body);
    const updatedPayment = await payment.save();

    if (updatedPayment.isDefault) {
      await Payment.updateMany(
        { user: req.user._id, _id: { $ne: updatedPayment._id } },
        { isDefault: false }
      );
    }
    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete payment method
router.delete("/:id", protect, async (req, res) => {
  try {
    const payment = await Payment.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
