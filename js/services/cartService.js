import { CartItem } from "../models/CartItem.js";
import { Product } from '../models/Product.js';

export const cartService = {
  items: [], // Array of CartItem instances

  init() {
        const saved = localStorage.getItem('lumina_cart');
        if (saved) {
            try {
                const rawData = JSON.parse(saved);
                
                // Re-mapping the plain JSON data back into Class instances
                this.items = rawData.map(item => {
                    // We pass the raw product data into our Product constructor
                    const productInstance = new Product(item.product);
                    // Then we create a new CartItem instance with that product
                    return new CartItem(productInstance, item.quantity);
                });
                
                console.log("Cart revived successfully:", this.items);
            } catch (error) {
                console.error("Failed to parse cart from storage:", error);
                this.items = []; // Reset if data is corrupted
            }
        }
    },

  addItem(product) {
    const existing = this.items.find(item => item.product.id === product.id);
    if (existing) {
      existing.increment();
    } else {
      this.items.push(new CartItem(product));
    }
    this.save();
  },

  save() {
    localStorage.setItem('lumina_cart', JSON.stringify(this.items));
    // Dispatch custom event so UI knows to update the badge
    window.dispatchEvent(new Event('cartUpdated'));
  },
  removeItem(productId) {
        // We keep only the items that DO NOT match the productId
        this.items = this.items.filter(item => item.product.id !== productId);
        
        // Save the new list to localStorage and trigger UI updates
        this.save();
        
        console.log(`Product ${productId} removed. Items remaining:`, this.items.length);
    },

  getTotal(){
    return this.items.reduce((sum, item) => {
        return sum + item.lineTotal;
    }, 0)
  },
  updateQty(productId, delta) {
    const item = this.items.find(i => i.product.id === productId);
    if (item) {
        if (delta > 0) {
            item.increment(); // This checks against item.product.stock
        } else {
            item.decrement(); // This ensures quantity doesn't go below 1
        }
        this.save();
    }
},

  getFormattedTotal() {
    return `$${this.getTotal().toFixed(2)}`;
  },

  get count() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }
};