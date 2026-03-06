import CheckoutLayout from "@/components/CheckoutLayout";
import CartScreen from "@/components/CartScreen";
import { CartItem as CartItemType } from "@/types";

// This simulates a server-side fetch without relying on an absolute URL
async function getCartData() {
  // Simulate DB / API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  return {
    cartItems: [
      {
        product_id: 101,
        product_name: "Bamboo Toothbrush (Pack of 4)",
        product_price: 299,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500&q=80",
      },
      {
        product_id: 102,
        product_name: "Reusable Cotton Produce Bags",
        product_price: 450,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1610993302487-6e06b7264789?w=500&q=80",
      },
    ] as CartItemType[],
    shipping_fee: 50,
    discount_applied: 0,
  };
}

export default async function CartPage() {
  const data = await getCartData(); // SSR DATA FETCHING

  return (
    <CheckoutLayout>
      <CartScreen 
        initialCartItems={data.cartItems}
        initialShippingFee={data.shipping_fee}
        initialDiscount={data.discount_applied}
      />
    </CheckoutLayout>
  );
}
