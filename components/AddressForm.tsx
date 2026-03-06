"use client";

import React, { useState } from "react";
import { useCheckout } from "@/context/CheckoutContext";
import { useRouter } from "next/navigation";

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

  const InputField = ({ label, name, type = "text", placeholder = "" }: any) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name as keyof typeof formData]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
          errors[name] ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-blue-500"
        }`}
      />
      {errors[name] && <p className="mt-1 text-sm text-red-500">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <div className="col-span-1 md:col-span-2">
            <InputField label="Full Name" name="fullName" placeholder="John Doe" />
          </div>
          <div className="col-span-1 md:col-span-2">
            <InputField label="Email Address" name="email" type="email" placeholder="john@example.com" />
          </div>
          <InputField label="Phone Number" name="phone" placeholder="9876543210" />
          <InputField label="PIN Code" name="pinCode" placeholder="110001" />
          <InputField label="City" name="city" placeholder="New Delhi" />
          <InputField label="State" name="state" placeholder="Delhi" />
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full md:w-auto"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );
}
