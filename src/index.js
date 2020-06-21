const express = require("express");
const app = express();

const path = require("path");
const cookieParser = require('cookie-parser');

const dotenv = require('dotenv');
dotenv.config();

require('./mongodb');

const pathViews = path.join(__dirname, "views");


/* Settings */
app.set("port", process.env.PORT || 3000);
app.set("views", pathViews);
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());



/* Routes */
app.use(require("./routes/index"));

app.use(express.static(path.join(__dirname, "public")));

app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
  console.log(pathViews);
});
