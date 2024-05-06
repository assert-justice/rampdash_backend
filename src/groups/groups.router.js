const express = require("express");
const router = express.Router();
const controller = require("./groups.controller");

// get all groups, potentially filtered by criteria
router.get("/", controller.listGroups);

// get specific group
router.get("/:group_id", controller.getGroup);

// post a new group
router.post("/", controller.postGroup);
// update an group
router.patch("/", controller.updateGroup);
// delete an group
router.delete("/:group_id", controller.deleteGroup);

module.exports = router;