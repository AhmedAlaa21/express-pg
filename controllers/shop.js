const Product = require("../models/product");

/**
 * Renders the shop page with all products.
 */
exports.getProducts = (req, res) => {
  const products = Product.fetchAll();
  res.render("shop/product-list", {
    pageTitle: "Shop",
    path: "/",
    products,
  });
};
