import { CartItem } from "@/types";
import { getProductById } from "./products";

export function calculateSubtotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => {
    const product = getProductById(item.productId);
    return total + (product?.price || 0) * item.quantity;
  }, 0);
}

export function calculateShipping(subtotal: number): number {
  return subtotal >= 500 ? 0 : 50;
}

export function calculateDiscount(subtotal: number, promoCode: string | null): number {
  if (promoCode?.toUpperCase() === "ECO10") {
    return Math.round(subtotal * 0.1);
  }
  return 0;
}

export function calculateGrandTotal(
  subtotal: number, 
  shipping: number, 
  discount: number
): number {
  return Math.max(0, subtotal + shipping - discount);
}

export function calculateEcoImpact(total: number): { trees: number; co2: number } {
  // 1 tree per ₹300, 0.8kg CO₂ per ₹100
  const trees = Math.max(1, Math.floor(total / 300));
  const co2 = parseFloat((total * 0.008).toFixed(1));
  return { trees, co2 };
}
