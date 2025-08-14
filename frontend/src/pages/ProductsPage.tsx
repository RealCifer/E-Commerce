import React, { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import { addToCart } from "../api/cart";
import ProductCard from "../components/ProductCard";
import { Search, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getProducts()
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const handleAddToCart = (product: any) => {
    addToCart(
      product._id,
      1,
      product.sizes?.[0] || "M",
      product.colors?.[0] || "Red"
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4">
                  <div className="h-48 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 products-bg-fixed"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-6">Our Products</h1>

          {/* Search and Filter Bar */}
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg border border-white/40 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search for amazing products..."
                  className="block w-full pl-10 pr-4 py-2.5 border border-transparent 
                  bg-white/90 rounded-full text-black placeholder-gray-500
                  shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                  transition-all duration-300 hover:shadow-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* View Toggle and Filters */}
              <div className="flex items-center space-x-4">
                <Button
                  className="flex items-center px-3 py-2 text-sm font-medium text-black bg-white/80 rounded-lg hover:bg-white/90 transition-colors duration-200 shadow-sm"
                  title="Filters"
                  aria-label="Filters"
                >
                  <Filter className="h-4 w-4 mr-2 text-blue-500" />
                  Filters
                </Button>

                <div className="flex items-center border border-white/50 bg-white/70 rounded-lg overflow-hidden">
                  <Button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-all duration-200 ${
                      viewMode === "grid"
                        ? "bg-blue-500 text-white shadow-md"
                        : "text-black hover:bg-blue-100"
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-all duration-200 ${
                      viewMode === "list"
                        ? "bg-blue-500 text-white shadow-md"
                        : "text-black hover:bg-blue-100"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-black">
              Showing {filteredProducts.length} of {products.length} products
              {searchTerm && (
                <span className="ml-1">
                  for "<span className="font-medium">{searchTerm}</span>"
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-black mb-2">
                No products found
              </h3>
              <p className="text-black/70">
                {searchTerm
                  ? `Try adjusting your search term "${searchTerm}"`
                  : "No products available at the moment"}
              </p>
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 text-blue-600 hover:text-blue-500 font-medium"
                >
                  Clear search
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }`}
          >
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className={`${viewMode === "list" ? "flex items-center space-x-4" : ""}`}
              >
                <ProductCard
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                  viewMode={viewMode}
                  addToCartButtonClass="mt-4 w-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
