export class Product {
  constructor({ id, title, price, description, category, thumbnail, rating, stock }) {
    this.id = id;
    this.name = title; 
    this.price = price;
    this.description = description;
    this.category = category;
    this.image = thumbnail;
    this.rating = rating;
    this.stock = stock;
  }

  get formattedPrice() { return `$${this.price.toFixed(2)}`; }
  
  get availability() {
    return this.stock > 10 ? 'In Stock' : (this.stock > 0 ? `Only ${this.stock} left!` : 'Out of Stock');
  }
}