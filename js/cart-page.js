import { cartService } from "./services/cartService.js";
import { renderCartPage, renderCartSummary } from "./utils/render.js";

export function initCartPage() {
  cartService.init();

  const itemsContainer = document.getElementById("cart-items-list");
  const summaryContainer = document.getElementById("cart-total-section");

  if (itemsContainer) {
    renderCartPage(cartService.items, itemsContainer);
  }

  if (summaryContainer) {
    renderCartSummary(summaryContainer);
  }
}

window.addEventListener("cartUpdated", () => {
  const itemsContainer = document.getElementById("cart-items-list");
  const summaryContainer = document.getElementById("cart-total-section");

  renderCartPage(cartService.items, itemsContainer);
  renderCartSummary(summaryContainer);
});

document.addEventListener("DOMContentLoaded", initCartPage);
