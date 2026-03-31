"use client";

import React, { useState } from "react";
import { Product, BADGE_COLORS } from "@/lib/products";
import { useCheckout } from "@/context/CheckoutContext";
import { useToast } from "@/context/ToastContext";
import { Star, ShoppingCart, Check, Bell } from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCheckout();
  const { success } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    if (!product.inStock) return;
    
    setIsAdding(true);
    
    // Simulate brief delay for UX feedback
    setTimeout(() => {
      addToCart(product.id, 1);
      setIsAdding(false);
      setJustAdded(true);
      success(`🛍️ ${product.name} added to cart!`, {
        label: "View Cart →",
        onClick: () => {
          window.location.href = "/checkout";
        },
      });
      
      // Reset button after 2s
      setTimeout(() => setJustAdded(false), 2000);
    }, 300);
  };

  const badgeStyle = product.badgeColor && BADGE_COLORS[product.badgeColor];
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div
      className={`
        group relative bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden
        transition-all duration-300 flex flex-col
        ${product.inStock 
          ? "card-hover cursor-pointer" 
          : "opacity-70 cursor-not-allowed"
        }
      `}
    >
      {/* Badge */}
      {product.badge && badgeStyle && (
        <div className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-xs font-bold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
          {product.badge}
        </div>
      )}

      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200">
          -{discount}%
        </div>
      )}

      {/* Out of Stock Overlay */}
      {!product.inStock && (
        <div className="absolute inset-0 bg-white/60 z-20 flex items-center justify-center">
          <span className="bg-[#111827] text-white px-4 py-2 rounded-full text-sm font-bold">
            Out of Stock
          </span>
        </div>
      )}

      {/* Emoji Display */}
      <div className="p-6 pb-0">
        <div className="w-full aspect-square bg-gradient-to-br from-[#F0FAF5] to-[#D1F5E5] rounded-xl flex items-center justify-center text-6xl md:text-7xl group-hover:scale-105 transition-transform duration-300">
          {product.emoji}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-0.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-[#111827]">{product.rating}</span>
          </div>
          <span className="text-xs text-[#9CA3AF]">({product.reviews} reviews)</span>
        </div>

        {/* Name */}
        <h3 className="font-display font-bold text-[#111827] text-base leading-snug mb-2 group-hover:text-[#0A9B6B] transition-colors">
          {product.name}
        </h3>

        {/* Eco Tag */}
        <div className="mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#D1F5E5] text-[#076B4A] border border-[#0A9B6B]/20">
            🌿 {product.tag}
          </span>
        </div>

        {/* Description - Hidden on mobile, shown on larger cards */}
        <p className="hidden sm:block text-xs text-[#4B5563] mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Eco Impact */}
        <p className="text-xs text-[#0A9B6B] font-medium mb-4 flex items-center gap-1">
          <span>🌍</span> {product.ecoImpact}
        </p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB]">
          <div>
            <span className="text-xl font-display font-bold text-[#111827]">
              ₹{product.price}
            </span>
            <span className="ml-2 text-sm text-[#9CA3AF] line-through">
              ₹{product.originalPrice}
            </span>
          </div>

          {product.inStock ? (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`
                flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold
                transition-all duration-200
                ${justAdded
                  ? "bg-[#D1F5E5] text-[#076B4A]"
                  : "bg-[#0A9B6B] hover:bg-[#076B4A] text-white hover:-translate-y-0.5"
                }
                ${isAdding ? "opacity-70 cursor-wait" : ""}
              `}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  Added
                </>
              ) : isAdding ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Add
                </>
              )}
            </button>
          ) : (
            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-[#F0FAF5] text-[#4B5563] border border-[#E5E7EB]">
              <Bell className="w-4 h-4" />
              Notify
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
