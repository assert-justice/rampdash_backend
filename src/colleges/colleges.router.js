const express = require("express");
const router = express.Router();
const controller = require("./colleges.controller");

// get all colleges, potentially filtered by criteria
router.get("/", controller.listColleges);

// get specific college
router.get("/:college_id", controller.getCollege);

// post a new college
router.post("/", controller.postCollege);
// update an college
router.patch("/:college_id", controller.updateCollege);
// delete an college
router.delete("/:college_id", controller.deleteCollege);

module.exports = router;