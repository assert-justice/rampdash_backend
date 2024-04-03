const db = require("../db");

function listUsers(){
    return db("users").select("*");
}

function getUser(user_id){
    return db("users").select("*").where({user_id}).first();
}

function loginUser(user_name, p_hash){
    return db("users").select("*").where({user_name}).first();
}

function followOffer(user_id, offer_id){
    return db("user_offers").insert({user_id, offer_id}, "*");
}
function unfollowOffer(user_id, offer_id){
    return db("user_offers").where({user_id, offer_id}).delete();
}

function postUser(user){
    return db("users").insert(user, "*");
}

module.exports = {
    listUsers,
    getUser,
    loginUser,
    followOffer,
    unfollowOffer,
    postUser,
};