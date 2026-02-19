export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  base_price: number;
  selling_price: number;
  gst_percent?: number;
  specs?: Record<string, unknown>;
  warranty_years?: number;
  weight_kg?: number;
  is_assembly_required?: boolean;
  is_hero: boolean;
  is_b2b_available: boolean;
  ar_model_url?: string;
  meta_title?: string;
  meta_description?: string;
  category?: Category;
  variants?: ProductVariant[];
  images?: ProductImage[];
}

export interface ProductVariant {
  id: string;
  sku_suffix: string;
  color: string;
  material?: string;
  price_adjustment: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}
