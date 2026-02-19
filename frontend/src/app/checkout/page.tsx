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
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Nothing to Checkout</h1>
        <Link href="/products" className="text-blue-600 hover:underline font-medium">
          Browse products &rarr;
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

    // Simulate payment processing
    setTimeout(() => {
      placeOrder(address);
      router.push("/order-confirmation");
    }, 1500);
  }

  const inputClass = (field: string) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      errors[field] ? "border-red-400" : "border-gray-300"
    }`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/cart" className="hover:text-blue-600">Cart</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Checkout</span>
      </nav>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Address form */}
          <div className="lg:col-span-3 space-y-6">
            <div className="border border-gray-200 rounded-xl p-6">
              <h2 className="font-bold text-lg mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input name="fullName" className={inputClass("fullName")} placeholder="Rakesh Kumar" />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input name="phone" type="tel" className={inputClass("phone")} placeholder="9876543210" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input name="email" type="email" className={inputClass("email")} placeholder="you@example.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                  <input name="line1" className={inputClass("line1")} placeholder="Flat/Building, Street" />
                  {errors.line1 && <p className="text-red-500 text-xs mt-1">{errors.line1}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                  <input name="line2" className={inputClass("line2")} placeholder="Area, Landmark" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input name="city" defaultValue="Bangalore" className={inputClass("city")} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input name="state" defaultValue="Karnataka" className={inputClass("state")} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                    <input name="pincode" className={inputClass("pincode")} placeholder="560001" maxLength={6} />
                    {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery info */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                <div>
                  <p className="text-green-800 font-medium text-sm">Free delivery within 48 hours</p>
                  <p className="text-green-700 text-xs mt-0.5">Our team will assemble the chair at your location</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="border border-gray-200 rounded-xl p-6 sticky top-24">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={`${item.product.slug}-${item.selectedColor}`} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate mr-2">
                      {item.product.name} <span className="text-gray-400">x{item.quantity}</span>
                    </span>
                    <span className="font-medium flex-shrink-0">
                      &#8377;{formatPrice(item.product.selling_price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>&#8377;{formatPrice(subtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%)</span>
                  <span>&#8377;{formatPrice(gst())}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Delivery</span>
                  <span className="font-medium">FREE</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>&#8377;{formatPrice(total())}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3.5 rounded-lg transition shadow-lg shadow-blue-600/20"
              >
                {submitting ? "Processing..." : `Pay ₹${formatPrice(total())}`}
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">
                Secure payment via Razorpay. UPI, cards, and net banking accepted.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
