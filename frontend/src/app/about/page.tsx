import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#6e6e73] mb-8">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-[#111318] font-medium">About Us</span>
      </nav>

      {/* Hero */}
      <div className="bg-[#fafafa] rounded-2xl p-8 md:p-16 mb-16 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-6 uppercase tracking-widest">
            Universal Furniture Systems
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">About Universal Ergonomics</h1>
          <p className="text-[#6e6e73] max-w-2xl text-lg leading-relaxed">
            India&apos;s trusted manufacturer &amp; dealer of office furniture, imported furniture, and furniture accessories since establishment. Factory-direct quality at honest prices.
          </p>
        </div>
        <div className="flex-shrink-0">
          <img src="/logo.png" alt="Universal Chairs" className="w-32 h-32 md:w-48 md:h-48 object-contain" />
        </div>
      </div>

      {/* Story */}
      <div className="max-w-3xl mx-auto mb-24">
        <div className="space-y-6 text-[#6e6e73] leading-relaxed">
          <p>
            Universal Furniture Systems — known by the brand &ldquo;Universal Chairs&rdquo; — was built on a simple promise: <strong className="text-[#111318]">&ldquo;Better than the best, better than the rest.&rdquo;</strong>
          </p>
          <p>
            Based out of Mysore Road, Bangalore (560026), we are manufacturers and dealers of a wide range of office furniture including Executive Chairs, Mesh Chairs, Revolving Chairs, Visitor Chairs, Bar Stools, and Classroom furniture. We also deal in imported furniture and furniture accessories, and offer job work including CNC Pipe Bending.
          </p>
          <p>
            Our catalog of 81+ chair models (UFS 001 through UFS 081) covers every need — from premium leather executive seating for boardrooms to stackable visitor chairs for seminar halls. By manufacturing in-house and selling factory-direct, we offer pricing 30-50% lower than comparable brands without compromising on quality.
          </p>
          <p>
            Whether you&apos;re furnishing a single home office or outfitting 500 workstations, we have the selection, the pricing, and the service to deliver.
          </p>
        </div>
      </div>

      {/* Advantages */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold mb-12 text-center tracking-tight">The Universal Ergonomics Advantage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: "precision_manufacturing", title: "Factory Direct", desc: "We manufacture in-house at our Bangalore facility. Full control over quality and pricing." },
            { icon: "local_shipping", title: "Free Delivery", desc: "Free delivery and on-site assembly across Bangalore and surrounding areas." },
            { icon: "inventory_2", title: "81+ Models", desc: "Executive, Mesh, Revolving, Visitor, Bar Stools, Classroom — we have it all." },
            { icon: "handshake", title: "B2B Specialists", desc: "Volume pricing, GST invoicing, and dedicated account management for businesses." },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              </div>
              <h3 className="font-bold text-base mb-2">{item.title}</h3>
              <p className="text-sm text-[#6e6e73]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Numbers */}
      <div className="bg-[#f5f5f7] rounded-2xl p-8 md:p-16 mb-24">
        <h2 className="text-3xl font-bold mb-12 text-center tracking-tight">By the Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "81+", label: "Chair Models" },
            { value: "5", label: "Product Categories" },
            { value: "5yr", label: "Max Warranty" },
            { value: "100%", label: "Made in Bangalore" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl md:text-5xl font-black text-primary">{stat.value}</p>
              <p className="text-sm text-[#6e6e73] mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 mb-24">
        <h2 className="text-3xl font-bold mb-8 text-center tracking-tight">Visit Us / Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto mb-4">
              <span className="material-symbols-outlined text-2xl">location_on</span>
            </div>
            <h3 className="font-bold mb-2">Address</h3>
            <p className="text-sm text-[#6e6e73] leading-relaxed">
              No. 3/4, &ldquo;B&rdquo; Street 1st Main Road,<br />
              New Guddadahalli, Mysore Road,<br />
              Bangalore - 560026
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto mb-4">
              <span className="material-symbols-outlined text-2xl">call</span>
            </div>
            <h3 className="font-bold mb-2">Phone</h3>
            <p className="text-sm text-[#6e6e73] leading-relaxed">
              +91 9845007572<br />
              +91 8660249123
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto mb-4">
              <span className="material-symbols-outlined text-2xl">mail</span>
            </div>
            <h3 className="font-bold mb-2">Email</h3>
            <p className="text-sm text-[#6e6e73] leading-relaxed">
              universalfurnituresystems@gmail.com
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mb-12">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="px-10 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition shadow-lg shadow-primary/20"
          >
            Browse Full Catalog
          </Link>
          <Link
            href="/b2b"
            className="px-10 py-4 border-2 border-[#111318] text-[#111318] font-bold rounded-full hover:bg-[#111318] hover:text-white transition"
          >
            B2B / Wholesale Enquiry
          </Link>
        </div>
      </div>
    </div>
  );
}
