"use client";

import React, { useState, useEffect } from "react";
import CheckoutLayout from "@/components/CheckoutLayout";
import OrderSummary from "@/components/OrderSummary";
import { useCheckout } from "@/context/CheckoutContext";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, CreditCard, Smartphone, Building2, ChevronRight, Lock, CheckCircle2 } from "lucide-react";

const paymentMethods = [
  { id: "card", icon: <CreditCard className="w-5 h-5" />, label: "Credit / Debit Card", sub: "Visa, Mastercard, Rupay" },
  { id: "upi", icon: <Smartphone className="w-5 h-5" />, label: "UPI", sub: "GPay, PhonePe, Paytm" },
  { id: "netbank", icon: <Building2 className="w-5 h-5" />, label: "Net Banking", sub: "All major banks" },
];

export default function PaymentPage() {
  const { addressDetails, orderTotal, cartItems } = useCheckout();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("card");
  const router = useRouter();

  useEffect(() => {
    if (cartItems.length === 0 || !addressDetails) {
      router.push("/checkout");
    }
  }, [cartItems, addressDetails, router]);

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1800));
    router.push("/checkout/success");
  };

  if (!addressDetails) return null;

  return (
    <CheckoutLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left column */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-500" />
            Payment Options
          </h2>

          {/* Payment method selector */}
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${selectedMethod === method.id
                    ? "border-emerald-500 bg-emerald-50/50 shadow-sm"
                    : "border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-white"
                  }`}
              >
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${selectedMethod === method.id ? "bg-emerald-500 text-white" : "bg-white text-gray-400 border border-gray-100"}`}>
                  {method.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{method.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{method.sub}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selectedMethod === method.id ? "border-emerald-500 bg-emerald-500" : "border-gray-200"}`}>
                  {selectedMethod === method.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
              </button>
            ))}
          </div>

          {/* Shipping address recap */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Delivering To</h3>
              <button
                onClick={() => router.push("/checkout/address")}
                className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-0.5"
              >
                Edit <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <p className="font-semibold text-gray-900">{addressDetails.fullName}</p>
            <p className="text-sm text-gray-500 mt-1">{addressDetails.email} · {addressDetails.phone}</p>
            <p className="text-sm text-gray-500 mt-0.5">{addressDetails.city}, {addressDetails.state} — {addressDetails.pinCode}</p>
          </div>

          {/* Security guarantee */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Lock className="w-4 h-4" />, label: "256-bit SSL", sub: "Bank-grade secure" },
              { icon: <CheckCircle2 className="w-4 h-4" />, label: "PCI DSS", sub: "Certified payment" },
            ].map((item) => (
              <div key={item.label} className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100 flex items-center gap-3">
                <div className="text-emerald-600 bg-emerald-100 p-2 rounded-lg flex-shrink-0">{item.icon}</div>
                <div>
                  <p className="text-xs font-bold text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pay button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 focus:ring-4 focus:ring-emerald-200 focus:outline-none flex justify-center items-center gap-3 text-lg ${isProcessing
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-200 hover:-translate-y-0.5"
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing payment...
              </>
            ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Pay Securely ₹{orderTotal}
                </>
            )}
          </button>
          <p className="text-center text-xs text-gray-400">By clicking Pay, you agree to our <span className="text-emerald-600 font-semibold cursor-pointer">Terms</span> and <span className="text-emerald-600 font-semibold cursor-pointer">Privacy Policy</span></p>
        </div>

        {/* Right column */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <OrderSummary />
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
}
