import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Eco Products | Ecoyaan",
  description: "Browse 100% sustainable, eco-certified products. Every purchase plants a tree.",
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
