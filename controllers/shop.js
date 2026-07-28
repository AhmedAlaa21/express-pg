const Product = require("../models/product");

/**
 * Renders the shop page with all products loaded from products.json.
 */
exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      pageTitle: "Shop",
      path: "/",
      products,
    });
  });
};
