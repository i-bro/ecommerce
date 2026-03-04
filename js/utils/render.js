import { cartService } from '../services/cartService.js';

/**
 * Creates a single product card element
 * @param {Product} product - Instance of the Product class
 */
export function createProductCard(product) {
    // 1. Create the main container
    const article = document.createElement('article');
    article.classList.add('product-card');

    // 2. Create and setup the Image
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    img.loading = 'lazy'; // Performance boost!

    // 3. Create the Title (h3)
    const title = document.createElement('h3');
    title.textContent = product.name;

    // 4. Create the Price (p)
    const price = document.createElement('p');
    price.classList.add('price');
    price.textContent = product.formattedPrice;

    // 5. Create the Add to Cart Button
    const btn = document.createElement('button');
    btn.classList.add('btn-add-to-cart');
    btn.textContent = 'Add to Cart';
    
    // Direct Event Listener (No more data-id attributes needed!)
    btn.addEventListener('click', () => {
        cartService.addItem(product);
        showToast(`${product.name} added to cart!`);
    });
    img.addEventListener('click', () => {
    window.location.href = `product-detail.html?id=${product.id}`;
});
img.style.cursor = 'pointer';

    // 6. Assemble the card (The "Append" Phase)
    article.append(img, title, price, btn);

    return article;
}

/**
 * Renders the full grid of products
 */
export function renderGrid(products, container) {
    if (!container) return;

    // Clear previous content safely
    container.innerHTML = ''; 

    if (products.length === 0) {
        container.textContent = 'No products found matching your search.';
        return;
    }

    // Create a DocumentFragment for better performance
    const fragment = document.createDocumentFragment();

    products.forEach(product => {
        const card = createProductCard(product);
        fragment.appendChild(card);
    });

    // One single paint operation on the DOM
    container.appendChild(fragment);
}

/**
 * Helper for User Feedback (Requirement #8)
 */
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast animate__animated animate__fadeInUp';
    toast.textContent = message;
    
    const container = document.getElementById('toast-container');
    if (container) {
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

export function renderProductDetail(product, container) {
    if (!container) return;
    container.innerHTML = ''; // Clear loading state

    // 1. Create the Main Grid Wrapper
    const detailGrid = document.createElement('div');
    detailGrid.classList.add('detail-grid');

    // 2. Create the Image Section
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    img.classList.add('detail-image');

    // 3. Create the Info Section
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info');

    // --- Create individual elements for the Info Section ---
    const title = document.createElement('h1');
    title.textContent = product.name;

    const category = document.createElement('p');
    category.classList.add('category-tag');
    category.textContent = product.category;

    const description = document.createElement('p');
    description.classList.add('description');
    description.textContent = product.description;

    const price = document.createElement('p');
    price.classList.add('detail-price');
    price.textContent = product.formattedPrice;

    const stock = document.createElement('p');
    stock.classList.add('stock-info');
    stock.textContent = `Stock: ${product.stock}`;

    const addToCartBtn = document.createElement('button');
    addToCartBtn.classList.add('btn-primary', 'btn-large');
    addToCartBtn.textContent = 'Add to Cart';

    // 🎯 Direct Event Listener
    addToCartBtn.addEventListener('click', () => {
        cartService.addItem(product);
        // You can call your showToast function here too!
    });

    // 4. Assemble the Info Div
    infoDiv.append(title, category, description, price, stock, addToCartBtn);

    // 5. Assemble the Grid and push to Container
    detailGrid.append(img, infoDiv);
    container.appendChild(detailGrid);
}