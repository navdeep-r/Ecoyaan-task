"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import { Product } from "@/lib/products";

export default function CartToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [lastProduct, setLastProduct] = useState<Product | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // We only care about explicit local added actions for the toast popup
    const handleCartUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{ product: Product }>;
      const product = customEvent.detail?.product;
      
      if (!product) return;

      setLastProduct(product);

      // Re-read cart to calculate exact real-time total to display
      try {
        const cartStr = localStorage.getItem("ecoyaan_cart");
        if (cartStr) {
          const cart = JSON.parse(cartStr);
          const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
          setCartCount(count);

          // We don't have all product info in localStorage (only productId and quantity), 
          // but we want to show cart total. We could import getProductById but since this
          // runs on client, we can fetch the local products list directly, or pass total.
          // For simplicity and avoiding massive imports here if we don't have to, let's just 
          // use the prompt instruction: "🛒 Cart — X items · ₹XXXX"
        }
      } catch (err) {
        console.error("CartToast parse error", err);
      }

      setIsVisible(true);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 4000);
    };

    window.addEventListener("cart_updated", handleCartUpdated);

    return () => {
      window.removeEventListener("cart_updated", handleCartUpdated);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // We need to fetch total price correctly. Let's do it right inside the effect or outside.
  // We'll import `getProductById` locally inside the hook to keep it clean.
  useEffect(() => {
    if (!isVisible) return;
    const calculateTotal = async () => {
       const { getProductById } = await import("@/lib/products");
       try {
         const cartStr = localStorage.getItem("ecoyaan_cart");
         if (cartStr) {
           const cart = JSON.parse(cartStr);
           const total = cart.reduce((sum: number, item: any) => {
             const p = getProductById(item.productId);
             return sum + (p?.price || 0) * item.quantity;
           }, 0);
           setCartTotal(total);
         }
       } catch (e) {}
    };
    calculateTotal();
  }, [isVisible, lastProduct]);

  return (
    <div 
      className={`
        fixed z-50 transition-all duration-300 ease-out flex items-center shadow-2xl rounded-2xl bg-white border border-[#E5E7EB] p-3 gap-4 
        bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-[420px] 
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}
      `}
    >
      {/* Left: Product preview */}
      {lastProduct && (
        <div className="flex bg-[#F0FAF5] rounded-xl w-12 h-12 flex-shrink-0 items-center justify-center text-2xl">
          {lastProduct.emoji}
        </div>
      )}

      {/* Middle: Info */}
      <div className="flex-grow flex flex-col justify-center overflow-hidden">
        <p className="text-sm font-bold text-[#111827] truncate leading-tight">
          {lastProduct?.name}
        </p>
        <p className="text-xs text-[#6B7280] font-medium mt-0.5">
          🛒 Cart — {cartCount} items <span className="mx-1">·</span> ₹{cartTotal.toLocaleString()}
        </p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href="/checkout"
          onClick={() => setIsVisible(false)}
          className="bg-[#0A9B6B] hover:bg-[#076B4A] text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 transition-colors whitespace-nowrap"
        >
          View Cart <ArrowRight className="w-3 h-3" />
        </Link>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1.5 text-[#9CA3AF] hover:text-[#4B5563] hover:bg-[#F3F4F6] rounded-lg transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
