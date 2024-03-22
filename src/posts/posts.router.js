const express = require("express");
const router = express.Router();
const controller = require("./posts.controller");

const notImplemented = (req, res)=>{
    res.send("not yet implemented");
}

// get all posts
router.get("/", controller.listPosts);

// get specific post
router.get("/:post_id", controller.getPost);

// post a new post
router.post("/", controller.publishPost);

module.exports = router;