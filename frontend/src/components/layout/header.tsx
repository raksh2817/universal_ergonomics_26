"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useCart } from "@/hooks/use-cart";
import { useMode } from "@/hooks/use-mode";

const navLinks = [
  { href: "/products?category=Executive+Chairs", label: "Executive" },
  { href: "/products?category=Mesh+Chairs", label: "Mesh" },
  { href: "/products?category=Revolving+Chairs", label: "Revolving" },
  { href: "/products?category=Visitor+Chairs", label: "Visitor" },
  { href: "/products", label: "All Chairs" },
  { href: "/about", label: "About" },
];

const mobileLinks = [
  { href: "/products?category=Executive+Chairs", label: "Executive Chairs" },
  { href: "/products?category=Mesh+Chairs", label: "Mesh Chairs" },
  { href: "/products?category=Revolving+Chairs", label: "Revolving Chairs" },
  { href: "/products?category=Visitor+Chairs", label: "Visitor Chairs" },
  { href: "/products?category=Bar+Stools+%26+Classroom", label: "Bar Stools & Classroom" },
  { href: "/products", label: "All Chairs" },
  { href: "/about", label: "About Us" },
];

export function Header() {
  const totalItems = useCart((s) => s.totalItems);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const mode = useMode((s) => s.mode);
  const setMode = useMode((s) => s.setMode);

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  useEffect(() => {
    const stored = localStorage.getItem("ue-banner-dismissed");
    if (stored === "true") setDismissed(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const dismissBanner = useCallback(() => {
    setDismissed(true);
    localStorage.setItem("ue-banner-dismissed", "true");
  }, []);

  const itemCount = totalItems();

  return (
    <>
      {/* Row 1: Announcement Bar */}
      {!dismissed && (
        <div className="relative w-full h-9 bg-dark overflow-hidden flex items-center justify-center">
          <p className="text-accent text-xs font-medium tracking-[0.05em] uppercase text-center px-8">
            {mode === "wholesale"
              ? "Wholesale Portal — Bulk Pricing from 5 Chairs. Up to 20% Off."
              : "Factory-Direct Prices. Free Delivery & Assembly in Bengaluru."}
          </p>
          <button
            onClick={dismissBanner}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-accent/60 hover:text-accent transition"
            aria-label="Dismiss announcement"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Row 2 + 3: Sticky Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-shadow duration-300 ${
          scrolled
            ? "shadow-[0_1px_0_var(--color-border)] backdrop-blur-xl bg-surface-raised/95"
            : "bg-surface-raised"
        }`}
      >
        {/* Main Nav Row */}
        <div className="border-b border-[var(--color-border)]">
          <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-10 h-16 lg:h-[72px] flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <span className="font-display text-xl lg:text-2xl tracking-tight text-foreground whitespace-nowrap">
                Universal <span className="text-accent">Ergonomics</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-medium tracking-[0.03em] uppercase text-muted hover:text-foreground transition group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-full hover:bg-surface-muted transition"
                aria-label="Search"
              >
                <span className="material-symbols-outlined text-[22px] text-muted">search</span>
              </button>

              <Link
                href="/cart"
                className="p-2 rounded-full hover:bg-surface-muted transition relative"
                aria-label={`Cart with ${itemCount} items`}
              >
                <span className="material-symbols-outlined text-[22px] text-muted">shopping_bag</span>
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 tabular-nums">
                    {itemCount}
                  </span>
                )}
              </Link>

              <div className="hidden lg:flex size-9 rounded-full border border-[var(--color-border)] bg-surface-muted items-center justify-center text-muted">
                <span className="material-symbols-outlined text-base">person</span>
              </div>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-surface-muted transition"
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                <span className="material-symbols-outlined text-[22px] text-foreground">
                  {mobileOpen ? "close" : "menu"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mode Toggle Row */}
        <div className="border-b border-[var(--color-border)]">
          <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-10 py-2 flex justify-center">
            <div className="flex p-1 rounded-full bg-surface-muted w-52 relative">
              <div
                className="absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] bg-primary rounded-full transition-transform duration-300 ease-out"
                style={{
                  transform: mode === "wholesale" ? "translateX(calc(100% + 4px))" : "translateX(0)",
                }}
              />
              <button
                onClick={() => setMode("retail")}
                className={`relative z-10 flex-1 py-1.5 rounded-full text-xs font-semibold tracking-[0.05em] uppercase transition-colors ${
                  mode === "retail" ? "text-white" : "text-muted"
                }`}
              >
                Retail
              </button>
              <button
                onClick={() => setMode("wholesale")}
                className={`relative z-10 flex-1 py-1.5 rounded-full text-xs font-semibold tracking-[0.05em] uppercase transition-colors ${
                  mode === "wholesale" ? "text-white" : "text-muted"
                }`}
              >
                Wholesale
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            style={{ animation: "fadeIn 0.2s ease-out" }}
          />
          <nav
            className="absolute top-0 right-0 h-full w-[min(85vw,360px)] bg-surface-raised flex flex-col overflow-y-auto"
            style={{ animation: "slideInRight 0.3s ease-out" }}
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
              <span className="font-display text-lg text-foreground">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-full hover:bg-surface-muted"
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined text-foreground">close</span>
              </button>
            </div>

            <div className="flex-1 p-5 space-y-1">
              {mobileLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center px-4 py-3 text-xl font-medium text-foreground hover:bg-surface-muted rounded-lg transition min-h-[48px]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="p-5 border-t border-[var(--color-border)]">
              <div className="flex p-1 rounded-full bg-surface-muted relative">
                <div
                  className="absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] bg-primary rounded-full transition-transform duration-300 ease-out"
                  style={{
                    transform: mode === "wholesale" ? "translateX(calc(100% + 4px))" : "translateX(0)",
                  }}
                />
                <button
                  onClick={() => setMode("retail")}
                  className={`relative z-10 flex-1 py-2 rounded-full text-sm font-semibold tracking-[0.05em] uppercase transition-colors ${
                    mode === "retail" ? "text-white" : "text-muted"
                  }`}
                >
                  Retail
                </button>
                <button
                  onClick={() => setMode("wholesale")}
                  className={`relative z-10 flex-1 py-2 rounded-full text-sm font-semibold tracking-[0.05em] uppercase transition-colors ${
                    mode === "wholesale" ? "text-white" : "text-muted"
                  }`}
                >
                  Wholesale
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
