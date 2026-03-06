import { cartService } from './services/cartService.js';
import { renderCartPage, renderCartSummary } from './utils/render.js';


export function initCartPage() {
    // 1. Load and revive classes from localStorage
    cartService.init();

    // 2. Target the containers in your cart-page.html
    const itemsContainer = document.getElementById('cart-items-list');
    const summaryContainer = document.getElementById('cart-total-section');

    // 3. Render the dynamic content
    if (itemsContainer) {
        renderCartPage(cartService.items, itemsContainer);
    }
    
    if (summaryContainer) {
        renderCartSummary(summaryContainer);
    }
}

// 4. Listen for quantity updates to re-render the total immediately
window.addEventListener('cartUpdated', () => {
    const itemsContainer = document.getElementById('cart-items-list');
    const summaryContainer = document.getElementById('cart-total-section');
    
    renderCartPage(cartService.items, itemsContainer);
    renderCartSummary(summaryContainer);
});

document.addEventListener('DOMContentLoaded', initCartPage);