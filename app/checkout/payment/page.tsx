"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";
import { useToast } from "@/context/ToastContext";
import Navbar from "@/components/Navbar";
import StepIndicator from "@/components/StepIndicator";
import OrderSummary from "@/components/OrderSummary";
import StickyActionBar from "@/components/StickyActionBar";
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  ChevronRight, 
  Lock, 
  CheckCircle2,
  MapPin,
  Shield
} from "lucide-react";

type PaymentMethod = "card" | "upi" | "netbanking";

const paymentMethods = [
  { 
    id: "card" as PaymentMethod, 
    icon: CreditCard, 
    label: "Credit / Debit Card", 
    sub: "Visa, Mastercard, Rupay" 
  },
  { 
    id: "upi" as PaymentMethod, 
    icon: Smartphone, 
    label: "UPI", 
    sub: "GPay, PhonePe, Paytm" 
  },
  { 
    id: "netbanking" as PaymentMethod, 
    icon: Building2, 
    label: "Net Banking", 
    sub: "All major banks" 
  },
];

const banks = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
];

export default function PaymentPage() {
  const router = useRouter();
  const { 
    cart, 
    getActiveAddress, 
    getCartTotal, 
    placeOrder, 
    setStep 
  } = useCheckout();
  const { success, error } = useToast();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("card");
  const [isProcessing, setIsProcessing] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // UPI state
  const [upiId, setUpiId] = useState("");

  // Net Banking state
  const [selectedBank, setSelectedBank] = useState("");

  const activeAddress = getActiveAddress();
  const { total } = getCartTotal();

  // Redirect if cart is empty or no address
  useEffect(() => {
    if (cart.length === 0) {
      router.push("/checkout");
    } else if (!activeAddress) {
      router.push("/checkout/address");
    }
  }, [cart, activeAddress, router]);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16);
    const parts = cleaned.match(/.{1,4}/g);
    return parts ? parts.join(" ") : cleaned;
  };

  // Format expiry as MM/YY
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    return cleaned;
  };

  // Detect card type
  const getCardType = () => {
    const number = cardNumber.replace(/\s/g, "");
    if (number.startsWith("4")) return "Visa";
    if (number.startsWith("5") || number.startsWith("2")) return "Mastercard";
    if (number.startsWith("6")) return "Rupay";
    return null;
  };

  const handlePayment = async () => {
    // Validate based on payment method
    if (selectedMethod === "card") {
      if (cardNumber.replace(/\s/g, "").length < 16) {
        error("Please enter a valid card number");
        return;
      }
      if (cardExpiry.length < 5) {
        error("Please enter a valid expiry date");
        return;
      }
      if (cardCvv.length < 3) {
        error("Please enter a valid CVV");
        return;
      }
      if (!cardName.trim()) {
        error("Please enter cardholder name");
        return;
      }
    } else if (selectedMethod === "upi") {
      if (!upiId.includes("@")) {
        error("Please enter a valid UPI ID");
        return;
      }
    } else if (selectedMethod === "netbanking") {
      if (!selectedBank) {
        error("Please select a bank");
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Place order
    const order = placeOrder();
    success("Payment successful! 🎉");
    
    // Navigate to success
    router.push("/checkout/success");
  };

  if (!activeAddress) return null;

  return (
    <div className="min-h-screen bg-[#F0FAF5] pb-32">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#111827]">
            Payment
          </h1>
          <p className="text-[#4B5563] mt-1 text-sm">
            Choose your payment method
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep="payment" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Payment Options */}
          <div className="lg:col-span-7 space-y-6">
            {/* Payment Method Selector */}
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;

                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`
                      w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left
                      ${isSelected
                        ? "border-[#0A9B6B] bg-[#F0FAF5] shadow-sm"
                        : "border-[#E5E7EB] bg-white hover:border-[#9CA3AF]"
                      }
                    `}
                  >
                    <div className={`
                      p-3 rounded-xl flex-shrink-0 transition-colors
                      ${isSelected
                        ? "bg-[#0A9B6B] text-white"
                        : "bg-[#F0FAF5] text-[#4B5563]"
                      }
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#111827]">{method.label}</p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">{method.sub}</p>
                    </div>
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${isSelected ? "border-[#0A9B6B] bg-[#0A9B6B]" : "border-[#E5E7EB]"}
                    `}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
              {/* Card Form */}
              {selectedMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#111827] uppercase tracking-wide mb-1.5">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 pr-16 text-sm rounded-xl border border-[#E5E7EB] focus:border-[#0A9B6B] focus:ring-2 focus:ring-[#0A9B6B]/20 outline-none transition-all"
                      />
                      {getCardType() && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#4B5563] bg-[#F0FAF5] px-2 py-1 rounded">
                          {getCardType()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#111827] uppercase tracking-wide mb-1.5">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 text-sm rounded-xl border border-[#E5E7EB] focus:border-[#0A9B6B] focus:ring-2 focus:ring-[#0A9B6B]/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#111827] uppercase tracking-wide mb-1.5">
                        CVV
                      </label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="•••"
                        className="w-full px-4 py-3 text-sm rounded-xl border border-[#E5E7EB] focus:border-[#0A9B6B] focus:ring-2 focus:ring-[#0A9B6B]/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111827] uppercase tracking-wide mb-1.5">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 text-sm rounded-xl border border-[#E5E7EB] focus:border-[#0A9B6B] focus:ring-2 focus:ring-[#0A9B6B]/20 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* UPI Form */}
              {selectedMethod === "upi" && (
                <div>
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wide mb-1.5">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-[#E5E7EB] focus:border-[#0A9B6B] focus:ring-2 focus:ring-[#0A9B6B]/20 outline-none transition-all"
                  />
                  <p className="mt-2 text-xs text-[#9CA3AF]">
                    Enter your UPI ID linked to GPay, PhonePe, or any UPI app
                  </p>
                </div>
              )}

              {/* Net Banking Form */}
              {selectedMethod === "netbanking" && (
                <div>
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wide mb-1.5">
                    Select Bank
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-[#E5E7EB] focus:border-[#0A9B6B] focus:ring-2 focus:ring-[#0A9B6B]/20 outline-none transition-all bg-white"
                  >
                    <option value="">Select your bank</option>
                    {banks.map((bank) => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Delivery Address */}
            <div className="bg-[#F0FAF5] rounded-2xl p-5 border border-[#D1F5E5]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0A9B6B]" />
                  <h3 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide">
                    Delivering To
                  </h3>
                </div>
                <button
                  onClick={() => router.push("/checkout/address")}
                  className="text-xs text-[#0A9B6B] font-semibold hover:underline flex items-center gap-0.5"
                >
                  Edit <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <p className="font-semibold text-[#111827]">{activeAddress.fullName}</p>
              <p className="text-sm text-[#4B5563] mt-1">
                {activeAddress.addressLine1}
                {activeAddress.addressLine2 && `, ${activeAddress.addressLine2}`}
              </p>
              <p className="text-sm text-[#4B5563]">
                {activeAddress.city}, {activeAddress.state} - {activeAddress.pinCode}
              </p>
              <p className="text-sm text-[#4B5563] mt-1">
                {activeAddress.phone} · {activeAddress.email}
              </p>
            </div>

            {/* Security Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#F0FAF5] text-[#0A9B6B]">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#111827]">256-bit SSL</p>
                  <p className="text-xs text-[#9CA3AF]">Bank-grade secure</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#F0FAF5] text-[#0A9B6B]">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#111827]">PCI DSS</p>
                  <p className="text-xs text-[#9CA3AF]">Certified payment</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <StickyActionBar
        securityText="Secured by 256-bit SSL"
        backHref="/checkout/address"
        backLabel="Back"
        forwardLabel="Pay Securely"
        forwardIcon="lock"
        total={total}
        forwardLoading={isProcessing}
        onForward={handlePayment}
      />
    </div>
  );
}
