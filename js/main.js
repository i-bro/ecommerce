import { apiService } from './services/apiService.js';
import { cartService } from './services/cartService.js';
import { renderGrid } from './utils/render.js';
import {initCartPage} from './cart-page.js';

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