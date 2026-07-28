# Master Shop — Project Documentation

This document explains how **Master Shop** is built, how the MVC layers work together, and how product data flows through the app.

---

## Overview

Master Shop is an Express.js training app that lets an admin add products (title, image URL, price, description) and shows them on a shop page.

- **Runtime:** Node.js + Express 5  
- **Template engine:** Pug  
- **Architecture:** MVC (Model–View–Controller)  
- **Data store:** `data/products.json` (loaded on each shop request; survives server restarts)

---

## Project structure

```text
express-pg/
├── index.js                 # App entry: middleware, routes, server
├── controllers/             # Request handlers (Controller layer)
│   ├── admin.js             # Add-product GET/POST
│   ├── shop.js              # Shop product list
│   └── error.js             # 404 handler
├── models/                  # Business data (Model layer)
│   └── product.js           # Product class + in-memory store
├── routes/                  # URL → controller mapping
│   ├── admin.js
│   └── shop.js
├── views/                   # Pug templates (View layer)
│   ├── layouts/
│   │   └── main.pug         # Shared header / nav
│   ├── shop/
│   │   └── product-list.pug
│   ├── admin/
│   │   └── add-product.pug
│   └── 404.pug
├── public/
│   └── css/main.css         # Static styles
└── utils/
    └── path.js              # Helper for project root path
```

Older `.html` files under `views/` are leftovers from earlier steps and are no longer used by the app.

---

## How MVC is applied

### Model (`models/product.js`)

Owns **what a product is** and **how products are stored**:

| Field         | Purpose                          |
|---------------|----------------------------------|
| `title`       | Product name                     |
| `imageUrl`    | URL of the product image         |
| `description` | Short product text               |
| `price`       | Numeric price shown as `$…`      |

Key methods:

- `save(callback)` — reads `data/products.json`, appends the product, writes the file back  
- `Product.fetchAll(callback)` — reads `data/products.json` and returns the product list (empty array if the file is missing or invalid)  

On first load, if the file does not exist yet, the app treats the catalog as empty (`[]`) and still serves the shop page.

### Controller (`controllers/`)

Owns **request/response logic**:

| Controller method              | Role |
|--------------------------------|------|
| `admin.getAddProduct`          | Renders the add-product form |
| `admin.postAddProduct`         | Reads form body, creates `Product`, saves, redirects |
| `shop.getProducts`             | Loads all products, renders the shop list |
| `error.get404`                 | Renders the 404 page with status `404` |

Controllers:

1. Read input from `req` when needed  
2. Call the model  
3. Pass data into `res.render(...)` or redirect  

They do not contain HTML markup.

### View (`views/`)

Owns **presentation**:

- `layouts/main.pug` — shared shell (brand, nav, CSS)  
- `shop/product-list.pug` — product cards (image, title, price, description)  
- `admin/add-product.pug` — form with all product fields  
- `404.pug` — not-found page  

Pug uses `extends` / `block content` so pages share one layout. Active nav links use the `path` value passed from controllers.

### Routes (`routes/`)

Keep URL mapping thin:

```js
router.get("/add-product", adminController.getAddProduct);
router.post("/add-product", adminController.postAddProduct);
router.get("/", shopController.getProducts);
```

Routes do not contain business logic or rendering details.

---

## Request flow

### 1. Add a product

```text
Browser  →  GET /admin/add-product
         →  routes/admin.js
         →  controllers/admin.getAddProduct
         →  views/admin/add-product.pug
```

User submits the form:

```text
Browser  →  POST /admin/add-product  { title, imageUrl, price, description }
         →  routes/admin.js
         →  controllers/admin.postAddProduct
         →  new Product(...).save()
         →  redirect /
```

### 2. View the shop

```text
Browser  →  GET /
         →  routes/shop.js
         →  controllers/shop.getProducts
         →  Product.fetchAll()
         →  views/shop/product-list.pug  (product cards)
```

### 3. Unknown URL

```text
Browser  →  unmatched path
         →  controllers/error.get404
         →  views/404.pug
```

---

## App bootstrap (`index.js`)

1. Create the Express app  
2. Set Pug as the view engine and point `views` at the `views` folder  
3. Parse URL-encoded form bodies (`body-parser`)  
4. Serve static files from `public/` (CSS, etc.)  
5. Mount `/admin` routes and shop routes  
6. Register the 404 controller as the final middleware  
7. Listen on port `8080`

---

## Running the project

```bash
npm install
npm start
```

Open [http://localhost:8080](http://localhost:8080).

1. Go to **Add product**  
2. Fill title, image URL, price, and description  
3. Submit — you are redirected to the shop  
4. The new product appears as a card with all details  

**Note:** Products are stored in `data/products.json`, so they remain after a server restart.

---

## Design choices (why this shape)

- **MVC** keeps forms, storage, and HTML separated so each layer is easier to change later (e.g. swapping the in-memory array for PostgreSQL).  
- **Controllers** stay small: validate/orchestrate, then hand off to model and view.  
- **Pug layouts** avoid copying the same nav into every page.  
- **Full product fields** on create and list make the shop useful for learning CRUD before introducing a real database.

---

## Next steps (optional learning path)

- Persist products to a JSON file or PostgreSQL  
- Add product IDs and a product-detail page  
- Add edit / delete actions  
- Replace in-memory storage with a repository layer behind the model
