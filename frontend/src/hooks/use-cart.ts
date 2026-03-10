/**
 * Cart state hook — persisted to localStorage via Zustand's persist middleware.
 *
 * Responsibilities:
 *   - Manage the list of CartItems (product + colour variant + quantity)
 *   - Compute derived totals: subtotal, 18% GST, grand total
 *   - Execute the "place order" action: snapshot the cart into an OrderDetails
 *     record, clear the cart, and return the order number for the confirmation page
 *   - Persist cart and lastOrder across page refreshes via localStorage key "ue-cart"
 *
 * Cart item identity:
 *   A cart item is uniquely identified by (product.slug + selectedColor).
 *   Adding the same product in the same colour increments quantity rather than
 *   creating a duplicate row.
 *
 * Note: This is a client-side-only cart.  When the backend API is integrated,
 * `placeOrder` should be replaced with an API call to POST /api/v1/orders/.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, OrderDetails, ShippingAddress } from "@/types/product";

/**
 * Shape of the Zustand cart store.
 *
 * State fields:
 *   items      – Array of CartItems currently in the cart
 *   lastOrder  – The most recently placed OrderDetails; consumed by the
 *                confirmation page and cleared on next page load (or next order)
 *
 * Mutation actions:
 *   addItem        – Add a product/colour combination; increments qty if exists
 *   removeItem     – Remove a specific product/colour line
 *   updateQuantity – Set quantity; delegates to removeItem when qty ≤ 0
 *   clearCart      – Empty the cart (called after order placement)
 *
 * Computed getters (use `get()` internally to stay reactive):
 *   totalItems – Sum of all item quantities
 *   subtotal   – Sum of (selling_price × quantity) for all items
 *   gst        – 18% of subtotal, rounded to nearest rupee
 *   total      – subtotal + gst (delivery is always free in Bangalore)
 *
 * Order flow:
 *   placeOrder(address) → snapshots cart into lastOrder, clears items, returns order number
 */
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

/**
 * Generate a human-readable order number matching the backend format.
 * Pattern: UE-YYYYMMDD-XXXXXX
 *   UE      = brand prefix
 *   date    = local calendar date (YYYYMMDD)
 *   suffix  = 6-char alphanumeric random string (base-36, uppercase)
 *
 * Collision probability is negligible for the expected order volume.
 * The backend uses the same pattern with UUID hex instead of Math.random.
 */
function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is 0-indexed
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase(); // Base-36 random suffix
  return `UE-${y}${m}${d}-${rand}`;
}

/**
 * Zustand store wrapped with the `persist` middleware.
 * The store is serialized to localStorage under the key "ue-cart".
 * This means the cart survives page refreshes and browser restarts.
 */
export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastOrder: null,

      /**
       * Add a product+colour combination to the cart.
       * If an identical entry (same slug + colour) already exists, its
       * quantity is incremented rather than a duplicate row being created.
       */
      addItem: (product, selectedColor, quantity = 1) => {
        set((state) => {
          // Find existing cart line for this exact product+colour combination
          const idx = state.items.findIndex(
            (item) =>
              item.product.slug === product.slug &&
              item.selectedColor === selectedColor
          );

          if (idx >= 0) {
            // Existing line found — create a new array to trigger re-render
            const updated = [...state.items];
            updated[idx] = {
              ...updated[idx],
              quantity: updated[idx].quantity + quantity,
            };
            return { items: updated };
          }

          // New line — append to end of cart
          return {
            items: [...state.items, { product, selectedColor, quantity }],
          };
        });
      },

      /** Remove the specific product+colour line from the cart entirely. */
      removeItem: (productSlug, color) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.product.slug === productSlug && item.selectedColor === color)
          ),
        }));
      },

      /**
       * Set the quantity for a specific cart line.
       * Delegates to `removeItem` when quantity reaches 0 or below,
       * which keeps the cart free of zero-quantity ghost entries.
       */
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

      /** Empty the entire cart (called after a successful order placement). */
      clearCart: () => set({ items: [] }),

      /** Total number of individual units across all cart lines. */
      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      /** Pre-tax sum of all line totals (selling_price × quantity). */
      subtotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.product.selling_price * item.quantity,
          0
        ),

      /** GST at 18%, rounded to the nearest rupee. */
      gst: () => Math.round(get().subtotal() * 0.18),

      /** Grand total = subtotal + GST (delivery is always ₹0 in Bangalore). */
      total: () => get().subtotal() + get().gst(),

      /**
       * Snapshot the current cart into an OrderDetails record and clear the cart.
       *
       * This client-side action mimics what the backend POST /orders/ endpoint does.
       * When the backend API is integrated, this should make an API call instead.
       *
       * Returns the generated order number so the caller can navigate to the
       * confirmation page.
       */
      placeOrder: (address: ShippingAddress) => {
        const state = get();
        const orderNumber = generateOrderNumber();
        const order: OrderDetails = {
          items: [...state.items],      // Shallow copy to freeze cart state
          subtotal: state.subtotal(),
          gst: state.gst(),
          delivery: 0,                  // Free delivery in Bangalore
          total: state.total(),
          address,
          orderNumber,
          createdAt: new Date().toISOString(),
        };
        // Atomically clear cart and save the completed order in one update
        set({ items: [], lastOrder: order });
        return orderNumber;
      },
    }),
    { name: "ue-cart" }  // localStorage key
  )
);
