const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  unit: { type: String, enum: ["kg", "L"], required: true },
  size: { type: Number, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
});

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    variants: [variantSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
