"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { 
  CartItem, 
  Address, 
  Order, 
  CheckoutStep, 
  CheckoutState, 
  CheckoutContextType 
} from "@/types";
import { 
  STORAGE_KEYS, 
  save, 
  load, 
  generateId, 
  calculateEcoImpact, 
  calculateShipping, 
  calculateDiscount, 
  isValidPromoCode 
} from "@/lib/storage";
import { getProductById } from "@/lib/products";

const initialState: CheckoutState = {
  cart: [],
  addresses: [],
  activeAddressIndex: null,
  currentStep: "shop",
  promoCode: null,
  discount: 0,
  lastOrder: null,
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CheckoutState>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const cart = load<CartItem[]>(STORAGE_KEYS.CART, []);
    const addresses = load<Address[]>(STORAGE_KEYS.ADDRESSES, []);
    const activeAddressIndex = load<number | null>(STORAGE_KEYS.ACTIVE_ADDR, null);
    const currentStep = load<CheckoutStep>(STORAGE_KEYS.STEP, "shop");
    const promoCode = load<string | null>(STORAGE_KEYS.PROMO, null);
    const lastOrder = load<Order | null>(STORAGE_KEYS.ORDER, null);

    // Calculate discount based on loaded promo code
    const subtotal = cart.reduce((sum, item) => {
      const product = getProductById(item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);
    const discount = calculateDiscount(subtotal, promoCode);

    setState({
      cart,
      addresses,
      activeAddressIndex,
      currentStep,
      promoCode,
      discount,
      lastOrder,
    });
    setIsHydrated(true);
  }, []);

  // Persist cart to localStorage
  useEffect(() => {
    if (isHydrated) {
      save(STORAGE_KEYS.CART, state.cart);
    }
  }, [state.cart, isHydrated]);

  // Persist addresses to localStorage
  useEffect(() => {
    if (isHydrated) {
      save(STORAGE_KEYS.ADDRESSES, state.addresses);
    }
  }, [state.addresses, isHydrated]);

  // Persist active address index
  useEffect(() => {
    if (isHydrated) {
      save(STORAGE_KEYS.ACTIVE_ADDR, state.activeAddressIndex);
    }
  }, [state.activeAddressIndex, isHydrated]);

  // Persist current step
  useEffect(() => {
    if (isHydrated) {
      save(STORAGE_KEYS.STEP, state.currentStep);
    }
  }, [state.currentStep, isHydrated]);

  // Persist promo code
  useEffect(() => {
    if (isHydrated) {
      save(STORAGE_KEYS.PROMO, state.promoCode);
    }
  }, [state.promoCode, isHydrated]);

  // === CART ACTIONS ===

  const addToCart = useCallback((productId: number, quantity: number = 1) => {
    setState((prev) => {
      const existingIndex = prev.cart.findIndex((item) => item.productId === productId);
      let newCart: CartItem[];

      if (existingIndex >= 0) {
        newCart = prev.cart.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...prev.cart, { productId, quantity }];
      }

      // Recalculate discount with new cart
      const subtotal = newCart.reduce((sum, item) => {
        const product = getProductById(item.productId);
        return sum + (product?.price || 0) * item.quantity;
      }, 0);
      const discount = calculateDiscount(subtotal, prev.promoCode);

      return { ...prev, cart: newCart, discount };
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setState((prev) => {
      const newCart = prev.cart.filter((item) => item.productId !== productId);
      const subtotal = newCart.reduce((sum, item) => {
        const product = getProductById(item.productId);
        return sum + (product?.price || 0) * item.quantity;
      }, 0);
      const discount = calculateDiscount(subtotal, prev.promoCode);
      return { ...prev, cart: newCart, discount };
    });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setState((prev) => {
      const newCart = prev.cart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      const subtotal = newCart.reduce((sum, item) => {
        const product = getProductById(item.productId);
        return sum + (product?.price || 0) * item.quantity;
      }, 0);
      const discount = calculateDiscount(subtotal, prev.promoCode);
      return { ...prev, cart: newCart, discount };
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setState((prev) => ({ ...prev, cart: [], discount: 0, promoCode: null }));
  }, []);

  const getCartTotal = useCallback(() => {
    const subtotal = state.cart.reduce((sum, item) => {
      const product = getProductById(item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);
    const shipping = calculateShipping(subtotal);
    const discount = state.discount;
    const total = Math.max(0, subtotal + shipping - discount);
    return { subtotal, shipping, discount, total };
  }, [state.cart, state.discount]);

  const getCartItemCount = useCallback(() => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  }, [state.cart]);

  // === ADDRESS ACTIONS ===

  const addAddress = useCallback((address: Omit<Address, "id">) => {
    const id = generateId("ADDR");
    const newAddress: Address = { ...address, id };
    
    setState((prev) => {
      // If this is the first address or it's marked as default, make it the active one
      const isFirst = prev.addresses.length === 0;
      const newAddresses = address.isDefault
        ? prev.addresses.map((a) => ({ ...a, isDefault: false })).concat(newAddress)
        : [...prev.addresses, newAddress];
      
      const newActiveIndex = address.isDefault || isFirst 
        ? newAddresses.length - 1 
        : prev.activeAddressIndex;
      
      return {
        ...prev,
        addresses: newAddresses,
        activeAddressIndex: newActiveIndex,
      };
    });
  }, []);

  const updateAddress = useCallback((id: string, updates: Partial<Address>) => {
    setState((prev) => {
      let newAddresses = prev.addresses.map((addr) =>
        addr.id === id ? { ...addr, ...updates } : addr
      );

      // If setting as default, unset others
      if (updates.isDefault) {
        newAddresses = newAddresses.map((addr) =>
          addr.id === id ? addr : { ...addr, isDefault: false }
        );
      }

      return { ...prev, addresses: newAddresses };
    });
  }, []);

  const deleteAddress = useCallback((id: string) => {
    setState((prev) => {
      const newAddresses = prev.addresses.filter((addr) => addr.id !== id);
      let newActiveIndex = prev.activeAddressIndex;

      // Adjust active index if needed
      if (prev.activeAddressIndex !== null) {
        const deletedIndex = prev.addresses.findIndex((a) => a.id === id);
        if (deletedIndex === prev.activeAddressIndex) {
          newActiveIndex = newAddresses.length > 0 ? 0 : null;
        } else if (deletedIndex < prev.activeAddressIndex) {
          newActiveIndex = prev.activeAddressIndex - 1;
        }
      }

      return { ...prev, addresses: newAddresses, activeAddressIndex: newActiveIndex };
    });
  }, []);

  const setActiveAddress = useCallback((index: number) => {
    setState((prev) => ({ ...prev, activeAddressIndex: index }));
  }, []);

  const getActiveAddress = useCallback((): Address | null => {
    if (state.activeAddressIndex === null || state.activeAddressIndex >= state.addresses.length) {
      return null;
    }
    return state.addresses[state.activeAddressIndex];
  }, [state.addresses, state.activeAddressIndex]);

  // === PROMO ACTIONS ===

  const applyPromoCode = useCallback((code: string): boolean => {
    if (isValidPromoCode(code)) {
      const subtotal = state.cart.reduce((sum, item) => {
        const product = getProductById(item.productId);
        return sum + (product?.price || 0) * item.quantity;
      }, 0);
      const discount = calculateDiscount(subtotal, code);
      setState((prev) => ({ ...prev, promoCode: code.toUpperCase(), discount }));
      return true;
    }
    return false;
  }, [state.cart]);

  const removePromoCode = useCallback(() => {
    setState((prev) => ({ ...prev, promoCode: null, discount: 0 }));
  }, []);

  // === NAVIGATION ACTIONS ===

  const setStep = useCallback((step: CheckoutStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  // === ORDER ACTIONS ===

  const placeOrder = useCallback((): Order => {
    const { subtotal, shipping, discount, total } = getCartTotal();
    const activeAddress = getActiveAddress();

    const order: Order = {
      id: generateId("ECO"),
      items: [...state.cart],
      addressId: activeAddress?.id || "",
      subtotal,
      shipping,
      discount,
      total,
      promoCode: state.promoCode,
      createdAt: new Date().toISOString(),
    };

    // Save order and update state
    save(STORAGE_KEYS.ORDER, order);
    setState((prev) => ({ ...prev, lastOrder: order, currentStep: "success" }));

    return order;
  }, [state.cart, state.promoCode, getCartTotal, getActiveAddress]);

  const clearCheckout = useCallback(() => {
    // Clear cart and step, but keep addresses!
    setState((prev) => ({
      ...prev,
      cart: [],
      currentStep: "shop",
      promoCode: null,
      discount: 0,
      // Keep: addresses, activeAddressIndex, lastOrder
    }));
  }, []);

  // === ECO IMPACT ===

  const getEcoImpact = useCallback((total: number) => {
    return calculateEcoImpact(total);
  }, []);

  const value: CheckoutContextType = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    addAddress,
    updateAddress,
    deleteAddress,
    setActiveAddress,
    getActiveAddress,
    applyPromoCode,
    removePromoCode,
    setStep,
    placeOrder,
    clearCheckout,
    getEcoImpact,
  };

  // Show loading state until hydrated
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0FAF5]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#D1F5E5] border-t-[#0A9B6B]"></div>
          <p className="text-sm text-[#4B5563] font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}
