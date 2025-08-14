import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import shopping from '../assets/shopping-women.png';
import ProductCard from "@/components/ProductCard";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

const textGlowKeyframes = `
  @keyframes text-glow {
    0%, 100% {
      text-shadow:
        0 0 8px rgba(255, 255, 255, 0.83),
        0 0 15px rgba(255, 255, 255, 0.5);
    }
    50% {
      text-shadow:
        0 0 12px rgba(255, 255, 255, 0.9),
        0 0 20px rgba(255, 255, 255, 0.64);
    }
  }
`;

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products?limit=4");
        setFeaturedProducts(res.data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    console.log("Adding to cart:", product);
  };

  return (
    <>
      {/* Inject glowing text keyframes */}
      <style>{textGlowKeyframes}</style>

      {/* Banner Section */}
      <div className="w-full h-[450px] bg-gradient-to-r from-sky-300 via-sky-200 to-yellow-100 shadow-inner flex items-center justify-between px-10">
        {/* Left side with text */}
        <div className="flex flex-col justify-center h-full">
          <h1
            className="
              text-5xl sm:text-6xl md:text-7xl
              font-extrabold
              text-gray-900
              tracking-wide
              select-none
              cursor-default
              animate-[text-glow_4s_ease-in-out_infinite]
              transition-transform duration-300
              hover:scale-105
            "
          >
            MAKE <span className="text-red-600">YOURSELF</span>
          </h1>
          <h1
            className="
              text-5xl sm:text-6xl md:text-7xl
              font-extrabold
              text-gray-900
              tracking-wide
              select-none
              cursor-default
              animate-[text-glow_4s_ease-in-out_infinite]
              mt-3
            "
          >
            URBANISED
          </h1>
        </div>

        {/* Right side with shopping woman image */}
        <div className="w-1/2 h-full flex items-end justify-center">
          <img
            src={shopping}
            alt="Shopping woman"
            className="h-full object-contain drop-shadow-lg"
          />
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-semibold mb-8 text-gray-900">Featured Products</h2>

        {loading ? (
          <p className="text-gray-600 text-lg">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info Section - Moved to Bottom */}
      <div className="bg-white py-8 shadow-md mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">🚚 Free Delivery</h3>
            <p className="text-gray-600">On all orders above ₹999</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">🔄 Easy Returns</h3>
            <p className="text-gray-600">Return within 7 days hassle-free</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">💳 Secure Payment</h3>
            <p className="text-gray-600">100% safe & trusted transactions</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
