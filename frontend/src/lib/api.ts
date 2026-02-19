/**
 * API client for the Universal Ergonomics backend.
 * All requests go through Next.js rewrites to avoid CORS in dev.
 */

const API_BASE = "/api/v1";

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `API error: ${res.status}`);
  }

  return res.json();
}

// Products
export const getProducts = (params?: Record<string, string>) => {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  return fetchAPI<import("@/types/product").Product[]>(`/products/${query}`);
};

export const getProduct = (slug: string) =>
  fetchAPI<import("@/types/product").Product>(`/products/${slug}`);

// Cart / Orders
export const createOrder = (data: {
  items: { product_id: string; variant_id?: string; quantity: number }[];
  shipping_address_id: string;
  customer_notes?: string;
  order_type?: string;
}) => fetchAPI("/orders/", { method: "POST", body: JSON.stringify(data) });

// Auth
export const login = (email: string, password: string) =>
  fetchAPI<{ access_token: string; token_type: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const register = (data: {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  is_b2b?: boolean;
}) => fetchAPI("/auth/register", { method: "POST", body: JSON.stringify(data) });

// Pricing
export const getPriceRecommendation = (productId: string) =>
  fetchAPI(`/pricing/recommendation/${productId}`);

// Inventory
export const getInventory = (productId: string) =>
  fetchAPI(`/inventory/${productId}`);

// Leads
export const submitLead = (data: Record<string, unknown>) => {
  const params = new URLSearchParams();
  Object.entries(data).forEach(([k, v]) => {
    if (v !== undefined && v !== null) params.set(k, String(v));
  });
  return fetchAPI(`/leads/?${params.toString()}`, { method: "POST" });
};
