"use client";

import React, { useState, useEffect } from "react";
import CheckoutLayout from "@/components/CheckoutLayout";
import OrderSummary from "@/components/OrderSummary";
import { useCheckout } from "@/context/CheckoutContext";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function PaymentPage() {
  const { addressDetails, orderTotal, cartItems } = useCheckout();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // Redirect if accessed directly without cart/address
  useEffect(() => {
    if (cartItems.length === 0 || !addressDetails) {
      router.push("/checkout");
    }
  }, [cartItems, addressDetails, router]);

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push("/checkout/success");
  };

  if (!addressDetails) return null;

  return (
    <CheckoutLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Options</h2>
          
          <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 mb-6 flex gap-4">
            <ShieldCheck className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900">Secure Payment</h3>
              <p className="text-sm text-gray-600 mt-1">
                Your payment is securely processed. We do not store your credit card details.
              </p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Shipping To</h3>
            <p className="font-medium text-gray-900">{addressDetails.fullName}</p>
            <p className="text-sm text-gray-600 mt-1">{addressDetails.email} • {addressDetails.phone}</p>
            <p className="text-sm text-gray-600 mt-1">
              {addressDetails.city}, {addressDetails.state} {addressDetails.pinCode}
            </p>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full text-white font-medium py-3.5 px-6 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex justify-center items-center gap-2 ${
              isProcessing ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Payment...
              </>
            ) : (
              `Pay Securely ₹${orderTotal}`
            )}
          </button>
        </div>
        
        <div className="lg:pl-8 lg:border-l border-gray-100">
          <OrderSummary />
        </div>
      </div>
    </CheckoutLayout>
  );
}
