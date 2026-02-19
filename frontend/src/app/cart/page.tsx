"use client";

import Link from "next/link";
import { useCart } from "@/hooks/use-cart";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-6">
          Browse our collection and add chairs to your cart.
        </p>
        <Link
          href="/products"
          className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3 rounded-lg transition"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  const gst = subtotal() * 0.18;
  const total = subtotal() + gst;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.variant?.id || ""}`}
              className="border rounded-lg p-4 flex gap-4"
            >
              <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center text-xs text-gray-400">
                Image
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.product.name}</h3>
                {item.variant && (
                  <p className="text-sm text-gray-500">{item.variant.color}</p>
                )}
                <p className="text-brand-700 font-bold mt-1">
                  &#8377;
                  {(
                    item.product.selling_price +
                    (item.variant?.price_adjustment || 0)
                  ).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product.id,
                        item.quantity - 1,
                        item.variant?.id
                      )
                    }
                    className="px-2 py-1 text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 border-x text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product.id,
                        item.quantity + 1,
                        item.variant?.id
                      )
                    }
                    className="px-2 py-1 text-sm"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() =>
                    removeItem(item.product.id, item.variant?.id)
                  }
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border rounded-lg p-6 h-fit">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
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
          <Link
            href="/checkout"
            className="block w-full mt-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg text-center transition"
          >
            Proceed to Checkout
          </Link>
          <button
            onClick={clearCart}
            className="block w-full mt-2 text-sm text-gray-500 hover:text-red-500 text-center"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
