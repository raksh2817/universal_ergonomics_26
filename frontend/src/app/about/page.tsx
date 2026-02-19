import Link from "next/link";

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-dark relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-10 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.1em] text-accent font-medium mb-3">
              Universal Furniture Systems
            </p>
            <h1 className="font-display text-3xl md:text-[2.5rem] text-white mb-4">
              About Universal Ergonomics
            </h1>
            <p className="text-white/60 max-w-2xl text-lg leading-relaxed">
              India&apos;s trusted manufacturer &amp; dealer of office furniture, imported
              furniture, and furniture accessories since establishment. Factory-direct quality
              at honest prices.
            </p>
          </div>
          <div className="flex-shrink-0">
            <img
              src="/logo.png"
              alt="Universal Ergonomics"
              className="w-32 h-32 md:w-44 md:h-44 object-contain"
            />
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-surface py-12 md:py-24 px-4 md:px-6 lg:px-10">
        <div className="max-w-[720px] mx-auto space-y-5 text-muted leading-relaxed">
          <p>
            Universal Furniture Systems started with one belief: office furniture shouldn&apos;t
            cost a fortune to be built well. From our factory on Mysore Road, Bengaluru, we
            manufacture and deliver every chair ourselves — cutting out the middlemen and passing
            the savings to you.
          </p>
          <p>
            Today, our catalog spans{" "}
            <span className="font-display text-3xl text-accent inline-block mx-1 align-baseline">81+</span>{" "}
            models — Executive, Mesh, Revolving, Visitor, Bar Stools, and Classroom furniture —
            covering every workspace from boardrooms to seminar halls. We also deal in imported
            furniture, accessories, and offer job work including CNC Pipe Bending.
          </p>
          <p>
            By manufacturing in-house and selling factory-direct, we offer pricing{" "}
            <span className="font-display text-3xl text-accent inline-block mx-1 align-baseline">30–50%</span>{" "}
            lower than comparable imported brands without compromising on materials or build quality.
          </p>
          <p>
            Whether you&apos;re furnishing a single home office or outfitting 500 workstations, we
            have the selection, the pricing, and the service to deliver.
          </p>
        </div>
      </section>

      {/* Advantages */}
      <section className="bg-surface-muted py-12 md:py-24 px-4 md:px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-center mb-10">
            The Universal Ergonomics Advantage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "precision_manufacturing",
                title: "Factory Direct",
                desc: "Everything is built in our own Bengaluru factory — giving us full control over quality and pricing.",
              },
              {
                icon: "local_shipping",
                title: "Free Delivery",
                desc: "Free doorstep delivery and on-site assembly across Bengaluru and surrounding areas.",
              },
              {
                icon: "inventory_2",
                title: "81+ Models",
                desc: "Executive, Mesh, Revolving, Visitor, Bar Stools, and Classroom — a chair for every space.",
              },
              {
                icon: "handshake",
                title: "B2B Specialists",
                desc: "Volume pricing, GST invoicing, and a dedicated account manager for every business order.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-surface-raised border border-[var(--color-border)] rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 bg-accent-soft rounded-xl flex items-center justify-center text-primary mx-auto mb-4">
                  <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                </div>
                <h3 className="font-medium text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-surface py-12 md:py-24 px-4 md:px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-center mb-10">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "81+", label: "Chair Models" },
              { value: "500+", label: "Businesses Served" },
              { value: "5yr", label: "Max Warranty" },
              { value: "100%", label: "Made in Bengaluru" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl md:text-[2.5rem] text-accent">
                  {stat.value}
                </p>
                <p className="text-sm text-muted mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-surface-muted py-12 md:py-24 px-4 md:px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-center mb-10">
            Visit Us / Contact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-raised border border-[var(--color-border)] rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-accent-soft rounded-xl flex items-center justify-center text-primary mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl">location_on</span>
              </div>
              <h3 className="font-medium text-foreground mb-2">Address</h3>
              <p className="text-sm text-muted leading-relaxed">
                No. 3/4, &ldquo;B&rdquo; Street 1st Main Road,
                <br />
                New Guddadahalli, Mysore Road,
                <br />
                Bengaluru - 560026
              </p>
            </div>
            <div className="bg-surface-raised border border-[var(--color-border)] rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-accent-soft rounded-xl flex items-center justify-center text-primary mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl">call</span>
              </div>
              <h3 className="font-medium text-foreground mb-2">Phone</h3>
              <p className="text-sm text-muted leading-relaxed">
                +91 9845007572
                <br />
                +91 8660249123
              </p>
            </div>
            <div className="bg-surface-raised border border-[var(--color-border)] rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-accent-soft rounded-xl flex items-center justify-center text-primary mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl">mail</span>
              </div>
              <h3 className="font-medium text-foreground mb-2">Email</h3>
              <p className="text-sm text-muted leading-relaxed">
                universalfurnituresystems@gmail.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark py-12 md:py-20 px-4 md:px-6 lg:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl text-white mb-6">
            Ready to Find Your Chair?
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products"
              className="px-8 py-3 bg-accent text-accent-fg font-medium text-sm tracking-[0.04em] uppercase rounded-lg hover:bg-accent-hover transition"
            >
              Browse Full Catalog
            </Link>
            <Link
              href="/b2b"
              className="px-8 py-3 border-[1.5px] border-white/20 text-white font-medium text-sm tracking-[0.04em] uppercase rounded-lg hover:bg-white/10 transition"
            >
              B2B / Wholesale Enquiry
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
