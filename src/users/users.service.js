const db = require("../db");

function listUsers(){
    return db("users").select("*");
}

function getUser(user_id){
    return db("users").select("*").where({user_id}).first();
}

function loginUser(user_name){
    return db("users").select("*").where({user_name}).first();
}

function postUser(user){
    return db("users").insert(user, "*");
}
function updateUser(user){
    const {user_id} = user;
    return db("users").where({user_id}).update(user);
}
function deleteUser(user_id){
    return db("users").where({user_id}).delete();
}

module.exports = {
    listUsers,
    getUser,
    loginUser,
    postUser,
    updateUser,
    deleteUser,
};