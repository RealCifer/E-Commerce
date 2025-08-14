// ProductCard.tsx - Updated with navigation
import React, { useState } from "react";
import { Heart, Star, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom"; // For React Router
import { Button } from "./ui/button";
// import { useRouter } from "next/router"; // For Next.js (uncomment if using Next.js)

interface Props {
  product: any;
  viewMode?: "grid" | "list";
}

const ProductCard: React.FC<Props> = ({ 
  product, 
  viewMode = "grid" 
}) => {
  const navigate = useNavigate(); // React Router
  // const router = useRouter(); // Next.js (uncomment if using Next.js)
  
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isImageError, setIsImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  const handleCardClick = () => {
    // React Router navigation - Fixed to match your route (/product/:id)
    navigate(`/product/${product._id || product.id}`);
    
    // Next.js navigation (uncomment if using Next.js)
    // router.push(`/product/${product._id || product.id}`);
  };

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking wishlist
    setWishlistLoading(true);
    try {
      // Add your wishlist API call here
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found — user may not be logged in");
        return;
      }

      // Example API call (replace with your actual endpoint)
     

const response = await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist/add/${product._id}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({ productId: product._id }),
});


      if (response.ok) {
        setInWishlist(!inWishlist);
        console.log("Added to wishlist successfully");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleImageLoad = () => setIsImageLoading(false);
  const handleImageError = () => {
    setIsImageLoading(false);
    setIsImageError(true);
  };

  // Determine which image to show (first or second on hover)
  const imageSrc = Array.isArray(product.image)
    ? isHovered && product.image[1]
      ? product.image[1]
      : product.image[0]
    : product.image;

  const rating = product.rating || Math.floor(Math.random() * 2) + 4;
  const reviewCount = product.reviewCount || Math.floor(Math.random() * 100) + 10;

  /* ---------- LIST VIEW ---------- */
  if (viewMode === "list") {
    return (
      <div 
        className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 overflow-hidden cursor-pointer group"
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex p-6">
          {/* Product Image */}
          <div className="flex-shrink-0 mr-6">
            <div className="relative w-32 h-32 bg-gray-100 rounded-xl overflow-hidden">
              {isImageLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <Eye className="h-8 w-8 text-gray-400" />
                </div>
              )}
              {!isImageError && imageSrc ? (
                <img
                  src={imageSrc}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    isImageLoading ? "opacity-0" : "opacity-100"
                  } ${isHovered ? "scale-105" : "scale-100"}`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Eye className="h-8 w-8 text-gray-400" />
                </div>
              )}
              
              {/* Wishlist Button */}
              <Button
                onClick={handleAddToWishlist}
                className="absolute top-2 right-2 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 z-10"
                disabled={wishlistLoading}
              >
                <Heart
                  size={16}
                  className={`${
                    inWishlist 
                      ? "fill-red-500 text-red-500" 
                      : "text-gray-600 hover:text-red-500"
                  } transition-colors duration-200`}
                />
              </Button>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="flex-1 mr-4">
                <div className="mb-2">
                  <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                    {product.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                  {product.name}
                </h3>

                {product.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">
                    ({reviewCount} reviews)
                  </span>
                </div>

                {/* Product Variants */}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {product.sizes && (
                    <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                      {product.sizes.length} sizes
                    </span>
                  )}
                  {product.colors && (
                    <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                      {product.colors.length} colors
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <div className="mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="text-sm text-gray-500 line-through">
                      ₹{product.originalPrice}
                    </div>
                  )}
                </div>
                
                {/* Sale Badge */}
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="inline-block">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      SALE
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- GRID VIEW ---------- */
  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {isImageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <Eye className="h-8 w-8 text-gray-400" />
          </div>
        )}

        {!isImageError && imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-300 ${
              isImageLoading ? "opacity-0" : "opacity-100"
            } ${isHovered ? "scale-105" : "scale-100"}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Eye className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Wishlist Button */}
        <Button
          onClick={handleAddToWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 z-10"
          disabled={wishlistLoading}
        >
          <Heart
            size={18}
            className={`${
              inWishlist 
                ? "fill-red-500 text-red-500" 
                : "text-gray-600 hover:text-red-500"
            } transition-colors duration-200`}
          />
        </Button>

        {/* Sale Badge */}
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              SALE
            </span>
          </div>
        )}

        {/* Quick View Text Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-white text-center">
            <Eye size={24} className="mx-auto mb-2" />
            <p className="text-sm font-medium">Click to view details</p>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Category */}
        <div className="mb-2">
          <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
            {product.category}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="ml-1 text-xs text-gray-500">({reviewCount})</span>
        </div>

        {/* Product Variants */}
        {(product.sizes || product.colors) && (
          <div className="mb-3">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              {product.sizes && (
                <span className="bg-gray-100 px-2 py-1 rounded-full">
                  {product.sizes.length} sizes
                </span>
              )}
              {product.colors && (
                <span className="bg-gray-100 px-2 py-1 rounded-full">
                  {product.colors.length} colors
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              ₹{product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Stock Status */}
        {product.stock !== undefined && (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              product.stock > 0 ? "bg-green-500" : "bg-red-500"
            }`} />
            <span className={`text-xs font-medium ${
              product.stock > 0 ? "text-green-600" : "text-red-600"
            }`}>
              {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
            </span>
          </div>
        )}
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-300 transition-colors duration-300 pointer-events-none" />
    </div>
  );
};

export default ProductCard;

// ================================
// USAGE EXAMPLE IN PARENT COMPONENT
// ================================

// ProductListPage.tsx
/*
import React, { useEffect, useState } from 'react';
import ProductCard from './components/ProductCard';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-96"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
        <p className="text-gray-600 mt-2">Discover our amazing collection</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            viewMode="grid"
          />
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;
*/