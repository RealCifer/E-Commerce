// Navbar.tsx
import { useCart } from "@/context/cartContext";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Package, LogOut, Heart } from "lucide-react";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // cart context
  const { cartCount, setCartCount } = useCart();

  // wishlist state
  const [wishlistCount, setWishlistCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCartCount(0);
    setWishlistCount(0);
    navigate("/login");
  };

  // fetch cart count
  useEffect(() => {
    if (token) {
      fetch("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setCartCount(data.items?.length || 0))
        .catch((err) => console.error("Failed to fetch cart", err));
    }
  }, [token, setCartCount]);

  // fetch wishlist count
  useEffect(() => {
    if (token) {
      fetch("http://localhost:5000/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setWishlistCount(data.items?.length || 0))
        .catch((err) => console.error("Failed to fetch wishlist", err));
    }
  }, [token]);

  return (
    <nav className="bg-gradient-to-r from-sky-300 via-sky-200 to-yellow-100 shadow-lg border-b border-gray-200 backdrop-blur-md bg-opacity-90 font-nunito">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Brand Name */}
          <Link to="/" className="flex items-center">
            <span className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-transparent bg-clip-text tracking-widest drop-shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
              URBAN STORE
            </span>
          </Link>

          <div className="flex items-center space-x-8">
            {/* Products Link */}
            <Link to="/products" className="relative group font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-300 flex items-center tracking-wide text-lg">
              <Package className="h-6 w-6 mr-2 stroke-indigo-600" />
              Products
            </Link>

            {/* Wishlist Link with Count */}
            <Link to="/wishlist" className="relative group font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-300 flex items-center tracking-wide text-lg">
              <Heart className="h-6 w-6 mr-2 stroke-pink-600" />
              Wishlist
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {token && (
              <>
                {/* Cart Link with Count */}
                <Link to="/cart" className="relative group font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-300 flex items-center tracking-wide text-lg">
                  <ShoppingCart className="h-6 w-6 mr-2 stroke-indigo-600" />
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Orders Link */}
                <Link to="/orders" className="relative group font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-300 flex items-center tracking-wide text-lg">
                  <Package className="h-6 w-6 mr-2 stroke-indigo-600" />
                  Orders
                </Link>
              </>
            )}

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {!token ? (
                <>
                  <Link to="/login" className="px-4 py-2 rounded-full border border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-md">
                    Login
                  </Link>
                  <Link to="/signup" className="px-4 py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-md">
                    Sign Up
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full border border-pink-600 text-pink-600 font-semibold hover:bg-pink-600 hover:text-white transition-all duration-300 shadow-md flex items-center tracking-wide text-lg font-semibold hover:scale-105 transform"
                >
                  <LogOut className="h-6 w-6 mr-2 stroke-pink-600" />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
