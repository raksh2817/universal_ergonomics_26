export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">
              Universal Ergonomics
            </h3>
            <p className="text-sm">
              Factory-direct office chairs manufactured in Bangalore.
              Free 48-hour delivery with on-site assembly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/products" className="hover:text-white">All Chairs</a></li>
              <li><a href="/products?category=executive-chairs" className="hover:text-white">Executive</a></li>
              <li><a href="/products?category=ergonomic-chairs" className="hover:text-white">Ergonomic</a></li>
              <li><a href="/products?category=gaming-chairs" className="hover:text-white">Gaming</a></li>
            </ul>
          </div>

          {/* Business */}
          <div>
            <h4 className="text-white font-semibold mb-3">Business</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/b2b" className="hover:text-white">B2B / Bulk Orders</a></li>
              <li><a href="/about" className="hover:text-white">About Us</a></li>
              <li><a href="/about#factory" className="hover:text-white">Our Factory</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Bangalore, Karnataka</li>
              <li>GST Registered</li>
              <li className="text-brand-400">info@universalergonomics.in</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
          &copy; {new Date().getFullYear()} Universal Ergonomics. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
