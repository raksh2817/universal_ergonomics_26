import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-white font-bold text-lg mb-3">
              Universal Ergonomics
            </h3>
            <p className="text-sm leading-relaxed">
              Factory-direct office chairs. Made in Bangalore.
              Free 48-hour delivery with on-site assembly.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white transition">All Chairs</Link></li>
              <li><Link href="/products?category=Executive+Chairs" className="hover:text-white transition">Executive</Link></li>
              <li><Link href="/products?category=Ergonomic+Chairs" className="hover:text-white transition">Ergonomic</Link></li>
              <li><Link href="/products?category=Gaming+Chairs" className="hover:text-white transition">Gaming</Link></li>
              <li><Link href="/products?category=Task+Chairs" className="hover:text-white transition">Task</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Business</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/b2b" className="hover:text-white transition">B2B / Bulk Orders</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/about#factory" className="hover:text-white transition">Our Factory</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Bangalore, Karnataka</li>
              <li>GST Registered</li>
              <li className="text-blue-400">info@universalergonomics.in</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <span>&copy; {new Date().getFullYear()} Universal Ergonomics. All rights reserved.</span>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition">Shipping Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
