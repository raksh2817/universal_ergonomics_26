import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Premium Office Chairs.
              <br />
              Factory Direct.
              <br />
              <span className="text-accent-500">Made in Bangalore.</span>
            </h1>
            <p className="text-lg text-brand-100 mb-8">
              We manufacture and deliver. No middlemen. Free 48-hour delivery
              with on-site assembly across Bangalore.
            </p>
            <div className="flex gap-4">
              <Link
                href="/products"
                className="bg-accent-500 hover:bg-accent-600 text-white font-semibold px-8 py-3 rounded-lg transition"
              >
                Shop Now
              </Link>
              <Link
                href="/b2b"
                className="border border-white/30 hover:bg-white/10 font-semibold px-8 py-3 rounded-lg transition"
              >
                B2B Orders
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-3xl mb-3">🏭</div>
              <h3 className="font-semibold text-lg mb-2">Factory Direct</h3>
              <p className="text-gray-600 text-sm">
                We manufacture our own chairs. No middlemen = better prices and quality control.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl mb-3">🚚</div>
              <h3 className="font-semibold text-lg mb-2">Free 48hr Delivery</h3>
              <p className="text-gray-600 text-sm">
                Own fleet delivers to your door within 48 hours across Bangalore. Free of cost.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl mb-3">🔧</div>
              <h3 className="font-semibold text-lg mb-2">On-Site Assembly</h3>
              <p className="text-gray-600 text-sm">
                Our team assembles your chair at your location. Sit and work from minute one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Products Placeholder */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Hero Collection
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Our 15 hand-picked chairs — from executive to gaming, task to bulk B2B.
          </p>
          <div className="text-center">
            <Link
              href="/products?hero_only=true"
              className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3 rounded-lg transition"
            >
              View All Hero SKUs
            </Link>
          </div>
        </div>
      </section>

      {/* B2B CTA */}
      <section className="py-16 bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Furnishing a Startup or Office?</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Volume pricing, dedicated account manager, and fleet delivery.
            Minimum 5 chairs per order for B2B rates.
          </p>
          <Link
            href="/b2b"
            className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Get a B2B Quote
          </Link>
        </div>
      </section>
    </div>
  );
}
