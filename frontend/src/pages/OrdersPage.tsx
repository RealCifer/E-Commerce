import React, { useEffect, useState } from "react";
import { getOrders } from "../api/orders";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ArrowLeft,
  Calendar,
  DollarSign,
  ShoppingBag,
  MapPin,

  Eye,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface OrderItem {
  _id?: string;
  product?: {
    _id: string;
    name: string;
    price: number;
    image?: string[];
  };
  productId?: string;
  name?: string;
  price?: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface Order {
  _id: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
  products?: OrderItem[]; // Alternative field name
  orderItems?: OrderItem[]; // Another alternative
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  paymentMethod?: string;
  trackingNumber?: string;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    getOrders()
      .then((data) => {
        console.log("Orders data:", data); // Debug: Check the structure
        setOrders(data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setOrders([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "processing":
        return <Package className="h-4 w-4 text-blue-500" />;
      case "shipped":
        return <Truck className="h-4 w-4 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Fixed item counting - handles multiple possible data structures
  const getOrderItems = (order: Order): OrderItem[] => {
    return order.items || order.products || order.orderItems || [];
  };

  const getItemCount = (order: Order): number => {
    const items = getOrderItems(order);
    return items.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status.toLowerCase() === filter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOrderProgress = (status: string) => {
    const statusOrder = ["pending", "processing", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(status.toLowerCase());
    return currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-blue-50 transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                <Package className="text-blue-600 h-8 w-8" />
                My Orders
              </h1>
              <p className="text-gray-600 mt-1">
                Track and manage your orders
              </p>
            </div>
          </div>

          {/* Summary Stats */}
          {orders.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Orders", value: orders.length, icon: Package, color: "blue" },
                { label: "Delivered", value: orders.filter(o => o.status.toLowerCase() === "delivered").length, icon: CheckCircle, color: "green" },
                { label: "In Transit", value: orders.filter(o => ["shipped", "processing"].includes(o.status.toLowerCase())).length, icon: Truck, color: "purple" },
                { label: "Pending", value: orders.filter(o => o.status.toLowerCase() === "pending").length, icon: Clock, color: "amber" },
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                      <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        {orders.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map(
              (status) => {
                const isActive = filter === status;
                const count = status === "all" ? orders.length : orders.filter((o) => o.status.toLowerCase() === status).length;
                
                return (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`relative font-medium capitalize px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {getStatusIcon(status)}
                    {status === "all" ? "All Orders" : status}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        )}

        {/* Orders List */}
        <AnimatePresence mode="wait">
          {filteredOrders.length ? (
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {filteredOrders.map((order) => {
                const items = getOrderItems(order);
                const itemCount = getItemCount(order);
                const isExpanded = expandedOrder === order._id;
                
                return (
                  <motion.div
                    key={order._id}
                    layout
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200"
                  >
                    {/* Order Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(order.status)}
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Placed on {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            ₹{order.total.toFixed(2)}
                          </div>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar for non-cancelled orders */}
                      {order.status.toLowerCase() !== "cancelled" && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-600 mb-2">
                            <span>Order Progress</span>
                            <span>{Math.round(getOrderProgress(order.status))}% Complete</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300 order-progress-bar"
                              data-progress={getOrderProgress(order.status)}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Order Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <ShoppingBag className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Items</p>
                            <p className="font-semibold text-gray-900">
                              {itemCount} {itemCount === 1 ? "item" : "items"}
                              {/* Debug info - remove in production */}
                              <span className="text-xs text-gray-400 ml-1">
                                ({items.length} products)
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                            <p className="font-semibold text-gray-900">₹{order.total.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Calendar className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Order Date</p>
                            <p className="font-semibold text-gray-900">
                              {new Date(order.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between mt-4">
                        <button
                          onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 transition-colors duration-200"
                        >
                          <Eye size={16} />
                          {isExpanded ? "Hide Details" : "View Details"}
                        </button>

                        <div className="flex gap-2">
                          {order.status.toLowerCase() !== "cancelled" && order.status.toLowerCase() !== "delivered" && (
                            <button className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors duration-200">
                              Cancel Order
                            </button>
                          )}
                          
                          {order.status.toLowerCase() === "delivered" && (
                            <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 transition-colors duration-200">
                              <RotateCcw size={14} />
                              Reorder
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-100"
                        >
                          <div className="p-6 bg-gray-50">
                            {/* Order Items */}
                            <div className="mb-6">
                              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Order Items ({itemCount} total)
                              </h4>
                              
                              {items.length > 0 ? (
                                <div className="space-y-3">
                                  {items.map((item, idx) => {
                                    const productName = item.product?.name || item.name || "Unknown Product";
                                    const productPrice = item.product?.price || item.price || 0;
                                    const productImage = item.product?.image?.[0] || "/placeholder.jpg";
                                    
                                    return (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-4 bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors duration-200"
                                      >
                                        <div className="flex-shrink-0">
                                          <img
                                            src={productImage}
                                            alt={productName}
                                            className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                                            onError={(e) => {
                                              e.currentTarget.src = "/placeholder.jpg";
                                            }}
                                          />
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                          <h5 className="font-semibold text-gray-900 truncate">
                                            {productName}
                                          </h5>
                                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                            <span>Qty: {item.quantity || 1}</span>
                                            {item.size && <span>Size: {item.size}</span>}
                                            {item.color && <span>Color: {item.color}</span>}
                                          </div>
                                        </div>
                                        
                                        <div className="text-right">
                                          <div className="font-semibold text-gray-900">
                                            ₹{(productPrice * (item.quantity || 1)).toFixed(2)}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            ₹{productPrice} each
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="text-center py-8 text-gray-500">
                                  <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                  <p>No items found in this order</p>
                                  <p className="text-xs mt-1">This might be a data structure issue</p>
                                </div>
                              )}
                            </div>

                            {/* Shipping Address */}
                            {order.shippingAddress && (
                              <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  Shipping Address
                                </h4>
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                  <p className="text-gray-800">
                                    {order.shippingAddress.street && `${order.shippingAddress.street}, `}
                                    {order.shippingAddress.city && `${order.shippingAddress.city}, `}
                                    {order.shippingAddress.state && `${order.shippingAddress.state} `}
                                    {order.shippingAddress.pincode}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Additional Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Payment Method */}
                              {order.paymentMethod && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">Payment Method</h4>
                                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                                    <p className="text-gray-800 capitalize">{order.paymentMethod}</p>
                                  </div>
                                </div>
                              )}

                              {/* Tracking Number */}
                              {order.trackingNumber && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">Tracking Number</h4>
                                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                                    <p className="text-gray-800 font-mono text-sm">{order.trackingNumber}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-16"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 max-w-md mx-auto">
                <div className="relative mb-6">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto">
                    <Package className="h-12 w-12 text-blue-500" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-2 shadow-lg">
                    <ShoppingBag className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  {filter === "all" ? "No orders yet" : `No ${filter} orders`}
                </h2>
                <p className="text-gray-600 mb-6">
                  {filter === "all"
                    ? "Start shopping to see your orders here!"
                    : `You don't have any ${filter} orders at the moment.`}
                </p>
                
                <div className="flex gap-3 justify-center">
                  {filter !== "all" && (
                    <button
                      onClick={() => setFilter("all")}
                      className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
                    >
                      View All Orders
                    </button>
                  )}
                  
                  <button
                    onClick={() => navigate("/products")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Start Shopping
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

   
      </div>
    </div>
  );
};

export default OrdersPage;