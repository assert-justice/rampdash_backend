const db = require("../db");
const userFields = ["user_id","user_name","user_role", "user_email","college_id","group_id"];

function listUsers(){
    return db("users").select([...userFields]);
}

function getUser(user_id){
    return db("users").select([...userFields]).where({user_id}).first();
}

function loginUser(user_name){
    return db("users").select([...userFields, "user_pwd"]).where({user_name}).first();
}

function postUser(user){
    return db("users").insert(user, [...userFields]);
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