"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Package, 
  Leaf, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft,
  Calendar,
  CreditCard,
  CheckCircle2
} from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const historyStr = localStorage.getItem("ecoyaan_order_history");
      if (historyStr) {
        setOrders(JSON.parse(historyStr));
      }
    } catch (e) {
      console.error("Failed to parse orders", e);
    }
  }, []);

  const totalTrees = orders.reduce((sum, o) => sum + (o.ecoImpact?.trees || 0), 0);

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpandedIds(next);
  };

  const formatDate = (isoStr: string) => {
    return new Date(isoStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isClient) return null; // Avoid hydration mismatch

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 pt-24 md:pt-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header & Back Link */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#0A9B6B] font-medium text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight mb-2">
                Order History
              </h1>
              <p className="text-[#4B5563]">Review your past purchases and track your environmental impact.</p>
            </div>
            
            {/* Summary Stat Bar */}
            {orders.length > 0 && (
              <div className="flex bg-[#F0FAF5] rounded-2xl p-4 gap-6 border border-[#0A9B6B]/20">
                <div>
                  <p className="text-xs font-bold text-[#0A9B6B] uppercase tracking-wide">Total Orders</p>
                  <p className="font-display font-black text-2xl text-[#076B4A]">{orders.length}</p>
                </div>
                <div className="w-px bg-[#0A9B6B]/20"></div>
                <div>
                  <p className="text-xs font-bold text-[#0A9B6B] uppercase tracking-wide flex items-center gap-1"><Leaf className="w-3 h-3" /> Trees Planted</p>
                  <p className="font-display font-black text-2xl text-[#076B4A]">{totalTrees}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-[#D1D5DB]">
            <div className="text-7xl mb-6">📦</div>
            <h2 className="text-2xl font-bold font-display text-[#111827] mb-3">
              No orders yet — your eco journey starts here.
            </h2>
            <p className="text-[#6B7280] max-w-md mx-auto mb-8">
              Explore our collection of sustainable, earth-friendly products and make your first impact today.
            </p>
            <Link 
              href="/shop"
              className="inline-flex items-center bg-[#0A9B6B] hover:bg-[#076B4A] text-white font-bold py-3.5 px-8 rounded-xl transition-all hover:-translate-y-1 shadow-lg shadow-[#0A9B6B]/30"
            >
              Start Shopping →
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedIds.has(order.orderId);
              
              return (
                <div key={order.orderId} className="bg-white border text-left border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Collapsed Header Bar */}
                  <div 
                    onClick={() => toggleExpand(order.orderId)}
                    className="p-5 md:p-6 cursor-pointer flex flex-col md:flex-row gap-4 md:items-center justify-between"
                  >
                    <div className="flex-grow flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-12">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#F0FAF5] p-3 rounded-full hidden sm:block">
                          <Package className="w-5 h-5 text-[#0A9B6B]" />
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] font-medium flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatDate(order.timestamp)}</p>
                          <p className="font-bold text-[#111827]">{order.orderId}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-sm text-[#6B7280] font-medium">Total</p>
                          <p className="font-bold text-[#111827]">₹{order.total}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] font-medium">Items</p>
                          <p className="font-bold text-[#111827]">{order.items.reduce((sum: number, i: any) => sum + i.qty, 0)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-4 sm:w-auto w-full border-t border-gray-100 pt-4 md:border-0 md:pt-0 mt-2 md:mt-0">
                      <span className="inline-flex items-center gap-1.5 bg-[#F0FAF5] text-[#0A9B6B] text-xs font-bold px-2.5 py-1 rounded-full border border-[#D1F5E5]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
                      </span>
                      <button className="text-[#6B7280] hover:bg-[#F3F4F6] p-1.5 rounded-lg transition-colors">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-[#E5E7EB] p-5 md:p-6 bg-[#F9FAFB] animate-fade-in-up">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Left: Items List */}
                        <div className="lg:col-span-2">
                          <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-4">Items Ordered</h4>
                          <div className="space-y-3">
                            {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#E5E7EB] shadow-sm">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-[#F0FAF5] rounded-lg flex items-center justify-center text-2xl">
                                    {item.emoji}
                                  </div>
                                  <div>
                                    <p className="font-bold text-[#111827] text-sm line-clamp-1">{item.name}</p>
                                    <p className="text-xs text-[#6B7280]">Qty: {item.qty} × ₹{item.price}</p>
                                  </div>
                                </div>
                                <p className="font-bold text-[#111827]">₹{item.price * item.qty}</p>
                              </div>
                            ))}
                          </div>

                          {/* Impact Widget inside expanded */}
                          <div className="mt-6 flex items-center gap-3 bg-[#E8F8F0] text-[#076B4A] rounded-xl px-4 py-3 border border-[#0A9B6B]/20">
                            <Leaf className="w-5 h-5 text-[#0A9B6B]" />
                            <p className="text-sm font-medium">
                              This order offset <strong className="font-bold">{order.ecoImpact?.co2kg || 0}kg CO₂</strong> and planted <strong className="font-bold">{order.ecoImpact?.trees || 0} trees</strong>! 🌱
                            </p>
                          </div>
                        </div>

                        {/* Right: Info Panels */}
                        <div className="space-y-6">
                          {/* Order Summary */}
                          <div>
                            <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Order Summary</h4>
                            <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-sm space-y-2 text-sm">
                              <div className="flex justify-between text-[#6B7280]">
                                <span>Subtotal</span>
                                <span>₹{order.subtotal}</span>
                              </div>
                              <div className="flex justify-between text-[#6B7280]">
                                <span>Shipping</span>
                                <span>₹{order.shipping}</span>
                              </div>
                              {order.discount > 0 && (
                                <div className="flex justify-between text-[#0A9B6B]">
                                  <span>Discount</span>
                                  <span>-₹{order.discount}</span>
                                </div>
                              )}
                              <div className="border-t border-[#E5E7EB] pt-2 mt-2 flex justify-between font-bold text-[#111827] text-base">
                                <span>Total</span>
                                <span>₹{order.total}</span>
                              </div>
                            </div>
                          </div>

                          {/* Shipping Details */}
                          <div>
                            <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Shipping To</h4>
                            <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-sm">
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-[#9CA3AF] mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-bold text-sm text-[#111827]">{order.address?.fullName}</p>
                                  <p className="text-xs text-[#6B7280] leading-relaxed mt-1">
                                    {order.address?.city}, {order.address?.state}<br/>
                                    {order.address?.pinCode}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Payment */}
                          <div>
                            <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Payment Method</h4>
                            <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-[#E5E7EB] shadow-sm">
                              <CreditCard className="w-4 h-4 text-[#9CA3AF]" />
                              <span className="text-sm font-medium text-[#4B5563]">{order.paymentMethod || "Credit Card"}</span>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
