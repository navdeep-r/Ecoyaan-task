"use client";

import { useCheckout } from "@/context/CheckoutContext";
import { calculateSubtotal } from "@/lib/calculations";
import { Truck, Tag, ShoppingBag } from "lucide-react";

export default function OrderSummary() {
  const { cartItems, shippingFee, discount, orderTotal } = useCheckout();
  const subtotal = calculateSubtotal(cartItems);

  return (
    <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white">
        <div className="flex items-center gap-2 mb-1">
          <ShoppingBag className="w-4 h-4" />
          <h2 className="font-bold text-[15px] tracking-wide uppercase">Order Summary</h2>
        </div>
        <p className="text-xs text-emerald-100">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your bag</p>
      </div>

      {/* Body */}
      <div className="bg-white p-5 space-y-3">
        {/* Line items */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Subtotal</span>
            <span className="text-gray-900 font-semibold">₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm items-center">
            <span className="text-gray-500 font-medium flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-emerald-500" /> Shipping
            </span>
            <span className={`font-semibold ${shippingFee === 0 ? "text-emerald-600" : "text-gray-900"}`}>
              {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm items-center bg-emerald-50 -mx-5 px-5 py-2">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Promo Discount
              </span>
              <span className="text-emerald-700 font-bold">−₹{discount}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-200 pt-3">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total</p>
              <p className="text-xs text-gray-400">Incl. of all taxes</p>
            </div>
            <p className="text-3xl font-black text-gray-900 tracking-tight">₹{orderTotal}</p>
          </div>
        </div>

        {/* Savings chip */}
        {discount > 0 && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
            <p className="text-xs font-bold text-emerald-700">🎉 You are saving ₹{discount} on this order!</p>
          </div>
        )}

        {/* Shipping threshold nudge */}
        {subtotal < 500 && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
            <p className="text-xs font-medium text-amber-700">
              Add <strong>₹{500 - subtotal}</strong> more for <strong>FREE shipping</strong> 🚚
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
