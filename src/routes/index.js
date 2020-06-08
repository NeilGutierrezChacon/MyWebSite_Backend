const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index.html");
});

router.get("/MyProjects", (req, res) => {
  res.render("my_projects.html");
});

router.get("/Blog", (req, res) => {
  res.render("blog.html");
});

router.get("/Contact", (req, res) => {
  res.render("contact.html");
});

module.exports = router;
