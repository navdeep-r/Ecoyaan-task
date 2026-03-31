"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCheckout } from "@/context/CheckoutContext";
import { Leaf, ShoppingCart, Menu, X, ChevronRight } from "lucide-react";

export default function Navbar() {
  const { getCartItemCount } = useCheckout();
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Read cart count from localStorage on every render and listen to events
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cartStr = localStorage.getItem("ecoyaan_cart");
        if (cartStr) {
          const cart = JSON.parse(cartStr);
          const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
          setCartCount(count);
        } else {
          setCartCount(0);
        }
      } catch (e) {
        setCartCount(0);
      }
    };

    updateCartCount();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "ecoyaan_cart") {
        updateCartCount();
      }
    };

    const handleLocalCartChange = () => {
      updateCartCount();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cart_updated", handleLocalCartChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cart_updated", handleLocalCartChange);
    };
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "#impact", label: "Impact" },
    { href: "#about", label: "About" },
  ];

  return (
    <>
      <nav
        className={`
          sticky top-0 z-50 transition-all duration-300
          ${isScrolled 
            ? "bg-white/90 backdrop-blur-nav shadow-sm border-b border-[#E5E7EB]" 
            : "bg-white/80 backdrop-blur-nav"
          }
        `}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-[#0A9B6B] to-[#076B4A] rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-extrabold text-[#111827] tracking-tight">
              Ecoyaan
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-sm font-semibold text-[#4B5563] hover:text-[#0A9B6B] transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0A9B6B] transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <Link
              href="/checkout"
              className="relative p-2 rounded-xl hover:bg-[#F0FAF5] transition-colors group"
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingCart className="w-5 h-5 text-[#4B5563] group-hover:text-[#0A9B6B] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#0A9B6B] text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Shop Now Button - Desktop */}
            <Link
              href="/shop"
              className="hidden sm:flex items-center gap-1.5 bg-[#0A9B6B] hover:bg-[#076B4A] text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-sm hover:-translate-y-0.5 transition-all duration-200"
            >
              Shop Now
              <ChevronRight className="w-4 h-4" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-[#F0FAF5] transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-[#4B5563]" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="drawer-overlay open md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div className={`drawer-content md:hidden ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="w-8 h-8 bg-gradient-to-br from-[#0A9B6B] to-[#076B4A] rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-display font-extrabold text-[#111827]">Ecoyaan</span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-xl hover:bg-[#F0FAF5] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-[#4B5563]" />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F0FAF5] transition-colors text-[#111827] font-semibold"
            >
              {link.label}
              <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            </a>
          ))}
        </div>

        <div className="p-4 mt-auto">
          <Link
            href="/checkout"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full bg-[#0A9B6B] hover:bg-[#076B4A] text-white font-bold py-3.5 rounded-xl transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            View Cart {cartCount > 0 && `(${cartCount})`}
          </Link>
        </div>

        {/* Eco Badge */}
        <div className="p-4 mx-4 mb-4 bg-[#F0FAF5] rounded-xl border border-[#D1F5E5]">
          <p className="text-xs text-[#076B4A] font-medium">
            🌱 Every purchase plants a tree and offsets carbon emissions
          </p>
        </div>
      </div>
    </>
  );
}
