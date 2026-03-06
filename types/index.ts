export interface CartItem {
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  image: string;
}

export interface AddressDetails {
  fullName: string;
  email: string;
  phone: string;
  pinCode: string;
  city: string;
  state: string;
}

export interface CheckoutState {
  cartItems: CartItem[];
  shippingFee: number;
  discount: number;
  addressDetails: AddressDetails | null;
  orderTotal: number;
}

export interface CheckoutContextType extends CheckoutState {
  setCartItems: (items: CartItem[]) => void;
  setShippingFee: (fee: number) => void;
  setDiscount: (discount: number) => void;
  setAddressDetails: (details: AddressDetails) => void;
  calculateTotal: () => void;
  clearCheckout: () => void;
}
