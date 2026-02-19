"use client";

import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/products";

export default function OrderConfirmationPage() {
  const lastOrder = useCart((s) => s.lastOrder);

  if (!lastOrder) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">No Order Found</h1>
        <p className="text-gray-500 mb-6">Looks like you haven&apos;t placed an order yet.</p>
        <Link href="/products" className="text-blue-600 hover:underline font-medium">
          Shop now &rarr;
        </Link>
      </div>
    );
  }

  const orderDate = new Date(lastOrder.createdAt);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-green-700">Order Confirmed!</h1>
        <p className="text-gray-500">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
      </div>

      {/* Order details */}
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-wrap justify-between gap-2">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Order Number</p>
              <p className="font-bold text-lg">{lastOrder.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Order Date</p>
              <p className="font-medium">{orderDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-semibold mb-3">Items Ordered</h3>
          <div className="space-y-3">
            {lastOrder.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>
                  {item.product.name}
                  <span className="text-gray-400"> ({item.selectedColor})</span>
                  <span className="text-gray-400"> x{item.quantity}</span>
                </span>
                <span className="font-medium">
                  &#8377;{formatPrice(item.product.selling_price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>&#8377;{formatPrice(lastOrder.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">GST (18%)</span>
              <span>&#8377;{formatPrice(lastOrder.gst)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Delivery</span>
              <span>FREE</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total Paid</span>
              <span>&#8377;{formatPrice(lastOrder.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      <div className="border border-gray-200 rounded-xl p-6 mb-6">
        <h3 className="font-semibold mb-3">Shipping Address</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p className="font-medium text-gray-900">{lastOrder.address.fullName}</p>
          <p>{lastOrder.address.line1}</p>
          {lastOrder.address.line2 && <p>{lastOrder.address.line2}</p>}
          <p>{lastOrder.address.city}, {lastOrder.address.state} - {lastOrder.address.pincode}</p>
          <p>Phone: {lastOrder.address.phone}</p>
          <p>Email: {lastOrder.address.email}</p>
        </div>
      </div>

      {/* Delivery info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-blue-800 mb-2">What Happens Next?</h3>
        <ol className="text-sm text-blue-700 space-y-1.5 list-decimal list-inside">
          <li>You&apos;ll receive an order confirmation email shortly</li>
          <li>Our team will prepare your chair(s) for delivery</li>
          <li>We&apos;ll deliver and assemble at your location within 48 hours</li>
          <li>Sit comfortably and get to work!</li>
        </ol>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/products"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition text-center"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-8 py-3 rounded-lg transition text-center"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
