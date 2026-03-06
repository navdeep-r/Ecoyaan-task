import { useCheckout } from "@/context/CheckoutContext";
import { calculateSubtotal } from "@/lib/calculations";

export default function OrderSummary() {
  const { cartItems, shippingFee, discount, orderTotal } = useCheckout();
  const subtotal = calculateSubtotal(cartItems);

  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium text-gray-900">₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping Fee</span>
          <span className="font-medium text-gray-900">₹{shippingFee}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount Applied</span>
            <span className="font-medium">-₹{discount}</span>
          </div>
        )}
        
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-gray-900">Grand Total</span>
            <span className="text-xl font-bold text-gray-900">₹{orderTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
