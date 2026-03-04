import { Product } from '../models/Product.js';

const BASE_URL = 'https://dummyjson.com/products';

export const apiService = {
  async fetchProducts(limit = 12, skip = 0) {
    try {
      const resp = await fetch(`${BASE_URL}?limit=${limit}&skip=${skip}`);
      if (!resp.ok) throw new Error("Could not fetch products");
      const data = await resp.json();
      
      // Map raw data to our Class model
      return data.products.map(item => new Product(item));
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async searchProducts(query) {
    const resp = await fetch(`${BASE_URL}/search?q=${query}`);
    const data = await resp.json();
    return data.products.map(item => new Product(item));
  },

  async fetchProductById(id) {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        return new Product(data); // Map to your model!
    }
};
