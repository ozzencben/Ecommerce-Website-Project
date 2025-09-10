require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const conncectDB = require("./config/db");

const UserRoutes = require("./routes/UserRoutes");
const ProductRoutes = require("./routes/ProductRoutes");
const OrderRoutes = require("./routes/OrderRoutes");
const PaymentRoutes = require("./routes/PaymentRoutes");
const AddressRoutes = require("./routes/AddressRoutes");
const Notification = require("./routes/Notification");
const CartRoutes = require("./routes/CartRoutes");
const CategoryRoutes = require("./routes/CategoryRoutes");

//-----------------------------------------

const app = express();
const PORT = process.env.PORT || 5000;

//-----------------------------------------

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/users", UserRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/orders", OrderRoutes);
app.use("/api/payments", PaymentRoutes);
app.use("/api/addresses", AddressRoutes);
app.use("/api/notifications", Notification);
app.use("/api/carts", CartRoutes);
app.use("/api/categories", CategoryRoutes);

conncectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
