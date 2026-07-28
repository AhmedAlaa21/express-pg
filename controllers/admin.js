const Product = require("../models/product");

/**
 * Renders the "Add Product" form.
 */
exports.getAddProduct = (req, res) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

/**
 * Creates a new product from the submitted form and redirects to the shop.
 */
exports.postAddProduct = (req, res) => {
  const { title, imageUrl, description, price } = req.body;
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};
