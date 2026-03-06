import React, { ReactNode } from "react";
import StepIndicator from "./StepIndicator";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Checkout</h1>
        </header>
        <StepIndicator />
        <main className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
