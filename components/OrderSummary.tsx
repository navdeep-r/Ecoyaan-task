"use client";

import React from "react";
import { useCheckout } from "@/context/CheckoutContext";
import { Truck, Tag, ShoppingBag, Leaf } from "lucide-react";

interface OrderSummaryProps {
  compact?: boolean;
}

export default function OrderSummary({ compact = false }: OrderSummaryProps) {
  const { cart, getCartTotal, getEcoImpact, promoCode } = useCheckout();
  const { subtotal, shipping, discount, total } = getCartTotal();
  const ecoImpact = getEcoImpact(total);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`rounded-2xl overflow-hidden border border-[#E5E7EB] ${compact ? "shadow-sm" : "shadow-lg"}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A9B6B] to-[#076B4A] p-4 sm:p-5 text-white">
        <div className="flex items-center gap-2 mb-1">
          <ShoppingBag className="w-4 h-4" />
          <h2 className="font-bold text-sm tracking-wide uppercase">Order Summary</h2>
        </div>
        <p className="text-xs text-[#D1F5E5]">
          {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
        </p>
      </div>

      {/* Body */}
      <div className="bg-white p-4 sm:p-5 space-y-3">
        {/* Line items */}
        <div className="space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-[#4B5563]">Subtotal</span>
            <span className="text-[#111827] font-semibold">₹{subtotal}</span>
          </div>

          <div className="flex justify-between text-sm items-center">
            <span className="text-[#4B5563] flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#0A9B6B]" />
              Shipping
            </span>
            {shipping === 0 ? (
              <span className="text-[#0A9B6B] font-bold flex items-center gap-1">
                FREE 🎉
              </span>
            ) : (
              <span className="text-[#111827] font-semibold">₹{shipping}</span>
            )}
          </div>

          {/* Discount */}
          {discount > 0 && (
            <div className="flex justify-between text-sm items-center bg-[#F0FAF5] -mx-4 sm:-mx-5 px-4 sm:px-5 py-2.5">
              <span className="text-[#076B4A] font-semibold flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                Promo ({promoCode})
              </span>
              <span className="text-[#076B4A] font-bold">−₹{discount}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-[#E5E7EB] pt-3">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide">Total</p>
              <p className="text-xs text-[#9CA3AF]">Incl. of all taxes</p>
            </div>
            <p className="font-display text-2xl sm:text-3xl font-bold text-[#111827]">
              ₹{total}
            </p>
          </div>
        </div>

        {/* Savings chip */}
        {discount > 0 && (
          <div className="bg-[#D1F5E5] border border-[#0A9B6B]/20 rounded-xl p-3 text-center">
            <p className="text-xs font-bold text-[#076B4A]">
              🎉 You're saving ₹{discount} on this order!
            </p>
          </div>
        )}

        {/* Free shipping nudge */}
        {subtotal > 0 && subtotal < 500 && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
            <p className="text-xs font-medium text-amber-700">
              Add <strong>₹{500 - subtotal}</strong> more for <strong>FREE shipping</strong> 🚚
            </p>
          </div>
        )}

        {/* Eco Impact */}
        {!compact && total > 0 && (
          <div className="bg-[#F0FAF5] border border-[#D1F5E5] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Leaf className="w-4 h-4 text-[#0A9B6B]" />
              <span className="text-xs font-bold text-[#076B4A]">Your Eco Impact</span>
            </div>
            <p className="text-xs text-[#4B5563]">
              This order plants <strong className="text-[#0A9B6B]">{ecoImpact.trees} tree{ecoImpact.trees !== 1 ? "s" : ""}</strong> and 
              offsets <strong className="text-[#0A9B6B]">{ecoImpact.co2}kg CO₂</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
