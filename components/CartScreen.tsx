"use client";

import React, { useEffect, useState } from "react";
import { useCheckout } from "@/context/CheckoutContext";
import { CartItem as CartItemType } from "@/types";
import CartItem from "@/components/CartItem";
import OrderSummary from "@/components/OrderSummary";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowRight, Tag, Check } from "lucide-react";

export default function CartScreen({
  initialCartItems,
  initialShippingFee,
  initialDiscount,
}: {
  initialCartItems: CartItemType[];
  initialShippingFee: number;
  initialDiscount: number;
}) {
  const { setCartItems, setShippingFee, setDiscount } = useCheckout();
  const [isInitialized, setIsInitialized] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const router = useRouter();

  useEffect(() => {
    setCartItems(initialCartItems);
    setShippingFee(initialShippingFee);
    setDiscount(initialDiscount);
    setIsInitialized(true);
  }, [initialCartItems, initialShippingFee, initialDiscount, setCartItems, setShippingFee, setDiscount]);

  const handlePromo = () => {
    if (promoCode.trim().toUpperCase() === "ECO10") {
      setPromoApplied(true);
      setPromoError("");
      setDiscount(84); // 10% of subtotal
    } else {
      setPromoError("Invalid promo code. Try ECO10!");
      setPromoApplied(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex flex-col justify-center items-center py-20 gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-200 border-t-emerald-600"></div>
        <p className="text-sm text-gray-400 font-medium">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Left: Cart Items */}
      <div className="lg:col-span-3 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-500" />
            Your Cart
          </h2>
          <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {initialCartItems.length} item{initialCartItems.length !== 1 ? "s" : ""}
          </span>
        </div>

        {initialCartItems.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Your cart is empty</p>
          </div>
        ) : (
            <div className="bg-gray-50/60 rounded-2xl overflow-hidden divide-y divide-gray-100 border border-gray-100">
              {initialCartItems.map((item, idx) => (
                <CartItem key={item.product_id} item={item} index={idx} />
            ))}
          </div>
        )}

        {/* Promo Code Section */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-800">Have a promo code?</span>
          </div>
          {promoApplied ? (
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-100 rounded-xl px-4 py-3 font-semibold text-sm">
              <Check className="w-4 h-4" />
              "ECO10" applied — You saved ₹84!
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => { setPromoCode(e.target.value); setPromoError(""); }}
                placeholder="Enter code (try ECO10)"
                className="flex-1 text-gray-900 text-sm px-4 py-2.5 rounded-xl border border-emerald-200 bg-white outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all"
              />
              <button
                onClick={handlePromo}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all focus:ring-2 focus:ring-emerald-300"
              >
                Apply
              </button>
            </div>
          )}
          {promoError && <p className="mt-2 text-xs text-red-500 font-medium">{promoError}</p>}
        </div>

        {/* Eco Impact Banner */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-5 text-white">
          <p className="font-bold text-sm mb-1">🌱 Your Eco Impact</p>
          <p className="text-xs text-emerald-100 leading-relaxed">
            This purchase will offset <strong>2.4 kg of CO₂</strong> and fund the planting of <strong>3 trees</strong> through our green initiative.
          </p>
        </div>
      </div>

      {/* Right: Order Summary */}
      <div className="lg:col-span-2">
        <div className="sticky top-24 space-y-4">
          <OrderSummary />
          <button
            onClick={() => router.push("/checkout/address")}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-emerald-200 hover:-translate-y-0.5 transition-all duration-300 focus:ring-4 focus:ring-emerald-300 flex justify-center items-center gap-2 text-base"
          >
            Proceed to Checkout
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-center text-xs text-gray-400 font-medium">🔒 Secured with 256-bit SSL encryption</p>
        </div>
      </div>
    </div>
  );
}
