import { Route, Routes } from "react-router-dom";

import RoleRoute from "./RoleRoute";

import Login from "../pages/auth/login/Login";
import Register from "../pages/auth/register/Register";

import Navbar from "../components/navbar/Navbar";

import AddProduct from "../pages/admin/add-product/AddProduct";
import MainPage from "../pages/admin/main-page/MainPage";
import Product from "../pages/admin/products/Product";
import Users from "../pages/admin/users/Users";
import OrdersAdmin from "../pages/admin/orders/OrdersAdmin";
import OrderDetail from "../pages/admin/order-detail/OrderDetail";

import Home from "../pages/user/home/Home";
import ProductDetail from "../pages/user/product-detail/ProductDetail";
import Cart from "../pages/user/cart/Cart";
import Payment from "../pages/user/payment/Payment";

function AppRoute() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/register"
          element={
            <RoleRoute publicOnly>
              <Register />
            </RoleRoute>
          }
        />
        <Route
          path="/login"
          element={
            <RoleRoute publicOnly>
              <Login />
            </RoleRoute>
          }
        />
        //admin route
        <Route
          path="/admin"
          element={
            <RoleRoute roles={["admin"]}>
              <MainPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <RoleRoute roles={["admin"]}>
              <AddProduct />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <RoleRoute roles={["admin"]}>
              <Product />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleRoute roles={["admin"]}>
              <Users />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <RoleRoute roles={["admin"]}>
              <OrdersAdmin />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/orders/:id"
          element={
            <RoleRoute roles={["admin"]}>
              <OrderDetail />
            </RoleRoute>
          }
        />
        
        // user route
        <Route
          path="/"
          element={
            <RoleRoute roles={["user"]}>
              <Home />
            </RoleRoute>
          }
        />
        <Route
          path="/product-detail/:id"
          element={
            <RoleRoute roles={["user"]}>
              <ProductDetail />
            </RoleRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <RoleRoute roles={["user"]}>
              <Cart />
            </RoleRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <RoleRoute roles={["user"]}>
              <Payment />
            </RoleRoute>
          }
        />
      </Routes>
    </>
  );
}

export default AppRoute;
