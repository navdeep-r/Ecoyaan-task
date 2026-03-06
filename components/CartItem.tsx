import { CartItem as CartItemType } from "@/types";
import Image from "next/image";
import { Leaf } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
  readonly?: boolean;
  index?: number;
}

const ecoLabels = ["🌿 Biodegradable", "♻️ Recycled Material", "🌱 Sustainably Sourced"];

export default function CartItem({ item, readonly = false, index = 0 }: CartItemProps) {
  return (
    <div className="group flex items-center gap-5 p-5 hover:bg-white transition-all duration-300 cursor-default">
      {/* Image */}
      <div className="relative w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300">
        <Image
          src={item.image}
          alt={item.product_name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!readonly && (
          <div className="absolute top-1.5 left-1.5 bg-emerald-500 rounded-full p-0.5">
            <Leaf className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] font-semibold text-gray-900 leading-snug">{item.product_name}</h3>
        {!readonly && (
          <span className="mt-1.5 inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">
            {ecoLabels[index % ecoLabels.length]}
          </span>
        )}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 rounded-full px-2.5 py-0.5">
            Qty: {item.quantity}
          </span>
          {!readonly && (
            <span className="text-xs text-gray-400">₹{item.product_price} each</span>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="text-right flex-shrink-0">
        <p className="text-xl font-extrabold text-gray-900 tracking-tight">₹{item.product_price * item.quantity}</p>
      </div>
    </div>
  );
}
