"use client";

import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/products";
import { ProductImage } from "@/components/product/product-image";
import { useCart } from "@/hooks/use-cart";
import { useMode } from "@/hooks/use-mode";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const isWholesale = useMode((s) => s.mode === "wholesale");

  const wholesalePrice = Math.round(product.selling_price * 0.85);
  const displayPrice = isWholesale ? wholesalePrice : product.selling_price;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.colors[0], isWholesale ? 5 : 1);
  };

  return (
    <Link href={`/products/${product.slug}`} className="product-card group flex flex-col cursor-pointer">
      <div className="bg-[#f5f5f7] rounded-2xl p-6 mb-4 aspect-[4/5] flex items-center justify-center relative overflow-hidden">
        <ProductImage
          product={product}
          className="product-image w-full h-full object-contain transition-transform duration-500"
        />
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-4 right-4 size-10 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
        >
          <span className="material-symbols-outlined text-primary">add_shopping_cart</span>
        </button>
        {isWholesale && (
          <span className="absolute top-3 left-3 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
            Wholesale
          </span>
        )}
      </div>
      <div className="px-1">
        <h3 className="font-semibold text-base mb-1">{product.name}</h3>
        <p className="text-xs text-[#6e6e73] mb-3">{product.tagline}</p>
        {isWholesale ? (
          <div>
            <p className="font-bold text-lg text-primary">&#8377;{formatPrice(wholesalePrice)}<span className="text-xs font-normal text-[#6e6e73] ml-1">/unit</span></p>
            <p className="text-xs text-[#6e6e73] line-through">MRP &#8377;{formatPrice(product.base_price)}</p>
          </div>
        ) : (
          <p className="font-bold text-lg">&#8377;{formatPrice(product.selling_price)}</p>
        )}
      </div>
    </Link>
  );
}
