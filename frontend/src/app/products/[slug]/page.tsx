"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { getProductBySlug, formatPrice, getDiscount, getProductsByCategory } from "@/lib/products";
import { ProductImage } from "@/components/product/product-image";
import { ProductCard } from "@/components/product/product-card";
import { useCart } from "@/hooks/use-cart";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug);
  const addItem = useCart((s) => s.addItem);

  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-500 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/products" className="text-blue-600 hover:underline font-medium">
          Browse all chairs &rarr;
        </Link>
      </div>
    );
  }

  const discount = getDiscount(product);
  const related = getProductsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  const handleAddToCart = () => {
    addItem(product, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-blue-600">All Chairs</Link>
        <span className="mx-2">/</span>
        <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-blue-600">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-50 aspect-square">
          <ProductImage product={product} className="w-full h-full object-cover" />
          {discount > 0 && (
            <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
              Save {discount}%
            </span>
          )}
        </div>

        {/* Info */}
        <div>
          <Link
            href={`/products?category=${encodeURIComponent(product.category)}`}
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            {product.category}
          </Link>
          <h1 className="text-3xl font-bold mt-1 mb-2">{product.name}</h1>
          <p className="text-gray-500 mb-5">{product.tagline}</p>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">
              &#8377;{formatPrice(product.selling_price)}
            </span>
            {discount > 0 && (
              <span className="text-lg text-gray-400 line-through">
                &#8377;{formatPrice(product.base_price)}
              </span>
            )}
            <span className="text-sm text-gray-500">+ 18% GST</span>
          </div>

          {/* Color selector */}
          {product.colors.length > 1 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color: <span className="text-gray-900">{selectedColor}</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                      selectedColor === color
                        ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-200"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2.5 text-lg text-gray-600 hover:text-gray-900 transition"
              >
                -
              </button>
              <span className="px-4 py-2.5 border-x border-gray-300 min-w-[3rem] text-center font-medium">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2.5 text-lg text-gray-600 hover:text-gray-900 transition"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className={`flex-1 font-semibold py-3 px-6 rounded-lg transition text-white ${
                added
                  ? "bg-green-600"
                  : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
              }`}
            >
              {added ? "Added to Cart!" : "Add to Cart"}
            </button>
          </div>

          {/* Delivery promise */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
              <div>
                <p className="text-green-800 font-medium text-sm">Free 48-hour delivery in Bangalore</p>
                <p className="text-green-700 text-xs mt-0.5">Includes on-site assembly by our trained technicians</p>
              </div>
            </div>
          </div>

          {/* Quick info */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-bold text-gray-900">{product.warranty_years} Year{product.warranty_years > 1 ? "s" : ""}</p>
              <p className="text-xs text-gray-500">Warranty</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-bold text-gray-900">{product.weight_kg} kg</p>
              <p className="text-xs text-gray-500">Weight</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-bold text-gray-900">{product.is_b2b_available ? "Yes" : "No"}</p>
              <p className="text-xs text-gray-500">B2B Available</p>
            </div>
          </div>

          {/* Specifications */}
          <details className="border border-gray-200 rounded-xl" open>
            <summary className="px-5 py-4 font-semibold cursor-pointer select-none hover:bg-gray-50 transition rounded-xl">
              Specifications
            </summary>
            <div className="px-5 pb-5">
              <dl className="divide-y divide-gray-100">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2.5 text-sm">
                    <dt className="text-gray-500">{key}</dt>
                    <dd className="font-medium text-gray-900">
                      {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </details>
        </div>
      </div>

      {/* Description */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-xl font-bold mb-4">About This Chair</h2>
        <p className="text-gray-600 leading-relaxed max-w-3xl">{product.description}</p>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-16 border-t pt-10">
          <h2 className="text-xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
