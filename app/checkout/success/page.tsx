"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCheckout } from "@/context/CheckoutContext";
import { getProductById } from "@/lib/products";
import { 
  CheckCircle2, 
  Leaf, 
  MapPin, 
  Package, 
  ArrowLeft, 
  Star,
  Truck,
  ExternalLink
} from "lucide-react";

// Confetti particle component
function ConfettiParticle({ delay, color, left }: { delay: number; color: string; left: number }) {
  return (
    <div
      className="absolute w-2 h-2 rounded-full"
      style={{
        backgroundColor: color,
        left: `${left}%`,
        top: "-10px",
        animation: `confetti-fall 3s ease-out ${delay}s forwards`,
      }}
    />
  );
}

// Confetti colors
const confettiColors = ["#0A9B6B", "#D1F5E5", "#FFD700", "#FF6B6B", "#4ECDC4", "#A78BFA"];

export default function SuccessPage() {
  const router = useRouter();
  const { 
    lastOrder, 
    addresses, 
    activeAddressIndex, 
    cart,
    getEcoImpact,
    clearCheckout 
  } = useCheckout();
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  // Get order details
  const order = lastOrder;
  const activeAddress = activeAddressIndex !== null && activeAddressIndex < addresses.length 
    ? addresses[activeAddressIndex] 
    : null;

  // Generate confetti particles
  const confettiParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.5,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    left: Math.random() * 100,
  }));

  // Hide confetti after animation
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Redirect if no order
  useEffect(() => {
    if (!order && cart.length === 0) {
      // Give a moment for the order to be loaded from localStorage
      const timer = setTimeout(() => {
        if (!lastOrder) {
          router.push("/");
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [order, cart, lastOrder, router]);

  const handleBackToHome = () => {
    clearCheckout();
    router.push("/");
  };

  // Calculate eco impact
  const ecoImpact = order ? getEcoImpact(order.total) : { trees: 0, co2: 0 };

  // Get cart items for display
  const orderItems = order?.items || cart;
  const itemCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const orderTotal = order?.total || 0;
  const orderId = order?.id || `ECO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  if (!activeAddress && !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0FAF5]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#D1F5E5] border-t-[#0A9B6B]"></div>
          <p className="text-sm text-[#4B5563] font-medium">Loading your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F0FAF5] relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {confettiParticles.map((particle) => (
            <ConfettiParticle key={particle.id} {...particle} />
          ))}
        </div>
      )}

      {/* CSS for confetti animation */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes check-draw {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        .animate-check {
          stroke-dasharray: 100;
          animation: check-draw 0.6s ease-out 0.3s forwards;
        }
      `}</style>

      <div className="w-full max-w-2xl animate-fade-in-up">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-[#E5E7EB] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#0A9B6B] to-[#076B4A] px-8 py-10 text-center text-white relative overflow-hidden">
            {/* Pattern overlay */}
            <div 
              className="absolute inset-0 opacity-10" 
              style={{ 
                backgroundImage: "radial-gradient(circle at 30% 50%, white 1px, transparent 1px), radial-gradient(circle at 70% 20%, white 1px, transparent 1px)", 
                backgroundSize: "40px 40px" 
              }}
            />
            
            <div className="relative z-10">
              {/* Animated checkmark */}
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" opacity="0.3" />
                  <path 
                    d="M8 12l3 3 5-6" 
                    stroke="white" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="animate-check"
                    style={{ strokeDashoffset: 100 }}
                  />
                </svg>
              </div>
              
              <h1 className="font-display text-3xl font-bold tracking-tight mb-2">
                Order Placed! 🎉
              </h1>
              <p className="text-[#D1F5E5] font-medium">
                Hey {activeAddress?.fullName?.split(" ")[0] || "there"}, your order is confirmed.
              </p>
              
              {/* Order ID */}
              <div className="mt-4 inline-block bg-white/20 backdrop-blur rounded-xl px-4 py-2 text-sm font-bold tracking-wide">
                Order ID: {orderId}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-7 space-y-5">
            {/* Eco Impact */}
            <div className="bg-gradient-to-r from-[#F0FAF5] to-[#D1F5E5] rounded-2xl p-5 border border-[#0A9B6B]/20 flex items-start gap-4">
              <div className="bg-[#0A9B6B] rounded-xl p-3 flex-shrink-0">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-[#076B4A] text-sm">Your Eco Impact 🌍</p>
                <p className="text-xs text-[#4B5563] mt-1 leading-relaxed">
                  This purchase offsets <strong className="text-[#0A9B6B]">{ecoImpact.co2}kg of CO₂</strong> and 
                  plants <strong className="text-[#0A9B6B]">{ecoImpact.trees} tree{ecoImpact.trees !== 1 ? "s" : ""}</strong> through 
                  the Ecoyaan Green Initiative.
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Delivery Address */}
              {activeAddress && (
                <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-[#E5E7EB]">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-[#0A9B6B]" />
                    <h3 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide">
                      Delivering To
                    </h3>
                  </div>
                  <p className="font-semibold text-[#111827]">{activeAddress.fullName}</p>
                  <p className="text-sm text-[#4B5563] mt-1">
                    {activeAddress.city}, {activeAddress.state}
                  </p>
                  <p className="text-sm text-[#4B5563]">{activeAddress.pinCode}</p>
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-[#E5E7EB]">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-[#0A9B6B]" />
                  <h3 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide">
                    Order Summary
                  </h3>
                </div>
                <p className="text-sm text-[#4B5563]">
                  {itemCount} item{itemCount !== 1 ? "s" : ""}
                </p>
                <p className="font-display text-2xl font-bold text-[#111827] mt-1">
                  ₹{orderTotal}
                </p>
                <p className="text-xs font-bold text-[#0A9B6B] mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Payment Successful
                </p>
              </div>
            </div>

            {/* Order Items Preview */}
            {orderItems.length > 0 && (
              <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#E5E7EB]">
                <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-3">
                  Items Ordered
                </p>
                <div className="flex flex-wrap gap-2">
                  {orderItems.map((item) => {
                    const product = getProductById(item.productId);
                    if (!product) return null;
                    return (
                      <div 
                        key={item.productId}
                        className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-[#E5E7EB]"
                      >
                        <span className="text-xl">{product.emoji}</span>
                        <span className="text-xs font-medium text-[#4B5563]">
                          {product.name.split(" ").slice(0, 2).join(" ")} ×{item.quantity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Estimated Delivery */}
            <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-wide">
                    Estimated Delivery
                  </p>
                  <p className="font-bold text-blue-900 mt-0.5">3–5 Business Days</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleBackToHome}
                className="flex-1 flex items-center justify-center gap-2 bg-[#0A9B6B] hover:bg-[#076B4A] text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-[#0A9B6B]/20 hover:-translate-y-0.5 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
              <button
                onClick={() => setShowTrackModal(true)}
                className="flex-1 flex items-center justify-center gap-2 text-[#4B5563] font-semibold py-3.5 px-6 rounded-2xl border-2 border-[#E5E7EB] hover:border-[#0A9B6B] hover:text-[#0A9B6B] transition-all duration-200"
              >
                Track Order
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <p className="text-center text-xs text-[#9CA3AF] mt-6">
          Thank you for choosing sustainable products. Together, we're making a difference! 🌱
        </p>
      </div>

      {/* Track Order Modal */}
      {showTrackModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowTrackModal(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-sm w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-[#F0FAF5] rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-[#0A9B6B]" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#111827] mb-2">
                Order Tracking
              </h3>
              <p className="text-sm text-[#4B5563] mb-4">
                Your order <strong>{orderId}</strong> has been confirmed and will be shipped soon.
              </p>
              <p className="text-xs text-[#9CA3AF] mb-6">
                You'll receive an email with tracking details once your package is on its way.
              </p>
              <button
                onClick={() => setShowTrackModal(false)}
                className="w-full py-3 bg-[#0A9B6B] hover:bg-[#076B4A] text-white font-bold rounded-xl transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
