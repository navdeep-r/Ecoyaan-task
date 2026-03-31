// Cart item stored in localStorage
export interface CartItem {
  productId: number;
  quantity: number;
}

// Address with full details
export interface Address {
  id: string;
  label: "Home" | "Work" | "Other";
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
}

// Order stored after successful checkout
export interface Order {
  id: string;
  items: CartItem[];
  addressId: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  promoCode: string | null;
  createdAt: string;
}

// Checkout step tracking
export type CheckoutStep = "shop" | "cart" | "address" | "payment" | "success";

// Checkout state in context
export interface CheckoutState {
  cart: CartItem[];
  addresses: Address[];
  activeAddressIndex: number | null;
  currentStep: CheckoutStep;
  promoCode: string | null;
  discount: number;
  lastOrder: Order | null;
}

// Toast notification types
export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Checkout context type
export interface CheckoutContextType extends CheckoutState {
  // Cart actions
  addToCart: (productId: number, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => { subtotal: number; shipping: number; discount: number; total: number };
  getCartItemCount: () => number;
  
  // Address actions
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setActiveAddress: (index: number) => void;
  getActiveAddress: () => Address | null;
  
  // Promo actions
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  
  // Navigation actions
  setStep: (step: CheckoutStep) => void;
  
  // Order actions
  placeOrder: () => Order;
  clearCheckout: () => void;
  
  // Eco impact calculation
  getEcoImpact: (total: number) => { trees: number; co2: number };
}
