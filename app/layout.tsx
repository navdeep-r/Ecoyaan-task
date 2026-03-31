import type { Metadata } from "next";
import "./globals.css";
import { CheckoutProvider } from "@/context/CheckoutContext";
import { ToastProvider } from "@/context/ToastContext";
import CartToast from "@/components/CartToast";

export const metadata: Metadata = {
  title: "Ecoyaan — Shop Green, Live Better.",
  description: "Shop sustainable, eco-friendly products that are good for you and the planet. Every purchase plants a tree.",
  keywords: "eco-friendly, sustainable, green products, bamboo, reusable, zero waste",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ToastProvider>
          <CheckoutProvider>{children}</CheckoutProvider>
        </ToastProvider>
        <CartToast />
      </body>
    </html>
  );
}
