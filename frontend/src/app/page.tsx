import Link from "next/link";
import { getFeaturedProducts, getCategories, getAllProducts, formatPrice, getDiscount } from "@/lib/products";
import { ProductCard } from "@/components/product/product-card";

export default function HomePage() {
  const featured = getFeaturedProducts();
  const categories = getCategories();
  const allProducts = getAllProducts();
  const cheapest = Math.min(...allProducts.map((p) => p.selling_price));

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-blue-300 font-medium text-sm mb-4 tracking-wider uppercase">
              Made in Bangalore
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Premium Office Chairs.
              <br />
              <span className="text-blue-400">Factory Direct.</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              We manufacture and deliver — no middlemen. Free 48-hour delivery
              with on-site assembly across Bangalore. Starting at &#8377;{formatPrice(cheapest)}.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-lg transition shadow-lg shadow-blue-600/25"
              >
                Shop All Chairs
              </Link>
              <Link
                href="/b2b"
                className="border border-white/25 hover:bg-white/10 text-white font-semibold px-8 py-3.5 rounded-lg transition"
              >
                B2B / Bulk Orders
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Free Delivery
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              48-Hour Delivery
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              On-Site Assembly
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Up to 5-Year Warranty
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${encodeURIComponent(cat)}`}
                className="flex-shrink-0 px-5 py-2.5 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 rounded-full text-sm font-medium text-gray-700 transition border border-transparent hover:border-blue-200"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Chairs</h2>
            <Link href="/products" className="text-sm text-blue-600 hover:underline font-medium">
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.sku} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-10">
            Why Buy From Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
              <div className="w-14 h-14 bg-blue-50 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Factory Direct</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                We manufacture our own chairs in Bangalore. No middlemen means better prices and complete quality control.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
              <div className="w-14 h-14 bg-green-50 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Free 48hr Delivery</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Our own fleet delivers to your door within 48 hours anywhere in Bangalore. Completely free of cost.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
              <div className="w-14 h-14 bg-amber-50 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.384-3.19A.6.6 0 015.75 11.5h12.5a.6.6 0 01.286.48l-5.384 3.19m-1.732 0L5.75 11.98m5.67 3.19l5.83-3.19M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z" /></svg>
              </div>
              <h3 className="font-bold text-lg mb-2">On-Site Assembly</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Our trained technicians assemble your chair at your home or office. Sit and work from minute one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* B2B CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Furnishing a Startup or Office?
            </h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              Volume pricing, dedicated support, fleet delivery, and GST invoicing.
              Minimum 5 chairs per order for B2B rates.
            </p>
            <Link
              href="/b2b"
              className="inline-block bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-3.5 rounded-lg transition"
            >
              Get a B2B Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
