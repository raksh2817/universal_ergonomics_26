"use client";

import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/products";
import { ProductImage } from "@/components/product/product-image";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, gst, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-10 py-20 text-center">
        <span className="material-symbols-outlined text-faint mb-4" style={{ fontSize: "80px" }}>
          shopping_bag
        </span>
        <h1 className="font-display text-2xl mb-3 text-foreground">Your Cart is Empty</h1>
        <p className="text-muted mb-6">Browse our collection and find your perfect chair.</p>
        <Link
          href="/products"
          className="inline-block px-8 py-3 bg-primary text-white font-medium text-sm tracking-[0.04em] uppercase rounded-lg hover:bg-primary-light transition"
        >
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-10 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-faint mb-6">
        <Link href="/" className="hover:text-foreground transition">Home</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Cart</span>
      </nav>

      <h1 className="font-display text-2xl md:text-3xl mb-6 text-foreground">
        Shopping Cart{" "}
        <span className="text-muted font-sans text-base font-normal">
          ({items.length} {items.length === 1 ? "item" : "items"})
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={`${item.product.slug}-${item.selectedColor}`}
              className="bg-surface-raised border border-[var(--color-border)] rounded-xl p-4 md:p-5 flex gap-4 md:gap-5"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-warm-bg">
                <ProductImage product={item.product} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="font-medium text-foreground hover:text-primary transition line-clamp-1"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-muted">{item.selectedColor}</p>
                <p className="text-foreground font-bold tabular-nums mt-1">
                  &#8377;{formatPrice(item.product.selling_price)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div className="flex items-center border border-[var(--color-border)] rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      updateQuantity(item.product.slug, item.selectedColor, item.quantity - 1)
                    }
                    className="w-8 h-8 flex items-center justify-center text-muted hover:bg-surface-muted transition text-sm"
                  >
                    &minus;
                  </button>
                  <span className="w-9 h-8 border-x border-[var(--color-border)] text-sm text-center flex items-center justify-center font-medium text-foreground tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product.slug, item.selectedColor, item.quantity + 1)
                    }
                    className="w-8 h-8 flex items-center justify-center text-muted hover:bg-surface-muted transition text-sm"
                  >
                    +
                  </button>
                </div>
                <p className="font-bold tabular-nums text-foreground">
                  &#8377;{formatPrice(item.product.selling_price * item.quantity)}
                </p>
                <button
                  onClick={() => removeItem(item.product.slug, item.selectedColor)}
                  className="text-xs text-error hover:underline transition flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">delete</span>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-surface-muted border border-[var(--color-border)] rounded-xl p-5 sticky top-36">
            <h2 className="font-display text-lg mb-5 text-foreground">Order Summary</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="font-medium text-foreground tabular-nums">
                  &#8377;{formatPrice(subtotal())}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">GST (18%)</span>
                <span className="font-medium text-foreground tabular-nums">
                  &#8377;{formatPrice(gst())}
                </span>
              </div>
              <div className="flex justify-between text-success">
                <span>Delivery</span>
                <span className="font-medium">FREE</span>
              </div>
              <div className="border-t border-[var(--color-border)] pt-3 flex justify-between font-bold text-lg">
                <span className="text-foreground">Total</span>
                <span className="text-primary tabular-nums">&#8377;{formatPrice(total())}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full mt-5 h-12 bg-primary hover:bg-primary-light text-white font-medium text-sm tracking-[0.04em] uppercase rounded-lg text-center leading-[3rem] transition"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/products"
              className="block w-full mt-2 h-12 border-[1.5px] border-strong text-foreground font-medium text-sm tracking-[0.04em] uppercase rounded-lg text-center leading-[2.75rem] hover:bg-surface-raised transition"
            >
              Continue Shopping
            </Link>

            <button
              onClick={clearCart}
              className="block w-full mt-3 text-sm text-muted hover:text-error text-center transition"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
