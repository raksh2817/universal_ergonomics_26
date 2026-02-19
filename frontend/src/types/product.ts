export interface Product {
  sku: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  base_price: number;
  selling_price: number;
  warranty_years: number;
  weight_kg: number;
  is_b2b_available: boolean;
  colors: string[];
  specs: Record<string, string | number | boolean>;
  image: string; // path relative to /public e.g. "/products/ergoelite-executive-chair.jpg"
}

export interface CartItem {
  product: Product;
  selectedColor: string;
  quantity: number;
}

export interface OrderDetails {
  items: CartItem[];
  subtotal: number;
  gst: number;
  delivery: number;
  total: number;
  address: ShippingAddress;
  orderNumber: string;
  createdAt: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}
