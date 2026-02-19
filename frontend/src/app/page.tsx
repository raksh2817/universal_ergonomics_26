"use client";

import Link from "next/link";
import { useState } from "react";
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
  { icon: "trending_up", title: "Productivity Up 17%", desc: "Studies show ergonomic seating improves focus and output by reducing discomfort-related distractions throughout the workday." },
  { icon: "health_and_safety", title: "Reduce Back Pain", desc: "Proper lumbar support and adjustable seating reduce the risk of chronic lower back pain — the #1 workplace complaint." },
  { icon: "psychology", title: "Better Concentration", desc: "When your body is supported correctly, your mind is free to focus. Ergonomic chairs reduce fidgeting and restlessness." },
  { icon: "group", title: "Employee Retention", desc: "Investing in workplace comfort signals care. Companies with ergonomic setups report higher satisfaction and lower turnover." },
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
  { q: "What is the delivery timeline?", a: "Most in-stock models ship within 2-3 business days within Bangalore. For larger orders (50+), typically 5-7 business days. Pan-India shipping available." },
  { q: "Do you offer on-site assembly?", a: "Yes, free on-site assembly is included with all orders within Bangalore. Our trained team sets up every chair at your location." },
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
   RETAIL HOME
   ═══════════════════════════════════════════════════════ */

function RetailHome() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [email, setEmail] = useState("");

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-[#f8f9fb] to-[#eef1f6] pt-24 pb-28 md:pt-36 md:pb-44 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="max-w-[1200px] mx-auto relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur border border-gray-200 text-xs font-bold rounded-full mb-8 uppercase tracking-widest text-[#111318]/70">
            <span className="material-symbols-outlined text-primary text-sm">verified</span>
            India&apos;s Trusted Chair Manufacturer
          </span>
          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6 max-w-4xl mx-auto">
            Where You Sit Shapes <br className="hidden md:block" />
            <span className="text-primary">How You Work.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#6e6e73] leading-relaxed mb-12 max-w-2xl mx-auto">
            81+ chair models. Factory-direct from Bangalore. Executive, Mesh, Revolving, Visitor, and Classroom chairs — engineered for every workspace, every body, every budget.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link href="/products" className="px-10 py-4 bg-primary text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
              <span className="material-symbols-outlined">storefront</span>
              Explore Full Catalog
            </Link>
            <Link href="/about" className="px-10 py-4 border-2 border-[#111318] text-[#111318] font-bold rounded-full hover:bg-[#111318] hover:text-white transition-all">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-white border-b border-[#f0f2f4]">
        <div className="max-w-[1200px] mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-black text-primary">{s.value}</p>
              <p className="text-sm text-[#6e6e73] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT THE COMPANY ── */}
      <section className="max-w-[1200px] mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-6 uppercase tracking-widest">Who We Are</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6 leading-tight">
              Manufacturers &amp; Dealers <br className="hidden md:block" />Since Day One.
            </h2>
            <div className="space-y-4 text-[#6e6e73] leading-relaxed">
              <p>
                <strong className="text-[#111318]">Universal Furniture Systems</strong> — the brand behind <strong className="text-[#111318]">Universal Chairs</strong> — is a Bangalore-based manufacturer and dealer of office furniture. We make everything from premium leather executive chairs to stackable classroom seating, all under one roof.
              </p>
              <p>
                Our facility on Mysore Road handles the entire production chain: metal fabrication, CNC pipe bending, mesh cutting, foam molding, upholstery, and final assembly. By controlling every step, we deliver quality that rivals imported brands at 30-50% lower prices.
              </p>
              <p>
                Whether you need a single chair for your home office or 500 for a corporate setup, we deliver factory-direct with free assembly and up to 5-year warranty.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#f5f5f7] rounded-2xl p-6 text-center">
              <span className="material-symbols-outlined text-primary text-4xl mb-3 block">factory</span>
              <h4 className="font-bold text-sm mb-1">Own Factory</h4>
              <p className="text-xs text-[#6e6e73]">Full production on Mysore Road, Bangalore</p>
            </div>
            <div className="bg-[#f5f5f7] rounded-2xl p-6 text-center">
              <span className="material-symbols-outlined text-primary text-4xl mb-3 block">local_shipping</span>
              <h4 className="font-bold text-sm mb-1">Free Delivery</h4>
              <p className="text-xs text-[#6e6e73]">Delivery + on-site assembly included</p>
            </div>
            <div className="bg-[#f5f5f7] rounded-2xl p-6 text-center">
              <span className="material-symbols-outlined text-primary text-4xl mb-3 block">engineering</span>
              <h4 className="font-bold text-sm mb-1">CNC Bending</h4>
              <p className="text-xs text-[#6e6e73]">Precision metal work in-house</p>
            </div>
            <div className="bg-[#f5f5f7] rounded-2xl p-6 text-center">
              <span className="material-symbols-outlined text-primary text-4xl mb-3 block">shield</span>
              <h4 className="font-bold text-sm mb-1">Up to 5yr Warranty</h4>
              <p className="text-xs text-[#6e6e73]">On-site repairs, no call centers</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="bg-[#fafafa] py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">5 Categories. 81+ Models.</h2>
            <p className="text-[#6e6e73] max-w-xl mx-auto">From the boardroom to the classroom — we have the right chair for every space.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href} className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{cat.name}</h3>
                    <p className="text-xs text-[#6e6e73]">{cat.count} models</p>
                  </div>
                </div>
                <p className="text-sm text-[#6e6e73] leading-relaxed">{cat.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                  Browse <span className="material-symbols-outlined text-base">arrow_forward</span>
                </div>
              </Link>
            ))}
            <Link href="/products" className="group bg-primary rounded-2xl p-8 text-white hover:bg-blue-700 transition-all flex flex-col justify-center items-center text-center">
              <span className="material-symbols-outlined text-4xl mb-3">grid_view</span>
              <h3 className="font-bold text-lg mb-1">View Full Catalog</h3>
              <p className="text-sm text-white/70">All 81+ models in one place</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY ERGONOMIC SEATING MATTERS ── */}
      <section className="max-w-[1200px] mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-6 uppercase tracking-widest">The Science of Sitting</span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Why Your Chair Matters More Than You Think</h2>
          <p className="text-[#6e6e73] max-w-2xl mx-auto">The average office worker spends 8-10 hours seated daily. The right chair isn&apos;t a luxury — it&apos;s a health and productivity investment.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ergonomicBenefits.map((b) => (
            <div key={b.title} className="flex gap-5 p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-sm transition-shadow">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-2xl">{b.icon}</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">{b.title}</h3>
                <p className="text-sm text-[#6e6e73] leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE UFS ADVANTAGE ── */}
      <section className="bg-gradient-to-br from-[#0a1628] to-[#1a2d4d] text-white py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">The Universal Advantage</h2>
            <p className="text-white/60 max-w-xl mx-auto">What separates us from furniture marketplaces and imported brands.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "factory", title: "Factory Direct", desc: "We manufacture in-house. No middlemen, no markups — savings passed directly to you." },
              { icon: "receipt_long", title: "GST Invoicing", desc: "Proper GST invoices on every order. Claim full Input Tax Credit on business purchases." },
              { icon: "local_shipping", title: "Free Delivery & Assembly", desc: "Our fleet delivers and assembles at your location. You're ready to sit the same day." },
              { icon: "build", title: "On-Site Warranty Service", desc: "Up to 5-year warranty with on-site repairs. Dedicated service team — no call centers." },
              { icon: "dashboard_customize", title: "Mix & Match", desc: "Executive for the boss, mesh for the team, visitor for reception — one order, one invoice." },
              { icon: "support_agent", title: "Dedicated Support", desc: "Single point of contact for orders, reorders, and service. We know your name, not your ticket number." },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <span className="material-symbols-outlined text-primary text-2xl mb-4 block">{item.icon}</span>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="max-w-[1200px] mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Trusted by Growing Businesses</h2>
          <p className="text-[#6e6e73]">From startups to enterprises — hear from companies we&apos;ve furnished.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map((s) => <span key={s} className="material-symbols-outlined text-yellow-400 text-xl" style={{fontVariationSettings:"'FILL' 1"}}>star</span>)}
              </div>
              <blockquote className="text-lg md:text-xl font-medium leading-relaxed text-[#111318] mb-6">
                &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">{testimonials[activeTestimonial].person[0]}</div>
                <div>
                  <p className="font-bold">{testimonials[activeTestimonial].person}</p>
                  <p className="text-sm text-[#6e6e73]">{testimonials[activeTestimonial].role}, {testimonials[activeTestimonial].company}</p>
                </div>
              </div>
            </div>
            <div className="md:w-56 flex-shrink-0 flex flex-col justify-center gap-4">
              <div className="bg-primary/5 rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-primary">{testimonials[activeTestimonial].chairs}</p>
                <p className="text-xs text-[#6e6e73] uppercase tracking-wider">Chairs Delivered</p>
              </div>
              <div className="bg-[#fafafa] rounded-xl p-4 text-center">
                <span className="material-symbols-outlined text-primary text-xl mb-1 block">domain</span>
                <p className="text-xs text-[#6e6e73] uppercase tracking-wider">{testimonials[activeTestimonial].industry}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {testimonials.map((t, idx) => (
            <button key={t.company} onClick={() => setActiveTestimonial(idx)} className={`p-4 rounded-xl text-left transition-all border-2 ${idx === activeTestimonial ? "border-primary bg-primary/5 shadow-sm" : "border-gray-100 bg-white hover:border-gray-200"}`}>
              <p className="font-bold text-sm truncate">{t.company}</p>
              <p className="text-xs text-[#6e6e73] mt-0.5">{t.chairs} chairs &middot; {t.industry}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ── WORK ENVIRONMENT SECTION ── */}
      <section className="bg-[#fafafa] py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Design Your Ideal Workspace</h2>
            <p className="text-[#6e6e73] max-w-xl mx-auto">The right furniture transforms a room into a productive, inspiring environment.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "corporate_fare", title: "Corporate Offices", desc: "Ergonomic mesh and executive chairs that keep teams comfortable through 8-hour days. Pair with visitor chairs for meeting rooms and reception.", points: ["Mesh chairs for open floors", "Executive chairs for leadership", "Visitor chairs for reception"] },
              { icon: "home_work", title: "Home Offices", desc: "Compact revolving and mid-back chairs that fit home setups without sacrificing comfort. Designed to look professional on video calls too.", points: ["Revolving chairs for small spaces", "Adjustable for shared desks", "Clean, professional look"] },
              { icon: "school", title: "Institutions & Training", desc: "Stackable visitor chairs, writing-pad classroom seats, and lab stools built to withstand heavy daily use across hundreds of students.", points: ["Writing-pad chairs for classrooms", "Stackable for easy storage", "Built for heavy daily use"] },
            ].map((space) => (
              <div key={space.title} className="bg-white rounded-2xl p-8 border border-gray-100">
                <span className="material-symbols-outlined text-primary text-3xl mb-4 block">{space.icon}</span>
                <h3 className="font-bold text-lg mb-2">{space.title}</h3>
                <p className="text-sm text-[#6e6e73] leading-relaxed mb-4">{space.desc}</p>
                <ul className="space-y-2">
                  {space.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                      <span className="text-[#111318]">{pt}</span>
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
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Ready to Upgrade Your Seating?</h2>
          <p className="text-[#6e6e73] text-lg mb-10 max-w-xl mx-auto">
            Visit our showroom on Mysore Road, browse the catalog online, or call us for a consultation. We respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/products" className="px-10 py-4 bg-primary text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">storefront</span>
              Browse Catalog
            </Link>
            <a href="tel:+919845007572" className="px-10 py-4 border-2 border-[#111318] text-[#111318] font-bold rounded-full hover:bg-[#111318] hover:text-white transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">call</span>
              +91 9845007572
            </a>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-[#6e6e73] flex-wrap">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-primary">location_on</span>
              Mysore Road, Bangalore 560026
            </span>
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-primary">mail</span>
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

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-shadow";

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-50 text-green-600 mb-8">
            <span className="material-symbols-outlined" style={{ fontSize: "48px" }}>check_circle</span>
          </div>
          <h1 className="text-4xl font-black mb-4">Quote Request Received!</h1>
          <p className="text-[#6e6e73] text-lg mb-4">Our wholesale team will reach out within <strong className="text-[#111318]">24 hours</strong> with a custom quote.</p>
          <p className="text-sm text-[#6e6e73] mb-8">Need it sooner? Call <a href="tel:+919845007572" className="text-primary font-semibold hover:underline">+91 9845007572</a></p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition shadow-lg shadow-primary/20">Browse Catalog</Link>
            <button onClick={() => setSubmitted(false)} className="px-8 py-4 border-2 border-[#111318] text-[#111318] font-bold rounded-full hover:bg-[#111318] hover:text-white transition">Submit Another</button>
          </div>
        </div>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setSubmitted(true); }

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-[#0a1628] to-[#1a2d4d] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="max-w-[1200px] mx-auto px-6 py-24 md:py-36 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur text-white/90 text-xs font-bold rounded-full uppercase tracking-widest border border-white/10">Wholesale Portal</span>
              <span className="inline-block px-3 py-1 bg-primary/80 text-white text-xs font-bold rounded-full uppercase tracking-widest">5+ Chairs = Bulk Pricing</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tight mb-6">
              Furnish your entire office.<br /><span className="text-primary">Save up to 20%.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-2xl">
              Factory-direct pricing on 81+ chair models. Free delivery, on-site assembly, GST invoicing, and dedicated account management. Trusted by 500+ businesses across Bangalore.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <a href="#quote-form" className="px-10 py-4 bg-primary text-white font-bold rounded-full hover:bg-blue-600 transition-all shadow-xl shadow-primary/30 flex items-center gap-2">
                <span className="material-symbols-outlined">request_quote</span>Get a Free Quote
              </a>
              <a href="tel:+919845007572" className="px-10 py-4 bg-white/10 backdrop-blur text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2">
                <span className="material-symbols-outlined">call</span>+91 9845007572
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 text-center">
                <p className="text-3xl md:text-4xl font-black text-primary">{s.value}</p>
                <p className="text-xs text-white/60 mt-1 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-[1200px] mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight mb-3">How Wholesale Ordering Works</h2>
          <p className="text-[#6e6e73]">Three simple steps from enquiry to fully furnished office.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", icon: "edit_note", title: "Submit Your Requirements", desc: "Fill out the quote form with your chair needs — models, quantities, and timeline." },
            { step: "02", icon: "calculate", title: "Receive Custom Quote", desc: "Our team sends a detailed quote within 24 hours with volume pricing and GST breakdown." },
            { step: "03", icon: "local_shipping", title: "Delivery & Assembly", desc: "We deliver and assemble every chair on-site. You're ready to work the same day." },
          ].map((item) => (
            <div key={item.step} className="relative bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow group">
              <span className="text-6xl font-black text-primary/10 absolute top-4 right-6 group-hover:text-primary/20 transition-colors">{item.step}</span>
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-5">
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-[#6e6e73] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── VOLUME PRICING ── */}
      <section className="bg-[#fafafa] py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Volume Pricing That Scales</h2>
            <p className="text-[#6e6e73] max-w-lg mx-auto">The more you order, the more you save. Discounts apply across all categories in a single order.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { qty: "5 – 19", discount: "10%", label: "Starter" },
              { qty: "20 – 49", discount: "12%", label: "Growth" },
              { qty: "50 – 99", discount: "15%", label: "Scale", popular: true },
              { qty: "100+", discount: "20%", label: "Enterprise", best: true },
            ].map((tier) => (
              <div key={tier.qty} className={`rounded-2xl p-6 text-center border-2 transition-transform hover:-translate-y-1 ${tier.best ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" : tier.popular ? "bg-white border-primary/30 shadow-md" : "bg-white border-gray-200"}`}>
                {tier.best && <span className="inline-block px-2 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded-full uppercase tracking-widest mb-3">Best Value</span>}
                {tier.popular && <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-widest mb-3">Popular</span>}
                {!tier.popular && !tier.best && <div className="mb-3" />}
                <p className={`text-4xl font-black mb-1 ${tier.best ? "text-white" : "text-primary"}`}>{tier.discount}</p>
                <p className={`text-xs uppercase tracking-wider mb-4 ${tier.best ? "text-white/70" : "text-[#6e6e73]"}`}>OFF MRP</p>
                <div className={`w-full h-px mb-4 ${tier.best ? "bg-white/20" : "bg-gray-200"}`} />
                <p className={`text-lg font-bold mb-1 ${tier.best ? "text-white" : "text-[#111318]"}`}>{tier.qty} chairs</p>
                <p className={`text-xs ${tier.best ? "text-white/60" : "text-[#6e6e73]"}`}>{tier.label} Tier</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="max-w-[1200px] mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-3">One Vendor, Every Chair Type</h2>
          <p className="text-[#6e6e73] max-w-xl mx-auto">Mix and match across 5 categories in a single order. Volume discounts apply to the total.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link key={cat.name} href={cat.href} className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{cat.name}</h3>
                  <p className="text-xs text-[#6e6e73]">{cat.count} models</p>
                </div>
              </div>
              <p className="text-sm text-[#6e6e73] leading-relaxed">{cat.desc}</p>
            </Link>
          ))}
          <Link href="/products" className="group bg-primary rounded-2xl p-8 text-white hover:bg-blue-700 transition-all flex flex-col justify-center items-center text-center">
            <span className="material-symbols-outlined text-4xl mb-3">grid_view</span>
            <h3 className="font-bold text-lg mb-1">View Full Catalog</h3>
            <p className="text-sm text-white/70">All 81+ models</p>
          </Link>
        </div>
      </section>

      {/* ── ADVANTAGES ── */}
      <section className="bg-gradient-to-br from-[#0a1628] to-[#1a2d4d] text-white py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-3">The Wholesale Advantage</h2>
            <p className="text-white/60 max-w-xl mx-auto">Everything you need from a single furniture partner.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "factory", title: "Factory Direct Pricing", desc: "We manufacture in-house. No middlemen — savings passed directly to you." },
              { icon: "receipt_long", title: "GST Invoicing & ITC", desc: "Proper GST invoices so your business claims full Input Tax Credit." },
              { icon: "local_shipping", title: "Free Delivery & Assembly", desc: "Our fleet delivers and assembles at your office within 48 hours." },
              { icon: "build", title: "On-Site Service & Warranty", desc: "Up to 5-year warranty with on-site repairs. No call centers." },
              { icon: "dashboard_customize", title: "Mix & Match Models", desc: "Executive, mesh, visitor — combine any models in one order." },
              { icon: "support_agent", title: "Dedicated Account Manager", desc: "Single point of contact for orders, reorders, and service." },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <span className="material-symbols-outlined text-primary text-2xl mb-4 block">{item.icon}</span>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="max-w-[1200px] mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Trusted by Growing Businesses</h2>
          <p className="text-[#6e6e73]">From startups to enterprises — hear from companies we&apos;ve furnished.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map((s) => <span key={s} className="material-symbols-outlined text-yellow-400 text-xl" style={{fontVariationSettings:"'FILL' 1"}}>star</span>)}
              </div>
              <blockquote className="text-lg md:text-xl font-medium leading-relaxed text-[#111318] mb-6">&ldquo;{testimonials[activeTestimonial].quote}&rdquo;</blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">{testimonials[activeTestimonial].person[0]}</div>
                <div>
                  <p className="font-bold">{testimonials[activeTestimonial].person}</p>
                  <p className="text-sm text-[#6e6e73]">{testimonials[activeTestimonial].role}, {testimonials[activeTestimonial].company}</p>
                </div>
              </div>
            </div>
            <div className="md:w-56 flex-shrink-0 flex flex-col justify-center gap-4">
              <div className="bg-primary/5 rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-primary">{testimonials[activeTestimonial].chairs}</p>
                <p className="text-xs text-[#6e6e73] uppercase tracking-wider">Chairs Delivered</p>
              </div>
              <div className="bg-[#fafafa] rounded-xl p-4 text-center">
                <span className="material-symbols-outlined text-primary text-xl mb-1 block">domain</span>
                <p className="text-xs text-[#6e6e73] uppercase tracking-wider">{testimonials[activeTestimonial].industry}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {testimonials.map((t, idx) => (
            <button key={t.company} onClick={() => setActiveTestimonial(idx)} className={`p-4 rounded-xl text-left transition-all border-2 ${idx === activeTestimonial ? "border-primary bg-primary/5 shadow-sm" : "border-gray-100 bg-white hover:border-gray-200"}`}>
              <p className="font-bold text-sm truncate">{t.company}</p>
              <p className="text-xs text-[#6e6e73] mt-0.5">{t.chairs} chairs &middot; {t.industry}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ── INDUSTRIES ── */}
      <section className="bg-[#fafafa] py-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Industries We Serve</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {industries.map((ind) => (
              <div key={ind.label} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100">
                <span className="material-symbols-outlined text-primary text-xl">{ind.icon}</span>
                <span className="text-sm font-medium">{ind.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE FORM ── */}
      <section id="quote-form" className="max-w-[1200px] mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-6 uppercase tracking-widest">Free Quote</span>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Request a Wholesale Quote</h2>
            <p className="text-[#6e6e73] leading-relaxed mb-8">Tell us what you need — our team will prepare a detailed quote within 24 hours.</p>
            <div className="space-y-5 mb-8">
              {[
                { icon: "schedule", text: "Response within 24 hours" },
                { icon: "lock", text: "No obligation, no spam" },
                { icon: "call", text: "Or call: +91 9845007572" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-lg">{item.icon}</span>
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="bg-[#fafafa] rounded-2xl p-6 border border-gray-100">
              <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-[#6e6e73]">Pricing Guide</h4>
              <div className="space-y-3">
                {[{ r: "5–19", p: "10%" }, { r: "20–49", p: "12%" }, { r: "50–99", p: "15%" }, { r: "100+", p: "20%" }].map((t) => (
                  <div key={t.r} className="flex justify-between"><span className="text-sm">{t.r} chairs</span><span className="text-sm font-bold text-primary">{t.p} off</span></div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-lg shadow-gray-100/50">
              <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">description</span>Your Requirements
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Company *</label><input name="company_name" required className={inputClass} placeholder="Company name" /></div>
                  <div><label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Contact Person *</label><input name="contact_name" required className={inputClass} placeholder="Full name" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Email *</label><input name="email" type="email" required className={inputClass} placeholder="you@company.com" /></div>
                  <div><label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Phone *</label><input name="phone" type="tel" required className={inputClass} placeholder="+91 98450 07572" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Quantity *</label><input name="qty" type="number" min="5" required className={inputClass} placeholder="Min 5 chairs" /></div>
                  <div><label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Category</label>
                    <select name="category" className={inputClass}><option value="">Select (optional)</option><option>Executive</option><option>Mesh</option><option>Revolving</option><option>Visitor</option><option>Classroom</option><option>Mixed</option></select>
                  </div>
                </div>
                <div><label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">City</label><input name="city" className={inputClass} placeholder="Bangalore, Mysore, Chennai..." /></div>
                <div><label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Additional Info</label><textarea name="notes" rows={3} className={inputClass} placeholder="Models, timeline, budget..." /></div>
                <button type="submit" className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-lg">
                  <span className="material-symbols-outlined">send</span>Get My Free Quote
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FAQ />

      {/* ── FINAL CTA ── */}
      <section className="bg-gradient-to-br from-[#0a1628] to-[#1a2d4d] text-white py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Ready to Furnish Your Office?</h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">Join 500+ businesses that trust Universal Furniture Systems.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#quote-form" className="px-10 py-4 bg-primary text-white font-bold rounded-full hover:bg-blue-600 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">request_quote</span>Get a Free Quote
            </a>
            <a href="tel:+919845007572" className="px-10 py-4 bg-white/10 backdrop-blur text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">call</span>+91 9845007572
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
    <section className="bg-[#fafafa] py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 tracking-tight">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
              <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-semibold text-[#111318] pr-4">{faq.q}</span>
                <span className={`material-symbols-outlined text-[#6e6e73] transition-transform flex-shrink-0 ${openFaq === idx ? "rotate-180" : ""}`}>expand_more</span>
              </button>
              {openFaq === idx && <div className="px-5 pb-5 -mt-1"><p className="text-sm text-[#6e6e73] leading-relaxed">{faq.a}</p></div>}
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
