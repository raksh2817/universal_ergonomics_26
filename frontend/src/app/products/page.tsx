"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/product/product-card";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const heroOnly = searchParams.get("hero_only") === "true";
  const category = searchParams.get("category") || undefined;

  const params: Record<string, string> = {};
  if (heroOnly) params.hero_only = "true";
  if (category) params.category_slug = category;

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">
        {heroOnly ? "Hero Collection" : "All Office Chairs"}
      </h1>
      <p className="text-gray-500 mb-8">
        {heroOnly
          ? "Our curated selection of 15 flagship chairs."
          : "Browse our full range of factory-direct office chairs."}
      </p>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-80 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      )}

      {error && (
        <p className="text-red-600">
          Failed to load products. Please try again.
        </p>
      )}

      {products && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12">Loading...</div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
