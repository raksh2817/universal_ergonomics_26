export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-6">About Universal Ergonomics</h1>

      <div className="prose prose-gray max-w-none space-y-6">
        <p className="text-lg text-gray-600">
          We are a Bangalore-based furniture manufacturer specializing in
          premium office chairs. We design, manufacture, and deliver directly to
          you — cutting out middlemen and passing the savings on.
        </p>

        <section id="factory">
          <h2 className="text-2xl font-bold mt-8 mb-4">Our Factory</h2>
          <p className="text-gray-600">
            Our manufacturing unit in Bangalore houses state-of-the-art
            equipment for metal fabrication, mesh cutting, foam molding, and
            final assembly. Every chair goes through rigorous quality checks
            before it leaves our floor.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-4">
            The Universal Ergonomics Advantage
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li>
              <strong>Factory Direct:</strong> We manufacture our own
              components, giving us full control over quality and pricing.
            </li>
            <li>
              <strong>Own Fleet Delivery:</strong> We own our delivery vehicles,
              enabling free 48-hour delivery across Bangalore.
            </li>
            <li>
              <strong>On-Site Assembly:</strong> Our trained team assembles your
              chair at your location, so you&apos;re ready to work immediately.
            </li>
            <li>
              <strong>B2B Specialists:</strong> Volume pricing, GST invoicing,
              and dedicated account management for startups and enterprises.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-4">Our Commitment</h2>
          <p className="text-gray-600">
            We believe great work starts with great seating. Our mission is to
            make ergonomic office chairs accessible to every professional and
            business in Bangalore, backed by local manufacturing, honest pricing,
            and a service level that national D2C brands cannot match.
          </p>
        </section>
      </div>
    </div>
  );
}
