"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getAllProducts, getCategories, formatPrice } from "@/lib/products";
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

    // Category filter
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search
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

    // Sort
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">
          {selectedCategory || "All Chairs"}
        </span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">
        {selectedCategory || "All Office Chairs"}
      </h1>
      <p className="text-gray-500 mb-6">
        {filtered.length} {filtered.length === 1 ? "product" : "products"} available
      </p>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chairs..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category filter */}
        <select
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="name">Sort: Name</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="discount">Biggest Discount</option>
        </select>
      </div>

      {/* Category chips (mobile-friendly) */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-8 pb-1">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition border ${
            !selectedCategory
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition border ${
              selectedCategory === cat
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">No products match your filters.</p>
          <button
            onClick={() => { setSearch(""); setSelectedCategory(null); }}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
