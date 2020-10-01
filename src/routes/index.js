const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const querystring = require('querystring');  


const Project = require("../models/project");
const Post = require("../models/post");


const verifyToken = require("../verifyToken");
const cloudinary = require("../cloudinary");

const multer = require("multer");
const upload = multer();




/* Functions from helpers */
const {
  uploadFromBuffer,
  calcBlogPags,
  reduceTextDescription,
} = require("../helpers/functions");
const { Router } = require("express");


router.get("/", async (req, res) => {
  let projects = await Project.find().limit(4);
  console.log(projects);

  /* projects.forEach((project) => {
    project.description = reduceTextDescription(project.description, 20, "...");
  }); */
  res.render("index.html", { projects });
});

/* Projects */

router.get("/projects", async (req, res) => {
  let projects = await Project.find();

  /* projects.forEach((project) => {
    project.description = reduceTextDescription(project.description, 20, "...");
  }); */

  res.render("my_projects.html", { projects });
});

router.get("/projects/:id", async (req, res) => {
  const project = await Project.findById({ _id: req.params.id });
  console.log(project);
  res.render("projectDetail.html", { project });
});


/* Blog */
router.get("/blog/", async (req, res) => {
  const posts = await Post.paginate({},{limit:5});
  console.log(posts);
  res.render("blog.html", {posts});
});

/* Blog for page */

router.get("/blog/:page", async (req, res) => {
  const page = parseInt(req.params.page,10) || 1 ;
  const limit = 5 ;
  const posts = await Post.paginate({},{limit,page});
  console.log(posts);
  res.render("blog.html", {posts});
});

router.get("/blog/post/:id", async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById({ _id: postId });
  console.log(post);
  res.render("postDetail.html",{post});
});

router.get("/contact", (req, res) => {
  res.render("contact.html");
});

router.post("/contact", async (req, res) => {
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

router.get("/admin", (req, res) => {
  let info = {
    message:""
  };
  if(req.query.message) info.message = req.query.message;  
  res.render("admin/logIn.html",{info});
});

router.post("/admin", (req, res) => {

  const { username, password } = req.body;
  const admin_name = process.env.ADMIN_NAME;
  const admin_password = process.env.ADMIN_PASSWORD;

  console.log(req.body);
  if (
    username == admin_name &&
    password == admin_password
  ) {
    const token = jwt.sign(
      { adminName: admin_name },
      process.env.TOKEN_SECRET,
      {
        expiresIn: 60 * 60 * 24, // expires in 24 hours
      }
    );
    console.log(token);
    
    res
      .cookie("token", token, { path: "/" })
      .redirect("/admin/manage-projects");
  } else {
    /* Access denied... */
    let query = querystring.stringify({
      "message":"Bad credentials"
    });
    res.redirect(`/admin?${query}`);
  }
});

router.get("/admin/my-profile", verifyToken, (req, res) => {
  res.render("admin/myProfile.html");
});

router.get("/admin/manage-projects",verifyToken, async (req, res) => {
  const projects = await Project.find();
  res.render("admin/manageProjects.html", { projects });
});

router.post("/admin/manage-projects/:project/delete", verifyToken, async (req, res) => {

  const projectId  = req.params.project;
  const info = await Project.findByIdAndDelete({ _id: projectId });

  console.log(info);
  
  info.imgsPubId.forEach(async (element) => {
    let infoDestroy = await cloudinary.v2.uploader.destroy(element);
    console.log(infoDestroy);
  });
  res.status(200).json({ delete: true });


});

router.get("/admin/manage-projects/:project/edit",verifyToken, async (req, res) => {
  const projectId = req.params.project;
  const project = await Project.findById({ _id: projectId });
  console.log(project);
  res.render("admin/editProject.html", { project });
});

router.post(
  "/admin/manage-projects/:project/edit",
  verifyToken,
  upload.array("images"),
  async (req, res) => {
    console.log("-- Edit Project --");
    let imgs = Array();
    let imgsPubId = Array();
    const { title, github, website, description, content } = req.body;
    const id = req.params.project;
    console.log(req.body);
    if (req.files.length > 0) {
      console.log("Files request");
      console.log(req.files.length);
      const project = await Project.findById({ _id: id });
      project.imgsPubId.forEach(async (element) => {
        /* Destroy de image in clodinary */
        let infoDestroy = await cloudinary.v2.uploader.destroy(element);
        console.log("info destroy");
        console.log(infoDestroy);
      });
      for (let i = 0; i < req.files.length; i++) {
        /* Upload de new image in clodunary */
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
          content,
          github,
          website,
          imgs,
          imgsPubId,
          updateDate: new Date(),
        }
      );
    } else {
      const info = await Project.updateOne(
        { _id: id },
        {
          title,
          description,
          content,
          github,
          website,
          updateDate: new Date(),
        }
      );
    }
    res.redirect("/admin/manage-projects");
  }
);

router.get("/admin/manage-projects/add",verifyToken, (req, res) => {
  res.render("admin/addProject.html");
});

router.post(
  "/admin/manage-projects/add",
  verifyToken,
  upload.array("images"),
  async (req, res) => {
    try {
      let imgs = Array();
      let imgsPubId = Array();
      const { title, description, github, website, content } = req.body;
      console.log("-- Add project --");
      console.log(req.body);
      for (let i = 0; i < req.files.length; i++) {
        let result = await uploadFromBuffer(req.files[i], "myWebSite");
        imgs.push(result.secure_url);
        imgsPubId.push(result.public_id);
      }
      const project = new Project({
        title,
        description,
        content,
        github,
        website,
        imgs,
        imgsPubId,
        updateDate: new Date(),
      });
      console.log(project);
      await project.save();
      res.redirect(301, "/admin/manage-projects");
    } catch (error) {
      console.log(error);
      res.status(500);
    }
  }
);

router.get("/admin/save-post", async (req, res) => {

  let post = {
      id:"",title:"",content:""
    }

  res.render("admin/savePost.html",{post});

});

router.get("/admin/save-post/:id", async (req, res) => {

  let id = req.params.id;
  let post = await Post.findById({ _id: id });
  console.log(post);
  res.render("admin/savePost.html",{post});

});

router.post("/admin/save-post",verifyToken,upload.array("images"), async (req, res) => {
  console.log(req.body);
  const {id ,title, content } = req.body;
  if(!id){
    console.log("-- New post Add --");
    const post = new Post({
      title,
      updateDate: new Date(),
      content
  
    });
    try {
      const info = await post.save();
      console.log(info);
      res.json({save:true});
    } catch (error) {
      console.error(error);
      res.status(500).json({save:false});
    }
  }else{
    console.log("-- Post update --");
    try {
      const info = await Post.updateOne(
        { _id: id },
        {
          title,
          updateDate: new Date(),
          content
        }
      );
      console.log(info);
      res.json({save:true});
    } catch (error) {
      console.error(error);
      res.status(500).json({save:false});
    }
    
  }
  
});

router.get("/cookies", (req, res) => {
  res.render("cookies.html");
});

router.get("/privacy-policy", (req, res) => {
  res.render("privacyPolicy.html");
});

router.get("/user-manual", (req, res) => {
  res.render("userManual.html");
});

router.get("/legal-notice", (req, res) => {
  res.render("legalNotice.html");
});

router.get("/db-test", async (req, res) => {
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

router.get("/sign-out", (req, res) => {
  console.log("Clear cookies");
  res.clearCookie("token", { path: "/" }).redirect(301, "/");
});

/* Routers for error pages */

router.get('/404', function(req, res, next){
  // trigger a 404 since no other middleware
  // will match /404 after this one, and we're not
  // responding here
  next();
});

router.get('/403', function(req, res, next){
  // trigger a 403 error
  var err = new Error('not allowed!');
  err.status = 403;
  next(err);
});

router.get('/500', function(req, res, next){
  // trigger a generic (500) error
  next(new Error('keyboard cat!'));
});

module.exports = router;
