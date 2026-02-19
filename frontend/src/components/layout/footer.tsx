import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 bg-dark text-white overflow-hidden">
      {/* Subtle gradient accent at the top */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-10 pt-16 lg:pt-20 pb-12 lg:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column — wider */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block group">
              <span className="font-display text-xl text-white group-hover:text-accent transition">
                Universal <span className="text-accent group-hover:text-white transition">Ergonomics</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/50 max-w-xs">
              Factory-direct office furniture from Bengaluru.
              81+ chair models, free delivery &amp; assembly,
              and up to a 5-year warranty.
            </p>
            <div className="flex gap-3 pt-1">
              <a
                href="tel:+919845007572"
                className="w-9 h-9 rounded-lg bg-white/[0.06] hover:bg-accent/20 flex items-center justify-center transition group"
                aria-label="Call us"
              >
                <span className="material-symbols-outlined text-[18px] text-white/60 group-hover:text-accent transition">call</span>
              </a>
              <a
                href="mailto:universalfurnituresystems@gmail.com"
                className="w-9 h-9 rounded-lg bg-white/[0.06] hover:bg-accent/20 flex items-center justify-center transition group"
                aria-label="Email us"
              >
                <span className="material-symbols-outlined text-[18px] text-white/60 group-hover:text-accent transition">mail</span>
              </a>
              <a
                href="https://maps.google.com/?q=Universal+Furniture+Systems+Bengaluru"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/[0.06] hover:bg-accent/20 flex items-center justify-center transition group"
                aria-label="Find us on map"
              >
                <span className="material-symbols-outlined text-[18px] text-white/60 group-hover:text-accent transition">location_on</span>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-medium tracking-[0.1em] uppercase text-white/30 mb-5">
              Shop
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Executive Chairs", cat: "Executive+Chairs" },
                { label: "Mesh Chairs", cat: "Mesh+Chairs" },
                { label: "Revolving Chairs", cat: "Revolving+Chairs" },
                { label: "Visitor Chairs", cat: "Visitor+Chairs" },
                { label: "Bar Stools & Classroom", cat: "Bar+Stools+%26+Classroom" },
              ].map((item) => (
                <li key={item.cat}>
                  <Link
                    href={`/products?category=${item.cat}`}
                    className="text-white/50 hover:text-accent transition inline-flex items-center gap-1 group"
                  >
                    {item.label}
                    <span className="material-symbols-outlined text-sm opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      arrow_forward
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-medium tracking-[0.1em] uppercase text-white/30 mb-5">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "About Us", href: "/about" },
                { label: "Full Catalog", href: "/products" },
                { label: "B2B / Wholesale", href: "/b2b" },
                { label: "Shipping & Returns", href: "/about" },
                { label: "Warranty", href: "/about" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white/50 hover:text-accent transition inline-flex items-center gap-1 group"
                  >
                    {item.label}
                    <span className="material-symbols-outlined text-sm opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      arrow_forward
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit Us Column */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-medium tracking-[0.1em] uppercase text-white/30 mb-5">
              Visit Our Showroom
            </h4>
            <div className="bg-white/[0.04] rounded-xl p-5 space-y-4 border border-white/[0.06]">
              <p className="flex items-start gap-3 text-sm text-white/50 leading-relaxed">
                <span className="material-symbols-outlined text-base text-accent mt-0.5 flex-shrink-0">
                  location_on
                </span>
                <span>
                  No. 3/4, &ldquo;B&rdquo; Street 1st Main Road,<br />
                  New Guddadahalli, Mysore Road,<br />
                  Bengaluru &ndash; 560026
                </span>
              </p>
              <div className="flex items-center gap-3 text-sm text-white/50">
                <span className="material-symbols-outlined text-base text-accent flex-shrink-0">schedule</span>
                Mon &ndash; Sat, 9:30 AM &ndash; 7:00 PM
              </div>
              <div className="flex gap-3 text-sm pt-1">
                <a
                  href="tel:+919845007572"
                  className="text-white/50 hover:text-accent transition flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">call</span>
                  984 500 7572
                </a>
                <span className="text-white/20">|</span>
                <a
                  href="tel:+918660249123"
                  className="text-white/50 hover:text-accent transition flex items-center gap-1.5"
                >
                  866 024 9123
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-10 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/30">
          <p>
            &copy; {new Date().getFullYear()} Universal Furniture Systems. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-white/60 transition">Privacy Policy</a>
            <a href="/terms" className="hover:text-white/60 transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
