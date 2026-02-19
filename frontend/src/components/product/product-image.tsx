"use client";

import { useState } from "react";
import type { Product } from "@/types/product";

/**
 * Product image with fallback placeholder.
 * When real images are added to /public/products/[slug].jpg, they'll show automatically.
 * Until then, displays a styled placeholder with the product name.
 */
export function ProductImage({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !product.image) {
    return (
      <div
        className={`bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-gray-400 ${className}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-xs font-medium text-center px-4">{product.name}</span>
      </div>
    );
  }

  return (
    <img
      src={product.image}
      alt={product.name}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
