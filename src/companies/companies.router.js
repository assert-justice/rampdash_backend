const express = require("express");
const router = express.Router();
const controller = require("./companies.controller");

// const notImplemented = (req, res)=>{
//     res.send("not yet implemented");
// }

// get all companies
router.get("/", controller.listCompanies);

// get specific company
router.get("/:company_id", controller.getCompany);

// post a new company
router.post("/", controller.postCompany);
// delete a company
router.delete("/:company_id", controller.deleteCompany);
router.patch("/", controller.updateCompany);

module.exports = router;