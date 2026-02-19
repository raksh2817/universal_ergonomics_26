"use client";

import Link from "next/link";
import { useMode } from "@/hooks/use-mode";

export function Footer() {
  const isWholesale = useMode((s) => s.mode === "wholesale");

  return (
    <footer className={`border-t py-12 px-6 transition-colors ${isWholesale ? "bg-[#0a1628] border-[#1a2d4d] text-white" : "bg-white border-[#f0f2f4]"}`}>
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
        <div className="col-span-2 md:col-span-1 space-y-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Universal Chairs" className="h-10 w-10 object-contain" />
            <span className={`font-bold text-lg ${isWholesale ? "text-white" : "text-[#111318]"}`}>Universal Ergonomics</span>
          </div>
          <p className={`text-sm leading-relaxed ${isWholesale ? "text-white/60" : "text-[#6e6e73]"}`}>
            Manufacturers &amp; Dealers of Office Furniture, Imported Furniture &amp; Furniture Accessories. Factory-direct pricing from Bangalore.
          </p>
          <div className={`space-y-2 text-sm ${isWholesale ? "text-white/60" : "text-[#6e6e73]"}`}>
            <p className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-primary">call</span>
              +91 9845007572
            </p>
            <p className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-primary">call</span>
              +91 8660249123
            </p>
            <p className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-primary">mail</span>
              universalfurnituresystems@gmail.com
            </p>
          </div>
        </div>

        <div>
          <h4 className={`font-bold text-sm mb-6 uppercase tracking-wider ${isWholesale ? "text-white/40" : ""}`}>Shop</h4>
          <ul className={`space-y-4 text-sm ${isWholesale ? "text-white/60" : "text-[#6e6e73]"}`}>
            <li><Link href="/products?category=Executive+Chairs" className="hover:text-primary transition-colors">Executive Chairs</Link></li>
            <li><Link href="/products?category=Mesh+Chairs" className="hover:text-primary transition-colors">Mesh Chairs</Link></li>
            <li><Link href="/products?category=Revolving+Chairs" className="hover:text-primary transition-colors">Revolving Chairs</Link></li>
            <li><Link href="/products?category=Visitor+Chairs" className="hover:text-primary transition-colors">Visitor Chairs</Link></li>
            <li><Link href="/products?category=Bar+Stools+%26+Classroom" className="hover:text-primary transition-colors">Bar Stools &amp; Classroom</Link></li>
          </ul>
        </div>

        <div>
          <h4 className={`font-bold text-sm mb-6 uppercase tracking-wider ${isWholesale ? "text-white/40" : ""}`}>Company</h4>
          <ul className={`space-y-4 text-sm ${isWholesale ? "text-white/60" : "text-[#6e6e73]"}`}>
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/products" className="hover:text-primary transition-colors">Full Catalog</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">Our Factory</Link></li>
          </ul>
        </div>

        <div>
          <h4 className={`font-bold text-sm mb-6 uppercase tracking-wider ${isWholesale ? "text-white/40" : ""}`}>Visit Us</h4>
          <div className={`text-sm space-y-4 ${isWholesale ? "text-white/60" : "text-[#6e6e73]"}`}>
            <p className="flex items-start gap-2 leading-relaxed">
              <span className="material-symbols-outlined text-base text-primary mt-0.5">location_on</span>
              No. 3/4, &ldquo;B&rdquo; Street 1st Main Road, New Guddadahalli, Mysore Road, Bangalore - 560026
            </p>
            <ul className="space-y-4">
              <li><Link href="/about" className="hover:text-primary transition-colors">Shipping &amp; Returns</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Warranty</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className={`max-w-[1200px] mx-auto mt-20 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6 text-xs ${isWholesale ? "border-[#1a2d4d] text-white/40" : "border-[#f0f2f4] text-[#6e6e73]"}`}>
        <p>&copy; {new Date().getFullYear()} Universal Ergonomics (Universal Furniture Systems). All rights reserved.</p>
        <div className="flex gap-8">
          <span className={`cursor-pointer ${isWholesale ? "hover:text-white" : "hover:text-[#111318]"}`}>Privacy Policy</span>
          <span className={`cursor-pointer ${isWholesale ? "hover:text-white" : "hover:text-[#111318]"}`}>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
