import { apiService } from './services/apiService.js';
import { cartService } from './services/cartService.js';
import { renderGrid } from './utils/render.js';

async function initApp() {
  cartService.init();
  updateBadge();

  try {
    const products = await apiService.fetchProducts();
    renderGrid(products, document.getElementById('product-grid'));
  } catch (error) {
    document.getElementById('app-grid').innerHTML = `
      <div class="error-state">
        <p>Something went wrong. Check your connection.</p>
        <button onclick="location.reload()">Retry</button>
      </div>
    `;
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
}

window.addEventListener('cartUpdated', updateBadge);
document.addEventListener('DOMContentLoaded', initApp);