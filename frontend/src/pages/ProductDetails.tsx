import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProduct } from "@/api/products";
import { addToCart } from "@/api/cart";
import { useCart } from "@/context/cartContext";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  sizes: string[];
  colors: string[];
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const { setCartCount } = useCart();

  // For the in-place badge animation
  const [showBadge, setShowBadge] = useState(false);
  const badgeTimerRef = useRef<number | null>(null);

  const rating = 4.5;
  const reviewCount = 127;

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getProduct(id)
        .then((data) => {
          setProduct(data);
          if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
          if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
        })
        .catch((err) => console.error("Error fetching product:", err))
        .finally(() => setIsLoading(false));
    }
    return () => {
      if (badgeTimerRef.current) {
        window.clearTimeout(badgeTimerRef.current);
      }
    };
  }, [id]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const triggerBadge = () => {
    // show -> auto hide after timeout
    if (badgeTimerRef.current) {
      window.clearTimeout(badgeTimerRef.current);
    }
    setShowBadge(true);
    badgeTimerRef.current = window.setTimeout(() => {
      setShowBadge(false);
      badgeTimerRef.current = null;
    }, 1600); // visible for 1.6s
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }
    if (!product) return;

    setIsAddingToCart(true);
    try {
      await addToCart(product._id, quantity, selectedSize, selectedColor);
      setCartCount((prev) => prev + quantity);

      // smoother toast (keeps using react-hot-toast)
      toast.custom(
        (t) => (
          <div
            className={`max-w-md w-full px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
              t.visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            } transition-all duration-300 ease-out`}
            style={{
              background:
                "linear-gradient(90deg, rgba(79,70,229,1) 0%, rgba(99,102,241,1) 50%, rgba(168,85,247,1) 100%)",
              color: "#fff",
            }}
          >
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20 text-white text-sm font-semibold">
              🛒
            </div>
            <div className="flex-1">
              <div className="font-semibold">
                {quantity} × {product.name}
              </div>
              <div className="text-xs opacity-90">Added to cart</div>
            </div>
          </div>
        ),
        { duration: 2200 }
      );

      // trigger in-place badge for a nicer local pop
      triggerBadge();
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const getColorName = (color: string) => {
    const colorMap: { [key: string]: string } = {
      "#FF0000": "Red",
      "#00FF00": "Green",
      "#0000FF": "Blue",
      "#FFFF00": "Yellow",
      "#FF00FF": "Magenta",
      "#00FFFF": "Cyan",
      "#000000": "Black",
      "#FFFFFF": "White",
      "#FFA500": "Orange",
      "#800080": "Purple",
      "#FFC0CB": "Pink",
      "#A52A2A": "Brown",
      "#808080": "Gray",
    };
    return colorMap[color] || color;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl animate-pulse rounded-lg bg-white/70 p-6 shadow-md">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="aspect-square bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-purple-300 rounded w-3/4"></div>
              <div className="h-4 bg-purple-300 rounded"></div>
              <div className="h-4 bg-purple-300 rounded w-2/3"></div>
              <div className="h-8 bg-indigo-300 rounded w-1/3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-purple-300 rounded w-1/2"></div>
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-10 w-14 rounded-lg bg-purple-300 opacity-60"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-sm mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Product not found
          </h2>
          <p className="text-gray-600 mb-5">The product you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4 relative">
      <Link
        to="/"
        className="absolute top-6 left-6 p-2 rounded-full bg-white shadow hover:bg-indigo-50 transition"
        aria-label="Back to products"
      >
        <ArrowLeft className="h-6 w-6 text-indigo-600" />
      </Link>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 border border-indigo-100">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6 font-medium">
          <Link to="/" className="hover:text-indigo-700 transition">
            Products
          </Link>
          <span className="text-gray-400 select-none">/</span>
          <span className="text-indigo-900 font-semibold">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="aspect-square rounded-lg overflow-hidden shadow-sm border border-indigo-200 cursor-pointer hover:scale-105 transform transition">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>

            <div className="flex justify-between mt-4 space-x-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square w-16 rounded-lg border border-indigo-200 overflow-hidden cursor-pointer hover:opacity-90"
                >
                  <img
                    src={product.image}
                    alt={`${product.name} view ${i + 1}`}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between space-y-5">
            <div className="flex justify-end items-start mb-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  aria-label="Toggle favorite"
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    isFavorited
                      ? "text-red-500 bg-red-50"
                      : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
                </button>
                <button
                  aria-label="Share product"
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-full transition"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-indigo-900">{product.name}</h1>
              <div className="flex items-center space-x-3 mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-indigo-700 font-semibold">{rating}</span>
                <span className="text-indigo-500 text-sm">({reviewCount} reviews)</span>
              </div>
            </div>

            <div className="flex items-baseline space-x-3 mt-1">
              <span className="text-2xl font-bold text-indigo-700">
                ₹{product.price.toFixed(2)}
              </span>
              <span className="line-through text-gray-400">
                ₹{(product.price * 1.2).toFixed(2)}
              </span>
              <span className="text-green-700 bg-green-200 px-2 py-0.5 rounded-full text-xs font-semibold select-none">
                Save 20%
              </span>
            </div>

            <p className="text-indigo-800 text-sm leading-relaxed">{product.description}</p>

            {product.sizes?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-indigo-900 mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-4 border-2 rounded-md text-sm transition ${
                        selectedSize === size
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow"
                          : "border-gray-300 text-gray-700 hover:border-indigo-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-indigo-900 mb-2 flex items-center gap-1">
                  Color:{" "}
                  <span className="font-normal text-indigo-600 text-base">
                    {getColorName(selectedColor)}
                  </span>
                </h3>
                <div className="flex space-x-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-4 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        selectedColor === color
                          ? "border-indigo-900 scale-110 shadow"
                          : "border-gray-300 hover:border-indigo-600"
                      }`}
                      style={{ backgroundColor: color }}
                      title={getColorName(color)}
                      aria-label={`Select color ${getColorName(color)}`}
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-indigo-900 mb-2">Quantity</h3>
              <div className="flex items-center gap-3 max-w-xs">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="p-2 border border-indigo-300 rounded-md hover:bg-indigo-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4 text-indigo-600" />
                </button>
                <span className="text-indigo-900 font-semibold text-lg min-w-[2.5rem] text-center select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                  className="p-2 border border-indigo-300 rounded-md hover:bg-indigo-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4 text-indigo-600" />
                </button>
                <span className="text-indigo-500 text-xs select-none">Max 10</span>
              </div>
            </div>

            {/* Add to Cart button container (relative for badge) */}
            <div className="relative">
              {/* in-place badge: animated scale + opacity */}
              <div
                aria-hidden
                className={`pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 transform transition-all duration-350 ease-out ${
                  showBadge
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-2 scale-95"
                }`}
                style={{ transitionDuration: "300ms" }}
              >
                <div className="flex items-center gap-2 px-3 py-2 rounded-full shadow-lg"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(79,70,229,1) 0%, rgba(168,85,247,1) 100%)",
                    color: "#fff",
                  }}
                >
                  <div className="text-sm font-semibold">✓</div>
                  <div className="text-sm font-semibold">
                    Added {quantity}
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !selectedSize || !selectedColor}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-md font-semibold text-base hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isAddingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Add {quantity} - ₹{(product.price * quantity).toFixed(2)}
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-indigo-200">
              <div className="text-center text-indigo-700">
                <Truck className="h-6 w-6 mx-auto mb-1" />
                <p className="text-sm font-semibold">Free Delivery</p>
                <p className="text-xs">On orders above ₹999</p>
              </div>
              <div className="text-center text-indigo-700">
                <RotateCcw className="h-6 w-6 mx-auto mb-1" />
                <p className="text-sm font-semibold">Easy Returns</p>
                <p className="text-xs">30 days return policy</p>
              </div>
              <div className="text-center text-indigo-700">
                <Shield className="h-6 w-6 mx-auto mb-1" />
                <p className="text-sm font-semibold">Secure Payment</p>
                <p className="text-xs">100% secure checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
