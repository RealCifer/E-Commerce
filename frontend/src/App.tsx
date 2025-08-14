import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import ProductDetails from "./pages/ProductDetails";
import HomePage from "./pages/HomePage";
import { CartProvider } from "./context/cartContext";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import WishlistPage from "./pages/WishlistPage";

const App: React.FC = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Routes>

        {/* Toast provider */}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 2500,
            style: {
              borderRadius: "10px",
              padding: "10px 14px",
              color: "#fff",
            },
          }}
        />

        <Footer />
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;
