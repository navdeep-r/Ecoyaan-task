"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem, AddressDetails, CheckoutContextType } from "@/types";
import { calculateSubtotal, calculateGrandTotal } from "@/lib/calculations";

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [addressDetails, setAddressDetails] = useState<AddressDetails | null>(null);
  const [orderTotal, setOrderTotal] = useState<number>(0);

  const calculateTotal = () => {
    const subtotal = calculateSubtotal(cartItems);
    const total = calculateGrandTotal(subtotal, shippingFee, discount);
    setOrderTotal(total);
  };

  useEffect(() => {
    calculateTotal();
  }, [cartItems, shippingFee, discount]);

  const clearCheckout = () => {
    setCartItems([]);
    setShippingFee(0);
    setDiscount(0);
    setAddressDetails(null);
    setOrderTotal(0);
  };

  const value: CheckoutContextType = {
    cartItems,
    shippingFee,
    discount,
    addressDetails,
    orderTotal,
    setCartItems,
    setShippingFee,
    setDiscount,
    setAddressDetails,
    calculateTotal,
    clearCheckout,
  };

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}
