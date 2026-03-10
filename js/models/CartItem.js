export class CartItem {
  constructor(product, quantity = 1) {
    this.product = product; // This is an instance of the Product class
    this.quantity = quantity;
  }

  get lineTotal() {
    return this.product.price * this.quantity;
  }

  increment() {
    if (this.quantity < this.product.stock) this.quantity++;
    else throw new Error("Maximum stock reached");
  }

  decrement() {
    if (this.quantity > 1) this.quantity--;
  }
}
