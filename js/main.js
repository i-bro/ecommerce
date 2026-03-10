import { apiService } from "./services/apiService.js";
import { cartService } from "./services/cartService.js";
import { renderGrid } from "./utils/render.js";
import { initCartPage } from "./cart-page.js";
import { appendProductsToGrid } from "./utils/render.js";

let allLoadedProducts = [];
async function initApp() {
  cartService.init();
  updateBadge();
  initCategories();

  const productGrid = document.getElementById("product-grid");
  try {
    const products = await apiService.fetchProducts();
    allLoadedProducts = products;
    renderGrid(allLoadedProducts, document.getElementById("product-grid"));
  } catch (error) {
    document.getElementById("app-grid").innerHTML = `
      <div class="error-state">
        <p>Something went wrong. Check your connection.</p>
        <button onclick="location.reload()">Retry</button>
      </div>
    `;
  }
}

async function initCategories() {
  const categorySelect = document.getElementById("category-filter");
  if (!categorySelect) return;

  try {
    const categories = await apiService.fetchCategories();

    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      categorySelect.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to load categories", err);
  }
}

//  Category Change
const categoryFilter = document.getElementById("category-filter");
if (categoryFilter) {
  categoryFilter.addEventListener("change", async (e) => {
    const selectedCategory = e.target.value;
    currentOffset = 0;

    const loadBtn = document.getElementById("load-more-btn");
    if (loadBtn) {
      loadBtn.disabled = false;
      loadBtn.style.display = "block";
      loadBtn.textContent = "Load More";
    }

    try {
      // Fetch products for this specific category
      const filteredProducts = await apiService.fetchProductsByCategory(
        selectedCategory,
        LIMIT,
        currentOffset,
      );

      // Update state and UI
      allLoadedProducts = filteredProducts;
      renderGrid(allLoadedProducts, document.getElementById("product-grid"));

      // Re-show the "Load More" button if it was hidden
      const loadBtn = document.getElementById("load-more-btn");
      if (loadBtn) loadBtn.style.display = "block";
    } catch (err) {
      console.error("Filtering error", err);
    }
  });
}

function applyCurrentSort(products) {
  const sortSelect = document.getElementById("sort-price");
  if (!sortSelect) return products;

  const sortBy = sortSelect.value;
  const sorted = [...products]; // Copy to avoid mutating original

  if (sortBy === "low") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortBy === "high") {
    sorted.sort((a, b) => b.price - a.price);
  }

  return sorted;
}

let currentOffset = 0;
const LIMIT = 12;

async function loadMoreProducts() {
  const loadBtn = document.getElementById("load-more-btn");
  const selectedCategory = document.getElementById("category-filter").value;
  loadBtn.textContent = "Loading...";
  loadBtn.disabled = true;

  try {
    currentOffset += LIMIT;

    const nextProducts = await apiService.fetchProductsByCategory(
      selectedCategory,
      LIMIT,
      currentOffset,
    );

    if (nextProducts.length > 0) {
      allLoadedProducts = [...allLoadedProducts, ...nextProducts];
      const sortedList = applyCurrentSort(allLoadedProducts);
      renderGrid(sortedList, document.getElementById("product-grid"));

      loadBtn.textContent = "Load More";
      loadBtn.disabled = false;
    } else {
      loadBtn.textContent = "No more products";
      loadBtn.style.display = "none";
    }
  } catch (error) {
    console.error("Pagination error:", error);
    loadBtn.textContent = "Error loading more";
  }
}

export function updateBadge() {
  const badge = document.getElementById("cart-count");

  if (badge) {
    badge.textContent = cartService.count;
  } else {
    console.warn("Element #cart-count not found in the DOM.");
  }
  initCartPage();
  const cartBtn = document.getElementById("cart-toggle");

  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      window.location.href = "cart-page.html";
    });

    cartBtn.style.cursor = "pointer";
  }
}

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

if (searchForm) {
  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const query = searchInput.value.trim();
    if (!query) return;

    try {
      currentOffset = 0;
      const loadBtn = document.getElementById("load-more-btn");

      const results = await apiService.searchProducts(query);

      allLoadedProducts = results;
      renderGrid(allLoadedProducts, document.getElementById("product-grid"));

      if (loadBtn) {
        loadBtn.style.display = "none";
      }

      const catFilter = document.getElementById("category-filter");
      if (catFilter) catFilter.value = "all";
    } catch (error) {
      console.error("Search failed:", error);
    }
  });
}

if (searchInput) {
  let debounceTimer;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const query = e.target.value.trim();
      if (query.length > 2) {
        const results = await apiService.searchProducts(query);
        allLoadedProducts = results;
        renderGrid(allLoadedProducts, document.getElementById("product-grid"));
      }
      if (query.length < 3) {
        const results = await apiService.searchProducts(query);
        allLoadedProducts = results;
        renderGrid(allLoadedProducts, document.getElementById("product-grid"));
      }
    }, 500);
  });
}

window.addEventListener("cartUpdated", updateBadge);
document.addEventListener("DOMContentLoaded", initApp);
const loadBtn = document.getElementById("load-more-btn");
if (loadBtn) {
  loadBtn.addEventListener("click", loadMoreProducts);
}

const sortSelect = document.getElementById("sort-price");

if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    const sorted = applyCurrentSort(allLoadedProducts);
    renderGrid(sorted, document.getElementById("product-grid"));
  });
}
