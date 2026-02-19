"use client";

import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/products";

export default function OrderConfirmationPage() {
  const lastOrder = useCart((s) => s.lastOrder);

  if (!lastOrder) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
          <span className="material-symbols-outlined text-5xl">info</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">No Order Found</h1>
        <p className="text-[#6e6e73] mb-6">Looks like you haven&apos;t placed an order yet.</p>
        <Link href="/products" className="text-primary hover:underline font-medium">
          Shop now &rarr;
        </Link>
      </div>
    );
  }

  const orderDate = new Date(lastOrder.createdAt);

  return (
    <div className="bg-bg-light min-h-screen">
      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
            <span className="material-symbols-outlined text-5xl font-bold">check</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Order Confirmed!</h1>
          <p className="text-lg text-[#6e6e73] max-w-2xl mx-auto">
            Thank you for choosing Universal Ergonomics. We&apos;ve received your order and our team is preparing your ergonomic solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Order ID</p>
                <p className="text-xl font-bold">{lastOrder.orderNumber}</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Order Date</p>
                <p className="text-xl font-bold">
                  {orderDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Total Amount</p>
                <p className="text-xl font-bold text-primary">&#8377;{formatPrice(lastOrder.total)}</p>
              </div>
            </div>

            {/* Status Tracker */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold mb-8">Order Journey</h2>
              <div className="relative">
                <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200" />
                <div className="absolute top-5 left-0 w-1/4 h-0.5 bg-primary" />
                <div className="relative flex justify-between">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center z-10">
                      <span className="material-symbols-outlined text-xl">assignment_turned_in</span>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold">Order Received</p>
                      <p className="text-xs text-gray-500">
                        {orderDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center z-10">
                      <span className="material-symbols-outlined text-xl">factory</span>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-400">Processing</p>
                      <p className="text-xs text-gray-400">Next Step</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center z-10">
                      <span className="material-symbols-outlined text-xl">local_shipping</span>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-400">Shipping</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center z-10">
                      <span className="material-symbols-outlined text-xl">package_2</span>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-400">Delivery</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-bold">Order Summary</h2>
                <span className="text-sm font-medium text-gray-500">
                  {lastOrder.items.length} Item{lastOrder.items.length > 1 ? "s" : ""},{" "}
                  {lastOrder.items.reduce((s, i) => s + i.quantity, 0)} Units
                </span>
              </div>
              <div className="p-6 space-y-4">
                {lastOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <span className="material-symbols-outlined text-gray-300 text-2xl">chair</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">Color: {item.selectedColor}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm font-medium">
                          Quantity: <span className="text-primary font-bold">{item.quantity}</span>
                        </p>
                        <p className="text-base font-bold">
                          &#8377;{formatPrice(item.product.selling_price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 p-6 flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">&#8377;{formatPrice(lastOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">GST (18%)</span>
                  <span className="font-medium">&#8377;{formatPrice(lastOrder.gst)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Delivery</span>
                  <span className="font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-primary">&#8377;{formatPrice(lastOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Shipping Address</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-bold text-gray-900">{lastOrder.address.fullName}</p>
                <p>{lastOrder.address.line1}</p>
                {lastOrder.address.line2 && <p>{lastOrder.address.line2}</p>}
                <p>{lastOrder.address.city}, {lastOrder.address.state} - {lastOrder.address.pincode}</p>
                <p className="pt-2">Phone: {lastOrder.address.phone}</p>
                <p>Email: {lastOrder.address.email}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Link
                href="/products"
                className="w-full py-4 px-6 bg-[#111318] text-white font-bold rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-gray-200 hover:scale-[1.02] transition-transform"
              >
                <span className="material-symbols-outlined">shopping_bag</span>
                Continue Shopping
              </Link>
              <Link
                href="/"
                className="w-full py-3 px-6 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
              >
                <span className="material-symbols-outlined">home</span>
                Back to Home
              </Link>
            </div>

            {/* Support Info */}
            <div className="p-6 rounded-xl bg-primary/5 border border-primary/10">
              <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">info</span>
                What Happens Next
              </h4>
              <ul className="text-xs text-gray-600 leading-relaxed space-y-2">
                <li>1. You&apos;ll receive an order confirmation email shortly</li>
                <li>2. Our team will prepare your chair(s) for delivery</li>
                <li>3. We&apos;ll deliver and assemble at your location within 48 hours</li>
                <li>4. Sit comfortably and get to work!</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
