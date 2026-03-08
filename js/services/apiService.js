import { Product } from "../models/Product.js";
import { toggleLoader } from "../utils/render.js";
const BASE_URL = "https://dummyjson.com/products";

export const apiService = {
  async fetchProducts(limit = 12, skip = 0) {
    toggleLoader(true);
    try {
      const resp = await fetch(`${BASE_URL}?limit=${limit}&skip=${skip}`);
      if (!resp.ok) throw new Error("Could not fetch products");
      const data = await resp.json();

      // Map raw data to our Class model
      return data.products.map((item) => new Product(item));
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      toggleLoader(false);
    }
  },

  async searchProducts(query) {
    toggleLoader(true);
    try {
      const resp = await fetch(`${BASE_URL}/search?q=${query}`);
      const data = await resp.json();
      return data.products.map((item) => new Product(item));
    } catch (err) {
      console.log(err, "serch product faild fetching");
    } finally {
      toggleLoader(false);
    }
  },

  async fetchProductById(id) {
    toggleLoader(true);
    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`);
      if (!response.ok) throw new Error("Product not found");
      const data = await response.json();
      return new Product(data); // Map to your model!
    } catch (err) {
      console.log(err, "id fethed error");
    } finally {
      toggleLoader(false);
    }
  },

  async fetchCategories() {
    toggleLoader(true);
    try {
      const resp = await fetch("https://dummyjson.com/products/category-list");
      return await resp.json(); // Returns an array of strings: ["beauty", "fragrances", ...]
    } catch (err) {
      console.log(err, "fetching categories faild");
    } finally {
      toggleLoader(false);
    }
  },

  async fetchProductsByCategory(category, limit = 12, skip = 0) {
    toggleLoader(true);
    try {
      const url =
        category === "all"
          ? `${BASE_URL}?limit=${limit}&skip=${skip}`
          : `${BASE_URL}/category/${category}?limit=${limit}&skip=${skip}`;

      const resp = await fetch(url);
      const data = await resp.json();
      return data.products.map((item) => new Product(item));
    } catch (err) {
      console.log(err, "fetthing products by category faild");
    } finally {
      toggleLoader(false);
    }
  },
};
