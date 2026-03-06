"use client";

import { usePathname } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

const steps = [
  { id: "cart", label: "Cart", path: "/checkout" },
  { id: "address", label: "Address", path: "/checkout/address" },
  { id: "payment", label: "Payment", path: "/checkout/payment" },
];

export default function StepIndicator() {
  const pathname = usePathname();

  // Determine current step index
  const currentIndex = steps.findIndex((step) => step.path === pathname);
  // It handles /checkout/success out of bounds by not marking any logic if not found, but we can hide it.
  if (pathname === "/checkout/success") return null;

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 z-0 rounded"></div>
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-600 z-0 transition-all duration-300 rounded"
          style={{ width: `${(Math.max(currentIndex, 0) / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white ring-4 ring-blue-100"
                    : isCompleted
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-400 border-2 border-gray-200"
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  isActive ? "text-blue-600" : isCompleted ? "text-gray-800" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
