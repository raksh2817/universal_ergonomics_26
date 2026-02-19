"use client";

import Link from "next/link";
import { useCart } from "@/hooks/use-cart";

export function Header() {
  const totalItems = useCart((s) => s.totalItems);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-brand-700">
              Universal Ergonomics
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/products"
              className="text-sm font-medium text-gray-700 hover:text-brand-600"
            >
              All Chairs
            </Link>
            <Link
              href="/products?hero_only=true"
              className="text-sm font-medium text-gray-700 hover:text-brand-600"
            >
              Hero Collection
            </Link>
            <Link
              href="/b2b"
              className="text-sm font-medium text-gray-700 hover:text-brand-600"
            >
              B2B / Bulk Orders
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-brand-600"
            >
              About Us
            </Link>
          </nav>

          {/* Cart */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative text-sm font-medium text-gray-700 hover:text-brand-600"
            >
              Cart
              {totalItems() > 0 && (
                <span className="absolute -top-2 -right-4 bg-brand-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
