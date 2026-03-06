import { CartItem } from "@/types";

export function calculateSubtotal(cartItems: CartItem[]): number {
  return cartItems.reduce((total, item) => total + item.product_price * item.quantity, 0);
}

export function calculateGrandTotal(subtotal: number, shippingFee: number, discount: number): number {
  return subtotal + shippingFee - discount;
}
