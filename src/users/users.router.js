const express = require("express");
const router = express.Router();
const controller = require("./users.controller");
const auth = require("../auth_middleware");

// get all users
router.get("/", auth.isAdmin, controller.listUsers);

// get specific user
router.post("/login", controller.loginUser);
router.get("/:user_id", auth.isAdmin, controller.getUser);

// create a new user
router.post("/", auth.isAdmin, controller.postUser);

// create a user with an invite code
router.post("/activate/:invite_code", controller.activateUser);

// update a user
router.patch("/update/:user_id", auth.isSelfOrAdmin, controller.updateUser);
// update a password
router.patch("/update_pwd/:user_id", auth.isSelfOrAdmin, controller.updatePassword);

// delete a user
router.delete("/:user_id", auth.isAdmin, controller.deleteUser);

module.exports = router;