"use client";

import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/lib/api";
import { useCart } from "@/hooks/use-cart";
import { useParams } from "next/navigation";
import { useState } from "react";
import type { ProductVariant } from "@/types/product";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const addItem = useCart((s) => s.addItem);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse h-96 bg-gray-100 rounded-lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-red-600">Product not found.</p>
      </div>
    );
  }

  const finalPrice =
    product.selling_price + (selectedVariant?.price_adjustment || 0);

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image placeholder */}
        <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center text-gray-400">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0].url}
              alt={product.images[0].alt_text || product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-lg">Product Image</span>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm text-brand-600 font-medium mb-1">
            {product.category?.name || "Office Chair"}
          </p>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          {product.tagline && (
            <p className="text-gray-500 mb-4">{product.tagline}</p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-brand-700">
              &#8377;{finalPrice.toLocaleString("en-IN")}
            </span>
            {product.base_price > product.selling_price && (
              <span className="text-lg text-gray-400 line-through">
                &#8377;{product.base_price.toLocaleString("en-IN")}
              </span>
            )}
            <span className="text-sm text-gray-500">
              + {product.gst_percent || 18}% GST
            </span>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color / Variant
              </label>
              <div className="flex gap-2 flex-wrap">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded border text-sm ${
                      selectedVariant?.id === v.id
                        ? "border-brand-600 bg-brand-50 text-brand-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {v.color}
                    {v.price_adjustment > 0 &&
                      ` (+₹${v.price_adjustment.toLocaleString("en-IN")})`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border rounded">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-lg"
              >
                -
              </button>
              <span className="px-4 py-2 border-x">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-lg"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              {added ? "Added!" : "Add to Cart"}
            </button>
          </div>

          {/* Delivery Promise */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium text-sm">
              Free 48-hour delivery + on-site assembly in Bangalore
            </p>
          </div>

          {/* Specs */}
          {product.specs && (
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3">Specifications</h3>
              <dl className="grid grid-cols-2 gap-y-2 text-sm">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="contents">
                    <dt className="text-gray-500 capitalize">
                      {key.replace(/_/g, " ")}
                    </dt>
                    <dd className="font-medium">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Warranty */}
          {product.warranty_years && (
            <p className="mt-4 text-sm text-gray-500">
              {product.warranty_years}-year warranty included
            </p>
          )}

          {/* AR placeholder */}
          {product.ar_model_url && (
            <div className="mt-6 p-4 border border-dashed border-brand-300 rounded-lg text-center text-sm text-brand-600">
              AR &quot;View in Room&quot; — Coming Soon
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">About This Chair</h2>
          <p className="text-gray-700 leading-relaxed max-w-3xl">
            {product.description}
          </p>
        </div>
      )}
    </div>
  );
}
