const express = require("express");
const router = express.Router();
const Project = require("../models/project");
const Post = require("../models/post");

const verifyToken = require("../verifyToken");

const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
const multer = require("multer");
const upload = multer();
const uploadFromBuffer = require("../helpers/functions");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get("/", async (req, res) => {
  let projects = await Project.find().limit(4);
  console.log(projects);

  res.render("index.html", { projects });
});

router.get("/MyProjects", async (req, res) => {
  let projects = await Project.find();
  res.render("my_projects.html", { projects });
});

router.get("/Blog", async (req, res) => {
  const posts = await Post.find();
  console.log(posts);
  res.render("blog.html", { posts });
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
    const token = jwt.sign(
      { adminName: process.env.ADMIN_NAME },
      process.env.TOKEN_SECRET,
      {
        expiresIn: 60 * 60 * 24, // expires in 24 hours
      }
    );
    console.log(token);
    /* res.json({auth:true,token}); */
    res
      .cookie("token", token, { path: "/" })
      .redirect(301, "/AdminManageProjects");
  } else {
    res.json({ auth: false });
  }
});

router.get("/AdminMyProfile", verifyToken, (req, res) => {
  res.render("adminMyProfile.html");
});

router.get("/AdminManageProjects", async (req, res) => {
  const projects = await Project.find();
  res.render("admin/adminManageProjects.html", { projects });
});

router.delete("/AdminManageProjects", verifyToken, async (req, res) => {
  console.log("...Delete project...");
  const { id } = req.query;
  const info = await Project.findByIdAndDelete({ _id: id });
  console.log(info);
  info.imgsPubId.forEach(async (element) => {
    let infoDestroy = await cloudinary.v2.uploader.destroy(element);
    console.log(infoDestroy);
  });
  res.status(200).json({ delete: true });
});

router.get("/AdminEditProject", async (req, res) => {
  const { id } = req.query;
  const project = await Project.findById({ _id: id });
  console.log(project);
  res.render("admin/adminEditProject.html", { project });
});

router.put(
  "/AdminEditProject",
  verifyToken,
  upload.array("images"),
  async (req, res) => {
    console.log("...AdminEditProject...");
    let imgs = Array();
    let imgsPubId = Array();
    const { id, title, github, website, description, image } = req.body;
    console.log(req.body);
    console.log("info files");
    console.log(req.files);
    const project = await Project.findById({ _id: id });
    project.imgsPubId.forEach(async (element) => {
      /* Destroy de image in clodinary */
      let infoDestroy = await cloudinary.v2.uploader.destroy(element);
      console.log("info destroy");
      console.log(infoDestroy);
      
    });
    for(let i=0;i<req.files.length;i++){
      /* Uploadd de new image in clodunary */
      let result = await uploadFromBuffer(req.files[i], "myWebSite");
      console.log("info update");
      console.log(result);
      imgs.push(result.secure_url);
      imgsPubId.push(result.public_id);
    }
    const info = await Project.updateOne(
      { _id: id },
      {
        title,
        description,
        github,
        website,
        imgs,
        imgsPubId
      }
    );
    res.status(200).json({ update: true });
  }
);

router.get("/AdminAddProject", (req, res) => {
  res.render("adminAddProject.html");
});

router.post(
  "/AdminAddProject",
  verifyToken,
  upload.array("images"),
  async (req, res) => {
    try {
      let imgs = Array();
      let imgsPubId = Array();
      const { title, description, github, website } = req.body;
      console.log("...AddProject...");
      console.log(req.body);
      for (let i = 0; i < req.files.length; i++) {
        let result = await uploadFromBuffer(req.files[i], "myWebSite");
        imgs.push(result.secure_url);
        imgsPubId.push(result.public_id);
      }
      const project = new Project({
        title,
        description,
        github,
        website,
        imgs,
        imgsPubId,
      });
      console.log(project);
      await project.save();
      res.redirect(301, "/AdminManageProjects");
    } catch (error) {
      console.log(error);
      res.status(500);
    }
  }
);

router.get("/AdminAddPost", (req, res) => {
  res.render("admin/adminAddPost.html");
});

router.post("/AdminAddPost", async (req, res) => {
  console.log(req.body);
  const { title, summary, introduction, body, conclusion } = req.body;

  const post = new Post({
    title,
    updateDate: new Date(),
    summary,
    introduction,
    body,
    conclusion,
  });
  await post.save();
  res.render("admin/adminAddPost.html");
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

router.get("/Project/:id", async (req, res) => {
  const project = await Project.findById({ _id: req.params.id });
  console.log(project);
  res.render("projectDetail.html", { project });
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

router.get("/SignOut", (req, res) => {
  console.log("Clear cookies");
  res.clearCookie("token", { path: "/" }).redirect(301,"/");
});

module.exports = router;
