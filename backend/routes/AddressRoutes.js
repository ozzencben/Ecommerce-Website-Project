const express = require("express");
const router = express.Router();
const Address = require("../models/Addresses");
const { protect } = require("../middleware/auth");

//--------------------------------------------------
// 1️⃣ CREATE ADDRESS
//--------------------------------------------------
router.post("/", protect, async (req, res) => {
  try {
    const address = await Address.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//--------------------------------------------------
// 2️⃣ GET USER ADDRESSES
//--------------------------------------------------
router.get("/", protect, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//--------------------------------------------------
// 3️⃣ UPDATE ADDRESS
//--------------------------------------------------
router.put("/:id", protect, async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!address) return res.status(404).json({ message: "Address not found" });

    Object.assign(address, req.body);
    const updatedAddress = await address.save();
    res.status(200).json(updatedAddress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//--------------------------------------------------
// 4️⃣ DELETE ADDRESS
//--------------------------------------------------
router.delete("/:id", protect, async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!address) return res.status(404).json({ message: "Address not found" });

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
