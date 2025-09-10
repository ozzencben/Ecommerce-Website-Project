const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["creditCard", "eft", "paypal"],
      default: "creditCard",
    },
    cardHolder: { type: String },
    cardNumber: { type: String },
    last4Digits: { type: String }, // Son 4 rakam
    expiryMonth: { type: String },
    expiryYear: { type: String },
    cvv: { type: String },
    paymentName: { type: String },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentMethod", paymentSchema);
