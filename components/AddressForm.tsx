"use client";

import React, { useState } from "react";
import { useCheckout } from "@/context/CheckoutContext";
import { useRouter } from "next/navigation";

const InputField = ({ label, name, type = "text", placeholder = "", value, onChange, error }: any) => (
  <div className="mb-5">
    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 text-gray-900 bg-gray-50 border rounded-xl focus:bg-white focus:ring-4 outline-none transition-all duration-300 ${error
          ? "border-red-300 focus:ring-red-100 focus:border-red-500"
          : "border-gray-200 focus:ring-emerald-100 focus:border-emerald-500 hover:border-gray-300"
        }`}
    />
    {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

export default function AddressForm() {
  const { addressDetails, setAddressDetails } = useCheckout();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: addressDetails?.fullName || "",
    email: addressDetails?.email || "",
    phone: addressDetails?.phone || "",
    pinCode: addressDetails?.pinCode || "",
    city: addressDetails?.city || "",
    state: addressDetails?.state || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be exactly 10 digits";
    }
    if (!/^\d+$/.test(formData.pinCode)) {
      newErrors.pinCode = "PIN code must be numeric";
    }
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setAddressDetails(formData);
      router.push("/checkout/payment");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for the field once user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <span className="w-2 h-6 rounded-full bg-emerald-500"></span>
          Shipping Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <div className="col-span-1 md:col-span-2">
            <InputField label="Full Name" name="fullName" placeholder="Jane Doe" value={formData.fullName} onChange={handleChange} error={errors.fullName} />
          </div>
          <div className="col-span-1 md:col-span-2">
            <InputField label="Email Address" name="email" type="email" placeholder="jane@example.com" value={formData.email} onChange={handleChange} error={errors.email} />
          </div>
          <InputField label="Phone Number" name="phone" placeholder="9876543210" value={formData.phone} onChange={handleChange} error={errors.phone} />
          <InputField label="PIN Code" name="pinCode" placeholder="110001" value={formData.pinCode} onChange={handleChange} error={errors.pinCode} />
          <InputField label="City" name="city" placeholder="New Delhi" value={formData.city} onChange={handleChange} error={errors.city} />
          <InputField label="State" name="state" placeholder="Delhi" value={formData.state} onChange={handleChange} error={errors.state} />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-10 rounded-xl shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 transition-all duration-300 focus:ring-4 focus:ring-emerald-200 focus:outline-none w-full md:w-auto text-lg flex items-center justify-center gap-2"
        >
          Continue to Payment
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </div>
    </form>
  );
}
