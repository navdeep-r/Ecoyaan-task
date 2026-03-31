"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";
import { useToast } from "@/context/ToastContext";
import { Address } from "@/types";
import Navbar from "@/components/Navbar";
import StepIndicator from "@/components/StepIndicator";
import StickyActionBar from "@/components/StickyActionBar";
import { 
  MapPin, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  Home, 
  Briefcase, 
  MapPinned,
  X
} from "lucide-react";

type AddressLabel = "Home" | "Work" | "Other";

const labelIcons: Record<AddressLabel, typeof Home> = {
  Home: Home,
  Work: Briefcase,
  Other: MapPinned,
};

export default function AddressPage() {
  const router = useRouter();
  const { 
    cart,
    addresses, 
    activeAddressIndex, 
    addAddress, 
    updateAddress, 
    deleteAddress, 
    setActiveAddress,
    setStep,
    getCartTotal,
    getEcoImpact
  } = useCheckout();
  const { success, error } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    label: "Home" as AddressLabel,
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
    isDefault: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { total } = getCartTotal();
  const ecoImpact = getEcoImpact(total);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      router.push("/checkout");
    }
  }, [cart, router]);

  // Show form if no addresses
  useEffect(() => {
    if (addresses.length === 0) {
      setShowForm(true);
    }
  }, [addresses.length]);

  const resetForm = () => {
    setFormData({
      label: "Home",
      fullName: "",
      email: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pinCode: "",
      isDefault: addresses.length === 0,
    });
    setErrors({});
    setEditingAddress(null);
  };

  const openEditForm = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      fullName: address.fullName,
      email: address.email,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      pinCode: address.pinCode,
      isDefault: address.isDefault,
    });
    setShowForm(true);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be exactly 10 digits";
    }
    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = "Address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = "PIN code must be exactly 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      error("Please fix the errors in the form");
      return;
    }

    if (editingAddress) {
      updateAddress(editingAddress.id, formData);
      success("Address updated successfully!");
    } else {
      addAddress(formData);
      success("Address saved successfully!");
    }

    setShowForm(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteAddress(id);
    success("Address deleted");
  };

  const handleContinue = () => {
    if (activeAddressIndex === null || activeAddressIndex >= addresses.length) {
      error("Please select a delivery address");
      return;
    }
    setStep("payment");
    router.push("/checkout/payment");
  };

  const InputField = ({ 
    label, 
    name, 
    type = "text", 
    placeholder, 
    value, 
    onChange, 
    error: fieldError,
    className = ""
  }: {
    label: string;
    name: string;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    className?: string;
  }) => (
    <div className={className}>
      <label className="block text-xs font-bold text-[#111827] uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 text-sm rounded-xl border outline-none transition-all
          ${fieldError
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-[#E5E7EB] focus:border-[#0A9B6B] focus:ring-2 focus:ring-[#0A9B6B]/20 hover:border-[#9CA3AF]"
          }
        `}
      />
      {fieldError && (
        <p className="mt-1 text-xs text-red-500 font-medium">{fieldError}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0FAF5] pb-32">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#111827]">
            Delivery Address
          </h1>
          <p className="text-[#4B5563] mt-1 text-sm">
            Where should we deliver your eco-friendly products?
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep="address" />

        {/* Address List */}
        {!showForm && addresses.length > 0 && (
          <div className="space-y-4 mb-6">
            {addresses.map((address, index) => {
              const LabelIcon = labelIcons[address.label];
              const isSelected = index === activeAddressIndex;

              return (
                <div
                  key={address.id}
                  onClick={() => setActiveAddress(index)}
                  className={`
                    relative bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all
                    ${isSelected
                      ? "border-[#0A9B6B] bg-[#F0FAF5] shadow-sm"
                      : "border-[#E5E7EB] hover:border-[#9CA3AF]"
                    }
                  `}
                >
                  {/* Selection indicator */}
                  <div className={`
                    absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${isSelected
                      ? "border-[#0A9B6B] bg-[#0A9B6B]"
                      : "border-[#E5E7EB]"
                    }
                  `}>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>

                  {/* Label badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`
                      inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                      ${isSelected
                        ? "bg-[#0A9B6B] text-white"
                        : "bg-[#F0FAF5] text-[#076B4A]"
                      }
                    `}>
                      <LabelIcon className="w-3.5 h-3.5" />
                      {address.label}
                    </span>
                    {address.isDefault && (
                      <span className="text-xs font-medium text-[#9CA3AF]">Default</span>
                    )}
                  </div>

                  {/* Address details */}
                  <p className="font-semibold text-[#111827]">{address.fullName}</p>
                  <p className="text-sm text-[#4B5563] mt-1">
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </p>
                  <p className="text-sm text-[#4B5563]">
                    {address.city}, {address.state} - {address.pinCode}
                  </p>
                  <p className="text-sm text-[#4B5563] mt-1">
                    {address.phone} · {address.email}
                  </p>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#E5E7EB]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditForm(address);
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#4B5563] hover:text-[#0A9B6B] transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <span className="text-[#E5E7EB]">|</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(address.id);
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#4B5563] hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Add new address button */}
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-[#E5E7EB] rounded-2xl text-[#4B5563] font-semibold hover:border-[#0A9B6B] hover:text-[#0A9B6B] hover:bg-[#F0FAF5] transition-all"
            >
              <Plus className="w-5 h-5" />
              Add New Address
            </button>
          </div>
        )}

        {/* Address Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-bold text-[#111827] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#0A9B6B]" />
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h2>
              {addresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="p-2 rounded-lg hover:bg-[#F0FAF5] transition-colors"
                >
                  <X className="w-5 h-5 text-[#9CA3AF]" />
                </button>
              )}
            </div>

            {/* Label Selector */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-[#111827] uppercase tracking-wide mb-2">
                Address Label
              </label>
              <div className="flex gap-2">
                {(["Home", "Work", "Other"] as AddressLabel[]).map((label) => {
                  const Icon = labelIcons[label];
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setFormData({ ...formData, label })}
                      className={`
                        flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
                        ${formData.label === label
                          ? "bg-[#0A9B6B] text-white"
                          : "bg-[#F0FAF5] text-[#4B5563] hover:bg-[#D1F5E5]"
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Full Name"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                error={errors.fullName}
                className="md:col-span-2"
              />

              <InputField
                label="Email Address"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
              />

              <InputField
                label="Phone Number"
                name="phone"
                placeholder="9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                error={errors.phone}
              />

              <InputField
                label="Address Line 1"
                name="addressLine1"
                placeholder="123 Green Street, Apartment 4B"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                error={errors.addressLine1}
                className="md:col-span-2"
              />

              <InputField
                label="Address Line 2 (Optional)"
                name="addressLine2"
                placeholder="Landmark, etc."
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                className="md:col-span-2"
              />

              <InputField
                label="City"
                name="city"
                placeholder="Mumbai"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                error={errors.city}
              />

              <InputField
                label="State"
                name="state"
                placeholder="Maharashtra"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                error={errors.state}
              />

              <InputField
                label="PIN Code"
                name="pinCode"
                placeholder="400001"
                value={formData.pinCode}
                onChange={(e) => setFormData({ ...formData, pinCode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                error={errors.pinCode}
              />

              {/* Default checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-4 h-4 rounded border-[#E5E7EB] text-[#0A9B6B] focus:ring-[#0A9B6B]"
                />
                <label htmlFor="isDefault" className="text-sm text-[#4B5563]">
                  Set as default address
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end gap-3">
              {addresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-6 py-3 text-[#4B5563] font-semibold rounded-xl hover:bg-[#F0FAF5] transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-8 py-3 bg-[#0A9B6B] hover:bg-[#076B4A] text-white font-bold rounded-xl transition-colors"
              >
                {editingAddress ? "Update Address" : "Save Address"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      <StickyActionBar
        backHref="/checkout"
        backLabel="Back to Cart"
        forwardLabel="Continue to Payment"
        forwardIcon="arrow"
        forwardDisabled={activeAddressIndex === null || showForm}
        onForward={handleContinue}
      />
    </div>
  );
}
