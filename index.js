const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "pug");
app.set("views", "views"); // default views directory is "views"
const port = 8080;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// routes..
const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");

app.use("/admin", adminRouter.routes);
app.use(shopRouter);

// default path UI..
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

//run server on port 8080..
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
