"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/products";
import type { ShippingAddress } from "@/types/product";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, gst, total, placeOrder } = useCart();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-10 py-20 text-center">
        <h1 className="font-display text-2xl mb-4 text-foreground">Nothing to Checkout</h1>
        <p className="text-muted mb-6">Add some chairs to your cart first.</p>
        <Link href="/products" className="text-primary hover:underline font-medium">
          Browse chairs &rarr;
        </Link>
      </div>
    );
  }

  function validate(form: FormData): ShippingAddress | null {
    const address: ShippingAddress = {
      fullName: (form.get("fullName") as string || "").trim(),
      phone: (form.get("phone") as string || "").trim(),
      email: (form.get("email") as string || "").trim(),
      line1: (form.get("line1") as string || "").trim(),
      line2: (form.get("line2") as string || "").trim(),
      city: (form.get("city") as string || "").trim(),
      state: (form.get("state") as string || "").trim(),
      pincode: (form.get("pincode") as string || "").trim(),
    };

    const newErrors: Record<string, string> = {};
    if (!address.fullName) newErrors.fullName = "Name is required";
    if (!address.phone || address.phone.length < 10) newErrors.phone = "Valid phone number required";
    if (!address.email || !address.email.includes("@")) newErrors.email = "Valid email required";
    if (!address.line1) newErrors.line1 = "Address is required";
    if (!address.pincode || address.pincode.length < 6) newErrors.pincode = "Valid 6-digit pincode required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 ? address : null;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const address = validate(form);
    if (!address) return;

    setSubmitting(true);
    setTimeout(() => {
      placeOrder(address);
      router.push("/order-confirmation");
    }, 1500);
  }

  const inputBase =
    "w-full h-12 border rounded-lg px-4 text-base bg-surface-raised text-foreground placeholder:text-faint placeholder:italic focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(26,26,46,0.06)] transition";

  const inputClass = (field: string) =>
    `${inputBase} ${errors[field] ? "border-error" : "border-[var(--color-border)]"}`;

  const steps = [
    { num: 1, label: "Cart", done: true },
    { num: 2, label: "Shipping", active: true },
    { num: 3, label: "Confirmation" },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-10 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-faint mb-6">
        <Link href="/" className="hover:text-foreground transition">Home</Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-foreground transition">Cart</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Checkout</span>
      </nav>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-0 mb-10 max-w-md mx-auto">
        {steps.map((step, idx) => (
          <div key={step.num} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  step.done
                    ? "bg-success text-white"
                    : step.active
                      ? "bg-primary text-white"
                      : "bg-surface-muted text-faint border border-[var(--color-border)]"
                }`}
              >
                {step.done ? (
                  <span className="material-symbols-outlined text-sm">check</span>
                ) : (
                  step.num
                )}
              </div>
              <span className={`text-xs mt-1.5 ${step.active ? "text-foreground font-medium" : "text-muted"}`}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-px mx-3 mt-[-18px] ${step.done ? "bg-success" : "bg-[var(--color-border)]"}`} />
            )}
          </div>
        ))}
      </div>

      <h1 className="font-display text-2xl md:text-3xl mb-8 text-foreground">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-surface-raised border border-[var(--color-border)] rounded-xl p-5 md:p-6">
              <h2 className="font-display text-lg mb-5 text-foreground">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1.5">Full Name *</label>
                    <input name="fullName" className={inputClass("fullName")} placeholder="Rakesh Kumar" />
                    {errors.fullName && <p className="text-error text-xs mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1.5">Phone *</label>
                    <input name="phone" type="tel" className={inputClass("phone")} placeholder="9876543210" />
                    {errors.phone && <p className="text-error text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1.5">Email *</label>
                  <input name="email" type="email" className={inputClass("email")} placeholder="you@example.com" />
                  {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1.5">Address Line 1 *</label>
                  <input name="line1" className={inputClass("line1")} placeholder="Flat/Building, Street" />
                  {errors.line1 && <p className="text-error text-xs mt-1">{errors.line1}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1.5">Address Line 2</label>
                  <input name="line2" className={inputBase + " border-[var(--color-border)]"} placeholder="Area, Landmark" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1.5">City</label>
                    <input name="city" defaultValue="Bengaluru" className={inputBase + " border-[var(--color-border)]"} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1.5">State</label>
                    <input name="state" defaultValue="Karnataka" className={inputBase + " border-[var(--color-border)]"} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1.5">Pincode *</label>
                    <input name="pincode" className={inputClass("pincode")} placeholder="560001" maxLength={6} />
                    {errors.pincode && <p className="text-error text-xs mt-1">{errors.pincode}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="p-5 rounded-xl bg-accent-soft border border-accent/20">
              <h4 className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-accent text-base">local_shipping</span>
                Free 48-hour Delivery
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                Our team will deliver and assemble your chair at your location within 48 hours. Completely free of cost across Bengaluru.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-surface-raised border border-[var(--color-border)] rounded-xl p-5 sticky top-36">
              <h2 className="font-display text-lg mb-5 text-foreground">Order Summary</h2>
              <div className="space-y-2.5 mb-4">
                {items.map((item) => (
                  <div key={`${item.product.slug}-${item.selectedColor}`} className="flex justify-between text-sm">
                    <span className="text-muted truncate mr-2">
                      {item.product.name}{" "}
                      <span className="text-faint">x{item.quantity}</span>
                    </span>
                    <span className="font-medium text-foreground flex-shrink-0 tabular-nums">
                      &#8377;{formatPrice(item.product.selling_price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[var(--color-border)] pt-3 space-y-2 text-sm">
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

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-5 h-14 bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-accent-fg font-medium text-sm tracking-[0.04em] uppercase rounded-lg transition flex items-center justify-center gap-2"
              >
                {submitting ? (
                  "Processing..."
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">lock</span>
                    Place Order — &#8377;{formatPrice(total())}
                  </>
                )}
              </button>
              <p className="text-[10px] text-faint text-center mt-3 italic">
                Secure payment via Razorpay. UPI, cards, and net banking accepted.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
