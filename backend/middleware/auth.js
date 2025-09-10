const jwt = require("jsonwebtoken");
const User = require("../models/Users");

//--------------------------------------------------
// 1️⃣ Authenticate: JWT kontrolü
//--------------------------------------------------
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) return res.status(401).json({ message: "User not found" });

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

//--------------------------------------------------
// 2️⃣ Admin only middleware
//--------------------------------------------------
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ message: "Admin access only" });
};

//--------------------------------------------------
// 3️⃣ User only middleware
//--------------------------------------------------
const user = (req, res, next) => {
  if (req.user && req.user.role === "user") return next();
  return res.status(403).json({ message: "User access only" });
};

//--------------------------------------------------
// 4️⃣ Admin or Owner middleware
//--------------------------------------------------
const adminOrOwner = (model) => async (req, res, next) => {
  try {
    const doc = await model.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Resource not found" });

    if (req.user.role === "admin") return next();
    if (doc._id.toString() === req.user._id.toString()) return next();

    return res.status(403).json({ message: "Not authorized" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { protect, admin, user, adminOrOwner };
