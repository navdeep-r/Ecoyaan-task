"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProductById } from "@/lib/products";
import { Star, ArrowRight, Truck, ShieldCheck, Recycle, Award, TreePine, Heart, Wind, Leaf } from "lucide-react";

// Live tree counter that increments randomly
function useTreeCounter(initial: number = 3241) {
  const [count, setCount] = useState(initial);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 3) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return count;
}

const stats = [
  { value: 2400000, label: "Trees Planted", suffix: "+", icon: TreePine, format: "2.4M" },
  { value: 50000, label: "Happy Customers", suffix: "+", icon: Heart, format: "50K" },
  { value: 120, label: "CO₂ Offset (Tons)", suffix: "T", icon: Wind, format: "120" },
  { value: 100, label: "Eco Certified", suffix: "%", icon: Recycle, format: "100" },
];

const trustBadges = [
  { icon: Truck, label: "Free Shipping", description: "On all orders above ₹500" },
  { icon: ShieldCheck, label: "Secure Payment", description: "256-bit SSL encrypted" },
  { icon: Recycle, label: "Eco Packaging", description: "100% plastic-free packaging" },
  { icon: Award, label: "Certified Green", description: "Verified eco standards" },
];

// Featured product IDs to show on homepage
const FEATURED_PRODUCT_IDS = [1, 2, 3];

export default function Home() {
  const treesPlantedToday = useTreeCounter(3241);
  const [socialProofCount, setSocialProofCount] = useState(0);
  const socialProofRef = useRef<HTMLDivElement>(null);

  // Get featured products from PRODUCTS array
  const featuredProducts = FEATURED_PRODUCT_IDS.map(id => getProductById(id)).filter(Boolean);

  // Animate social proof number
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && socialProofCount === 0) {
          const end = 50000;
          const duration = 2000;
          const startTime = Date.now();
          
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setSocialProofCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          animate();
        }
      },
      { threshold: 0.5 }
    );
    if (socialProofRef.current) {
      observer.observe(socialProofRef.current);
    }
    return () => observer.disconnect();
  }, [socialProofCount]);

  return (
    <div className="min-h-screen bg-[#F0FAF5]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated gradient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute -top-40 -right-40 w-96 h-96 bg-[#D1F5E5] rounded-full blur-3xl opacity-60 animate-blob"
            style={{ animationDelay: "0s" }}
          />
          <div 
            className="absolute top-40 -left-40 w-80 h-80 bg-[#0A9B6B]/20 rounded-full blur-3xl opacity-50 animate-blob"
            style={{ animationDelay: "-4s" }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 md:pt-24 md:pb-16 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#D1F5E5] text-[#076B4A] text-xs font-bold px-4 py-2 rounded-full mb-6 border border-[#0A9B6B]/20 animate-pulse-soft">
            <Leaf className="w-4 h-4" />
            100% Sustainable Products
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#111827] tracking-tight leading-tight mb-6 animate-fade-in-up">
            Shop Green.<br />
            <span className="font-display italic text-gradient">
              Live Better.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-xl mx-auto text-lg text-[#4B5563] font-medium mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Premium eco-friendly products that are good for you, your family, and our planet. 
            Every purchase funds reforestation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-[#0A9B6B] hover:bg-[#076B4A] text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-[#0A9B6B]/25 hover:-translate-y-0.5 transition-all duration-200 text-base"
            >
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#4B5563] font-semibold py-4 px-8 rounded-2xl border border-[#E5E7EB] hover:border-[#0A9B6B] hover:text-[#0A9B6B] transition-all duration-200 text-base"
            >
              Browse Products
            </Link>
          </div>

          {/* Social Proof */}
          <div 
            ref={socialProofRef}
            className="mt-10 flex items-center justify-center gap-3 text-sm text-[#9CA3AF] font-medium animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex -space-x-2">
              {["🧑", "👩", "👨", "🧕", "👱"].map((emoji, i) => (
                <div 
                  key={i} 
                  className="w-9 h-9 rounded-full bg-[#D1F5E5] border-2 border-white flex items-center justify-center text-sm shadow-sm"
                >
                  {emoji}
                </div>
              ))}
            </div>
            <span>
              Join <strong className="text-[#111827]">{socialProofCount.toLocaleString()}+</strong> eco-conscious shoppers
            </span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="impact" className="py-10 md:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-5 text-center border border-[#E5E7EB] shadow-sm tilt-hover"
                >
                  <div className="w-10 h-10 bg-[#D1F5E5] rounded-xl flex items-center justify-center text-[#0A9B6B] mx-auto mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="font-display text-2xl md:text-3xl font-bold text-[#111827]">
                    {stat.format}{stat.suffix}
                  </p>
                  <p className="text-xs text-[#9CA3AF] font-semibold mt-1 uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Picks Section */}
      <section id="products" className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#111827] mb-3">
              Featured Picks
            </h2>
            <p className="text-[#4B5563] max-w-lg mx-auto">
              Handpicked, sustainably sourced items loved by our community
            </p>
          </div>

          {/* Featured Products - Non-interactive preview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {featuredProducts.map((product) => product && (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm"
              >
                {/* Emoji Display */}
                <div className="p-6 pb-0">
                  <div className="w-full aspect-square bg-gradient-to-br from-[#F0FAF5] to-[#D1F5E5] rounded-xl flex items-center justify-center text-6xl">
                    {product.emoji}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-[#111827]">{product.rating}</span>
                    <span className="text-xs text-[#9CA3AF]">({product.reviews})</span>
                  </div>

                  {/* Name */}
                  <h3 className="font-display font-bold text-[#111827] text-base leading-snug mb-2">
                    {product.name}
                  </h3>

                  {/* Eco Tag */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#D1F5E5] text-[#076B4A] mb-3">
                    🌿 {product.tag}
                  </span>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-display font-bold text-[#111827]">
                      ₹{product.price}
                    </span>
                    <span className="text-sm text-[#9CA3AF] line-through">
                      ₹{product.originalPrice}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#0A9B6B] hover:bg-[#076B4A] text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-[#0A9B6B]/25 hover:-translate-y-0.5 transition-all duration-200 text-base"
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white border-y border-[#E5E7EB] py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div 
                  key={badge.label} 
                  className="group text-center cursor-default"
                >
                  <div className="w-12 h-12 bg-[#F0FAF5] group-hover:bg-[#D1F5E5] rounded-xl flex items-center justify-center text-[#0A9B6B] mx-auto mb-3 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-sm text-[#111827]">{badge.label}</p>
                  <p className="text-xs text-[#9CA3AF] font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {badge.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section id="about" className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative bg-gradient-to-br from-[#0A9B6B] to-[#076B4A] rounded-3xl p-10 md:p-14 text-center text-white overflow-hidden">
            {/* Leaf pattern overlay */}
            <div className="absolute inset-0 leaf-pattern opacity-30" />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="text-5xl md:text-6xl mb-4">🌍</div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Every Purchase Counts
              </h2>
              <p className="text-[#D1F5E5] font-medium mb-6 max-w-lg mx-auto">
                For every order placed, we plant a tree and offset your carbon footprint. 
                Make your shopping matter.
              </p>

              {/* Live counter */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 text-sm font-bold mb-8">
                <span className="w-2 h-2 bg-[#D1F5E5] rounded-full animate-pulse" />
                🌱 {treesPlantedToday.toLocaleString()} trees planted today
              </div>

              <div>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-white text-[#0A9B6B] font-bold py-4 px-8 rounded-2xl hover:bg-[#F0FAF5] transition-all duration-200 hover:-translate-y-0.5 shadow-lg text-base"
                >
                  Shop & Make Impact
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
