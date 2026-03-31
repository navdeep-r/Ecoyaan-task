"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ShoppingCart, MapPin, CreditCard } from "lucide-react";
import { CheckoutStep } from "@/types";

interface StepIndicatorProps {
  currentStep: "cart" | "address" | "payment";
}

const steps = [
  { id: "cart", label: "Cart", path: "/checkout", icon: ShoppingCart },
  { id: "address", label: "Address", path: "/checkout/address", icon: MapPin },
  { id: "payment", label: "Payment", path: "/checkout/payment", icon: CreditCard },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="w-full max-w-lg mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Background Track */}
        <div className="absolute left-0 top-5 w-full h-0.5 bg-[#E5E7EB] z-0" />
        
        {/* Progress Track */}
        <div
          className="absolute left-0 top-5 h-0.5 bg-gradient-to-r from-[#0A9B6B] to-[#076B4A] z-0 transition-all duration-500 ease-out"
          style={{ width: `${(Math.max(currentIndex, 0) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isFuture = index > currentIndex;

          // Can only click on completed steps
          const isClickable = isCompleted;

          const stepContent = (
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-300 font-bold text-sm border-2
                  ${isActive
                    ? "bg-gradient-to-br from-[#0A9B6B] to-[#076B4A] text-white border-transparent shadow-lg shadow-[#0A9B6B]/30 scale-110"
                    : isCompleted
                    ? "bg-[#0A9B6B] text-white border-transparent"
                    : "bg-white text-[#9CA3AF] border-[#E5E7EB]"
                  }
                `}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span
                className={`
                  text-xs font-bold uppercase tracking-wide transition-colors duration-300
                  ${isActive 
                    ? "text-[#0A9B6B]" 
                    : isCompleted 
                    ? "text-[#111827]" 
                    : "text-[#9CA3AF]"
                  }
                `}
              >
                {step.label}
              </span>
            </div>
          );

          if (isClickable) {
            return (
              <Link key={step.id} href={step.path} className="cursor-pointer">
                {stepContent}
              </Link>
            );
          }

          return (
            <div key={step.id} className={isFuture ? "cursor-not-allowed" : ""}>
              {stepContent}
            </div>
          );
        })}
      </div>
    </div>
  );
}
