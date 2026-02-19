"use client";

import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/products";

function CheckIcon() {
  return (
    <svg
      className="w-16 h-16"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="30" stroke="var(--color-success)" strokeWidth="3" />
      <path
        d="M20 33L28 41L44 25"
        stroke="var(--color-success)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="40"
        strokeDashoffset="40"
        style={{ animation: "checkDraw 0.6s ease-out 0.3s forwards" }}
      />
    </svg>
  );
}

export default function OrderConfirmationPage() {
  const lastOrder = useCart((s) => s.lastOrder);

  if (!lastOrder) {
    return (
      <div className="max-w-[640px] mx-auto px-4 md:px-6 py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-soft text-primary mb-6">
          <span className="material-symbols-outlined text-4xl">info</span>
        </div>
        <h1 className="font-display text-2xl mb-4 text-foreground">No Order Found</h1>
        <p className="text-muted mb-6">
          Looks like you haven&apos;t placed an order yet.
        </p>
        <Link
          href="/products"
          className="text-primary hover:underline font-medium"
        >
          Shop now &rarr;
        </Link>
      </div>
    );
  }

  const orderDate = new Date(lastOrder.createdAt);

  return (
    <div className="bg-surface min-h-screen">
      <main className="max-w-[640px] mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-5">
            <CheckIcon />
          </div>
          <h1 className="font-display text-3xl md:text-[2.5rem] mb-3 text-foreground">
            Order Confirmed!
          </h1>
          <p className="text-muted max-w-md mx-auto">
            Thank you for choosing Universal Ergonomics. We&apos;ve received your order and our team is preparing your ergonomic solutions.
          </p>
        </div>

        {/* Order Number */}
        <div className="bg-surface-muted rounded-xl p-5 text-center mb-6">
          <p className="text-xs font-medium uppercase tracking-[0.06em] text-muted mb-1">
            Order Number
          </p>
          <p className="font-mono text-xl tracking-[0.05em] text-foreground">
            {lastOrder.orderNumber}
          </p>
          <p className="text-xs text-muted mt-1">
            {orderDate.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Line Items */}
        <div className="bg-surface-raised border border-[var(--color-border)] rounded-xl overflow-hidden mb-6">
          <div className="p-5 border-b border-[var(--color-border)]">
            <h2 className="font-display text-lg text-foreground">Order Summary</h2>
          </div>
          <div className="p-5 space-y-4">
            {lastOrder.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-warm-bg flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-faint text-xl">chair</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground truncate">{item.product.name}</h3>
                  <p className="text-xs text-muted">
                    {item.selectedColor} &middot; Qty: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-bold text-foreground tabular-nums flex-shrink-0">
                  &#8377;{formatPrice(item.product.selling_price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="bg-surface-muted p-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="font-medium text-foreground tabular-nums">
                &#8377;{formatPrice(lastOrder.subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">GST (18%)</span>
              <span className="font-medium text-foreground tabular-nums">
                &#8377;{formatPrice(lastOrder.gst)}
              </span>
            </div>
            <div className="flex justify-between text-success">
              <span>Delivery</span>
              <span className="font-medium">FREE</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-[var(--color-border)]">
              <span className="text-foreground">Total</span>
              <span className="text-primary tabular-nums">
                &#8377;{formatPrice(lastOrder.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-surface-raised border border-[var(--color-border)] rounded-xl p-5 mb-6">
          <h3 className="text-xs font-medium uppercase tracking-[0.06em] text-muted mb-3">
            Shipping Address
          </h3>
          <div className="text-sm text-muted space-y-0.5">
            <p className="font-medium text-foreground">{lastOrder.address.fullName}</p>
            <p>{lastOrder.address.line1}</p>
            {lastOrder.address.line2 && <p>{lastOrder.address.line2}</p>}
            <p>
              {lastOrder.address.city}, {lastOrder.address.state} - {lastOrder.address.pincode}
            </p>
            <p className="pt-1.5">Phone: {lastOrder.address.phone}</p>
            <p>Email: {lastOrder.address.email}</p>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-accent-soft border border-accent/20 rounded-xl p-5 mb-8">
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-accent text-base">info</span>
            What Happens Next
          </h4>
          <ol className="text-xs text-muted leading-relaxed space-y-1.5 list-decimal list-inside">
            <li>You&apos;ll receive an order confirmation email shortly</li>
            <li>Our team will prepare your chair(s) for delivery</li>
            <li>We&apos;ll deliver and assemble at your location within 48 hours</li>
            <li>Sit comfortably and get to work!</li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/products"
            className="w-full h-12 bg-primary hover:bg-primary-light text-white font-medium text-sm tracking-[0.04em] uppercase rounded-lg flex items-center justify-center gap-2 transition"
          >
            <span className="material-symbols-outlined text-lg">shopping_bag</span>
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="w-full h-12 border-[1.5px] border-strong text-foreground hover:bg-surface-muted font-medium text-sm tracking-[0.04em] uppercase rounded-lg flex items-center justify-center gap-2 transition"
          >
            <span className="material-symbols-outlined text-lg">home</span>
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
