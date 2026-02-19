"use client";

import { useCart } from "@/hooks/use-cart";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Nothing to Checkout</h1>
        <Link
          href="/products"
          className="text-brand-600 hover:underline"
        >
          Browse products
        </Link>
      </div>
    );
  }

  const gst = subtotal() * 0.18;
  const total = subtotal() + gst;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Shipping Address Form */}
      <div className="border rounded-lg p-6 mb-6">
        <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 1
            </label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 2
            </label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                defaultValue="Bangalore"
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                defaultValue="Karnataka"
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode
              </label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
        </form>
      </div>

      {/* Order Summary */}
      <div className="border rounded-lg p-6 mb-6">
        <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
        <div className="space-y-2 text-sm">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.variant?.id || ""}`}
              className="flex justify-between"
            >
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span>
                &#8377;
                {(
                  (item.product.selling_price +
                    (item.variant?.price_adjustment || 0)) *
                  item.quantity
                ).toLocaleString("en-IN")}
              </span>
            </div>
          ))}
          <div className="border-t pt-2 flex justify-between">
            <span>Subtotal</span>
            <span>&#8377;{subtotal().toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (18%)</span>
            <span>&#8377;{gst.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Delivery</span>
            <span>FREE</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>&#8377;{total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* Payment Button (Razorpay integration placeholder) */}
      <button className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-4 rounded-lg transition text-lg">
        Pay with Razorpay — &#8377;{total.toLocaleString("en-IN")}
      </button>
      <p className="text-xs text-gray-400 text-center mt-2">
        Secure payment powered by Razorpay. UPI, cards, net banking accepted.
      </p>
    </div>
  );
}
