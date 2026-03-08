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
  
    const productGrid = document.getElementById("product-grid")
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
      option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1); // Capitalize first letter
      categorySelect.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to load categories", err);
  }
}

// Handle Category Change
const categoryFilter = document.getElementById("category-filter");
if (categoryFilter) {
  categoryFilter.addEventListener("change", async (e) => {
    const selectedCategory = e.target.value;
    currentOffset = 0; // Reset pagination for new category

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

      // Update our global state and UI
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
const LIMIT = 12; // How many to load per click

async function loadMoreProducts() {
  const loadBtn = document.getElementById("load-more-btn");
  const selectedCategory = document.getElementById("category-filter").value;
  loadBtn.textContent = "Loading...";
  loadBtn.disabled = true;

  try {
    // Increase the skip by the limit (0 -> 12 -> 24...)
    currentOffset += LIMIT;

    // Fetch next batch
    const nextProducts = await apiService.fetchProductsByCategory(
      selectedCategory,
      LIMIT,
      currentOffset,
    );

    if (nextProducts.length > 0) {
      // 🎯 CRITICAL: Use a new 'appendGrid' logic or modify renderGrid
      // so it doesn't clear the innerHTML!
      // appendProductsToGrid(nextProducts);
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

// In js/main.js
export function updateBadge() {
  const badge = document.getElementById("cart-count"); // or document.querySelector('#cart-count')

  if (badge) {
    badge.textContent = cartService.count;
  } else {
    console.warn("Element #cart-count not found in the DOM.");
  }
  initCartPage();
  const cartBtn = document.getElementById("cart-toggle");

  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      // This moves the user to your dedicated cart page
      window.location.href = "cart-page.html";
    });

    // UI Touch: Change cursor to pointer so users know it's clickable
    cartBtn.style.cursor = "pointer";
  }
}

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

if (searchForm) {
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent page refresh
        
        const query = searchInput.value.trim();
        if (!query) return;

        try {
            // 1. Reset pagination and UI state
            currentOffset = 0;
            const loadBtn = document.getElementById('load-more-btn');
            
            // 2. Fetch results
            const results = await apiService.searchProducts(query);
            
            // 3. Update global state and UI
            allLoadedProducts = results;
            renderGrid(allLoadedProducts, document.getElementById('product-grid'));

            // 4. Handle Load More button visibility
            // DummyJSON search results are usually limited to 30. 
            // If you want to keep it simple, hide the load more button during search results.
            if (loadBtn) {
                loadBtn.style.display = 'none'; 
            }

            // 5. Reset the Category filter to "all" visually
            const catFilter = document.getElementById('category-filter');
            if (catFilter) catFilter.value = 'all';

        } catch (error) {
            console.error("Search failed:", error);
        }
    });
}

if(searchInput){
    let debounceTimer;
searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
        const query = e.target.value.trim();
        if (query.length > 2) { // Only search if more than 2 letters
            const results = await apiService.searchProducts(query);
            allLoadedProducts = results;
            renderGrid(allLoadedProducts, document.getElementById('product-grid'));
        }
    }, 500); // Wait 500ms after user stops typing
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
    // Sort the existing products and redraw
    const sorted = applyCurrentSort(allLoadedProducts);
    renderGrid(sorted, document.getElementById("product-grid"));
  });
}
