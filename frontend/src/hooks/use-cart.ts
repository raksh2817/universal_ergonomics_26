/**
 * Cart state — persisted to localStorage.
 * Also manages completed order state for the confirmation page.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, OrderDetails, ShippingAddress } from "@/types/product";

interface CartState {
  items: CartItem[];
  lastOrder: OrderDetails | null;

  addItem: (product: Product, selectedColor: string, quantity?: number) => void;
  removeItem: (productSlug: string, color: string) => void;
  updateQuantity: (productSlug: string, color: string, quantity: number) => void;
  clearCart: () => void;

  totalItems: () => number;
  subtotal: () => number;
  gst: () => number;
  total: () => number;

  placeOrder: (address: ShippingAddress) => string;
}

function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `UE-${y}${m}${d}-${rand}`;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastOrder: null,

      addItem: (product, selectedColor, quantity = 1) => {
        set((state) => {
          const idx = state.items.findIndex(
            (item) =>
              item.product.slug === product.slug &&
              item.selectedColor === selectedColor
          );

          if (idx >= 0) {
            const updated = [...state.items];
            updated[idx] = {
              ...updated[idx],
              quantity: updated[idx].quantity + quantity,
            };
            return { items: updated };
          }

          return {
            items: [...state.items, { product, selectedColor, quantity }],
          };
        });
      },

      removeItem: (productSlug, color) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.product.slug === productSlug && item.selectedColor === color)
          ),
        }));
      },

      updateQuantity: (productSlug, color, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productSlug, color);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.slug === productSlug && item.selectedColor === color
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      subtotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.product.selling_price * item.quantity,
          0
        ),

      gst: () => Math.round(get().subtotal() * 0.18),

      total: () => get().subtotal() + get().gst(),

      placeOrder: (address: ShippingAddress) => {
        const state = get();
        const orderNumber = generateOrderNumber();
        const order: OrderDetails = {
          items: [...state.items],
          subtotal: state.subtotal(),
          gst: state.gst(),
          delivery: 0,
          total: state.total(),
          address,
          orderNumber,
          createdAt: new Date().toISOString(),
        };
        set({ items: [], lastOrder: order });
        return orderNumber;
      },
    }),
    { name: "ue-cart" }
  )
);
