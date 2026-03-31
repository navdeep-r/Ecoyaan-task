"use client";

import React from "react";
import { CartItem as CartItemType } from "@/types";
import { getProductById } from "@/lib/products";
import { useCheckout } from "@/context/CheckoutContext";
import { useToast } from "@/context/ToastContext";
import { Minus, Plus, X, Leaf } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
  readonly?: boolean;
}

export default function CartItem({ item, readonly = false }: CartItemProps) {
  const product = getProductById(item.productId);
  const { updateQuantity, removeFromCart, addToCart } = useCheckout();
  const { info } = useToast();

  if (!product) return null;

  const handleRemove = () => {
    const quantity = item.quantity;
    removeFromCart(item.productId);
    info(`${product.name} removed from cart`, {
      label: "Undo",
      onClick: () => {
        addToCart(item.productId, quantity);
      },
    });
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity <= 0) {
      handleRemove();
    } else {
      updateQuantity(item.productId, newQuantity);
    }
  };

  const itemTotal = product.price * item.quantity;

  return (
    <div className="group flex items-center gap-4 p-4 sm:p-5 hover:bg-white/50 transition-all duration-300">
      {/* Product Emoji */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#F0FAF5] to-[#D1F5E5] rounded-xl flex items-center justify-center text-4xl sm:text-5xl flex-shrink-0">
        {product.emoji}
        <div className="absolute -top-1 -left-1 bg-[#0A9B6B] rounded-full p-1">
          <Leaf className="w-3 h-3 text-white" />
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-[#111827] text-sm sm:text-base leading-tight mb-1 line-clamp-2">
          {product.name}
        </h3>
        
        {/* Eco Tag */}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#D1F5E5] text-[#076B4A] mb-2">
          🌿 {product.tag}
        </span>

        {/* Price per unit */}
        <p className="text-xs text-[#9CA3AF]">
          ₹{product.price} each
        </p>

        {/* Quantity Controls - Mobile */}
        {!readonly && (
          <div className="flex items-center gap-2 mt-3 sm:hidden">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="w-8 h-8 rounded-lg bg-[#F0FAF5] hover:bg-[#D1F5E5] flex items-center justify-center transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4 text-[#4B5563]" />
            </button>
            <span className="w-8 text-center font-semibold text-[#111827]">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="w-8 h-8 rounded-lg bg-[#F0FAF5] hover:bg-[#D1F5E5] flex items-center justify-center transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4 text-[#4B5563]" />
            </button>
          </div>
        )}
      </div>

      {/* Desktop: Quantity & Price */}
      <div className="hidden sm:flex items-center gap-6">
        {/* Quantity Controls */}
        {!readonly && (
          <div className="flex items-center gap-1 bg-[#F0FAF5] rounded-xl p-1">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="w-9 h-9 rounded-lg hover:bg-[#D1F5E5] flex items-center justify-center transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4 text-[#4B5563]" />
            </button>
            <span className="w-10 text-center font-bold text-[#111827]">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="w-9 h-9 rounded-lg hover:bg-[#D1F5E5] flex items-center justify-center transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4 text-[#4B5563]" />
            </button>
          </div>
        )}

        {readonly && (
          <span className="text-sm text-[#4B5563] bg-[#F0FAF5] px-3 py-1.5 rounded-lg">
            Qty: {item.quantity}
          </span>
        )}

        {/* Price */}
        <div className="text-right min-w-[80px]">
          <p className="font-display text-xl font-bold text-[#111827]">
            ₹{itemTotal}
          </p>
        </div>
      </div>

      {/* Mobile Price */}
      <div className="sm:hidden text-right">
        <p className="font-display text-lg font-bold text-[#111827]">
          ₹{itemTotal}
        </p>
      </div>

      {/* Remove Button */}
      {!readonly && (
        <button
          onClick={handleRemove}
          className="p-2 rounded-lg text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Remove item"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
