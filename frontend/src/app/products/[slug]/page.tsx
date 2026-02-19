"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { getProductBySlug, formatPrice, getDiscount, getProductsByCategory } from "@/lib/products";
import { ProductImage } from "@/components/product/product-image";
import { ProductCard } from "@/components/product/product-card";
import { useCart } from "@/hooks/use-cart";
import { useMode } from "@/hooks/use-mode";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug);
  const addItem = useCart((s) => s.addItem);
  const mode = useMode((s) => s.mode);

  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "");
  const [quantity, setQuantity] = useState(mode === "wholesale" ? 5 : 1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-[#6e6e73] mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/products" className="text-primary hover:underline font-medium">
          Browse all chairs &rarr;
        </Link>
      </div>
    );
  }

  const isWholesale = mode === "wholesale";
  const discount = getDiscount(product);
  const related = getProductsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 5);

  const wholesalePrice = Math.round(product.selling_price * 0.85);
  const unitPrice = isWholesale ? wholesalePrice : product.selling_price;
  const subtotal = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem(product, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-20 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <Link href="/products" className="hover:text-primary">All Chairs</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-primary">
          {product.category}
        </Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Image & Specs */}
        <div className="lg:col-span-7 space-y-12">
          <div className="aspect-[4/3] bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center relative">
            <ProductImage product={product} className="w-full h-full object-contain p-8" />
            {isWholesale && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider">
                Wholesale Pricing
              </span>
            )}
          </div>

          <section className="bg-white rounded-2xl p-8 border border-gray-100">
            <h3 className="text-xl font-bold mb-6">Technical Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">
                    settings
                  </span>
                  <div>
                    <p className="text-sm font-bold">{key}</p>
                    <p className="text-sm text-gray-600">
                      {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Product Info & Purchase */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {isWholesale && (
                  <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    Wholesale
                  </span>
                )}
                {!isWholesale && product.is_b2b_available && (
                  <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    Wholesale Available
                  </span>
                )}
                <span className="text-xs text-gray-500 font-medium tracking-wide">SKU: {product.sku}</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight">{product.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{product.tagline}</p>
            </div>

            {/* Pricing */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-black text-primary">
                  &#8377;{formatPrice(unitPrice)}
                </p>
                {(discount > 0 || isWholesale) && (
                  <p className="text-lg text-gray-400 line-through font-medium">
                    &#8377;{formatPrice(product.base_price)} MRP
                  </p>
                )}
              </div>
              <p className="text-sm font-bold text-gray-900">
                {isWholesale ? "Wholesale Unit Price" : "Retail Price"} + 18% GST
              </p>
              {isWholesale && (
                <div className="flex items-center gap-2 mt-2 py-2 px-3 bg-amber-50 rounded-lg border border-amber-100">
                  <span className="material-symbols-outlined text-amber-600 text-sm">info</span>
                  <p className="text-xs text-amber-800 font-medium">Minimum Order Quantity (MOQ): 5 Units</p>
                </div>
              )}
            </div>

            {/* Color Selector */}
            {product.colors.length > 1 && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                  Color: {selectedColor}
                </label>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                        selectedColor === color
                          ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Order Module */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
              {isWholesale && (
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Tiered Pricing</h4>
                  <div className="overflow-hidden rounded-xl border border-gray-100">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr className="text-left">
                          <th className="px-4 py-3 font-semibold text-gray-600">Quantity</th>
                          <th className="px-4 py-3 font-semibold text-gray-600 text-right">Unit Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        <tr className="pricing-table-row bg-primary/5">
                          <td className="px-4 py-3 font-medium">5 - 19 Units</td>
                          <td className="px-4 py-3 text-right font-bold text-primary">&#8377;{formatPrice(Math.round(product.selling_price * 0.90))}</td>
                        </tr>
                        <tr className="pricing-table-row">
                          <td className="px-4 py-3 font-medium">20 - 49 Units</td>
                          <td className="px-4 py-3 text-right font-bold">&#8377;{formatPrice(Math.round(product.selling_price * 0.88))}</td>
                        </tr>
                        <tr className="pricing-table-row">
                          <td className="px-4 py-3 font-medium">50 - 99 Units</td>
                          <td className="px-4 py-3 text-right font-bold">&#8377;{formatPrice(wholesalePrice)}</td>
                        </tr>
                        <tr className="pricing-table-row">
                          <td className="px-4 py-3 font-medium">100+ Units</td>
                          <td className="px-4 py-3 text-right font-bold">&#8377;{formatPrice(Math.round(product.selling_price * 0.80))}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Order Quantity</label>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <input
                        className="w-full border-gray-200 rounded-lg py-3 px-4 focus:ring-primary focus:border-primary font-bold text-lg"
                        min={isWholesale ? 5 : 1}
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(isWholesale ? 5 : 1, parseInt(e.target.value) || 1))}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">Units</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-400">Subtotal</p>
                      <p className="text-xl font-black">&#8377;{formatPrice(subtotal)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                      added
                        ? "bg-green-600 text-white shadow-green-600/20"
                        : "bg-primary hover:bg-primary/90 text-white shadow-primary/20"
                    }`}
                  >
                    <span className="material-symbols-outlined">
                      {added ? "check_circle" : "add_shopping_cart"}
                    </span>
                    {added ? "Added to Cart!" : isWholesale ? `Add ${quantity} to Cart` : "Add to Cart"}
                  </button>
                  {isWholesale && (
                    <a
                      href="tel:+919845007572"
                      className="w-full border-2 border-primary text-primary hover:bg-primary/5 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">call</span>
                      Call for Custom Quote
                    </a>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Warranty:</span>
                  <span className="text-gray-900 font-bold">{product.warranty_years} Year{product.warranty_years > 1 ? "s" : ""}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Delivery:</span>
                  <span className="text-gray-900 font-bold">Free {isWholesale ? "2-3 days" : "48-hour"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Assembly:</span>
                  <span className="text-gray-900 font-bold">On-site included</span>
                </div>
                {isWholesale && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">GST Invoice:</span>
                    <span className="text-gray-900 font-bold">Yes (ITC eligible)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="mt-24 py-16 border-t border-gray-200">
        <div className="max-w-3xl">
          <h3 className="text-xl font-bold mb-4">About This Chair</h3>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-16 border-t border-gray-200">
          <h3 className="text-2xl font-bold mb-8">You May Also Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {related.map((p) => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
