"use client";

import React, { useEffect } from "react";
import { useCheckout } from "@/context/CheckoutContext";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const { addressDetails, orderTotal, cartItems, clearCheckout } = useCheckout();
  const router = useRouter();

  // Redirect if no order exists
  useEffect(() => {
    if (cartItems.length === 0 || !addressDetails) {
      router.push("/");
    }
  }, [cartItems, addressDetails, router]);

  if (!addressDetails) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Order Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase, {addressDetails.fullName.split(" ")[0]}. Your order has been placed successfully.
        </p>

        <div className="bg-gray-50 rounded-xl p-6 text-left mb-8 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Order Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Shipping To</h3>
              <p className="font-medium text-gray-900">{addressDetails.fullName}</p>
              <p className="text-sm text-gray-600 mt-1">{addressDetails.email}</p>
              <p className="text-sm text-gray-600 mt-1">
                {addressDetails.city}, {addressDetails.state} {addressDetails.pinCode}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Payment Summary</h3>
              <p className="text-sm text-gray-600">Total Items: <span className="font-medium text-gray-900">{cartItems.length}</span></p>
              <p className="text-sm text-gray-600 mt-1">Total Amount Paid: <span className="font-medium text-gray-900">₹{orderTotal}</span></p>
              <p className="text-sm text-green-600 mt-1 font-medium">Payment Status: Success</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            clearCheckout();
            router.push("/");
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
