const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    }, // Opsiyonel: alt kategori
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
