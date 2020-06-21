const express = require("express");
const router = express.Router();
const Project = require("../models/project");

const verifyToken = require('../verifyToken');

const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

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

router.post("/Contact", async (req, res) => {
  const { name, email, message } = req.body;

  let contentHTML = `
      <h1>User information</h1>
      <ul>
        <li>Name:${name}</li>
        <li>Email:${email}</li>
      </ul>
      <p>${message}</p>
  
  `;

  const smtpConfig = {
    host: process.env.HOST_EMAIL,
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER_NAME,
      pass: process.env.PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  };

  const transporter = nodemailer.createTransport(smtpConfig);

  transporter.verify((err, success) => {
    if (err) console.error(err);
    console.log("Your config is correct");
  });

  try {
    const info = await transporter.sendMail({
      from: `'ngch43 Server' ${process.env.USER_NAME}`,
      to: "n.g.ch43@gmail.com",
      subject: "Website contact form",
      html: contentHTML,
    });
    console.log("Message sent", info.messageId);
  } catch (error) {
    console.log(error);
  }

  res.render("contact.html");
});

router.get("/AdminSignIn", (req, res) => {
  
  res.render("signIn.html");
});

router.post("/AdminSignIn", (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (
    email == process.env.ADMIN_NAME &&
    password == process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({adminName:process.env.ADMIN_NAME}, process.env.TOKEN_SECRET, {
      expiresIn: 60 * 60 * 24, // expires in 24 hours
    });
    console.log(token);
    res.json({auth:true,token});
  } else {
    res.json({auth:false});
  }
});

router.get("/AdminMyProfile",verifyToken,(req, res) => {
  res.render("adminMyProfile.html");
});

router.get("/AdminManageProjects", (req, res) => {
  res.render("adminManageProjects.html");
});

router.get("/AdminEditProject", (req, res) => {
  res.render("adminEditProject.html");
});

router.get("/AdminAddProject", (req, res) => {
  res.render("adminAddProject.html");
});

router.get("/Cookies", (req, res) => {
  res.render("cookies.html");
});

router.get("/PrivacyPolicy", (req, res) => {
  res.render("privacyPolicy.html");
});

router.get("/UserManual", (req, res) => {
  res.render("userManual.html");
});

router.get("/LegalNotice", (req, res) => {
  res.render("legalNotice.html");
});

router.get("/dbTest", async (req, res) => {
  try {
    const projects = await Project.find();

    if (!projects) {
      res.status(404).send("Projects not found");
    }
    res.status(200).json({ projects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ text: "Internal error" });
  }
});

module.exports = router;
