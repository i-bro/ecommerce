import { apiService } from './services/apiService.js';
import { cartService } from './services/cartService.js';
import { renderGrid } from './utils/render.js';
import {initCartPage} from './cart-page.js';
import {appendProductsToGrid} from './utils/render.js';


let allLoadedProducts = []
async function initApp() {
  cartService.init();
  updateBadge();
  initCategories();

  try {
    const products = await apiService.fetchProducts();
    allLoadedProducts = products;
    renderGrid(allLoadedProducts, document.getElementById('product-grid'));
  } catch (error) {
    document.getElementById('app-grid').innerHTML = `
      <div class="error-state">
        <p>Something went wrong. Check your connection.</p>
        <button onclick="location.reload()">Retry</button>
      </div>
    `;
  }
}

async function initCategories() {
    const categorySelect = document.getElementById('category-filter');
    if (!categorySelect) return;

    try {
        const categories = await apiService.fetchCategories();
        
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1); // Capitalize first letter
            categorySelect.appendChild(option);
        });
    } catch (err) {
        console.error("Failed to load categories", err);
    }
}

// Handle Category Change
const categoryFilter = document.getElementById('category-filter');
if (categoryFilter) {
    categoryFilter.addEventListener('change', async (e) => {
        const selectedCategory = e.target.value;
        currentOffset = 0; // Reset pagination for new category

        const loadBtn = document.getElementById('load-more-btn');
    if (loadBtn) {
        loadBtn.disabled = false;
        loadBtn.style.display = 'block';
        loadBtn.textContent = 'Load More';
    }

        try {
            // Fetch products for this specific category
            const filteredProducts = await apiService.fetchProductsByCategory(selectedCategory, LIMIT, currentOffset);
            
            // Update our global state and UI
            allLoadedProducts = filteredProducts;
            renderGrid(allLoadedProducts, document.getElementById('product-grid'));
            
            // Re-show the "Load More" button if it was hidden
            const loadBtn = document.getElementById('load-more-btn');
            if (loadBtn) loadBtn.style.display = 'block';
            
        } catch (err) {
            console.error("Filtering error", err);
        }
    });
}

function applyCurrentSort(products) {
    const sortSelect = document.getElementById('sort-price');
    if (!sortSelect) return products;

    const sortBy = sortSelect.value;
    const sorted = [...products]; // Copy to avoid mutating original

    if (sortBy === 'low') {
        sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'high') {
        sorted.sort((a, b) => b.price - a.price);
    }
    
    return sorted;
}

let currentOffset = 0;
const LIMIT = 12; // How many to load per click

async function loadMoreProducts() {
    const loadBtn = document.getElementById('load-more-btn');
    const selectedCategory = document.getElementById('category-filter').value;
    loadBtn.textContent = 'Loading...';
    loadBtn.disabled = true;

    try {
        // Increase the skip by the limit (0 -> 12 -> 24...)
        currentOffset += LIMIT;

        // Fetch next batch
        const nextProducts = await apiService.fetchProductsByCategory(selectedCategory, LIMIT, currentOffset);

        if (nextProducts.length > 0) {
            // 🎯 CRITICAL: Use a new 'appendGrid' logic or modify renderGrid 
            // so it doesn't clear the innerHTML!
            // appendProductsToGrid(nextProducts);
            allLoadedProducts = [...allLoadedProducts, ...nextProducts]
            const sortedList = applyCurrentSort(allLoadedProducts);
            renderGrid(sortedList, document.getElementById('product-grid'))
            
            loadBtn.textContent = 'Load More';
            loadBtn.disabled = false;
        }
         else {
            loadBtn.textContent = 'No more products';
            loadBtn.style.display = 'none';
        }
    } catch (error) {
        console.error("Pagination error:", error);
        loadBtn.textContent = 'Error loading more';
    }
}





// In js/main.js
export function updateBadge() {
  const badge = document.getElementById('cart-count'); // or document.querySelector('#cart-count')
  
  if (badge) {
    badge.textContent = cartService.count;
  } else {
    console.warn("Element #cart-count not found in the DOM.");
  }
  initCartPage();
  const cartBtn = document.getElementById('cart-toggle');

if (cartBtn) {
    cartBtn.addEventListener('click', () => {
        // This moves the user to your dedicated cart page
        window.location.href = 'cart-page.html';
    });
    
    // UI Touch: Change cursor to pointer so users know it's clickable
    cartBtn.style.cursor = 'pointer';
}
}

window.addEventListener('cartUpdated', updateBadge);
document.addEventListener('DOMContentLoaded', initApp);
const loadBtn = document.getElementById('load-more-btn');
if (loadBtn) {
    loadBtn.addEventListener('click', loadMoreProducts);
}

const sortSelect = document.getElementById('sort-price');

if (sortSelect) {
    sortSelect.addEventListener('change', () => {
        // Sort the existing products and redraw
        const sorted = applyCurrentSort(allLoadedProducts);
        renderGrid(sorted, document.getElementById('product-grid'));
    });
}
