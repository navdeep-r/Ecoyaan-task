"use client";

import React, { useEffect, useState } from "react";
import { useCheckout } from "@/context/CheckoutContext";
import { CartItem as CartItemType } from "@/types";
import CartItem from "@/components/CartItem";
import OrderSummary from "@/components/OrderSummary";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  useEffect(() => {
    setCartItems(initialCartItems);
    setShippingFee(initialShippingFee);
    setDiscount(initialDiscount);
    setIsInitialized(true);
  }, [initialCartItems, initialShippingFee, initialDiscount, setCartItems, setShippingFee, setDiscount]);

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-2">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Shopping Cart</h2>
        {initialCartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="bg-white rounded-xl">
            {initialCartItems.map((item) => (
              <CartItem key={item.product_id} item={item} />
            ))}
          </div>
        )}
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <OrderSummary />
          <div className="mt-6">
            <button
              onClick={() => router.push("/checkout/address")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex justify-center items-center gap-2"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
