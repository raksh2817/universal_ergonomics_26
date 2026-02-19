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

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#6e6e73] mb-8">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-[#111318] font-medium">
          {selectedCategory || "All Chairs"}
        </span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {selectedCategory || "Explore the Collection"}
          </h1>
          <p className="text-[#6e6e73]">
            {filtered.length} {filtered.length === 1 ? "product" : "products"} available
          </p>
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chairs..."
              className="pl-10 pr-4 py-2.5 border border-[#e5e7eb] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white w-48"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2.5 border border-[#e5e7eb] rounded-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="name">Sort: Name</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>
      </div>

      {/* Category chips */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide mb-12 pb-1">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition border ${
            !selectedCategory
              ? "bg-primary text-white border-primary"
              : "bg-white text-[#6e6e73] border-[#e5e7eb] hover:bg-[#f5f5f7]"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition border ${
              selectedCategory === cat
                ? "bg-primary text-white border-primary"
                : "bg-white text-[#6e6e73] border-[#e5e7eb] hover:bg-[#f5f5f7]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-gray-300 mb-4" style={{ fontSize: "64px" }}>
            search_off
          </span>
          <p className="text-[#6e6e73] mb-4">No products match your filters.</p>
          <button
            onClick={() => { setSearch(""); setSelectedCategory(null); }}
            className="text-primary hover:underline text-sm font-medium"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {filtered.map((product) => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-[1200px] mx-auto px-6 py-12 text-[#6e6e73]">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
