"use client";

import { useState } from "react";
import { submitLead } from "@/lib/api";

export default function B2BPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const data = {
      company_name: form.get("company_name") as string,
      contact_name: form.get("contact_name") as string,
      email: form.get("email") as string,
      phone: form.get("phone") as string,
      industry: form.get("industry") as string,
      employee_count: Number(form.get("employee_count")) || undefined,
      estimated_quantity: Number(form.get("estimated_quantity")) || undefined,
      source: "website",
    };

    try {
      await submitLead(data);
      setSubmitted(true);
    } catch (err) {
      setError("Failed to submit. Please try again or contact us directly.");
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4 text-brand-700">
          Thank You!
        </h1>
        <p className="text-gray-600 mb-6">
          We&apos;ve received your B2B inquiry. Our team will contact you within
          24 hours with a custom quote.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">B2B & Bulk Orders</h1>
          <p className="text-gray-600 mb-8">
            Furnish your office with factory-direct pricing. Minimum 5 chairs
            per B2B order.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center text-brand-700 font-bold flex-shrink-0">
                %
              </div>
              <div>
                <h3 className="font-semibold">Volume Discounts</h3>
                <p className="text-sm text-gray-500">
                  Up to 15% off on bulk orders. Tiered pricing for 5+, 20+, and
                  50+ units.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center text-brand-700 font-bold flex-shrink-0">
                48h
              </div>
              <div>
                <h3 className="font-semibold">Fleet Delivery</h3>
                <p className="text-sm text-gray-500">
                  Our own vehicles deliver and assemble at your office within 48
                  hours across Bangalore.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center text-brand-700 font-bold flex-shrink-0">
                GST
              </div>
              <div>
                <h3 className="font-semibold">GST Invoice</h3>
                <p className="text-sm text-gray-500">
                  Proper GST invoicing for ITC claims. We&apos;re a registered
                  manufacturer.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="border rounded-lg p-6">
          <h2 className="font-semibold text-lg mb-4">Get a Custom Quote</h2>
          {error && (
            <p className="text-red-600 text-sm mb-4">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name *
              </label>
              <input
                name="company_name"
                required
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name *
              </label>
              <input
                name="contact_name"
                required
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  type="tel"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <select
                  name="industry"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="technology">Technology</option>
                  <option value="startup">Startup</option>
                  <option value="fintech">Fintech</option>
                  <option value="consulting">Consulting</option>
                  <option value="ecommerce">E-Commerce</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employees
                </label>
                <input
                  name="employee_count"
                  type="number"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="e.g. 50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Quantity
              </label>
              <input
                name="estimated_quantity"
                type="number"
                min="5"
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Minimum 5 chairs"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Request Quote
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
