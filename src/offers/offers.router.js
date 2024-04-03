const express = require("express");
const router = express.Router();
const controller = require("./offers.controller");

// const notImplemented = (req, res)=>{
//     res.send("not yet implemented");
// }

// get all offers, potentially filtered by criteria
router.get("/", controller.listOffers);

// get specific offer
router.get("/:offer_id", controller.getOffer);

// post a new offer
router.post("/", controller.postOffer);
// update an offer
router.patch("/:offer_id", controller.updateOffer);
// delete an offer
router.delete("/:offer_id", controller.deleteOffer);

module.exports = router;