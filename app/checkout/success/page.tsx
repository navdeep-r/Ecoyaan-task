"use client";

import React, { useEffect } from "react";
import { useCheckout } from "@/context/CheckoutContext";
import { useRouter } from "next/navigation";
import { CheckCircle2, Leaf, MapPin, Package, ArrowLeft, Star } from "lucide-react";

export default function SuccessPage() {
  const { addressDetails, orderTotal, cartItems, calculateTotal, clearCheckout } = useCheckout();
  const router = useRouter();

  useEffect(() => {
    if (cartItems.length === 0 || !addressDetails) {
      router.push("/");
    }
  }, [cartItems, addressDetails, router]);

  if (!addressDetails) return null;

  const orderId = `ECO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #f8fafc 50%, #eff6ff 100%)" }}>
      <div className="w-full max-w-2xl animate-fade-in-up">

        {/* Success card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

          {/* Hero section */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-8 py-10 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, white 1px, transparent 1px), radial-gradient(circle at 70% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-black tracking-tight mb-2">Order Placed! 🎉</h1>
              <p className="text-emerald-100 font-medium">Hey {addressDetails.fullName.split(" ")[0]}, your order is confirmed.</p>
              <div className="mt-4 inline-block bg-white/20 backdrop-blur rounded-xl px-4 py-2 text-sm font-bold tracking-wide">
                Order ID: {orderId}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-7 space-y-5">

            {/* Eco impact */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100 flex items-start gap-4">
              <div className="bg-emerald-500 rounded-xl p-2.5 flex-shrink-0">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-emerald-800 text-sm">Your Eco Impact 🌍</p>
                <p className="text-xs text-emerald-600 mt-1 leading-relaxed">
                  This purchase offsets <strong>2.4 kg of CO₂</strong> and plants <strong>3 trees</strong> through the Ecoyaan Green Initiative.
                </p>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Delivering To</h3>
                </div>
                <p className="font-bold text-gray-900">{addressDetails.fullName}</p>
                <p className="text-sm text-gray-500 mt-1">{addressDetails.email}</p>
                <p className="text-sm text-gray-500 mt-0.5">{addressDetails.city}, {addressDetails.state} {addressDetails.pinCode}</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Summary</h3>
                </div>
                <p className="text-sm text-gray-600">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</p>
                <p className="text-2xl font-black text-gray-900 mt-1">₹{orderTotal}</p>
                <p className="text-xs font-bold text-emerald-600 mt-1.5">✅ Payment Successful</p>
              </div>
            </div>

            {/* Estimated delivery */}
            <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4">
              <div>
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Estimated Delivery</p>
                <p className="font-bold text-blue-900 mt-0.5">3–5 Business Days</p>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => { clearCheckout(); router.push("/"); }}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md shadow-emerald-200 hover:-translate-y-0.5 transition-all duration-300 focus:ring-4 focus:ring-emerald-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
              <button
                className="flex-1 text-gray-600 font-semibold py-3.5 px-6 rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                Track Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
