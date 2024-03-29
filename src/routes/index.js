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
var cpUpload = upload.fields([
   { name: 'outstandingImage', maxCount: 1 },
   { name: 'images', maxCount: 12 }
  ]);

const ejs = require("ejs");
const path = require("path");

/* Functions from helpers */
const {
  uploadFromBuffer,
  calcBlogPags,
  reduceTextDescription,
} = require("../helpers/functions");
const { Router } = require("express");
const { dirname } = require("path");


router.get("/", async (req, res) => {
  let projects = await Project.find().limit(4);
  console.log(projects);
  let auth = false;
  if(req.cookies.token) auth = true;
    
  res.render("index.html", { projects,auth});
});

/* Projects */

router.get("/projects", async (req, res) => {
  const page = parseInt(req.params.page,10) || 1 ;
  const limit = 8;
  const queryTitle = req.query.title;
  let projects = [];
  let filter = { "title": {} };
  if (req.query) {
      filter["title"]["$regex"] = new RegExp(queryTitle, "i");       
  } else {
      filter = { };
  }
  projects = await Project.paginate(filter,{limit,page});
  
  console.log(projects);
  let auth = false;
  if(req.cookies.token) auth = true;

  res.render("my_projects.html", {
    projects:projects.docs,
    auth 
  });
});

router.get("/projects/:id", async (req, res) => {
  const project = await Project.findById({ _id: req.params.id });
  console.log(project);
  let auth = false;
  if(req.cookies.token) auth = true;

  res.render("projectDetail.html", { project,auth });
});

router.get("/projects/pagination/:page",async (req, res) => {
  const page = parseInt(req.params.page,10) || 2 ;
  const limit = 8;
  const queryTitle = req.query.title;
  let projects = [];
  let filter = { "title": {} };
  if (req.query) {
      filter["title"]["$regex"] = new RegExp(queryTitle, "i");       
  } else {
      filter = { };
  }
  console.log(filter);
  console.log(page);
  projects = await Project.paginate(filter,{limit,page});

  /* console.log(projects); */
  let nextContent = "";
  for (let index = 0; index < projects.docs.length; index++) {
    const project = projects.docs[index];
    nextContent += await ejs.renderFile(path.join(__dirname,"/../views/partials/cartProject.html"),{project});
  }
  res.json({
    nextContent,
    hasNextPage:projects.hasNextPage,
    nextPage:projects.nextPage
  });
});

/* Blog */
router.get("/blog", async (req, res) => {
  const posts = await Post.paginate({},{limit:5});

  let auth = false;
  if(req.cookies.token) auth = true;
  
  res.render("blog.html", {posts, auth});
});

/* Blog for page */

router.get("/blog/:page", async (req, res) => {
  const page = parseInt(req.params.page,10) || 1 ;
  const limit = 5 ;

  let filter = { "title": {} };
  if (req.query) {
      filter["title"]["$regex"] = new RegExp(req.query.title, "i");       
  } else {
      filter = { };
  }

  const posts = await Post.paginate(filter,{limit,page});
  console.log(posts);

  let auth = false;
  if(req.cookies.token) auth = true;

  res.render("blog.html", {posts,auth});
});

router.get("/blog/post/:id", async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById({ _id: postId });
  console.log(post);
  let auth = false;
  if(req.cookies.token) auth = true;

  res.render("postDetail.html",{post,auth});
});

router.get("/contact", (req, res) => {
  let auth = false;
  if(req.cookies.token) auth = true;

  res.render("contact.html",{auth});
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

  let auth = false;
  if(req.cookies.token) auth = true;

  res.render("admin/logIn.html",{info,auth});
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
  let auth = false;
  if(req.cookies.token) auth = true;

  res.render("admin/myProfile.html",{auth});
});

router.get("/admin/manage-projects",verifyToken, async (req, res) => {
  const projects = await Project.find();

  let auth = false;
  if(req.cookies.token) auth = true;

  res.render("admin/manageProjects.html", { projects, auth });
});

router.get("/admin/manage-projects/add",verifyToken, (req, res) => {
  let auth = false;
  if(req.cookies.token) auth = true;

  res.render("admin/addProject.html",{auth});
});

router.post("/admin/manage-projects/add",verifyToken,
  cpUpload,
  async (req, res) => {
    try {
      let imgs = Array();
      let imgsPubId = Array();
      let outstandingImage;
      let outstandingImagePubId;
      const { title, github, website, content } = req.body;
      console.log("-- Add project --");
      for (const key in req.files) {
        const element = req.files[key];
        for (let i = 0; i < element.length; i++) {
          let result = await uploadFromBuffer(element[i], "myWebSite");
          if(key == "outstandingImage"){
            outstandingImage = result.secure_url
            outstandingImagePubId = result.public_id
          }else{
            imgs.push(result.secure_url);
            imgsPubId.push(result.public_id);
          }
        }
        
      }
      const project = new Project({
        title,
        content,
        github,
        website,
        outstandingImage,
        outstandingImagePubId,
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

router.get("/admin/manage-projects/:project/edit",verifyToken, async (req, res) => {
  const projectId = req.params.project;
  const project = await Project.findById({ _id: projectId });
  console.log(project);

  let auth = false;
  if(req.cookies.token) auth = true;

  res.render("admin/editProject.html", { project, auth });
});

router.post("/admin/manage-projects/:project/edit",verifyToken,
  cpUpload,
  async (req, res) => {
    console.log("-- Edit Project --");
    let imgs = Array();
    let imgsPubId = Array();
    const { title, github, website, content } = req.body;
    const id = req.params.project;
    console.log(req.body);
    if (req.files.images || req.files.outstandingImage) {
      const project = await Project.findById({ _id: id });
      let infoDestroy;
      if(project.outstandingImagePubId){
        infoDestroy = await cloudinary.v2.uploader
                              .destroy(project.outstandingImagePubId);
      }
      project.imgsPubId.forEach(async (element) => {
        /* Destroy de image in clodinary */
        infoDestroy = await cloudinary.v2.uploader.destroy(element);
        console.log("info destroy");
        console.log(infoDestroy);
      });
      for (const key in req.files) {
        const element = req.files[key];
        for (let i = 0; i < element.length; i++) {
          let result = await uploadFromBuffer(element[i], "myWebSite");
          if(key == "outstandingImage"){
            outstandingImage = result.secure_url
            outstandingImagePubId = result.public_id
          }else{
            imgs.push(result.secure_url);
            imgsPubId.push(result.public_id);
          }
        }
      }
      const info = await Project.updateOne(
        { _id: id },
        {
          title,
          content,
          github,
          website,
          outstandingImage,
          outstandingImagePubId,
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

router.get("/admin/manage-posts",verifyToken, async (req, res) => {
  const posts = await Post.find();

  let auth = false;
  if(req.cookies.token) auth = true;

  res.render("admin/managePosts.html", { posts, auth });
});

router.get("/admin/manage-posts/add",verifyToken, async (req, res) => {
  let auth = false;
  if(req.cookies.token) auth = true;

  res.render("admin/addPost.html",{ auth });
});

router.post("/admin/manage-posts/add",verifyToken, cpUpload, async (req, res) => {
  console.log("-- New post Add --");
  console.log(req.body);
  const {title, content } = req.body;
  try {
    if(req.files.outstandingImage[0]){
      let result = await uploadFromBuffer(req.files.outstandingImage[0], "myWebSite");
      outstandingImage = result.secure_url
      outstandingImagePubId = result.public_id
    }
    const post = new Post({
      title,
      updateDate: new Date(),
      outstandingImage,
      outstandingImagePubId,
      content
    });
    const info = await post.save();
    console.log(info);
    res.redirect("/admin/manage-posts");
  } catch (error) {
    console.error(error);
    res.status(500);
  }
  
});

router.get("/admin/manage-posts/:post/edit",verifyToken, async (req, res) => {

  let id = req.params.post;
  let post = await Post.findById({ _id: id });
  console.log(post);

  let auth = false;
  if(req.cookies.token) auth = true;

  res.render("admin/editPost.html",{post, auth});

});

router.post("/admin/manage-posts/:post/edit",verifyToken, cpUpload, async (req, res) => {
  console.log("-- Post update --");
  try {
    console.log(req.body);
    const {title, content } = req.body;
    const id = req.params.post;
    const post = await Post.findById({ _id: id });
    let outstandingImage;
    let outstandingImagePubId;
    let infoDestroy;
    if(req.files.outstandingImage[0]){
      infoDestroy = await cloudinary.v2.uploader
                              .destroy(post.outstandingImagePubId);
      let result = await uploadFromBuffer(req.files.outstandingImage[0], "myWebSite");
      outstandingImage = result.secure_url
      outstandingImagePubId = result.public_id
    }

    const info = await Post.updateOne(
      { _id: id },
      {
        title,
        updateDate: new Date(),
        outstandingImage,
        outstandingImagePubId,
        content
      }
    );
    console.log(info);
    res.redirect("/admin/manage-posts");
  } catch (error) {
    console.error(error);
    res.status(500);
  }
    
});

router.get("/admin/manage-posts/:post/delete", verifyToken, async (req, res) => {
  console.log("-- Delete Post -- ")
  const postId  = req.params.post;
  const info = await Post.deleteOne({ _id: postId });

  console.log(info);
  
  res.redirect("/admin/manage-posts");
});

router.get("/cookies", (req, res) => {
  let auth = false;
  if(req.cookies.token) auth = true;

  res.render("cookies.html",{auth});
});

router.get("/privacy-policy", (req, res) => {
  let auth = false;
  if(req.cookies.token) auth = true;

  res.render("privacyPolicy.html",{auth});
});

router.get("/legal-notice", (req, res) => {
  let auth = false;
  if(req.cookies.token) auth = true;

  res.render("legalNotice.html",{auth});
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
