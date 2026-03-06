import { NextResponse } from "next/server";

const mockCartData = {
  cartItems: [
    {
      product_id: 101,
      product_name: "Bamboo Toothbrush (Pack of 4)",
      product_price: 299,
      quantity: 2,
      image: "https://via.placeholder.com/150",
    },
    {
      product_id: 102,
      product_name: "Reusable Cotton Produce Bags",
      product_price: 450,
      quantity: 1,
      image: "https://via.placeholder.com/150",
    },
  ],
  shipping_fee: 50,
  discount_applied: 0,
};

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return NextResponse.json(mockCartData);
}
