const express = require("express");
const router = express.Router();
const Project = require("../models/project");

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

router.get("/AdminSignIn", (req, res) => {
  res.render("signIn.html");
});


router.get("/dbTest", async (req, res) => {

  try {
    const projects = await Project.find();

    if(!projects){
       res.status(404).send("Projects not found")
    }
    res.status(200).json({ projects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ text: "Internal error" });
  }
});

module.exports = router;
