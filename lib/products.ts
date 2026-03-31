// Ecoyaan Product Catalog
// This is the single source of truth for all product data

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  badge: string | null;
  badgeColor: "green" | "blue" | "purple" | "orange" | null;
  tag: string;
  emoji: string;
  description: string;
  category: "Personal Care" | "Kitchen" | "Lifestyle" | "Home";
  inStock: boolean;
  ecoImpact: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Bamboo Toothbrush (Pack of 4)",
    price: 299,
    originalPrice: 399,
    rating: 4.8,
    reviews: 240,
    badge: "Best Seller",
    badgeColor: "green",
    tag: "Biodegradable",
    emoji: "🪥",
    description: "BPA-free bamboo handle with charcoal-infused bristles. Fully compostable.",
    category: "Personal Care",
    inStock: true,
    ecoImpact: "Saves 4 plastic toothbrushes per pack"
  },
  {
    id: 2,
    name: "Reusable Cotton Produce Bags",
    price: 450,
    originalPrice: 550,
    rating: 4.9,
    reviews: 180,
    badge: "Eco Pick",
    badgeColor: "blue",
    tag: "Recycled Material",
    emoji: "🛍️",
    description: "Set of 6 organic cotton mesh bags. Machine washable, zero plastic.",
    category: "Kitchen",
    inStock: true,
    ecoImpact: "Replaces 300+ plastic bags per year"
  },
  {
    id: 3,
    name: "Stainless Steel Water Bottle",
    price: 649,
    originalPrice: 799,
    rating: 4.7,
    reviews: 95,
    badge: "New",
    badgeColor: "purple",
    tag: "Zero Waste",
    emoji: "🍶",
    description: "Double-wall vacuum insulated. Keeps drinks cold 24hrs, hot 12hrs.",
    category: "Lifestyle",
    inStock: true,
    ecoImpact: "Eliminates 156 plastic bottles per year"
  },
  {
    id: 4,
    name: "Beeswax Food Wraps (Set of 3)",
    price: 349,
    originalPrice: 449,
    rating: 4.6,
    reviews: 127,
    badge: "Popular",
    badgeColor: "orange",
    tag: "Natural",
    emoji: "🍯",
    description: "Reusable alternative to cling film. Naturally antibacterial.",
    category: "Kitchen",
    inStock: true,
    ecoImpact: "Replaces 100m of plastic wrap per year"
  },
  {
    id: 5,
    name: "Compostable Trash Bags (30 pack)",
    price: 299,
    originalPrice: 349,
    rating: 4.5,
    reviews: 88,
    badge: null,
    badgeColor: null,
    tag: "Compostable",
    emoji: "🗑️",
    description: "ASTM D6400 certified. Breaks down in 90 days in compost.",
    category: "Home",
    inStock: true,
    ecoImpact: "30 less plastic bags in landfill"
  },
  {
    id: 6,
    name: "Organic Loofah Scrubber",
    price: 199,
    originalPrice: 249,
    rating: 4.4,
    reviews: 62,
    badge: null,
    badgeColor: null,
    tag: "Organic",
    emoji: "🌿",
    description: "100% natural loofah grown without pesticides. Fully biodegradable.",
    category: "Personal Care",
    inStock: false,
    ecoImpact: "Zero synthetic materials"
  }
];

export const CATEGORIES = ["All", "Personal Care", "Kitchen", "Lifestyle", "Home"] as const;

export type Category = typeof CATEGORIES[number];

export function getProductById(id: number): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

export function getProductsByCategory(category: Category): Product[] {
  if (category === "All") return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.tag.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery)
  );
}

export function sortProducts(
  products: Product[], 
  sortBy: "featured" | "price-asc" | "price-desc" | "rating"
): Product[] {
  const sorted = [...products];
  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "featured":
    default:
      // Featured: prioritize items with badges, then by reviews
      return sorted.sort((a, b) => {
        if (a.badge && !b.badge) return -1;
        if (!a.badge && b.badge) return 1;
        return b.reviews - a.reviews;
      });
  }
}

// Badge color mapping to Tailwind classes
export const BADGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  green: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
};
