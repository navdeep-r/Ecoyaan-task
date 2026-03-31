// localStorage keys for Ecoyaan app state
export const STORAGE_KEYS = {
  CART: "ecoyaan_cart",
  ADDRESSES: "ecoyaan_addresses",
  ACTIVE_ADDR: "ecoyaan_activeAddr",
  STEP: "ecoyaan_step",
  ORDER: "ecoyaan_order",
  PROMO: "ecoyaan_promo",
} as const;

// Type-safe localStorage utilities
export function save<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
}

export function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    if (item === null) return fallback;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error loading from localStorage key "${key}":`, error);
    return fallback;
  }
}

export function remove(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}

export function clear(): void {
  if (typeof window === "undefined") return;
  Object.values(STORAGE_KEYS).forEach(key => remove(key));
}

// Generate unique ID for addresses and orders
export function generateId(prefix: string = ""): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}-${timestamp}${random}`.toUpperCase() : `${timestamp}${random}`;
}

// Calculate eco impact based on order total
export function calculateEcoImpact(total: number): { trees: number; co2: number } {
  // 1 tree per ₹300, 0.8kg CO₂ per ₹100
  const trees = Math.max(1, Math.floor(total / 300));
  const co2 = parseFloat((total * 0.008).toFixed(1));
  return { trees, co2 };
}

// Calculate shipping based on subtotal
export function calculateShipping(subtotal: number): number {
  return subtotal >= 500 ? 0 : 50;
}

// Calculate discount based on promo code
export function calculateDiscount(subtotal: number, promoCode: string | null): number {
  if (promoCode?.toUpperCase() === "ECO10") {
    return Math.round(subtotal * 0.1);
  }
  return 0;
}

// Validate promo code
export function isValidPromoCode(code: string): boolean {
  return code.toUpperCase() === "ECO10";
}
