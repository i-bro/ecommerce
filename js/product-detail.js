import { apiService } from "./services/apiService.js";
import { cartService } from "./services/cartService.js";
import { renderProductDetail } from "./utils/render.js";
import { updateBadge } from "./main.js";

async function initDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    window.location.href = "index.html";
    return;
  }

  try {
    const product = await apiService.fetchProductById(productId);
    const container = document.getElementById("product-details-container");

    renderProductDetail(product, container);
    updateBadge();

    cartService.init();
    document.getElementById("cart-count").textContent = cartService.count;
  } catch (error) {
    document.getElementById("product-details-container").innerHTML =
      `<h2>Product not found</h2><a href="index.html">Return to Shop</a>`;
  }
}

initDetailPage();
