const express = require("express");
const router = express.Router();
const controller = require("./invites.controller");
const { isAdmin } = require("../auth_middleware");

// get all invites
router.get("/", isAdmin, controller.listInvites);

// get specific invite
router.get("/:invite_id", isAdmin, controller.getInvite);
router.get("/code/:invite_code", controller.getInviteByCode);

// post a new invite
router.post("/", isAdmin, controller.postInvite);
// update an invite
// router.patch("/", controller.updateInvite);
// delete an invite
router.delete("/:invite_id", isAdmin, controller.deleteInvite);

module.exports = router;