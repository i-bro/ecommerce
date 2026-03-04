import { apiService } from './services/apiService.js';
import { cartService  } from './services/cartService.js';
import { renderProductDetail } from './utils/render.js';
import { updateBadge } from './main.js';

async function initDetailPage() {
    // 1. Get ID from URL: e.g., ?id=5
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        // 2. Fetch single product (Make sure apiService has fetchProductById!)
        const product = await apiService.fetchProductById(productId);
        const container = document.getElementById('product-details-container');
        
        // 3. Render
        renderProductDetail(product, container);
        updateBadge()
        
        // 4. Init Cart
        cartService.init();
        document.getElementById('cart-count').textContent = cartService.count;
    } catch (error) {
        document.getElementById('product-details-container').innerHTML = 
            `<h2>Product not found</h2><a href="index.html">Return to Shop</a>`;
    }
}



initDetailPage();