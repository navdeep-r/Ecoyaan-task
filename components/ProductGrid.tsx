"use client";

import React, { useState, useMemo, useCallback } from "react";
import { PRODUCTS, CATEGORIES, Category, sortProducts, searchProducts, Product } from "@/lib/products";
import ProductCard from "./ProductCard";
import { Search, SlidersHorizontal, X } from "lucide-react";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    // Simple debounce
    const timer = setTimeout(() => {
      setDebouncedQuery(value);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result: Product[] = [...PRODUCTS];

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by search
    if (debouncedQuery.trim()) {
      result = searchProducts(debouncedQuery).filter((p) =>
        selectedCategory === "All" ? true : p.category === selectedCategory
      );
    }

    // Sort
    result = sortProducts(result, sortBy);

    return result;
  }, [selectedCategory, sortBy, debouncedQuery]);

  const clearFilters = () => {
    setSelectedCategory("All");
    setSortBy("featured");
    setSearchQuery("");
    setDebouncedQuery("");
  };

  const hasActiveFilters = selectedCategory !== "All" || sortBy !== "featured" || searchQuery;

  return (
    <section id="products" className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#111827] mb-3">
            Featured Products
          </h2>
          <p className="text-[#4B5563] max-w-lg mx-auto">
            Handpicked, sustainably sourced items that make a difference
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#E5E7EB] bg-white focus:border-[#0A9B6B] focus:ring-2 focus:ring-[#0A9B6B]/20 outline-none transition-all text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setDebouncedQuery("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-[#F0FAF5] transition-colors"
              >
                <X className="w-4 h-4 text-[#9CA3AF]" />
              </button>
            )}
          </div>

          {/* Category Pills & Sort */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
                    ${selectedCategory === category
                      ? "bg-[#0A9B6B] text-white shadow-sm"
                      : "bg-white text-[#4B5563] border border-[#E5E7EB] hover:border-[#0A9B6B] hover:text-[#0A9B6B]"
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#9CA3AF]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-sm font-medium text-[#4B5563] focus:border-[#0A9B6B] focus:ring-2 focus:ring-[#0A9B6B]/20 outline-none transition-all cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex justify-center">
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-[#0A9B6B] hover:underline flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display text-xl font-bold text-[#111827] mb-2">
              No products found
            </h3>
            <p className="text-[#4B5563] mb-6">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-[#0A9B6B] hover:bg-[#076B4A] text-white font-bold rounded-xl transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Results Count */}
        {filteredProducts.length > 0 && (
          <p className="text-center text-sm text-[#9CA3AF] mt-8">
            Showing {filteredProducts.length} of {PRODUCTS.length} products
          </p>
        )}
      </div>
    </section>
  );
}
