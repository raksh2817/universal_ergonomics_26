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
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-10 py-16 text-center">
        <h1 className="font-display text-2xl mb-4">Product Not Found</h1>
        <p className="text-muted mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
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
    .slice(0, 4);

  const wholesalePrice = Math.round(product.selling_price * 0.85);
  const unitPrice = isWholesale ? wholesalePrice : product.selling_price;
  const subtotal = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem(product, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-10 py-6 md:py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-faint mb-6 flex-wrap">
        <Link href="/" className="hover:text-foreground transition">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground transition">All Chairs</Link>
        <span>/</span>
        <Link
          href={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-foreground transition"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Image */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-warm-bg rounded-2xl overflow-hidden aspect-[4/5] flex items-center justify-center p-6 lg:p-10 relative">
            <ProductImage
              product={product}
              className="w-full h-full object-contain"
            />
            {isWholesale && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs font-medium rounded">
                Wholesale Pricing
              </span>
            )}
          </div>

          {/* Specs Table */}
          <section className="bg-surface-raised rounded-xl border border-[var(--color-border)] overflow-hidden">
            <div className="p-5 lg:p-6 border-b border-[var(--color-border)]">
              <h3 className="font-display text-xl text-foreground">Technical Specifications</h3>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {Object.entries(product.specs).map(([key, value], idx) => (
                <div
                  key={key}
                  className={`flex justify-between px-5 lg:px-6 py-3.5 ${
                    idx % 2 === 0 ? "" : "bg-surface-muted"
                  }`}
                >
                  <span className="text-sm font-medium text-foreground">{key}</span>
                  <span className="text-sm text-muted font-mono">
                    {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-5">
          <div className="sticky top-36 space-y-5">
            {/* Category */}
            <p className="text-xs uppercase tracking-[0.06em] text-accent font-medium">
              {product.category}
            </p>

            {/* Name + Tagline */}
            <h1 className="font-display text-2xl lg:text-3xl text-foreground">{product.name}</h1>
            <p className="text-muted leading-relaxed">{product.tagline}</p>

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-xl font-bold tabular-nums text-foreground">
                  &#8377;{formatPrice(unitPrice)}
                </span>
                {(discount > 0 || isWholesale) && (
                  <span className="text-sm text-faint line-through tabular-nums">
                    &#8377;{formatPrice(product.base_price)}
                  </span>
                )}
                {discount > 0 && !isWholesale && (
                  <span className="px-2 py-0.5 bg-accent-soft text-discount text-xs font-semibold rounded">
                    {discount}% OFF
                  </span>
                )}
              </div>
              <p className="text-sm text-muted">
                {isWholesale ? "Wholesale Unit Price" : "Retail Price"} + 18% GST
              </p>
              {isWholesale && (
                <div className="flex items-center gap-2 mt-1.5 py-2 px-3 bg-accent-soft rounded-lg">
                  <span className="material-symbols-outlined text-primary text-sm">info</span>
                  <p className="text-xs text-primary font-medium">
                    Minimum Order Quantity (MOQ): 5 Units
                  </p>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--color-border)]" />

            {/* Color Selector */}
            {product.colors.length > 1 && (
              <div>
                <label className="text-sm font-medium text-muted mb-2 block">
                  Color: <span className="text-foreground">{selectedColor}</span>
                </label>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                        selectedColor === color
                          ? "border-primary bg-accent-soft text-primary"
                          : "border-[var(--color-border)] text-muted hover:border-strong"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Wholesale Pricing Tiers */}
            {isWholesale && (
              <div>
                <h4 className="text-sm font-medium text-muted mb-3">Tiered Pricing</h4>
                <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-muted border-b border-[var(--color-border)]">
                      <tr>
                        <th className="px-4 py-2.5 text-left font-medium text-muted">Quantity</th>
                        <th className="px-4 py-2.5 text-right font-medium text-muted">Unit Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                      <tr className="bg-accent-soft">
                        <td className="px-4 py-2.5 font-medium text-foreground">5 – 19 Units</td>
                        <td className="px-4 py-2.5 text-right font-bold text-primary tabular-nums">
                          &#8377;{formatPrice(Math.round(product.selling_price * 0.90))}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-medium text-foreground">20 – 49 Units</td>
                        <td className="px-4 py-2.5 text-right font-bold text-foreground tabular-nums">
                          &#8377;{formatPrice(Math.round(product.selling_price * 0.88))}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-medium text-foreground">50 – 99 Units</td>
                        <td className="px-4 py-2.5 text-right font-bold text-foreground tabular-nums">
                          &#8377;{formatPrice(wholesalePrice)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-medium text-foreground">100+ Units</td>
                        <td className="px-4 py-2.5 text-right font-bold text-foreground tabular-nums">
                          &#8377;{formatPrice(Math.round(product.selling_price * 0.80))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted mb-1.5 block">Quantity</label>
                  <div className="flex items-center h-12 border border-[var(--color-border)] rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(isWholesale ? 5 : 1, quantity - 1))}
                      className="w-12 h-full flex items-center justify-center text-muted hover:bg-surface-muted transition text-lg"
                    >
                      &minus;
                    </button>
                    <input
                      type="number"
                      min={isWholesale ? 5 : 1}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(isWholesale ? 5 : 1, parseInt(e.target.value) || 1))
                      }
                      className="flex-1 h-full text-center font-bold text-foreground bg-transparent border-x border-[var(--color-border)] focus:outline-none tabular-nums"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-full flex items-center justify-center text-muted hover:bg-surface-muted transition text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted mb-0.5">Subtotal</p>
                  <p className="text-xl font-bold text-foreground tabular-nums">
                    &#8377;{formatPrice(subtotal)}
                  </p>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full h-12 rounded-lg font-medium text-sm tracking-[0.04em] uppercase flex items-center justify-center gap-2 transition ${
                  added
                    ? "bg-success text-white"
                    : "bg-primary hover:bg-primary-light text-white"
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {added ? "check_circle" : "add_shopping_cart"}
                </span>
                {added
                  ? "Added to Cart!"
                  : isWholesale
                    ? `Add ${quantity} to Cart`
                    : "Add to Cart"}
              </button>

              {isWholesale && (
                <a
                  href="tel:+919845007572"
                  className="w-full h-12 border-[1.5px] border-strong text-foreground hover:bg-surface-muted rounded-lg font-medium text-sm tracking-[0.04em] uppercase flex items-center justify-center gap-2 transition"
                >
                  <span className="material-symbols-outlined text-lg">call</span>
                  Call for Custom Quote
                </a>
              )}
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap gap-4 py-3 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-accent text-base">local_shipping</span>
                Free Delivery
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-accent text-base">autorenew</span>
                7-Day Returns
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-accent text-base">receipt_long</span>
                GST Invoice
              </span>
            </div>

            {/* Service Info */}
            <div className="bg-surface-muted rounded-lg p-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Warranty</span>
                <span className="font-medium text-foreground">
                  {product.warranty_years} Year{product.warranty_years > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Delivery</span>
                <span className="font-medium text-foreground">
                  Free {isWholesale ? "2-3 days" : "48-hour"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Assembly</span>
                <span className="font-medium text-foreground">On-site included</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">SKU</span>
                <span className="font-mono text-sm text-muted">{product.sku}</span>
              </div>
              {isWholesale && (
                <div className="flex justify-between">
                  <span className="text-muted">GST Invoice</span>
                  <span className="font-medium text-foreground">Yes (ITC eligible)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="mt-16 md:mt-24 py-10 md:py-16 border-t border-[var(--color-border)]">
        <div className="max-w-3xl">
          <h3 className="font-display text-xl mb-4 text-foreground">About This Chair</h3>
          <p className="text-muted leading-relaxed">{product.description}</p>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-10 md:py-16 border-t border-[var(--color-border)]">
          <h3 className="font-display text-2xl mb-8 text-foreground">You May Also Like</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
