"use client";

import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/products";
import { ProductImage } from "@/components/product/product-image";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, gst, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-20 text-center">
        <span className="material-symbols-outlined text-gray-300 mb-4" style={{ fontSize: "80px" }}>
          shopping_bag
        </span>
        <h1 className="text-2xl font-bold mb-3">Your Cart is Empty</h1>
        <p className="text-[#6e6e73] mb-6">Browse our collection and find your perfect chair.</p>
        <Link
          href="/products"
          className="inline-block bg-primary hover:bg-primary/90 text-white font-bold px-10 py-4 rounded-full transition shadow-lg shadow-primary/20"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#6e6e73] mb-8">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-[#111318] font-medium">Cart</span>
      </nav>

      <h1 className="text-3xl font-bold mb-8 tracking-tight">
        Shopping Cart{" "}
        <span className="text-[#6e6e73] font-normal text-lg">
          ({items.length} {items.length === 1 ? "item" : "items"})
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product.slug}-${item.selectedColor}`}
              className="bg-white border border-gray-200 rounded-xl p-6 flex gap-6 shadow-sm"
            >
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-[#f5f5f7]">
                <ProductImage product={item.product} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.product.slug}`} className="font-bold hover:text-primary transition line-clamp-1">
                  {item.product.name}
                </Link>
                <p className="text-sm text-[#6e6e73]">{item.selectedColor}</p>
                <p className="text-primary font-bold mt-1">
                  &#8377;{formatPrice(item.product.selling_price)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.product.slug, item.selectedColor, item.quantity - 1)}
                    className="px-3 py-1.5 text-sm hover:bg-[#f5f5f7] transition rounded-l-lg"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 border-x border-gray-200 text-sm min-w-[2.5rem] text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.slug, item.selectedColor, item.quantity + 1)}
                    className="px-3 py-1.5 text-sm hover:bg-[#f5f5f7] transition rounded-r-lg"
                  >
                    +
                  </button>
                </div>
                <p className="text-base font-bold">
                  &#8377;{formatPrice(item.product.selling_price * item.quantity)}
                </p>
                <button
                  onClick={() => removeItem(item.product.slug, item.selectedColor)}
                  className="text-xs text-red-500 hover:text-red-700 transition flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">delete</span>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24 shadow-sm">
            <h2 className="font-bold text-lg mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6e6e73]">Subtotal</span>
                <span className="font-medium">&#8377;{formatPrice(subtotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6e6e73]">GST (18%)</span>
                <span className="font-medium">&#8377;{formatPrice(gst())}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Delivery</span>
                <span className="font-medium">FREE</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">&#8377;{formatPrice(total())}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="block w-full mt-6 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl text-center transition shadow-lg shadow-primary/20"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={clearCart}
              className="block w-full mt-3 text-sm text-[#6e6e73] hover:text-red-500 text-center transition"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
