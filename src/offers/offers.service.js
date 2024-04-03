const db = require("../db");

function listOffers(){
    return db("offers")
    .join("companies", "offers.company_id", "=", "companies.company_id")
    .select("*");
}
function listOffersFollowed(user_id){
    return db("user_offers").where({user_id})
    .join("offers", "user_offers.offer_id", "=", "offers.offer_id")
    .join("companies", "offers.company_id", "=", "companies.company_id")
    .select("*");
}
function listOffersNotFollowed(user_id){
    return db("user_offers").whereNot('user_id', user_id).orWhereNull("user_id")
    .fullOuterJoin("offers", "user_offers.offer_id", "=", "offers.offer_id")
    .join("companies", "offers.company_id", "=", "companies.company_id")
    .select("*");
    // return db("user_offers").whereNot('user_id', user_id).join("offers", "user_offers.offer_id", "=", "offers.offer_id").select("*");
}

function getOffer(offer_id){
    return db("offers").where({offer_id}).join("companies", "offers.company_id", "=", "companies.company_id").select("*").first();
}

function postOffer(offer){
    return db("offers").insert(offer, "*");
}
function updateOffer(offer){
    const {offer_id} = offer;
    db("offers").where({offer_id}).update(offer);
}

function deleteOffer(offer_id){
    db("offers").where({offer_id}).delete();
}

module.exports = {
    listOffers,
    listOffersFollowed,
    listOffersNotFollowed,
    getOffer,
    postOffer,
    updateOffer,
    deleteOffer,
};