import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice, getDiscount } from "@/lib/products";
import { ProductImage } from "@/components/product/product-image";

export function ProductCard({ product }: { product: Product }) {
  const discount = getDiscount(product);

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-200">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
          <ProductImage product={product} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              -{discount}%
            </span>
          )}
          {product.is_b2b_available && (
            <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
              B2B
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-blue-600 font-medium mb-1">{product.category}</p>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mb-3 line-clamp-1">{product.tagline}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              &#8377;{formatPrice(product.selling_price)}
            </span>
            {discount > 0 && (
              <span className="text-sm text-gray-400 line-through">
                &#8377;{formatPrice(product.base_price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
