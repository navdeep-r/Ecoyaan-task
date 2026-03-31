"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  PRODUCTS, 
  Category, 
  CATEGORIES, 
  searchProducts, 
  getProductsByCategory, 
  sortProducts,
  BADGE_COLORS
} from "@/lib/products";
import { useCheckout } from "@/context/CheckoutContext";
import { Search, Star, ChevronDown, Check, ChevronRight, Home, CheckCircle2 } from "lucide-react";
import { Product } from "@/lib/products";

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCheckout();
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    try {
      const currentStr = localStorage.getItem("ecoyaan_cart");
      if (currentStr) {
        const cart = JSON.parse(currentStr);
        if (cart.some((item: any) => item.productId === product.id)) {
          setAddedToCart(true);
        }
      }
    } catch (e) {
      // Ignore
    }
  }, [product.id]);

  const handleAddToCart = () => {
    addToCart(product.id, 1);
    
    try {
      const currentStr = localStorage.getItem("ecoyaan_cart");
      let updatedCart: { productId: number; quantity: number }[] = [];
      if (currentStr) {
        updatedCart = JSON.parse(currentStr);
      }
      
      const idx = updatedCart.findIndex((i: any) => i.productId === product.id);
      if (idx >= 0) {
        updatedCart[idx].quantity += 1;
      } else {
        updatedCart.push({ productId: product.id, quantity: 1 });
      }
      
      localStorage.setItem("ecoyaan_cart", JSON.stringify(updatedCart));
      setAddedToCart(true);
      window.dispatchEvent(new CustomEvent("cart_updated", { detail: { product } }));
    } catch (e) {
      console.error("Failed to write cart strictly to localStorage", e);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group h-full">
      {/* Image / Emoji */}
      <div className="p-4 pb-0 relative">
        <div className="w-full aspect-square bg-gradient-to-br from-[#F0FAF5] to-[#D1F5E5] rounded-xl flex items-center justify-center text-5xl group-hover:scale-[1.02] transition-transform duration-300">
          {product.emoji}
        </div>
        {product.badge && (
          <div className={`absolute top-6 left-6 px-3 py-1 text-[10px] font-bold rounded-full shadow-sm ${product.badgeColor ? BADGE_COLORS[product.badgeColor].bg + " " + BADGE_COLORS[product.badgeColor].text + " border " + BADGE_COLORS[product.badgeColor].border : "bg-white text-gray-800 border border-gray-200"}`}>
            {product.badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex items-center gap-1.5 mb-2">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-sm font-semibold text-[#111827]">{product.rating}</span>
          <span className="text-xs text-[#9CA3AF]">({product.reviews})</span>
        </div>

        <h3 className="font-display font-bold text-[#111827] text-base leading-snug mb-1">
          {product.name}
        </h3>
        
        <p className="text-sm text-[#6B7280] mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-display font-black text-[#0A9B6B]">
              ₹{product.price}
            </span>
            <span className="text-xs text-[#9CA3AF] line-through font-medium">
              ₹{product.originalPrice}
            </span>
          </div>
          
          {product.inStock ? (
            <button
              onClick={handleAddToCart}
              disabled={addedToCart}
              className={`
                text-xs sm:text-sm font-bold px-3 py-2 sm:px-4 rounded-xl transition-all duration-300 ease flex items-center gap-1.5
                ${addedToCart 
                  ? "bg-[#6EBF9A] text-white cursor-not-allowed" 
                  : "bg-[#111827] hover:bg-[#374151] text-white active:scale-95"
                }
              `}
            >
              {addedToCart ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Added ✓
                </>
              ) : (
                "Add to Cart"
              )}
            </button>
          ) : (
            <button
              disabled
              className="bg-[#F3F4F6] text-[#9CA3AF] text-sm font-bold px-5 py-2.5 rounded-xl cursor-not-allowed border border-[#E5E7EB]"
            >
              Notify Me
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const { addToCart } = useCheckout();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Compute filtered & sorted products
  const displayedProducts = useMemo(() => {
    let result = PRODUCTS;

    // 1. Filter by category
    if (selectedCategory !== "All") {
      result = getProductsByCategory(selectedCategory);
    }

    // 2. Filter by search query
    if (debouncedQuery.trim() !== "") {
      const lowerQuery = debouncedQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.tag.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
      );
    }

    // 3. Sort
    return sortProducts(result, sortBy);
  }, [selectedCategory, debouncedQuery, sortBy]);


  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 md:pt-10">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-[#6B7280] mb-6 font-medium">
          <Link href="/" className="flex items-center gap-1.5 hover:text-[#0A9B6B] transition-colors">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-[#D1D5DB]" />
          <span className="text-[#111827]">Shop</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-[#111827] tracking-tight mb-3">
            Shop Eco-Friendly Products
          </h1>
          <p className="text-[#4B5563] text-lg max-w-2xl">
            Every product is sustainably sourced and carbon-offset.
          </p>
        </div>

        {/* Controls: Search, Filter, Sort */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center mb-8">
          
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  px-4 py-2 rounded-full text-sm font-bold transition-all duration-200
                  ${selectedCategory === cat 
                    ? "bg-[#0A9B6B] text-white shadow-md shadow-[#0A9B6B]/20" 
                    : "bg-white text-[#4B5563] border border-[#E5E7EB] hover:border-[#0A9B6B] hover:text-[#0A9B6B]"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-grow lg:flex-grow-0 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0A9B6B]/20 focus:border-[#0A9B6B] transition-all text-[#111827] placeholder:text-[#9CA3AF] font-medium"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#4B5563] hover:border-[#0A9B6B] hover:text-[#0A9B6B] transition-colors"
              >
                {sortOptions.find(o => o.value === sortBy)?.label}
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isSortOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsSortOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E5E7EB] py-1.5 z-20 animate-scale-in origin-top-right">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setIsSortOpen(false);
                        }}
                        className={`
                          w-full flex items-center justify-between px-4 py-2 text-sm text-left transition-colors
                          ${sortBy === option.value ? "text-[#0A9B6B] font-bold bg-[#F0FAF5]" : "text-[#4B5563] font-medium hover:bg-[#F9FAFB]"}
                        `}
                      >
                        {option.label}
                        {sortBy === option.value && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Showing Count */}
        <p className="text-sm text-[#6B7280] font-medium mb-6">
          Showing <span className="font-bold text-[#111827]">{displayedProducts.length}</span> of <span className="font-bold text-[#111827]">{PRODUCTS.length}</span> products
        </p>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          
          {displayedProducts.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-[#D1D5DB]">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-[#111827] mb-2">No products found</h3>
              <p className="text-[#6B7280]">Try adjusting your search or category filters.</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-6 text-[#0A9B6B] font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
