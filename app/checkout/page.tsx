"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCheckout } from "@/context/CheckoutContext";
import { useToast } from "@/context/ToastContext";
import { getProductById } from "@/lib/products";
import Navbar from "@/components/Navbar";
import CartItem from "@/components/CartItem";
import OrderSummary from "@/components/OrderSummary";
import StickyActionBar from "@/components/StickyActionBar";
import StepIndicator from "@/components/StepIndicator";
import { ShoppingBag, Tag, Check, ArrowRight, ShoppingCart } from "lucide-react";

export default function CartPage() {
  const { cart, getCartTotal, getEcoImpact, applyPromoCode, removePromoCode, promoCode, setStep } = useCheckout();
  const { success, error } = useToast();
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

  const { subtotal, shipping, discount, total } = getCartTotal();
  const ecoImpact = getEcoImpact(total);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleApplyPromo = () => {
    if (!promoInput.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }
    
    if (applyPromoCode(promoInput)) {
      success("🎉 Promo code applied! You saved ₹" + Math.round(subtotal * 0.1));
      setPromoError("");
      setPromoInput("");
    } else {
      setPromoError("Invalid promo code. Try ECO10!");
      error("Invalid promo code");
    }
  };

  const handleProceed = () => {
    setStep("address");
  };

  return (
    <div className="min-h-screen bg-[#F0FAF5] pb-32">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#111827]">
            Your Shopping Cart
          </h1>
          <p className="text-[#4B5563] mt-1 text-sm">
            Every purchase plants a tree 🌱
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep="cart" />

        {cart.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-[#F0FAF5] rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-10 h-10 text-[#9CA3AF]" />
            </div>
            <h2 className="font-display text-xl font-bold text-[#111827] mb-2">
              Your cart is empty
            </h2>
            <p className="text-[#4B5563] text-sm mb-6">
              Looks like you haven't added any eco-friendly products yet.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#0A9B6B] hover:bg-[#076B4A] text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              Start Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Left: Cart Items */}
            <div className="lg:col-span-3 space-y-4">
              {/* Cart Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#0A9B6B]" />
                  Cart Items
                </h2>
                <span className="text-sm font-medium text-[#4B5563] bg-[#F0FAF5] px-3 py-1 rounded-full">
                  {itemCount} item{itemCount !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Cart Items List */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden divide-y divide-[#E5E7EB]">
                {cart.map((item) => (
                  <CartItem key={item.productId} item={item} />
                ))}
              </div>

              {/* Promo Code Section */}
              <div className="bg-gradient-to-r from-[#F0FAF5] to-[#D1F5E5] rounded-2xl p-5 border border-[#0A9B6B]/20">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-[#0A9B6B]" />
                  <span className="text-sm font-bold text-[#076B4A]">Have a promo code?</span>
                </div>

                {promoCode ? (
                  <div className="flex items-center justify-between bg-[#D1F5E5] rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2 text-[#076B4A] font-semibold text-sm">
                      <Check className="w-4 h-4" />
                      "{promoCode}" applied — You saved ₹{discount}!
                    </div>
                    <button
                      onClick={() => {
                        removePromoCode();
                        success("Promo code removed");
                      }}
                      className="text-xs text-[#4B5563] hover:text-red-500 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value.toUpperCase());
                          setPromoError("");
                        }}
                        placeholder="Enter code (try ECO10)"
                        className={`
                          flex-1 text-sm px-4 py-3 rounded-xl border bg-white outline-none transition-all
                          ${promoError 
                            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 animate-shake" 
                            : "border-[#E5E7EB] focus:border-[#0A9B6B] focus:ring-2 focus:ring-[#0A9B6B]/20"
                          }
                        `}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="px-5 py-3 bg-[#0A9B6B] hover:bg-[#076B4A] text-white text-sm font-bold rounded-xl transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <p className="mt-2 text-xs text-red-500 font-medium">{promoError}</p>
                    )}
                  </>
                )}
              </div>

              {/* Eco Impact Banner */}
              <div className="bg-gradient-to-r from-[#0A9B6B] to-[#076B4A] rounded-2xl p-5 text-white">
                <p className="font-bold text-sm mb-1">🌱 Your Eco Impact</p>
                <p className="text-xs text-[#D1F5E5] leading-relaxed">
                  This purchase will offset <strong className="text-white">{ecoImpact.co2}kg of CO₂</strong> and 
                  fund the planting of <strong className="text-white">{ecoImpact.trees} tree{ecoImpact.trees !== 1 ? "s" : ""}</strong> through 
                  our green initiative.
                </p>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <OrderSummary />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      {cart.length > 0 && (
        <StickyActionBar
          ecoImpact={ecoImpact}
          backHref="/"
          backLabel="Back to Shop"
          forwardHref="/checkout/address"
          forwardLabel="Proceed to Checkout"
          forwardIcon="arrow"
          onForward={handleProceed}
        />
      )}
    </div>
  );
}
