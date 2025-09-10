const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const { protect, admin, adminOrOwner } = require("../middleware/auth");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../helpers/TokenServices");

//--------------------------------------------------
// 1️⃣ REGISTER
//--------------------------------------------------
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, firstname, lastname } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      username,
      email,
      password,
      firstname,
      lastname,
      role: "user",
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//--------------------------------------------------
// 2️⃣ LOGIN
//--------------------------------------------------
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (user && (await user.matchPassword(password))) {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        accessToken,
        refreshToken,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//--------------------------------------------------
// 3️⃣ GET ALL USERS (Admin only)
//--------------------------------------------------
router.get("/all-users", protect, admin, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("addresses")
      .populate("payments")
      .populate("orders")
      .populate("cart");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//--------------------------------------------------
// 4️⃣ GET CURRENT USER PROFILE
//--------------------------------------------------
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("addresses")
      .populate("payments")
      .populate("orders")
      .populate("cart");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//--------------------------------------------------
// 5️⃣ GET USER BY ID (Admin or Owner)
//--------------------------------------------------
router.get("/:id", protect, adminOrOwner(User), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("addresses")
      .populate("payments")
      .populate("orders")
      .populate("cart");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//--------------------------------------------------
// 6️⃣ UPDATE USER (Admin or Owner)
//--------------------------------------------------
router.put("/:id", protect, adminOrOwner(User), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { firstname, lastname, email, username, password } = req.body;

    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (email) user.email = email;
    if (username) user.username = username;
    if (password) user.password = password;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//--------------------------------------------------
// 7️⃣ DELETE USER (Admin only)
//--------------------------------------------------
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//--------------------------------------------------
// 8️⃣ REFRESH TOKEN
//--------------------------------------------------
router.post("/refresh-token", (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: "Token yok" });
  if (!refreshTokens.includes(token))
    return res.status(403).json({ message: "Geçersiz token" });

  try {
    const decoded = verifyRefreshToken(token);
    const user = { id: decoded.id, email: decoded.email, role: decoded.role };
    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ message: "Token geçersiz veya süresi dolmuş" });
  }
});

//--------------------------------------------------
// 9️⃣ CHECK EMAIL AVAILABILITY
//--------------------------------------------------
router.post("/check-availability", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ message: "This email is already in use" });

    return res.status(200).json({ message: "Email is available" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//--------------------------------------------------
// 🔟 CHECK USERNAME AVAILABILITY
//--------------------------------------------------
router.post("/check-availability-username", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username)
      return res.status(400).json({ message: "username is required" });

    const existingusername = await User.findOne({ username });
    if (existingusername)
      return res
        .status(400)
        .json({ message: "This username is already in use" });

    return res.status(200).json({ message: "username is available" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
