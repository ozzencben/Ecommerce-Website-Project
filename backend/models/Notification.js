const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["order", "system", "offer", "general"],
      default: "general",
    },
    isRead: { type: Boolean, default: false },
    relatedId: { type: mongoose.Schema.Types.ObjectId }, // Opsiyonel: sipariş, teklif, vs.
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
