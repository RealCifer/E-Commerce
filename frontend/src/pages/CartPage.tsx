import React, { useEffect, useState } from "react";
import { getCart, removeFromCart, updateCartItem } from "../api/cart";
import { placeOrderFromCart } from "../api/orders";
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [updating, setUpdating] = useState<Set<string>>(new Set());
  const [orderPlaced, setOrderPlaced] = useState<any>(null); // store placed order details

  const loadCart = () => {
    setLoading(true);
    getCart()
      .then(setCart)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQty = async (id: string, qty: number) => {
    if (qty < 1) return;
    setUpdating((u) => new Set(u).add(id));
    try {
      await updateCartItem(id, qty);
      loadCart();
    } finally {
      setUpdating((u) => {
        const copy = new Set(u);
        copy.delete(id);
        return copy;
      });
    }
  };

  const removeItem = async (id: string) => {
    setUpdating((u) => new Set(u).add(id));
    try {
      await removeFromCart(id);
      loadCart();
    } finally {
      setUpdating((u) => {
        const copy = new Set(u);
        copy.delete(id);
        return copy;
      });
    }
  };

  const placeOrder = async () => {
    setPlacingOrder(true);
    try {
      const res = await placeOrderFromCart();
      setOrderPlaced({
        items: cart.items,
        total,
        orderId: res?.orderId || Math.floor(Math.random() * 1000000), // mock order id if not returned
      });
      loadCart();
    } catch {
      alert("Failed to place order. Try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const total = cart?.items?.reduce((acc: number, i: any) => acc + i.product.price * i.quantity, 0) || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full animate-pulse space-y-4">
          <div className="h-6 bg-blue-300 rounded w-1/3"></div>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 bg-white p-3 rounded-xl shadow-lg">
              <div className="h-12 w-12 bg-blue-100 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-blue-200 rounded w-2/3"></div>
                <div className="h-3 bg-blue-100 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-purple-50 py-8 px-3">
      <div className="max-w-3xl mx-auto">
        {/* ORDER PLACED ROASTER */}
        {orderPlaced && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-2xl shadow-md">
            <div className="flex items-center mb-3">
              <CheckCircle className="text-green-600 h-6 w-6 mr-2" />
              <h2 className="text-lg font-bold text-green-700">Order Placed Successfully!</h2>
            </div>
            <p className="text-green-800 text-sm mb-3">Order ID: <span className="font-semibold">{orderPlaced.orderId}</span></p>
            <ul className="mb-3 text-green-900 text-sm list-disc list-inside">
              {orderPlaced.items.map((it: any) => (
                <li key={it.product._id}>
                  {it.product.name} × {it.quantity} — ₹{(it.product.price * it.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
            <p className="font-bold text-green-700">Total Paid: ₹{orderPlaced.total.toFixed(2)}</p>
            <p className="mt-3 text-xs text-green-700">
              ✅ Easy Return Policy: You can return any product within <b>7 days</b> of delivery, no questions asked.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center mb-6 space-x-4">
          <Link to="/" className="text-blue-600 hover:text-blue-800 transition duration-300">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <ShoppingCart className="h-7 w-7 text-blue-700" />
          <h1 className="text-2xl font-extrabold text-blue-900 flex-1 select-none">Your Cart</h1>
          {cart?.items?.length > 0 && (
            <span className="bg-blue-200 text-blue-900 px-3 py-0.5 rounded-full text-xs font-semibold select-none shadow-md">
              {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {cart?.items?.length ? (
          <div className="lg:flex lg:space-x-6">
            {/* Cart Items */}
            <div className="flex-1 bg-white rounded-2xl shadow-lg border border-blue-100 divide-y divide-blue-100">
              {cart.items.map((item: any) => (
                <div
                  key={item.product._id}
                  className="flex items-center p-3 space-x-4 hover:bg-blue-50 rounded-t-2xl transition"
                >
                  <div className="flex-shrink-0 h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center shadow-inner">
                    <ShoppingCart className="h-6 w-6 text-blue-300" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-blue-900 truncate">{item.product.name}</h3>
                    <p className="text-xs text-blue-700">
                      Size: <span className="font-semibold">{item.size}</span> • Color:{" "}
                      <span className="font-semibold">{item.color}</span>
                    </p>
                    <p className="mt-0.5 text-blue-700 font-bold text-base">₹{item.product.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => updateQty(item.product._id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updating.has(item.product._id)}
                      className="p-1.5 rounded-full bg-white shadow hover:shadow-md active:scale-95 transition"
                    >
                      <Minus className="h-4 w-4 text-blue-600" />
                    </Button>
                    <span className="w-8 text-center font-semibold text-blue-900 select-none text-sm">
                      {updating.has(item.product._id) ? "..." : item.quantity}
                    </span>
                    <Button
                      onClick={() => updateQty(item.product._id, item.quantity + 1)}
                      disabled={updating.has(item.product._id)}
                      className="p-1.5 rounded-full bg-white shadow hover:shadow-md active:scale-95 transition"
                    >
                      <Plus className="h-4 w-4 text-blue-600" />
                    </Button>
                  </div>

                  <Button
                    onClick={() => removeItem(item.product._id)}
                    disabled={updating.has(item.product._id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition shadow active:scale-90 disabled:opacity-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>

                  <p className="ml-6 text-right text-blue-900 font-extrabold text-base min-w-[5rem] select-none">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 lg:mt-0 w-full max-w-xs bg-white rounded-2xl shadow-lg border border-blue-100 p-6 sticky top-6 self-start">
              <h2 className="text-xl font-extrabold text-blue-900 mb-4 select-none">Order Summary</h2>
              <div className="space-y-3 text-blue-800 font-semibold text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹0.00</span>
                </div>
                <div className="border-t border-blue-200 pt-4">
                  <div className="flex justify-between font-extrabold text-lg text-blue-700">
                    <span>Total </span>
                    <span> ₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={placingOrder}
                className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 text-white py-3 rounded-2xl flex justify-center items-center gap-2 font-semibold shadow active:scale-95 transition-transform text-sm"
              >
                {placingOrder ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-4 border-white"></div>
                ) : (
                  <CreditCard className="h-5 w-5" />
                )}
                {placingOrder ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="bg-blue-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6 shadow-inner">
                <ShoppingCart className="h-10 w-10 text-blue-400" />
              </div>
              <h2 className="text-2xl font-extrabold text-blue-900 mb-2 select-none">Your cart is empty</h2>
              <p className="text-blue-700 text-base mb-8">Looks like you haven’t added any items yet.</p>
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl text-sm font-semibold shadow transition active:scale-95"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
