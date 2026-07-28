const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/path");

const productsFilePath = path.join(rootDir, "data", "products.json");

/**
 * Ensures the data directory exists, then reads products from disk.
 * @param {(products: object[]) => void} callback
 */
const getProductsFromFile = (callback) => {
  fs.mkdir(path.dirname(productsFilePath), { recursive: true }, (mkdirError) => {
    if (mkdirError) {
      console.error("Could not create data directory:", mkdirError);
      return callback([]);
    }

    fs.readFile(productsFilePath, (readError, fileContent) => {
      if (readError) {
        // Missing or unreadable file → treat as empty catalog on first load
        return callback([]);
      }

      try {
        const products = JSON.parse(fileContent.toString() || "[]");
        callback(Array.isArray(products) ? products : []);
      } catch (parseError) {
        console.error("Invalid products.json content:", parseError);
        callback([]);
      }
    });
  });
};

/**
 * Represents a shop product and persists it to data/products.json.
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
   * Appends this product to products.json.
   * @param {(error?: Error) => void} [callback]
   */
  save(callback = () => {}) {
    getProductsFromFile((products) => {
      products.push({
        title: this.title,
        imageUrl: this.imageUrl,
        description: this.description,
        price: this.price,
      });

      fs.writeFile(
        productsFilePath,
        JSON.stringify(products, null, 2),
        (writeError) => {
          if (writeError) {
            console.error("Could not save products:", writeError);
          }
          callback(writeError || undefined);
        },
      );
    });
  }

  /**
   * Loads all products from products.json (used on shop page load).
   * @param {(products: object[]) => void} callback
   */
  static fetchAll(callback) {
    getProductsFromFile(callback);
  }
}

module.exports = Product;
