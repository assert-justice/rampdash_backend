const db = require("../db");

function listOffers(){
    return db("offers")
    .join("companies", "offers.company_id", "=", "companies.company_id")
    .select("*");
}

function getOffer(offer_id){
    // return db("offers").where({offer_id}).join("companies", "offers.company_id", "=", "companies.company_id").select("*").first();
    return db("offers").where({offer_id}).select("*").first();
}

function postOffer(offer){
    return db("offers").insert(offer, "*");
}
function updateOffer(offer){
    console.log(offer);
    const {offer_id} = offer;
    return db("offers").where({offer_id}).update(offer);
}

function deleteOffer(offer_id){
    db("offers").where({offer_id}).delete();
}

module.exports = {
    listOffers,
    getOffer,
    postOffer,
    updateOffer,
    deleteOffer,
};