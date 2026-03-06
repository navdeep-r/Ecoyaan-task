import { CartItem as CartItemType } from "@/types";
import Image from "next/image";

interface CartItemProps {
  item: CartItemType;
  readonly?: boolean;
}

export default function CartItem({ item, readonly = false }: CartItemProps) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={item.image}
          alt={item.product_name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-medium text-gray-900 truncate">{item.product_name}</h3>
        <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-base font-semibold text-gray-900">₹{item.product_price * item.quantity}</p>
        {!readonly && <p className="text-xs text-gray-500">₹{item.product_price} each</p>}
      </div>
    </div>
  );
}
