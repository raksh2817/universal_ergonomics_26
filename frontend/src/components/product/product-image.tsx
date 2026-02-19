"use client";

import { useState } from "react";
import type { Product } from "@/types/product";

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
        className={`bg-surface-muted flex flex-col items-center justify-center gap-2 ${className}`}
      >
        {/* Branded chair silhouette fallback */}
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-16 text-faint opacity-40"
        >
          <path
            d="M24 56V68M56 56V68M20 56h40a4 4 0 004-4V28a4 4 0 00-4-4H40M20 56a4 4 0 01-4-4V28a4 4 0 014-4h4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M28 24V16a4 4 0 014-4h16a4 4 0 014 4v8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="40" cy="40" r="4" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span className="text-xs font-medium text-faint text-center px-4">
          {product.name}
        </span>
      </div>
    );
  }

  return (
    <img
      src={product.image}
      alt={`${product.name}${product.colors[0] ? ` in ${product.colors[0]}` : ""}`}
      className={className}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}
