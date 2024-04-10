const express = require("express");
const router = express.Router();
const controller = require("./users.controller");

// const notImplemented = (req, res)=>{
//     res.send("not yet implemented");
// }

// get all users
router.get("/", controller.listUsers);

// get specific user
router.post("/login", controller.loginUser);
router.get("/:user_id", controller.getUser);

// follow an offer, user_id and offer_id passed in via query params
// router.post("/follow_offer", controller.followOffer);

// unfollow an offer, user_id and offer_id passed in via query params
// router.delete("/unfollow_offer", controller.unfollowOffer);

// post a new user
router.post("/", controller.postUser);

// post a new user
router.post("/", controller.postUser);

module.exports = router;