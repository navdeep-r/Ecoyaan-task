import React, { ReactNode } from "react";
import StepIndicator from "./StepIndicator";
import { ShieldCheck, Leaf, Truck, Award } from "lucide-react";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #f8fafc 50%, #eff6ff 100%)" }}>

      {/* Top Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-extrabold text-gray-900 tracking-tight">Ecoyaan</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            SSL Secured Checkout
          </div>
          <div className="text-xs text-gray-400 font-medium">Need help? <span className="text-emerald-600 font-semibold cursor-pointer hover:underline">Chat with us</span></div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Complete Your Order<span className="text-emerald-500">.</span>
            </h1>
            <p className="text-gray-500 mt-2 text-sm">Every purchase plants a tree 🌱</p>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 mb-8 animate-fade-in-up">
            {[
              { icon: <ShieldCheck className="w-4 h-4" />, label: "100% Secure" },
              { icon: <Truck className="w-4 h-4" />, label: "Free Shipping ₹500+" },
              { icon: <Award className="w-4 h-4" />, label: "Eco Certified" },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center justify-center gap-1.5 bg-white/70 border border-gray-100 rounded-xl py-2.5 px-3 shadow-sm text-xs font-semibold text-gray-600">
                <span className="text-emerald-500">{badge.icon}</span>
                <span className="hidden sm:inline">{badge.label}</span>
              </div>
            ))}
          </div>

          {/* Step Indicator */}
          <div className="animate-fade-in-up">
            <StepIndicator />
          </div>

          {/* Page Card */}
          <main className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white ring-1 ring-black/5 p-6 sm:p-10 animate-fade-in-up">
            {children}
          </main>

          {/* Footer Badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-400 font-medium animate-fade-in">
            <span className="flex items-center gap-1">🔒 256-bit SSL Encryption</span>
            <span className="flex items-center gap-1">✅ PCI DSS Compliant</span>
            <span className="flex items-center gap-1">🌿 Carbon Neutral Shipping</span>
            <span className="flex items-center gap-1">🔄 30-Day Easy Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
}
