"use client";

import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice, getDiscount } from "@/lib/products";
import { ProductImage } from "@/components/product/product-image";
import { useCart } from "@/hooks/use-cart";
import { useMode } from "@/hooks/use-mode";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const isWholesale = useMode((s) => s.mode === "wholesale");

  const wholesalePrice = Math.round(product.selling_price * 0.85);
  const displayPrice = isWholesale ? wholesalePrice : product.selling_price;
  const discount = getDiscount(product);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.colors[0], isWholesale ? 5 : 1);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative bg-warm-bg rounded-xl overflow-hidden aspect-[4/5] flex items-center justify-center p-4">
        <ProductImage
          product={product}
          className="w-full h-full object-contain transition-transform duration-[400ms] ease-out group-hover:scale-[1.03]"
        />

        {isWholesale && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-white text-xs font-medium rounded">
            Wholesale
          </span>
        )}

        {!isWholesale && discount > 0 && (
          <span className="absolute top-3 right-3 px-2 py-0.5 bg-accent-soft text-discount text-xs font-semibold rounded">
            {discount}% OFF
          </span>
        )}

        {/* Quick Add — slides up on hover */}
        <button
          onClick={handleQuickAdd}
          className="absolute inset-x-0 bottom-0 h-11 bg-primary text-white text-sm font-medium tracking-[0.04em] uppercase flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out md:flex hidden"
        >
          <span className="material-symbols-outlined text-base">add_shopping_cart</span>
          Add to Cart
        </button>

        {/* Mobile: always-visible small button */}
        <button
          onClick={handleQuickAdd}
          className="md:hidden absolute bottom-3 right-3 size-10 bg-primary text-white rounded-full flex items-center justify-center shadow-md"
          aria-label="Add to cart"
        >
          <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
        </button>
      </div>

      {/* Content */}
      <div className="pt-3 pb-1 px-0.5">
        <p className="text-xs tracking-[0.06em] uppercase text-faint mb-1">
          {product.category}
        </p>
        <h3 className="font-display text-lg text-foreground line-clamp-2 mb-1.5">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold tabular-nums text-foreground">
            &#8377;{formatPrice(displayPrice)}
          </span>
          {(discount > 0 || isWholesale) && (
            <span className="text-sm text-faint line-through tabular-nums">
              &#8377;{formatPrice(product.base_price)}
            </span>
          )}
          {isWholesale && (
            <span className="text-xs text-muted">/unit</span>
          )}
        </div>
        {isWholesale && (
          <p className="text-xs text-muted mt-1">Min. 5 units</p>
        )}
      </div>
    </Link>
  );
}
