export class Product {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.title || data.name; 
    this.price = data.price;
    this.description = data.description;
    this.category = data.category;
    this.image = data.thumbnail || data.image;
    this.rating = data.rating;
    this.stock = data.stock;
  }

  get formattedPrice() { return `$${this.price.toFixed(2)}`; }
  
  get availability() {
    return this.stock > 10 ? 'In Stock' : (this.stock > 0 ? `Only ${this.stock} left!` : 'Out of Stock');
  }
}