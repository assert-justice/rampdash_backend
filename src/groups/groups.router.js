const express = require("express");
const router = express.Router();
const controller = require("./groups.controller");
const { isAdmin } = require("../auth_middleware");

// get all groups, potentially filtered by criteria
router.get("/", controller.listGroups);

// get specific group
router.get("/:group_id", controller.getGroup);

// post a new group
router.post("/", isAdmin, controller.postGroup);
// update an group
router.patch("/:group_id", isAdmin, controller.updateGroup);
// delete an group
router.delete("/:group_id", isAdmin, controller.deleteGroup);

module.exports = router;