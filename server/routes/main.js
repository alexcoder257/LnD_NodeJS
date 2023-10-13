const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Routes
router.get("", async (req, res) => {
  // Render home page
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb",
    };

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.count();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);
    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.log(error);
  }
});

// router.get("", async(req, res) => {
//   // Render home page
//   const locals = {

//     title: "NodeJs Blog",
//     description: "Simple Blog created with NodeJs, Express & MongoDb",
//   };

//   try {
//     const data = await Post.find();
//     res.render('index',{locals,data})
//   } catch (error) {
//     console.log(error)
//   }
// });

router.get("/post/:id", async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb",
    };
    res.render("post", { locals, data });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST
 * POST - searchTerm
 */

router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Simple Blog created with NodeJs, Express & MongoDb",
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    res.render("search", {
      data,
      locals,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/about", (req, res) => {
  res.render("about");
});

// function insertPostData (){
//   Post.insertMany([
//    {
//      title:"Building a Blog",
//      body:"This is the body text"
//    },
//    {
//      title:"Building a Blog 1",
//      body:"This is the body text 1"
//    },  {
//      title:"Building a Blog 2",
//      body:"This is the body text 2"
//    },
//    {
//      title:"Building a Blog 3",
//      body:"This is the body text 3"
//    },  {
//      title:"Building a Blog 4",
//      body:"This is the body text 4"
//    },  {
//      title:"Building a Blog 5",
//      body:"This is the body text 5"
//    }
//   ])
// }
// insertPostData()

module.exports = router;
