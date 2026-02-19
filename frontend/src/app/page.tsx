"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { useMode } from "@/hooks/use-mode";

/* ═══════════════════════════════════════════════════════
   SHARED DATA
   ═══════════════════════════════════════════════════════ */

const stats = [
  { value: "81+", label: "Chair Models" },
  { value: "5", label: "Product Categories" },
  { value: "500+", label: "Businesses Served" },
  { value: "5yr", label: "Max Warranty" },
];

const categories = [
  { name: "Executive Chairs", count: 9, icon: "king_bed", desc: "Premium leather & fabric high-back chairs for boardrooms and corner offices.", href: "/products?category=Executive+Chairs" },
  { name: "Mesh Chairs", count: 36, icon: "airwave", desc: "Breathable mesh for all-day comfort. High-back, mid-back, and headrest options.", href: "/products?category=Mesh+Chairs" },
  { name: "Revolving Chairs", count: 9, icon: "sync", desc: "Compact revolving chairs for workstations, home offices, and study rooms.", href: "/products?category=Revolving+Chairs" },
  { name: "Visitor Chairs", count: 18, icon: "group", desc: "Fixed-base and stackable chairs for reception, waiting areas, and meeting rooms.", href: "/products?category=Visitor+Chairs" },
  { name: "Bar Stools & Classroom", count: 9, icon: "chair", desc: "Bar stools, lab stools, and writing-pad chairs for institutions and hospitality.", href: "/products?category=Bar+Stools+%26+Classroom" },
];

const ergonomicBenefits = [
  { title: "Up to 17% More Productive", desc: "Ergonomic seating improves focus and output by reducing discomfort-related distractions throughout the workday." },
  { title: "Less Back Pain, Fewer Sick Days", desc: "Proper lumbar support and adjustable seating reduce the risk of chronic lower back pain — the #1 workplace complaint." },
  { title: "Focus Without Fidgeting", desc: "When your body is correctly supported, your mind is free to concentrate. Ergonomic chairs reduce restlessness and fatigue." },
  { title: "Comfort Retains Talent", desc: "Investing in workplace comfort signals care. Companies with ergonomic setups report higher satisfaction and lower turnover." },
];

const testimonials = [
  { company: "TechNova Solutions", person: "Rajesh Kumar", role: "Head of Operations", quote: "We furnished our entire 200-seat office with Universal Chairs. The quality rivals imported brands at half the price. Their on-site assembly team had everything set up in a single day.", chairs: 200, industry: "IT Services" },
  { company: "Greenfield Coworking", person: "Ananya Sharma", role: "Founder", quote: "As a coworking space, durability is everything. We've been using UFS mesh chairs for 2 years across 3 locations — zero replacements. Their B2B pricing made it a no-brainer.", chairs: 350, industry: "Coworking" },
  { company: "Pinnacle Academy", person: "Dr. Suresh Reddy", role: "Principal", quote: "We needed 150 classroom chairs with writing pads delivered within a week. Universal Furniture delivered in 4 days with proper GST invoicing. Exceptional service.", chairs: 150, industry: "Education" },
  { company: "Orion Financial Services", person: "Meera Patel", role: "Admin Manager", quote: "The executive chairs for our leadership team and mesh chairs for the floor — all from one vendor with volume pricing. Saved us nearly 40% compared to our previous vendor.", chairs: 85, industry: "Finance" },
];

const faqs = [
  { q: "What is the minimum order for wholesale pricing?", a: "Wholesale pricing starts at just 5 chairs. The more you order, the better the discount — up to 20% off for orders of 100+ chairs." },
  { q: "Do you provide GST invoicing?", a: "Yes. We are a registered manufacturer and provide proper GST invoices on all B2B orders, enabling full Input Tax Credit (ITC) claims." },
  { q: "What is the delivery timeline?", a: "In-stock models ship within 2–3 business days across Bengaluru, with free doorstep assembly. Orders of 50+ chairs typically ship in 5–7 business days. Pan-India delivery is available on request." },
  { q: "Do you offer on-site assembly?", a: "Yes, free on-site assembly is included with all orders within Bengaluru. Our trained team sets up every chair at your location." },
  { q: "Can we mix different models in one order?", a: "Absolutely. Combine executive, mesh, revolving, visitor, and classroom chairs in one order. Volume discounts apply to the total quantity." },
  { q: "What warranty do you offer?", a: "Up to 5-year warranty depending on the model, with dedicated after-sales support and on-site service." },
];

const industries = [
  { icon: "computer", label: "IT & Software" },
  { icon: "business", label: "Corporate Offices" },
  { icon: "groups", label: "Coworking Spaces" },
  { icon: "school", label: "Schools & Colleges" },
  { icon: "local_hospital", label: "Hospitals & Clinics" },
  { icon: "account_balance", label: "Banks & Finance" },
  { icon: "gavel", label: "Government" },
  { icon: "hotel", label: "Hotels & Hospitality" },
];

/* ═══════════════════════════════════════════════════════
   SCROLL REVEAL HOOK
   ═══════════════════════════════════════════════════════ */

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll(".reveal");
    if (!targets.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ═══════════════════════════════════════════════════════
   RETAIL HOME
   ═══════════════════════════════════════════════════════ */

function RetailHome() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const revealRef = useReveal();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={revealRef}>
      {/* Logo watermark — fixed so it scrolls with the user */}
      <img
        src="/logo.png"
        alt=""
        aria-hidden="true"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[550px] lg:w-[700px] opacity-[0.06] pointer-events-none select-none z-0"
      />

      {/* ── HERO ── */}
      <section className="bg-surface/80 min-h-[80vh] lg:min-h-screen flex items-center relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-10 py-24 md:py-36 w-full text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 border border-[var(--color-border)] text-xs font-medium rounded-full mb-8 uppercase tracking-[0.05em] text-muted animate-fade-in-up mx-auto">
            <span className="material-symbols-outlined text-accent text-sm">verified</span>
            India&apos;s Trusted Chair Manufacturer
          </span>
          <h1
            className="font-display text-hero md:text-[3.5rem] lg:text-[4.5rem] leading-[1.05] tracking-tight mb-6 max-w-4xl mx-auto"
            style={{ animation: "fadeInUp 0.4s ease-out 0.1s both" }}
          >
            Where You Sit Shapes{" "}
            <br className="hidden md:block" />
            How You Work.
          </h1>
          <p
            className="text-lg text-muted leading-relaxed mb-10 max-w-2xl mx-auto"
            style={{ animation: "fadeInUp 0.4s ease-out 0.2s both" }}
          >
            81+ chair models built in our Bengaluru factory and delivered to your
            door — free. From boardroom to classroom, find the chair that fits
            your space, your body, and your budget.
          </p>
          <div
            className="flex flex-col sm:flex-row items-center gap-3 justify-center"
            style={{ animation: "fadeInUp 0.4s ease-out 0.3s both" }}
          >
            <Link
              href="/products"
              className="px-10 py-3.5 bg-primary text-white font-medium text-sm tracking-[0.04em] uppercase rounded-lg hover:bg-primary-light transition flex items-center gap-2"
            >
              Browse Collection
            </Link>
            <Link
              href="/about"
              className="px-10 py-3.5 border-[1.5px] border-strong text-foreground font-medium text-sm tracking-[0.04em] uppercase rounded-lg hover:bg-surface-muted transition"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-dark">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-10 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-2xl md:text-3xl text-white">{s.value}</p>
              <p className="text-xs uppercase tracking-[0.1em] text-accent mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORY GRID ── */}
      <section className="bg-surface-muted py-12 md:py-24 px-4 md:px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-xs uppercase tracking-[0.1em] text-accent font-medium mb-3 reveal">
              Collections
            </p>
            <h2 className="font-display text-2xl md:text-3xl reveal">
              Find Your Perfect Chair
            </h2>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide lg:grid lg:grid-cols-5 lg:gap-5 pb-2 lg:pb-0 reveal-stagger">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="reveal flex-shrink-0 w-56 lg:w-auto group relative bg-dark rounded-xl overflow-hidden aspect-[3/4] flex items-end"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative p-5 w-full">
                  <p className="text-white font-display text-lg mb-1">{cat.name}</p>
                  <p className="text-white/60 text-xs">{cat.count} models</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO WE ARE ── */}
      <section className="bg-surface py-12 md:py-24 px-4 md:px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.1em] text-accent font-medium mb-3 reveal">
              Who We Are
            </p>
            <h2 className="font-display text-2xl md:text-3xl mb-6 reveal">
              Manufacturers &amp; Dealers Since Day One.
            </h2>
            <div className="space-y-4 text-muted leading-relaxed reveal">
              <p>
                <strong className="text-foreground">Universal Furniture Systems</strong> — the
                brand behind Universal Chairs — manufactures and sells office furniture from our
                own factory on Mysore Road, Bengaluru. From premium leather executive chairs to
                stackable classroom seating, everything is made under one roof.
              </p>
              <p>
                We control the full production chain — metal fabrication, CNC bending, mesh
                cutting, foam molding, and final assembly — which is how we deliver quality
                that rivals imported brands at 30–50% lower prices. One chair or five hundred,
                we deliver free with on-site assembly and up to a 5-year warranty.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 reveal-stagger">
            {[
              { icon: "factory", title: "Own Factory", desc: "Full production on Mysore Road, Bengaluru" },
              { icon: "local_shipping", title: "Free Delivery", desc: "Delivery + on-site assembly included" },
              { icon: "engineering", title: "CNC Bending", desc: "Precision metal work in-house" },
              { icon: "shield", title: "Up to 5yr Warranty", desc: "On-site repairs, no call centers" },
            ].map((item) => (
              <div key={item.title} className="reveal bg-surface-muted rounded-xl p-5 text-center">
                <span className="material-symbols-outlined text-accent text-3xl mb-3 block">
                  {item.icon}
                </span>
                <h4 className="font-medium text-sm mb-1 text-foreground">{item.title}</h4>
                <p className="text-xs text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE SCIENCE OF SITTING ── */}
      <section className="bg-surface-muted py-12 md:py-24 px-4 md:px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-xs uppercase tracking-[0.1em] text-accent font-medium mb-3 reveal">
              The Science of Sitting
            </p>
            <h2 className="font-display text-2xl md:text-3xl reveal">
              Why Your Chair Matters More Than You Think
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 reveal-stagger">
            {ergonomicBenefits.map((b, idx) => (
              <div key={b.title} className="reveal">
                <p className="font-display text-3xl text-accent/20 mb-3">
                  {String(idx + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display text-lg mb-2 text-foreground">{b.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE UNIVERSAL ADVANTAGE ── */}
      <section className="bg-dark py-12 md:py-24 px-4 md:px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-2xl md:text-3xl text-white">
              The Universal Advantage
            </h2>
            <p className="text-white/50 mt-3 max-w-xl mx-auto text-sm">
              What separates us from furniture marketplaces and imported brands.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "factory", title: "Factory Direct", desc: "We manufacture in-house. No middlemen, no markups — savings passed directly to you." },
              { icon: "receipt_long", title: "GST Invoicing", desc: "Proper GST invoices on every order. Claim full Input Tax Credit on business purchases." },
              { icon: "local_shipping", title: "Free Delivery & Assembly", desc: "Our fleet delivers and assembles at your location. You're ready to sit the same day." },
              { icon: "build", title: "On-Site Warranty Service", desc: "Up to 5-year warranty with on-site repairs. Dedicated service team — no call centers." },
              { icon: "dashboard_customize", title: "Mix & Match", desc: "Executive for the boss, mesh for the team, visitor for reception — one order, one invoice." },
              { icon: "support_agent", title: "Dedicated Support", desc: "Single point of contact for orders, reorders, and service. We know your name, not your ticket number." },
            ].map((item) => (
              <div
                key={item.title}
                className="border border-white/10 rounded-xl p-6 hover:bg-white/5 transition"
              >
                <span className="material-symbols-outlined text-accent text-2xl mb-4 block">
                  {item.icon}
                </span>
                <h3 className="text-white font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-surface py-12 md:py-24 px-4 md:px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12 reveal">
            <h2 className="font-display text-2xl md:text-3xl">Trusted by Growing Businesses</h2>
            <p className="text-muted mt-3 text-sm">
              From startups to enterprises — hear from companies we&apos;ve furnished.
            </p>
          </div>
          <div className="max-w-3xl mx-auto text-center mb-10 reveal">
            <p className="font-display text-hero text-accent opacity-30 leading-none mb-4">
              &ldquo;
            </p>
            <blockquote className="font-display text-xl leading-relaxed italic text-foreground mb-6">
              {testimonials[activeTestimonial].quote}
            </blockquote>
            <p className="font-medium text-foreground">
              {testimonials[activeTestimonial].person}
            </p>
            <p className="text-sm text-muted">
              {testimonials[activeTestimonial].role}, {testimonials[activeTestimonial].company}
            </p>
          </div>
          <div className="flex justify-center gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  idx === activeTestimonial ? "bg-accent" : "bg-[var(--color-border-strong)]"
                }`}
                aria-label={`Testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKSPACE CARDS ── */}
      <section className="bg-surface-muted py-12 md:py-24 px-4 md:px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-2xl md:text-3xl reveal">
              Design Your Ideal Workspace
            </h2>
            <p className="text-muted mt-3 max-w-xl mx-auto text-sm reveal">
              The right furniture transforms a room into a productive, inspiring environment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-stagger">
            {[
              { icon: "corporate_fare", title: "Corporate Offices", desc: "Ergonomic mesh and executive chairs that keep teams comfortable through 8-hour days.", points: ["Mesh chairs for open floors", "Executive chairs for leadership", "Visitor chairs for reception"] },
              { icon: "home_work", title: "Home Offices", desc: "Compact revolving and mid-back chairs that fit home setups without sacrificing comfort.", points: ["Revolving chairs for small spaces", "Adjustable for shared desks", "Clean, professional look"] },
              { icon: "school", title: "Institutions & Training", desc: "Stackable visitor chairs, writing-pad classroom seats, and lab stools built for heavy daily use.", points: ["Writing-pad chairs for classrooms", "Stackable for easy storage", "Built for heavy daily use"] },
            ].map((space) => (
              <div
                key={space.title}
                className="reveal bg-surface-raised rounded-xl p-6 lg:p-8 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300"
              >
                <span className="material-symbols-outlined text-accent text-3xl mb-4 block">
                  {space.icon}
                </span>
                <h3 className="font-display text-lg mb-2 text-foreground">{space.title}</h3>
                <p className="text-sm text-muted leading-relaxed mb-4">{space.desc}</p>
                <ul className="space-y-2">
                  {space.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-accent text-base">check_circle</span>
                      <span className="text-foreground">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FAQ />

      {/* ── CONTACT CTA ── */}
      <section className="bg-dark py-12 md:py-24 px-4 md:px-6 lg:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl text-white mb-4">
            Ready to upgrade your workspace?
          </h2>
          <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
            Walk into our Mysore Road showroom, explore the full catalog online, or call for a free consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link
              href="/products"
              className="px-8 py-3 bg-accent text-accent-fg font-medium text-sm tracking-[0.04em] uppercase rounded-lg hover:bg-accent-hover transition"
            >
              Browse Catalog
            </Link>
            <a
              href="tel:+919845007572"
              className="px-8 py-3 border-[1.5px] border-white/20 text-white font-medium text-sm tracking-[0.04em] uppercase rounded-lg hover:bg-white/10 transition"
            >
              Call Us
            </a>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-white/50 flex-wrap">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-accent">location_on</span>
              Mysore Road, Bengaluru 560026
            </span>
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-accent">mail</span>
              universalfurnituresystems@gmail.com
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   WHOLESALE HOME
   ═══════════════════════════════════════════════════════ */

function WholesaleHome() {
  const [submitted, setSubmitted] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const revealRef = useReveal();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  }, []);

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success/10 text-success mb-8">
            <span className="material-symbols-outlined" style={{ fontSize: "48px" }}>check_circle</span>
          </div>
          <h1 className="font-display text-3xl mb-4 text-foreground">Quote Request Received!</h1>
          <p className="text-muted text-lg mb-4">
            Our wholesale team will reach out within{" "}
            <strong className="text-foreground">24 hours</strong> with a custom quote.
          </p>
          <p className="text-sm text-muted mb-8">
            Need it sooner? Call{" "}
            <a href="tel:+919845007572" className="text-primary font-medium hover:underline">
              +91 9845007572
            </a>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products"
              className="px-8 py-3 bg-primary text-white font-medium text-sm tracking-[0.04em] uppercase rounded-lg hover:bg-primary-light transition"
            >
              Browse Catalog
            </Link>
            <button
              onClick={() => setSubmitted(false)}
              className="px-8 py-3 border-[1.5px] border-strong text-foreground font-medium text-sm tracking-[0.04em] uppercase rounded-lg hover:bg-surface-muted transition"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full h-12 border border-[var(--color-border)] rounded-lg px-4 text-base bg-surface-raised text-foreground placeholder:text-faint placeholder:italic focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(74,158,255,0.1)] transition";

  return (
    <div ref={revealRef}>
      {/* Logo watermark — fixed so it scrolls with the user */}
      <img
        src="/logo.png"
        alt=""
        aria-hidden="true"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[550px] lg:w-[700px] opacity-[0.08] brightness-0 invert pointer-events-none select-none z-0"
      />

      {/* ── HERO ── */}
      <section className="bg-surface/80 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-10 py-24 md:py-36 text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 border border-[var(--color-border)] text-xs font-medium rounded-full mb-8 uppercase tracking-[0.05em] text-muted animate-fade-in-up mx-auto">
            <span className="material-symbols-outlined text-accent text-sm">verified</span>
            India&apos;s Trusted Chair Manufacturer
          </span>
          <h1
            className="font-display text-hero md:text-[3.5rem] lg:text-[4.5rem] leading-[1.05] text-foreground tracking-tight mb-6 max-w-4xl mx-auto"
            style={{ animation: "fadeInUp 0.4s ease-out 0.1s both" }}
          >
            Furnish your entire office.
            <br />
            <span className="text-primary">Save up to 20%.</span>
          </h1>
          <p
            className="text-lg text-muted leading-relaxed mb-10 max-w-2xl mx-auto"
            style={{ animation: "fadeInUp 0.4s ease-out 0.2s both" }}
          >
            Trusted by 500+ businesses across Bengaluru. Choose from 81+ factory-direct
            models with free delivery, on-site assembly, GST invoicing, and a dedicated
            account manager.
          </p>
          <div
            className="flex flex-col sm:flex-row items-center gap-3 justify-center"
            style={{ animation: "fadeInUp 0.4s ease-out 0.3s both" }}
          >
            <a
              href="#quote-form"
              className="px-10 py-3.5 bg-primary text-white font-medium text-sm tracking-[0.04em] uppercase rounded-lg hover:bg-primary-light transition flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">request_quote</span>
              Get a Free Quote
            </a>
            <a
              href="tel:+919845007572"
              className="px-10 py-3.5 border-[1.5px] border-strong text-foreground font-medium text-sm tracking-[0.04em] uppercase rounded-lg hover:bg-surface-muted transition flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">call</span>
              +91 9845007572
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-surface-muted border border-[var(--color-border)] rounded-xl p-5 text-center"
              >
                <p className="font-display text-2xl md:text-3xl text-primary">{s.value}</p>
                <p className="text-xs text-muted mt-1 uppercase tracking-[0.06em]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-surface-muted py-12 md:py-24 px-4 md:px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12 md:mb-14">
            <h2 className="font-display text-2xl md:text-3xl reveal">How Wholesale Ordering Works</h2>
            <p className="text-muted mt-3 text-sm reveal">Three simple steps from enquiry to fully furnished office.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-stagger">
            {[
              { step: "01", icon: "edit_note", title: "Submit Your Requirements", desc: "Fill out the quote form with your chair needs — models, quantities, and timeline." },
              { step: "02", icon: "calculate", title: "Receive Custom Quote", desc: "Our team sends a detailed quote within 24 hours with volume pricing and GST breakdown." },
              { step: "03", icon: "local_shipping", title: "Delivery & Assembly", desc: "We deliver and assemble every chair on-site. You're ready to work the same day." },
            ].map((item) => (
              <div
                key={item.step}
                className="reveal relative bg-surface-raised border border-[var(--color-border)] rounded-xl p-6 lg:p-8"
              >
                <span className="font-display text-[4rem] text-accent-soft absolute top-4 right-5 leading-none">
                  {item.step}
                </span>
                <div className="w-12 h-12 bg-accent-soft rounded-xl flex items-center justify-center text-primary mb-4">
                  <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                </div>
                <h3 className="font-display text-lg mb-2 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VOLUME PRICING ── */}
      <section className="bg-surface py-12 md:py-24 px-4 md:px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12 md:mb-14">
            <h2 className="font-display text-2xl md:text-3xl reveal">Volume Pricing That Scales</h2>
            <p className="text-muted mt-3 max-w-lg mx-auto text-sm reveal">
              The more you order, the more you save. Discounts apply across all categories.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto reveal-stagger">
            {[
              { qty: "5 – 19", discount: "10%", label: "Starter" },
              { qty: "20 – 49", discount: "12%", label: "Growth" },
              { qty: "50 – 99", discount: "15%", label: "Scale", popular: true },
              { qty: "100+", discount: "20%", label: "Enterprise", best: true },
            ].map((tier) => (
              <div
                key={tier.qty}
                className={`reveal rounded-xl p-5 text-center border-2 transition hover:-translate-y-1 ${
                  tier.best
                    ? "bg-primary text-white border-primary"
                    : tier.popular
                      ? "bg-surface-raised border-primary"
                      : "bg-surface-raised border-[var(--color-border)]"
                }`}
              >
                {tier.best && (
                  <span className="inline-block px-2 py-0.5 bg-white/20 text-white text-[10px] font-medium rounded-full uppercase tracking-[0.06em] mb-2">
                    Best Value
                  </span>
                )}
                {tier.popular && (
                  <span className="inline-block px-2 py-0.5 bg-accent-soft text-primary text-[10px] font-medium rounded-full uppercase tracking-[0.06em] mb-2">
                    Popular
                  </span>
                )}
                {!tier.popular && !tier.best && <div className="mb-2 h-[18px]" />}
                <p className={`text-3xl font-bold tabular-nums mb-1 ${tier.best ? "text-white" : "text-primary"}`}>
                  {tier.discount}
                </p>
                <p className={`text-xs uppercase tracking-[0.06em] mb-3 ${tier.best ? "text-white/60" : "text-muted"}`}>
                  OFF MRP
                </p>
                <div className={`w-full h-px mb-3 ${tier.best ? "bg-white/20" : "bg-[var(--color-border)]"}`} />
                <p className={`text-sm font-medium mb-0.5 ${tier.best ? "text-white" : "text-foreground"}`}>
                  {tier.qty} chairs
                </p>
                <p className={`text-xs ${tier.best ? "text-white/50" : "text-muted"}`}>
                  {tier.label} Tier
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="bg-surface-muted py-12 md:py-24 px-4 md:px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-2xl md:text-3xl reveal">One Vendor, Every Chair Type</h2>
            <p className="text-muted mt-3 max-w-xl mx-auto text-sm reveal">
              Mix and match across 5 categories in a single order. Volume discounts apply to the total.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 reveal-stagger">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="reveal group bg-surface-raised rounded-xl p-6 lg:p-8 border border-[var(--color-border)] hover:border-primary/40 transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent-soft rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition">
                    <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{cat.name}</h3>
                    <p className="text-xs text-muted">{cat.count} models</p>
                  </div>
                </div>
                <p className="text-sm text-muted leading-relaxed">{cat.desc}</p>
              </Link>
            ))}
            <Link
              href="/products"
              className="reveal group bg-primary rounded-xl p-6 lg:p-8 text-white flex flex-col justify-center items-center text-center hover:bg-primary-light transition"
            >
              <span className="material-symbols-outlined text-4xl mb-3">grid_view</span>
              <h3 className="font-medium text-lg mb-1">View Full Catalog</h3>
              <p className="text-sm text-white/60">All 81+ models</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── ADVANTAGES ── */}
      <section className="bg-dark py-12 md:py-24 px-4 md:px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-2xl md:text-3xl text-white">The Wholesale Advantage</h2>
            <p className="text-white/50 mt-3 max-w-xl mx-auto text-sm">
              Everything you need from a single furniture partner.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "factory", title: "Factory Direct Pricing", desc: "We manufacture in-house. No middlemen — savings passed directly to you." },
              { icon: "receipt_long", title: "GST Invoicing & ITC", desc: "Proper GST invoices so your business claims full Input Tax Credit." },
              { icon: "local_shipping", title: "Free Delivery & Assembly", desc: "Our fleet delivers and assembles at your office within 48 hours." },
              { icon: "build", title: "On-Site Service & Warranty", desc: "Up to 5-year warranty with on-site repairs. No call centers." },
              { icon: "dashboard_customize", title: "Mix & Match Models", desc: "Executive, mesh, visitor — combine any models in one order." },
              { icon: "support_agent", title: "Dedicated Account Manager", desc: "Single point of contact for orders, reorders, and service." },
            ].map((item) => (
              <div
                key={item.title}
                className="border border-white/10 rounded-xl p-6 hover:bg-white/5 transition"
              >
                <span className="material-symbols-outlined text-accent text-2xl mb-4 block">
                  {item.icon}
                </span>
                <h3 className="text-white font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-surface py-12 md:py-24 px-4 md:px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12 reveal">
            <h2 className="font-display text-2xl md:text-3xl">Trusted by Growing Businesses</h2>
            <p className="text-muted mt-3 text-sm">
              From startups to enterprises — hear from companies we&apos;ve furnished.
            </p>
          </div>
          <div className="max-w-3xl mx-auto text-center mb-10 reveal">
            <p className="font-display text-hero text-accent opacity-30 leading-none mb-4">
              &ldquo;
            </p>
            <blockquote className="font-display text-xl leading-relaxed italic text-foreground mb-6">
              {testimonials[activeTestimonial].quote}
            </blockquote>
            <p className="font-medium text-foreground">
              {testimonials[activeTestimonial].person}
            </p>
            <p className="text-sm text-muted">
              {testimonials[activeTestimonial].role}, {testimonials[activeTestimonial].company}
            </p>
          </div>
          <div className="flex justify-center gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  idx === activeTestimonial ? "bg-accent" : "bg-[var(--color-border-strong)]"
                }`}
                aria-label={`Testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ── */}
      <section className="bg-surface-muted py-12 md:py-16 px-4 md:px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display text-2xl text-center mb-8 reveal">Industries We Serve</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 reveal">
            {industries.map((ind) => (
              <div
                key={ind.label}
                className="flex-shrink-0 flex items-center gap-2.5 bg-surface-raised border border-[var(--color-border)] rounded-full px-4 py-2.5"
              >
                <span className="material-symbols-outlined text-primary text-lg">{ind.icon}</span>
                <span className="text-sm font-medium text-foreground whitespace-nowrap">{ind.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE FORM ── */}
      <section id="quote-form" className="bg-surface py-12 md:py-24 px-4 md:px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.1em] text-accent font-medium mb-3">
              Free Quote
            </p>
            <h2 className="font-display text-2xl md:text-3xl mb-4">
              Request a Wholesale Quote
            </h2>
            <p className="text-muted leading-relaxed mb-8">
              Tell us what you need — our team will prepare a detailed quote within 24 hours.
            </p>
            <div className="space-y-4 mb-8">
              {[
                { icon: "schedule", text: "Response within 24 hours" },
                { icon: "lock", text: "No obligation, no spam" },
                { icon: "call", text: "Or call: +91 9845007572" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-accent text-lg">{item.icon}</span>
                  <span className="text-sm font-medium text-foreground">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="bg-surface-muted rounded-xl p-5 border border-[var(--color-border)]">
              <h4 className="text-xs font-medium uppercase tracking-[0.06em] text-muted mb-4">
                Pricing Guide
              </h4>
              <div className="space-y-2.5">
                {[
                  { r: "5–19", p: "10%" },
                  { r: "20–49", p: "12%" },
                  { r: "50–99", p: "15%" },
                  { r: "100+", p: "20%" },
                ].map((t) => (
                  <div key={t.r} className="flex justify-between text-sm">
                    <span className="text-foreground">{t.r} chairs</span>
                    <span className="font-medium text-primary">{t.p} off</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-surface-raised border border-[var(--color-border)] rounded-xl p-5 md:p-8">
              <h3 className="font-display text-xl mb-6 flex items-center gap-2 text-foreground">
                <span className="material-symbols-outlined text-primary">description</span>
                Your Requirements
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1.5">Company *</label>
                    <input name="company_name" required className={inputClass} placeholder="Company name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1.5">Contact Person *</label>
                    <input name="contact_name" required className={inputClass} placeholder="Full name" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1.5">Email *</label>
                    <input name="email" type="email" required className={inputClass} placeholder="you@company.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1.5">Phone *</label>
                    <input name="phone" type="tel" required className={inputClass} placeholder="+91 98450 07572" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1.5">Quantity *</label>
                    <input name="qty" type="number" min="5" required className={inputClass} placeholder="Min 5 chairs" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1.5">Category</label>
                    <select name="category" className={inputClass}>
                      <option value="">Select (optional)</option>
                      <option>Executive</option>
                      <option>Mesh</option>
                      <option>Revolving</option>
                      <option>Visitor</option>
                      <option>Classroom</option>
                      <option>Mixed</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1.5">City</label>
                  <input name="city" className={inputClass} placeholder="Bengaluru, Mysore, Chennai..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1.5">Additional Info</label>
                  <textarea name="notes" rows={3} className={`${inputClass} h-auto py-3`} placeholder="Models, timeline, budget..." />
                </div>
                <button
                  type="submit"
                  className="w-full h-14 bg-primary hover:bg-primary-light text-white font-medium text-sm tracking-[0.04em] uppercase rounded-lg transition flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">send</span>
                  Get My Free Quote
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FAQ />

      {/* ── FINAL CTA ── */}
      <section className="bg-dark py-12 md:py-24 px-4 md:px-6 lg:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl text-white mb-4">
            Ready to Furnish Your Office?
          </h2>
          <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
            Join 500+ businesses that trust Universal Furniture Systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#quote-form"
              className="px-8 py-3 bg-accent text-accent-fg font-medium text-sm tracking-[0.04em] uppercase rounded-lg hover:bg-accent-hover transition flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">request_quote</span>
              Get a Free Quote
            </a>
            <a
              href="tel:+919845007572"
              className="px-8 py-3 border-[1.5px] border-white/20 text-white font-medium text-sm tracking-[0.04em] uppercase rounded-lg hover:bg-white/10 transition flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">call</span>
              +91 9845007572
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════════ */

function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  return (
    <section className="bg-surface-muted py-12 md:py-24 px-4 md:px-6 lg:px-10">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-surface-raised rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left min-h-[48px]"
              >
                <span className={`font-medium text-foreground pr-4 transition ${openFaq === idx ? "text-accent" : ""}`}>
                  {faq.q}
                </span>
                <span
                  className={`material-symbols-outlined text-muted flex-shrink-0 transition-transform duration-300 ${
                    openFaq === idx ? "rotate-45" : ""
                  }`}
                >
                  add
                </span>
              </button>
              <div
                className="grid transition-all duration-300"
                style={{
                  gridTemplateRows: openFaq === idx ? "1fr" : "0fr",
                  opacity: openFaq === idx ? 1 : 0,
                }}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-muted leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN — switches based on mode
   ═══════════════════════════════════════════════════════ */

export default function HomePage() {
  const mode = useMode((s) => s.mode);
  return mode === "wholesale" ? <WholesaleHome /> : <RetailHome />;
}
