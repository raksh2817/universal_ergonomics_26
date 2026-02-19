/**
 * PRODUCT DATA STORE
 *
 * This is the single source of truth for all products.
 *
 * TO ADD A NEW PRODUCT:
 *   1. Add an entry to the `products` array below
 *   2. Drop an image at /public/products/[slug].jpg
 *   3. That's it — the product appears on the site automatically
 *
 * TO ADD A NEW CATEGORY:
 *   Just use a new category string in a product — it auto-appears in filters
 */

import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    sku: "UE-EXEC-001",
    name: "ErgoElite Executive Chair",
    slug: "ergoelite-executive-chair",
    tagline: "Premium comfort for the modern executive",
    description:
      "Full mesh high-back executive chair with 3D adjustable armrests, synchro-tilt mechanism, and lumbar support. Built for 10+ hour workdays. The breathable mesh keeps you cool during marathon sessions while the adjustable headrest provides neck support exactly where you need it.",
    category: "Executive Chairs",
    base_price: 18999,
    selling_price: 15999,
    warranty_years: 3,
    weight_kg: 18.5,
    is_b2b_available: true,
    colors: ["Black", "Grey"],
    image: "/products/ergoelite-executive-chair.jpg",
    specs: {
      "Weight Capacity": "150 kg",
      "Seat Height": "42-52 cm",
      "Tilt Mechanism": "Synchro-tilt",
      "Armrest Type": "3D Adjustable",
      "Back Type": "High-back Mesh",
      Headrest: true,
      "Lumbar Support": "Adjustable",
    },
  },
  {
    sku: "UE-EXEC-002",
    name: "ErgoElite Executive Pro",
    slug: "ergoelite-executive-pro",
    tagline: "The ultimate seat of power",
    description:
      "Top-tier executive chair with Italian mesh, 4D armrests, seat depth adjustment, and coat hanger. Polished aluminum base with smooth-rolling PU casters. The pinnacle of our executive line, designed for those who demand the absolute best.",
    category: "Executive Chairs",
    base_price: 24999,
    selling_price: 21999,
    warranty_years: 5,
    weight_kg: 21.0,
    is_b2b_available: true,
    colors: ["Black", "Navy Blue"],
    image: "/products/ergoelite-executive-pro.jpg",
    specs: {
      "Weight Capacity": "150 kg",
      "Seat Height": "42-52 cm",
      "Tilt Mechanism": "Synchro-tilt",
      "Armrest Type": "4D Adjustable",
      "Back Type": "High-back Italian Mesh",
      Headrest: true,
      "Lumbar Support": "Adjustable",
      "Seat Depth Adjust": true,
      "Base Material": "Polished Aluminum",
    },
  },
  {
    sku: "UE-MID-001",
    name: "WorkPro Mid-Back",
    slug: "workpro-mid-back",
    tagline: "Engineered for everyday performance",
    description:
      "Mid-back mesh chair with 2D armrests and tilt lock. The reliable workhorse for professionals who value comfort and value. Breathable mesh back prevents heat buildup during long work sessions.",
    category: "Mid-Back Chairs",
    base_price: 11999,
    selling_price: 9999,
    warranty_years: 2,
    weight_kg: 14.0,
    is_b2b_available: true,
    colors: ["Black", "Grey", "Blue"],
    image: "/products/workpro-mid-back.jpg",
    specs: {
      "Weight Capacity": "120 kg",
      "Seat Height": "42-52 cm",
      "Tilt Mechanism": "Tilt-lock",
      "Armrest Type": "2D Adjustable",
      "Back Type": "Mid-back Mesh",
      Headrest: false,
      "Lumbar Support": "Fixed",
    },
  },
  {
    sku: "UE-MID-002",
    name: "WorkPro Mid-Back Plus",
    slug: "workpro-mid-back-plus",
    tagline: "Mid-back comfort, elevated",
    description:
      "Enhanced mid-back with breathable mesh, 3D armrests, and adjustable lumbar. Perfect B2B bulk order chair that balances premium features with volume-friendly pricing.",
    category: "Mid-Back Chairs",
    base_price: 13999,
    selling_price: 11999,
    warranty_years: 3,
    weight_kg: 15.0,
    is_b2b_available: true,
    colors: ["Black", "Grey"],
    image: "/products/workpro-mid-back-plus.jpg",
    specs: {
      "Weight Capacity": "130 kg",
      "Seat Height": "42-52 cm",
      "Tilt Mechanism": "Synchro-tilt",
      "Armrest Type": "3D Adjustable",
      "Back Type": "Mid-back Mesh",
      Headrest: false,
      "Lumbar Support": "Adjustable",
    },
  },
  {
    sku: "UE-TASK-001",
    name: "QuickSit Task Chair",
    slug: "quicksit-task-chair",
    tagline: "Smart seating, smart price",
    description:
      "Compact task chair with mesh back and foam seat. Fixed armrests. Great for home offices and conference rooms. Our most affordable option without compromising on essential ergonomic features.",
    category: "Task Chairs",
    base_price: 7999,
    selling_price: 6499,
    warranty_years: 1,
    weight_kg: 10.5,
    is_b2b_available: true,
    colors: ["Black"],
    image: "/products/quicksit-task-chair.jpg",
    specs: {
      "Weight Capacity": "100 kg",
      "Seat Height": "40-50 cm",
      "Tilt Mechanism": "Basic Tilt",
      "Armrest Type": "Fixed",
      "Back Type": "Mid-back Mesh",
      Headrest: false,
      "Lumbar Support": "Fixed",
    },
  },
  {
    sku: "UE-TASK-002",
    name: "QuickSit Task Pro",
    slug: "quicksit-task-pro",
    tagline: "Task mastery at every price point",
    description:
      "Upgraded task chair with adjustable armrests and lumbar. Ideal for startup offices ordering in bulk. Combines the simplicity of a task chair with ergonomic adjustability.",
    category: "Task Chairs",
    base_price: 9499,
    selling_price: 7999,
    warranty_years: 2,
    weight_kg: 12.0,
    is_b2b_available: true,
    colors: ["Black", "Grey"],
    image: "/products/quicksit-task-pro.jpg",
    specs: {
      "Weight Capacity": "110 kg",
      "Seat Height": "40-50 cm",
      "Tilt Mechanism": "Tilt-lock",
      "Armrest Type": "2D Adjustable",
      "Back Type": "Mid-back Mesh",
      Headrest: false,
      "Lumbar Support": "Adjustable",
    },
  },
  {
    sku: "UE-GAME-001",
    name: "AeroStrike Gaming Chair",
    slug: "aerostrike-gaming-chair",
    tagline: "Game harder, sit better",
    description:
      "Racing-style gaming chair with PU leather, bucket seat, 2D armrests, and 180-degree recline. Comes with headrest and lumbar pillows. Built for gamers who spend hours at the desk.",
    category: "Gaming Chairs",
    base_price: 14999,
    selling_price: 12999,
    warranty_years: 2,
    weight_kg: 22.0,
    is_b2b_available: false,
    colors: ["Black/Red", "Black/Blue"],
    image: "/products/aerostrike-gaming-chair.jpg",
    specs: {
      "Weight Capacity": "130 kg",
      "Seat Height": "44-54 cm",
      "Tilt Mechanism": "180° Recline",
      "Armrest Type": "2D Adjustable",
      "Back Type": "High-back PU Leather",
      Headrest: true,
      "Lumbar Support": "Pillow",
    },
  },
  {
    sku: "UE-GAME-002",
    name: "AeroStrike Gaming Pro",
    slug: "aerostrike-gaming-pro",
    tagline: "Pro-level comfort for pro-level play",
    description:
      "Premium gaming chair with 4D armrests, cold-foam seat, built-in footrest, and integrated Bluetooth speakers. The ultimate gaming throne for serious gamers.",
    category: "Gaming Chairs",
    base_price: 19999,
    selling_price: 17499,
    warranty_years: 3,
    weight_kg: 26.0,
    is_b2b_available: false,
    colors: ["Black/Red", "All Black"],
    image: "/products/aerostrike-gaming-pro.jpg",
    specs: {
      "Weight Capacity": "150 kg",
      "Seat Height": "44-54 cm",
      "Tilt Mechanism": "180° Recline",
      "Armrest Type": "4D Adjustable",
      "Back Type": "High-back PU Leather",
      Headrest: true,
      "Lumbar Support": "Adjustable Pillow",
      Footrest: true,
      "Bluetooth Speakers": true,
    },
  },
  {
    sku: "UE-ERGO-001",
    name: "PosturePerfect Ergonomic",
    slug: "postureperfect-ergonomic",
    tagline: "Science-backed seating for your spine",
    description:
      "Full ergonomic chair with S-curve backrest, seat slide, 4D armrests, and adjustable headrest. Recommended by physiotherapists. The dynamic lumbar auto-adjusts as you move throughout the day.",
    category: "Ergonomic Chairs",
    base_price: 22999,
    selling_price: 19999,
    warranty_years: 5,
    weight_kg: 20.0,
    is_b2b_available: true,
    colors: ["Black", "Grey", "White"],
    image: "/products/postureperfect-ergonomic.jpg",
    specs: {
      "Weight Capacity": "150 kg",
      "Seat Height": "42-52 cm",
      "Tilt Mechanism": "Synchro-tilt",
      "Armrest Type": "4D Adjustable",
      "Back Type": "S-curve Mesh",
      Headrest: true,
      "Lumbar Support": "Dynamic Auto-adjust",
      "Seat Depth Adjust": true,
    },
  },
  {
    sku: "UE-ERGO-002",
    name: "PosturePerfect Lite",
    slug: "postureperfect-lite",
    tagline: "Ergonomic comfort, accessible price",
    description:
      "Simplified ergonomic chair with mesh back, 2D armrests, and fixed lumbar. Great entry point into ergonomic seating without the premium price tag.",
    category: "Ergonomic Chairs",
    base_price: 13999,
    selling_price: 11499,
    warranty_years: 3,
    weight_kg: 15.5,
    is_b2b_available: true,
    colors: ["Black", "Grey"],
    image: "/products/postureperfect-lite.jpg",
    specs: {
      "Weight Capacity": "120 kg",
      "Seat Height": "42-52 cm",
      "Tilt Mechanism": "Tilt-lock",
      "Armrest Type": "2D Adjustable",
      "Back Type": "Ergonomic Mesh",
      Headrest: false,
      "Lumbar Support": "Fixed Ergonomic",
    },
  },
  {
    sku: "UE-VISIT-001",
    name: "MeetSpace Visitor Chair",
    slug: "meetspace-visitor-chair",
    tagline: "Make every meeting comfortable",
    description:
      "Stackable visitor chair with chrome sled base and padded mesh back. Perfect for conference rooms and waiting areas. Stacks up to 4 high for easy storage.",
    category: "Visitor Chairs",
    base_price: 4999,
    selling_price: 3999,
    warranty_years: 1,
    weight_kg: 7.0,
    is_b2b_available: true,
    colors: ["Black", "Grey"],
    image: "/products/meetspace-visitor-chair.jpg",
    specs: {
      "Weight Capacity": "100 kg",
      "Base Type": "Chrome Sled",
      Stackable: true,
      "Back Type": "Mesh",
      "Seat Type": "Foam Padded",
    },
  },
  {
    sku: "UE-VISIT-002",
    name: "MeetSpace Visitor Premium",
    slug: "meetspace-visitor-premium",
    tagline: "Impress from the first seat",
    description:
      "Premium visitor chair with leather-finish arms and a polished chrome frame. High perceived value for client-facing spaces. Makes a statement in any reception or boardroom.",
    category: "Visitor Chairs",
    base_price: 6999,
    selling_price: 5999,
    warranty_years: 2,
    weight_kg: 9.0,
    is_b2b_available: true,
    colors: ["Black", "Tan"],
    image: "/products/meetspace-visitor-premium.jpg",
    specs: {
      "Weight Capacity": "110 kg",
      "Base Type": "4-leg Chrome",
      Stackable: false,
      "Back Type": "Mesh with Leather Trim",
      "Seat Type": "High-density Foam",
    },
  },
  {
    sku: "UE-STOOL-001",
    name: "StandEasy Drafting Stool",
    slug: "standeasy-drafting-stool",
    tagline: "Stand. Sit. Create.",
    description:
      "Height-adjustable drafting stool with foot ring and breathable mesh. Designed for standing desks, architect workstations, and reception counters.",
    category: "Drafting Stools",
    base_price: 10999,
    selling_price: 8999,
    warranty_years: 2,
    weight_kg: 12.0,
    is_b2b_available: true,
    colors: ["Black"],
    image: "/products/standeasy-drafting-stool.jpg",
    specs: {
      "Weight Capacity": "110 kg",
      "Seat Height": "55-75 cm",
      "Foot Ring": true,
      "Back Type": "Mid-back Mesh",
      "Armrest Type": "Fixed",
    },
  },
  {
    sku: "UE-BULK-001",
    name: "OfficePack Standard",
    slug: "officepack-standard",
    tagline: "Furnish your office in one order",
    description:
      "B2B bulk-order mid-back chair. Durable mesh, fixed arms, gas lift. Minimum order: 5 units. Volume pricing available. The go-to choice for offices setting up 10-100 workstations.",
    category: "B2B Bulk Chairs",
    base_price: 8999,
    selling_price: 7499,
    warranty_years: 2,
    weight_kg: 12.0,
    is_b2b_available: true,
    colors: ["Black"],
    image: "/products/officepack-standard.jpg",
    specs: {
      "Weight Capacity": "110 kg",
      "Seat Height": "42-52 cm",
      "Tilt Mechanism": "Basic Tilt",
      "Armrest Type": "Fixed",
      "Back Type": "Mid-back Mesh",
    },
  },
  {
    sku: "UE-BULK-002",
    name: "OfficePack Premium",
    slug: "officepack-premium",
    tagline: "Premium seating, fleet pricing",
    description:
      "B2B bulk-order chair with 2D armrests, adjustable lumbar, and synchro-tilt. For companies that invest in their team's comfort. Available at fleet pricing for orders of 5+.",
    category: "B2B Bulk Chairs",
    base_price: 12499,
    selling_price: 10999,
    warranty_years: 3,
    weight_kg: 14.5,
    is_b2b_available: true,
    colors: ["Black", "Grey"],
    image: "/products/officepack-premium.jpg",
    specs: {
      "Weight Capacity": "130 kg",
      "Seat Height": "42-52 cm",
      "Tilt Mechanism": "Synchro-tilt",
      "Armrest Type": "2D Adjustable",
      "Back Type": "Mid-back Mesh",
      "Lumbar Support": "Adjustable",
    },
  },
];

// --- Helper functions ---

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsBySlugs(slugs: string[]): Product[] {
  return slugs.map((s) => products.find((p) => p.slug === s)).filter(Boolean) as Product[];
}

export function getCategories(): string[] {
  return [...new Set(products.map((p) => p.category))];
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
  );
}

export function getFeaturedProducts(): Product[] {
  // Return a curated mix for homepage — top sellers from different categories
  return getProductsBySlugs([
    "ergoelite-executive-chair",
    "postureperfect-ergonomic",
    "workpro-mid-back",
    "aerostrike-gaming-chair",
    "quicksit-task-pro",
    "meetspace-visitor-premium",
  ]);
}

export function getPriceRange(): { min: number; max: number } {
  const prices = products.map((p) => p.selling_price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN").format(price);
}

export function getDiscount(product: Product): number {
  return Math.round(
    ((product.base_price - product.selling_price) / product.base_price) * 100
  );
}
