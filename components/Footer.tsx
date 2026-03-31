"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Leaf, Instagram, Twitter, Youtube, Send, ArrowRight } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { success, error } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      error("Please enter a valid email address");
      return;
    }
    success("🎉 Welcome to the Ecoyaan family! Check your inbox.");
    setEmail("");
  };

  const footerLinks = {
    shop: [
      { label: "All Products", href: "#products" },
      { label: "Best Sellers", href: "#products" },
      { label: "New Arrivals", href: "#products" },
      { label: "Gift Cards", href: "#" },
    ],
    company: [
      { label: "About Us", href: "#about" },
      { label: "Our Impact", href: "#impact" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
    ],
    support: [
      { label: "FAQ", href: "#" },
      { label: "Shipping", href: "#" },
      { label: "Returns", href: "#" },
      { label: "Contact Us", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-white border-t border-[#E5E7EB]">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-[#0A9B6B] to-[#076B4A] rounded-xl flex items-center justify-center shadow-sm">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-extrabold text-[#111827] tracking-tight">
                Ecoyaan
              </span>
            </Link>
            <p className="text-[#4B5563] text-sm leading-relaxed mb-6 max-w-xs">
              Premium eco-friendly products that are good for you, your family, and our planet. 
              Every purchase funds reforestation.
            </p>

            {/* Newsletter */}
            <form onSubmit={handleNewsletterSubmit} className="max-w-sm">
              <label className="text-xs font-bold text-[#111827] uppercase tracking-wide mb-2 block">
                Join our newsletter
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-[#E5E7EB] bg-[#F0FAF5] focus:border-[#0A9B6B] focus:ring-2 focus:ring-[#0A9B6B]/20 outline-none transition-all"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#0A9B6B] hover:bg-[#076B4A] text-white rounded-xl transition-colors flex items-center gap-1.5"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-[#9CA3AF] mt-2">
                Get 10% off your first order + eco tips weekly
              </p>
            </form>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wide mb-4">
              Shop
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#4B5563] hover:text-[#0A9B6B] transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wide mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#4B5563] hover:text-[#0A9B6B] transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wide mb-4">
              Support
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#4B5563] hover:text-[#0A9B6B] transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-xs text-[#9CA3AF] font-medium">
            © {new Date().getFullYear()} Ecoyaan. Built for a greener tomorrow. 🌍
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-9 h-9 rounded-full bg-[#F0FAF5] hover:bg-[#D1F5E5] flex items-center justify-center transition-colors group"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4 text-[#4B5563] group-hover:text-[#0A9B6B] transition-colors" />
              </a>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-4 text-xs font-medium text-[#9CA3AF]">
            <a href="#" className="hover:text-[#0A9B6B] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#0A9B6B] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#0A9B6B] transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
