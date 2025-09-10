const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    label: { type: String },
    recipientName: { type: String, required: true },
    phone: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    neighborhood: { type: String },
    street: { type: String },
    buildingNumber: { type: String },
    apartmentNumber: { type: String },
    postalCode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    fullAddress: {
      type: String,
      default: function () {
        return `${this.street || ""} ${this.buildingNumber || ""}${
          this.apartmentNumber ? ", " + this.apartmentNumber : ""
        }, ${this.neighborhood ? this.neighborhood + ", " : ""}${
          this.district
        }, ${this.province}, ${this.postalCode}`;
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
