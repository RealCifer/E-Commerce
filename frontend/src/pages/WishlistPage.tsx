import React, { useEffect, useState } from "react";
import { Heart, Trash2, ShoppingBag, ArrowLeft, Star, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getWishlist, removeFromWishlist } from "@/api/wishlist";
import { Button } from "@/components/ui/button";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string[];
  category?: string;
  rating?: number;
  reviewCount?: number;
  discount?: number;
}

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Fetch wishlist on mount
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await getWishlist(token!);
      setWishlist(data);
    } catch (error) {
      console.error("Error fetching wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    try {
      setRemovingId(productId);
      await removeFromWishlist(productId, token!);
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch (error) {
      console.error("Error removing from wishlist", error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleViewProduct = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/product/${productId}`);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg w-64 mb-4 animate-pulse"></div>
            <div className="h-4 bg-pink-100 rounded w-48 animate-pulse"></div>
          </div>
          
          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-pink-100 overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-pink-100 rounded animate-pulse"></div>
                  <div className="h-4 bg-pink-100 rounded w-3/4 animate-pulse"></div>
                  <div className="h-6 bg-purple-100 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-pink-50 transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                <Heart className="text-red-500 h-8 w-8" fill="currentColor" />
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-1">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-pink-100 p-12 max-w-md mx-auto">
              <div className="relative mb-6">
                <Heart className="h-24 w-24 text-pink-200 mx-auto" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 border-4 border-dashed border-pink-300 rounded-full"></div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-6">Start adding products you love to see them here!</p>
              <button
                onClick={() => navigate("/products")}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <ShoppingBag className="h-5 w-5" />
                Browse Products
              </button>
            </div>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-xl shadow-sm border border-pink-100 overflow-hidden hover:shadow-xl hover:border-pink-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => handleProductClick(product._id)}
                onMouseEnter={() => setHoveredCard(product._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
                  <img
                    src={product.image?.[0] || "/placeholder.jpg"}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      hoveredCard === product._id ? "scale-105" : "scale-100"
                    }`}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Remove Button */}
                  <button
                    onClick={(e) => handleRemove(product._id, e)}
                    disabled={removingId === product._id}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 z-10 group"
                    title="Remove from wishlist"
                  >
                    {removingId === product._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                    ) : (
                      <Trash2 
                        size={16} 
                        className="text-gray-600 group-hover:text-red-500 transition-colors duration-200" 
                      />
                    )}
                  </button>

                  {/* Sale Badge */}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        SALE
                      </span>
                    </div>
                  )}

                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={(e) => handleViewProduct(product._id, e)}
                      className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
                    >
                      <Eye size={16} />
                      Quick View
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* Category */}
                  {product.category && (
                    <div className="mb-2">
                      <span className="text-xs font-medium text-pink-600 uppercase tracking-wide">
                        {product.category}
                      </span>
                    </div>
                  )}

                  {/* Product Name */}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors duration-200">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < (product.rating || 4) 
                              ? "text-yellow-400 fill-current" 
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-xs text-gray-500">
                      ({product.reviewCount || 23})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{product.price}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                    
                    {/* Heart indicator */}
                    <Heart 
                      className="h-5 w-5 text-red-500 fill-current" 
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex gap-2">
                      <Button
                        onClick={(e) => handleViewProduct(product._id, e)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={16} />
                        View Details
                      </Button>  
                      
                      
                      <Button
                        onClick={(e) => handleRemove(product._id, e)}
                        disabled={removingId === product._id}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-all duration-200 group"
                        title="Remove from wishlist"
                      >
                        {removingId === product._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                        ) : (
                          <Trash2 
                            size={16} 
                            className="text-gray-400 group-hover:text-red-500 transition-colors duration-200" 
                          />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-pink-300 transition-colors duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        )}

        {/* Bottom Actions */}
        {wishlist.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-sm border border-pink-100 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-semibold text-gray-900">
                  Ready to shop?
                </h3>
                <p className="text-gray-600 text-sm">
                  Browse more products or continue shopping
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/products")}
                  className="px-6 py-2 border border-purple-200 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-all duration-200 flex items-center gap-2"
                >
                  <ShoppingBag size={16} />
                  Continue Shopping
                </button>
                
                <button
                  onClick={() => {
                    // Add all wishlist items to cart functionality
                    console.log("Add all to cart");
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2"
                >
                  <Heart size={16} />
                  Add All to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;