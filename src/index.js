const express = require("express");
const app = express();

const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require('morgan');

/**
 * Configuration to use environment variables.
 */
const dotenv = require("dotenv");
dotenv.config();


const node_env = process.env.NODE_ENV;

/**
 * Connection with mongodb
 */

require("./mongodb");



const pathViews = path.join(__dirname, "views");

/* Settings */
app.set("port", process.env.PORT || 3000);
app.set("views", pathViews);

app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

node_env == "dev" || app.use(morgan('dev'));

/* Routes */
app.use(require("./routes/index"));
app.use(express.static(path.join(__dirname, "public")));


/* Middlewares */
/*  Error handling middleware */

app.use((req, res, next) => {
  res.status(404);

  res.format({
    html: function () {
      res.render('errors/404.html', { url: req.url })
    },
    json: function () {
      res.json({ error: 'Not found' })
    },
    default: function () {
      res.type('txt').send('Not found')
    }
  })
});

/* Only show in production */
if(node_env == "prod"){
  app.use((err, req, res, next) => {
  
    res.status(err.status || 500);
    res.render('errors/500.html', { error: err });
  
  }); 
}


app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});
