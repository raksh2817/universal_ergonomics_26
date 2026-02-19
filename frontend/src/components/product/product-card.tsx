import Link from "next/link";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = Math.round(
    ((product.base_price - product.selling_price) / product.base_price) * 100
  );

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
        {/* Image */}
        <div className="bg-gray-100 aspect-[4/3] flex items-center justify-center text-gray-400 relative">
          <span className="text-sm">Product Image</span>
          {product.is_hero && (
            <span className="absolute top-2 left-2 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded">
              HERO
            </span>
          )}
          {discount > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition mb-1">
            {product.name}
          </h3>
          {product.tagline && (
            <p className="text-sm text-gray-500 mb-2">{product.tagline}</p>
          )}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-brand-700">
              &#8377;{product.selling_price.toLocaleString("en-IN")}
            </span>
            {product.base_price > product.selling_price && (
              <span className="text-sm text-gray-400 line-through">
                &#8377;{product.base_price.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          {product.is_b2b_available && (
            <span className="inline-block mt-2 text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
              B2B Available
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
