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

// create a new user
router.post("/", controller.postUser);

// activate a user
router.post("/activate", controller.activateUser);

// update a user
router.patch("/", controller.updateUser);
// update a password
router.patch("/:user_id", controller.updatePassword);

// delete a user
router.delete("/:user_id", controller.deleteUser);

module.exports = router;