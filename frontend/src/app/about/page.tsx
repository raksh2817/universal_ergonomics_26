import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">About Us</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-8 md:p-12 text-white mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">About Universal Ergonomics</h1>
        <p className="text-gray-300 max-w-2xl text-lg">
          Bangalore&apos;s own office chair manufacturer. We design, build, and deliver directly to you — cutting out middlemen and passing the savings on.
        </p>
      </div>

      {/* Story */}
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="text-2xl font-bold mb-4">Our Story</h2>
        <div className="space-y-4 text-gray-600">
          <p>
            Universal Ergonomics was born from a simple observation: Bangalore&apos;s tech professionals spend 8-12 hours a day seated, yet most rely on overpriced imported chairs or flimsy local alternatives. We set out to change that.
          </p>
          <p>
            With our own manufacturing unit in Bangalore, we control every step — from metal fabrication and mesh cutting to foam molding and final assembly. Every chair goes through rigorous quality checks before it leaves our floor.
          </p>
          <p>
            By selling factory-direct, we offer premium ergonomic chairs at prices 30-50% lower than comparable brands, with the kind of local service that national D2C companies simply can&apos;t match.
          </p>
        </div>
      </div>

      {/* Advantages */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">The Universal Ergonomics Advantage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              ),
              title: "Factory Direct",
              desc: "We manufacture our own components, giving us full control over quality and pricing. No middlemen, no markups.",
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              ),
              title: "Own Fleet Delivery",
              desc: "We own our delivery vehicles, enabling free 48-hour delivery and assembly across Bangalore.",
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1m0 0L11.42 4.97m-5.1 5.1H21M3 21h18" />
                </svg>
              ),
              title: "On-Site Assembly",
              desc: "Our trained team assembles your chair at your location, so you're ready to work immediately.",
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
              title: "B2B Specialists",
              desc: "Volume pricing, GST invoicing, and dedicated account management for startups and enterprises.",
            },
          ].map((item) => (
            <div key={item.title} className="border border-gray-200 rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-700 mx-auto mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Numbers */}
      <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">By the Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "15+", label: "Chair Models" },
            { value: "48hr", label: "Delivery Promise" },
            { value: "5yr", label: "Max Warranty" },
            { value: "100%", label: "Made in Bangalore" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl md:text-4xl font-bold text-blue-600">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-gray-600 text-lg">
          We believe great work starts with great seating. Our mission is to make ergonomic office chairs accessible to every professional and business in Bangalore, backed by local manufacturing, honest pricing, and a service level that national D2C brands cannot match.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Browse Our Chairs
          </Link>
          <Link
            href="/b2b"
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-8 py-3 rounded-lg transition"
          >
            B2B Inquiries
          </Link>
        </div>
      </div>
    </div>
  );
}
