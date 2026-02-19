"use client";

import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/products";
import { ProductImage } from "@/components/product/product-image";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, gst, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
        <h1 className="text-2xl font-bold mb-3">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-6">Browse our collection and find your perfect chair.</p>
        <Link
          href="/products"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Cart</span>
      </nav>

      <h1 className="text-3xl font-bold mb-8">
        Shopping Cart <span className="text-gray-400 font-normal text-lg">({items.length} {items.length === 1 ? "item" : "items"})</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product.slug}-${item.selectedColor}`}
              className="border border-gray-200 rounded-xl p-4 flex gap-4"
            >
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                <ProductImage product={item.product} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.product.slug}`} className="font-semibold hover:text-blue-600 transition line-clamp-1">
                  {item.product.name}
                </Link>
                <p className="text-sm text-gray-500">{item.selectedColor}</p>
                <p className="text-blue-700 font-bold mt-1">
                  &#8377;{formatPrice(item.product.selling_price)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.product.slug, item.selectedColor, item.quantity - 1)}
                    className="px-3 py-1.5 text-sm hover:bg-gray-50 transition"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 border-x border-gray-300 text-sm min-w-[2.5rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.slug, item.selectedColor, item.quantity + 1)}
                    className="px-3 py-1.5 text-sm hover:bg-gray-50 transition"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm font-semibold">
                  &#8377;{formatPrice(item.product.selling_price * item.quantity)}
                </p>
                <button
                  onClick={() => removeItem(item.product.slug, item.selectedColor)}
                  className="text-xs text-red-500 hover:text-red-700 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="border border-gray-200 rounded-xl p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
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
            <Link
              href="/checkout"
              className="block w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-lg text-center transition shadow-lg shadow-blue-600/20"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={clearCart}
              className="block w-full mt-3 text-sm text-gray-500 hover:text-red-500 text-center transition"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
