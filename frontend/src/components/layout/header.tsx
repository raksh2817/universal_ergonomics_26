"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useMode } from "@/hooks/use-mode";

export function Header() {
  const totalItems = useCart((s) => s.totalItems);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mode = useMode((s) => s.mode);
  const setMode = useMode((s) => s.setMode);

  const isWholesale = mode === "wholesale";

  const navLinkClass = `text-sm font-semibold transition-colors ${isWholesale ? "text-white/60 hover:text-primary" : "text-[#111318]/70 hover:text-primary"}`;

  return (
    <>
      {/* ── Row 1: Caption Bar ── */}
      <div className={`w-full border-b py-3.5 px-4 transition-colors ${isWholesale ? "bg-[#0a1628] border-[#1a2d4d]" : "bg-[#fbfbfd] border-[#f0f2f4]"}`}>
        <p className={`text-center text-sm font-bold tracking-wide ${isWholesale ? "text-white/90" : "text-[#111318]"}`}>
          {isWholesale
            ? "Universal Furniture Systems — Wholesale Pricing on 81+ Chair Models"
            : "Universal Furniture Systems — Factory-Direct Office Chairs from Bangalore"}
        </p>
      </div>

      {/* ── Row 2: Logo + Nav + Icons ── */}
      <header className={`sticky top-0 z-50 w-full backdrop-blur-md transition-colors ${isWholesale ? "bg-[#0f1d33]/95" : "bg-white/95"}`}>
        <div className={`border-b transition-colors ${isWholesale ? "border-[#1a2d4d]" : "border-[#f0f2f4]"}`}>
          <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between">
            {/* Logo & Brand */}
            <Link href="/" className="flex items-center gap-4 group cursor-pointer flex-shrink-0">
              <img
                src="/logo.png"
                alt="Universal Chairs"
                className="h-14 w-14 object-contain"
              />
              <span className={`text-xl font-extrabold tracking-tight whitespace-nowrap ${isWholesale ? "text-white" : "text-[#111318]"}`}>
                Universal{" "}<span className="text-primary">Ergonomics</span>
              </span>
            </Link>

            {/* Desktop Nav links */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/products?category=Executive+Chairs" className={navLinkClass}>Executive</Link>
              <Link href="/products?category=Mesh+Chairs" className={navLinkClass}>Mesh</Link>
              <Link href="/products?category=Revolving+Chairs" className={navLinkClass}>Revolving</Link>
              <Link href="/products?category=Visitor+Chairs" className={navLinkClass}>Visitor</Link>
              <Link href="/products" className={navLinkClass}>All Chairs</Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-3">
              <button className={`p-2 rounded-full transition-colors ${isWholesale ? "hover:bg-white/10" : "hover:bg-[#f5f5f7]"}`}>
                <span className={`material-symbols-outlined text-[22px] ${isWholesale ? "text-white/70" : ""}`}>search</span>
              </button>
              <Link href="/cart" className={`p-2 rounded-full transition-colors relative ${isWholesale ? "hover:bg-white/10" : "hover:bg-[#f5f5f7]"}`}>
                <span className={`material-symbols-outlined text-[22px] ${isWholesale ? "text-white/70" : ""}`}>shopping_bag</span>
                {totalItems() > 0 && (
                  <span className="absolute top-1 right-1 size-2.5 bg-primary rounded-full" />
                )}
              </Link>
              <div className={`size-9 rounded-full overflow-hidden border flex items-center justify-center ${isWholesale ? "border-white/20 bg-white/10 text-white/70" : "border-[#f0f2f4] bg-primary/10 text-primary"}`}>
                <span className="material-symbols-outlined text-base">person</span>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2 rounded-full transition ${isWholesale ? "hover:bg-white/10" : "hover:bg-[#f5f5f7]"}`}
                aria-label="Toggle menu"
              >
                <span className={`material-symbols-outlined text-[22px] ${isWholesale ? "text-white/70" : ""}`}>
                  {mobileOpen ? "close" : "menu"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Row 3: Retail / Wholesale Toggle ── */}
        <div className={`border-b transition-colors ${isWholesale ? "border-[#1a2d4d]" : "border-[#f0f2f4]"}`}>
          <div className="max-w-[1200px] mx-auto px-6 py-2.5 flex justify-center">
            <div className={`flex p-1 rounded-full border w-56 transition-colors ${isWholesale ? "bg-white/10 border-white/20" : "bg-[#f5f5f7] border-[#e5e7eb]"}`}>
              <button
                onClick={() => setMode("retail")}
                className={`flex-1 py-1.5 px-5 rounded-full text-sm font-semibold transition-all ${
                  !isWholesale
                    ? "bg-white shadow-sm text-[#111318]"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                Retail
              </button>
              <button
                onClick={() => setMode("wholesale")}
                className={`flex-1 py-1.5 px-5 rounded-full text-sm font-semibold transition-all ${
                  isWholesale
                    ? "bg-primary shadow-sm text-white"
                    : "text-[#6e6e73] hover:text-[#111318]"
                }`}
              >
                Wholesale
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className={`lg:hidden pb-4 border-b pt-3 px-6 ${isWholesale ? "border-[#1a2d4d]" : "border-[#f0f2f4]"}`}>
            <div className="flex flex-col gap-1">
              {[
                { href: "/products?category=Executive+Chairs", label: "Executive Chairs" },
                { href: "/products?category=Mesh+Chairs", label: "Mesh Chairs" },
                { href: "/products?category=Revolving+Chairs", label: "Revolving Chairs" },
                { href: "/products?category=Visitor+Chairs", label: "Visitor Chairs" },
                { href: "/products?category=Bar+Stools+%26+Classroom", label: "Bar Stools & Classroom" },
                { href: "/products", label: "All Chairs" },
                { href: "/about", label: "About Us" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 text-sm font-medium rounded-lg transition ${isWholesale ? "text-white/70 hover:bg-white/10" : "text-[#111318]/70 hover:bg-[#f5f5f7]"}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
