"use client";

import { usePathname } from "next/navigation";
import { CheckCircle2, ShoppingCart, MapPin, CreditCard } from "lucide-react";

const steps = [
  { id: "cart", label: "Cart", path: "/checkout", icon: <ShoppingCart className="w-4 h-4" /> },
  { id: "address", label: "Address", path: "/checkout/address", icon: <MapPin className="w-4 h-4" /> },
  { id: "payment", label: "Payment", path: "/checkout/payment", icon: <CreditCard className="w-4 h-4" /> },
];

export default function StepIndicator() {
  const pathname = usePathname();
  const currentIndex = steps.findIndex((step) => step.path === pathname);
  if (pathname === "/checkout/success") return null;

  return (
    <div className="w-full max-w-lg mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Track */}
        <div className="absolute left-0 top-5 w-full h-0.5 bg-gray-200 z-0"></div>
        <div
          className="absolute left-0 top-5 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 z-0 transition-all duration-700 ease-in-out"
          style={{ width: `${(Math.max(currentIndex, 0) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 font-bold text-sm border-2 ${
                  isActive
                  ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-transparent shadow-lg shadow-emerald-200 scale-110"
                    : isCompleted
                    ? "bg-emerald-500 text-white border-transparent"
                    : "bg-white text-gray-300 border-gray-200"
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.icon}
              </div>
              <span
                className={`text-xs font-bold tracking-wide uppercase transition-colors duration-300 ${isActive ? "text-emerald-600" : isCompleted ? "text-gray-700" : "text-gray-300"
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
