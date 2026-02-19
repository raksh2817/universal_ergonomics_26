"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getAllProducts, getCategories } from "@/lib/products";
import { ProductCard } from "@/components/product/product-card";
import Link from "next/link";

type SortOption = "price-asc" | "price-desc" | "name" | "discount";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const allProducts = getAllProducts();
  const categories = getCategories();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [sortBy, setSortBy] = useState<SortOption>("name");

  const filtered = useMemo(() => {
    let result = allProducts;
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case "price-asc":
        result = [...result].sort((a, b) => a.selling_price - b.selling_price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.selling_price - a.selling_price);
        break;
      case "discount":
        result = [...result].sort(
          (a, b) =>
            (b.base_price - b.selling_price) / b.base_price -
            (a.base_price - a.selling_price) / a.base_price
        );
        break;
      case "name":
      default:
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  }, [allProducts, selectedCategory, search, sortBy]);

  const categoryCount = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [allProducts]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-10 py-8 md:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-faint mb-6">
        <Link href="/" className="hover:text-foreground transition">Home</Link>
        <span className="text-faint">/</span>
        <span className="text-foreground font-medium">
          {selectedCategory || "All Chairs"}
        </span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <div className="sticky top-36">
            <h3 className="text-xs font-medium uppercase tracking-[0.06em] text-muted mb-4">
              Categories
            </h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition flex items-center justify-between ${
                    !selectedCategory
                      ? "font-medium text-foreground bg-surface-muted border-l-[3px] border-accent pl-2.5"
                      : "text-muted hover:text-foreground hover:bg-surface-muted"
                  }`}
                >
                  All Chairs
                  <span className="text-xs text-faint tabular-nums">{allProducts.length}</span>
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition flex items-center justify-between ${
                      selectedCategory === cat
                        ? "font-medium text-foreground bg-surface-muted border-l-[3px] border-accent pl-2.5"
                        : "text-muted hover:text-foreground hover:bg-surface-muted"
                    }`}
                  >
                    {cat}
                    <span className="text-xs text-faint tabular-nums">{categoryCount[cat] || 0}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div>
              <h1 className="font-display text-2xl md:text-3xl mb-1">
                {selectedCategory || "Explore the Collection"}
              </h1>
              <p className="text-sm text-muted">
                {filtered.length} {filtered.length === 1 ? "product" : "products"} available
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-faint text-lg">
                  search
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search chairs..."
                  className="pl-10 pr-4 h-10 border border-[var(--color-border)] rounded-full text-sm bg-surface-muted text-foreground placeholder:text-faint focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(26,26,46,0.06)] w-44 md:w-52 transition"
                />
              </div>
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-10 px-4 border border-[var(--color-border)] rounded-full text-sm bg-surface-muted text-foreground focus:outline-none focus:border-primary transition"
              >
                <option value="name">Sort: Name</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>

          {/* Mobile Category Pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-8 pb-1 lg:hidden">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition min-h-[40px] ${
                !selectedCategory
                  ? "bg-primary text-white"
                  : "bg-surface-muted text-muted border border-[var(--color-border)] hover:text-foreground"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition min-h-[40px] ${
                  selectedCategory === cat
                    ? "bg-primary text-white"
                    : "bg-surface-muted text-muted border border-[var(--color-border)] hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-faint mb-4" style={{ fontSize: "64px" }}>
                search_off
              </span>
              <p className="text-muted mb-4">
                No chairs match your filter. Try adjusting your search.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory(null);
                }}
                className="text-primary hover:underline text-sm font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8"
              style={{ contentVisibility: "auto" }}
            >
              {filtered.map((product) => (
                <ProductCard key={product.sku} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-10 py-12 text-muted">
          Loading...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
