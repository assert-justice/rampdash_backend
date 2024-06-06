const express = require("express");
const router = express.Router();
const controller = require("./offers.controller");
const { isLoggedIn, isAdmin } = require("../auth_middleware");

// const notImplemented = (req, res)=>{
//     res.send("not yet implemented");
// }

// get all offers, potentially filtered by criteria
router.get("/", isLoggedIn, controller.listOffers);

// get specific offer
router.get("/:offer_id", isLoggedIn, controller.getOffer);

// post a new offer
router.post("/", isAdmin, controller.postOffer);
// update an offer
router.patch("/:offer_id", isAdmin, controller.updateOffer);
// delete an offer
router.delete("/:offer_id", isAdmin, controller.deleteOffer);

module.exports = router;