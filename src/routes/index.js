const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");


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


router.get("/", async (req, res) => {
  let projects = await Project.find().limit(4);
  console.log(projects);

  projects.forEach((project) => {
    project.description = reduceTextDescription(project.description, 20, "...");
  });
  res.render("index.html", { projects });
});

router.get("/MyProjects", async (req, res) => {
  let projects = await Project.find();

  projects.forEach((project) => {
    project.description = reduceTextDescription(project.description, 20, "...");
  });

  res.render("my_projects.html", { projects });
});


/* Blog */
router.get("/Blog/", async (req, res) => {
  const posts = await Post.paginate({},{limit:5});
  console.log(posts);
  res.render("blog.html", {posts});
});

/* Blog for page */

router.get("/Blog/:page", async (req, res) => {
  const page = parseInt(req.params.page,10) || 1 ;
  const limit = 5 ;
  const posts = await Post.paginate({},{limit,page});
  console.log(posts);
  res.render("blog.html", {posts});
});

router.get("/Blog/Post/:id", async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById({ _id: postId });
  console.log(post);
  res.render("postDetail.html",{post});
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
          github,
          website,
          updateDate: new Date(),
        }
      );
    }
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
        updateDate: new Date(),
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

router.get("/Admin/SavePost", async (req, res) => {

  let post = {
      id:"",title:"",content:""
    }

  res.render("admin/savePost.html",{post});

});

router.get("/Admin/SavePost/:id", async (req, res) => {

  let id = req.params.id;
  let post = await Post.findById({ _id: id });
  console.log(post);
  res.render("admin/savePost.html",{post});

});

router.post("/Admin/SavePost",verifyToken,upload.array("images"), async (req, res) => {
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
  res.clearCookie("token", { path: "/" }).redirect(301, "/");
});

module.exports = router;
