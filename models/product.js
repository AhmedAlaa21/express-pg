const products = [];

/**
 * Represents a shop product and handles in-memory persistence.
 */
class Product {
  /**
   * @param {string} title
   * @param {string} imageUrl
   * @param {string} description
   * @param {string|number} price
   */
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  /**
   * Saves this product into the in-memory store.
   */
  save() {
    products.push(this);
  }

  /**
   * Returns all saved products.
   * @returns {Product[]}
   */
  static fetchAll() {
    return products;
  }
}

module.exports = Product;
