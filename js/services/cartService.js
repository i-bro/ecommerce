import { CartItem } from "../models/CartItem.js";
import { Product } from "../models/Product.js";

export const cartService = {
  items: [], // Array of CartItem instances

  init() {
    const saved = localStorage.getItem("lumina_cart");
    if (saved) {
      try {
        const rawData = JSON.parse(saved);

        this.items = rawData.map((item) => {
          const productInstance = new Product(item.product);

          return new CartItem(productInstance, item.quantity);
        });

        console.log("Cart revived successfully:", this.items);
      } catch (error) {
        console.error("Failed to parse cart from storage:", error);
        this.items = [];
      }
    }
  },

  addItem(product) {
    const existing = this.items.find((item) => item.product.id === product.id);
    if (existing) {
      existing.increment();
    } else {
      this.items.push(new CartItem(product));
    }
    this.save();
  },

  save() {
    localStorage.setItem("lumina_cart", JSON.stringify(this.items));

    window.dispatchEvent(new Event("cartUpdated"));
  },
  removeItem(productId) {
    this.items = this.items.filter((item) => item.product.id !== productId);

    this.save();

    console.log(
      `Product ${productId} removed. Items remaining:`,
      this.items.length,
    );
  },

  getTotal() {
    return this.items.reduce((sum, item) => {
      return sum + item.lineTotal;
    }, 0);
  },
  updateQty(productId, delta) {
    const item = this.items.find((i) => i.product.id === productId);
    if (item) {
      if (delta > 0) {
        item.increment();
      } else {
        item.decrement();
      }
      this.save();
    }
  },

  getFormattedTotal() {
    return `$${this.getTotal().toFixed(2)}`;
  },

  get count() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  },
};
