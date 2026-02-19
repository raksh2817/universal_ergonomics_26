"use client";

import { useState } from "react";
import Link from "next/link";
import { getProductsByCategory, formatPrice } from "@/lib/products";
import { ProductCard } from "@/components/product/product-card";

export default function B2BPage() {
  const [submitted, setSubmitted] = useState(false);
  const bulkProducts = [
    ...getProductsByCategory("B2B Bulk Chairs"),
    ...getProductsByCategory("Mid-Back Chairs"),
  ].slice(0, 4);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // In production, this would POST to the backend API
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-green-700">Thank You!</h1>
        <p className="text-gray-600 mb-6">
          We&apos;ve received your B2B inquiry. Our team will contact you within 24 hours with a custom quote.
        </p>
        <Link
          href="/products"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">B2B Orders</span>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-8 md:p-12 text-white mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">B2B & Bulk Orders</h1>
        <p className="text-gray-300 max-w-xl">
          Furnish your entire office at factory-direct pricing. We handle delivery, assembly, and after-sales support.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Benefits */}
        <div>
          <h2 className="text-xl font-bold mb-6">Why Choose Us for B2B?</h2>
          <div className="space-y-5">
            {[
              { icon: "%", title: "Volume Discounts", desc: "Up to 15% off on bulk orders. Tiered pricing for 5+, 20+, and 50+ units." },
              { icon: "48h", title: "Fleet Delivery", desc: "Our own vehicles deliver and assemble at your office within 48 hours across Bangalore." },
              { icon: "GST", title: "GST Invoice", desc: "Proper GST invoicing for ITC claims. We're a registered manufacturer." },
              { icon: "5yr", title: "Extended Warranty", desc: "Up to 5-year warranty on B2B orders with dedicated after-sales support." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing tiers */}
          <div className="mt-8 border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-sm">Volume Pricing Tiers</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { qty: "5 - 19 chairs", discount: "10% off" },
                { qty: "20 - 49 chairs", discount: "12% off" },
                { qty: "50+ chairs", discount: "15% off" },
              ].map((tier) => (
                <div key={tier.qty} className="flex justify-between px-5 py-3 text-sm">
                  <span className="text-gray-600">{tier.qty}</span>
                  <span className="font-semibold text-green-600">{tier.discount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div>
          <div className="border border-gray-200 rounded-xl p-6">
            <h2 className="font-bold text-lg mb-4">Get a Custom Quote</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                <input name="company_name" required className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input name="contact_name" required className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input name="email" type="email" required className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input name="phone" type="tel" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <select name="industry" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="technology">Technology</option>
                    <option value="startup">Startup</option>
                    <option value="fintech">Fintech</option>
                    <option value="consulting">Consulting</option>
                    <option value="ecommerce">E-Commerce</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employees</label>
                  <input name="employee_count" type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 50" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Chairs Needed</label>
                <input name="estimated_quantity" type="number" min="5" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Minimum 5 chairs" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Requirements</label>
                <textarea name="notes" rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Any specific requirements..." />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition shadow-lg shadow-blue-600/20"
              >
                Request Quote
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Popular B2B products */}
      {bulkProducts.length > 0 && (
        <div className="mt-16 border-t pt-10">
          <h2 className="text-xl font-bold mb-6">Popular for Offices</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bulkProducts.map((p) => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
