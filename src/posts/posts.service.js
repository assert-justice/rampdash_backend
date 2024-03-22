const db = require("../db");

function listPosts(){
    // knex.
    return db("posts").select("*");
}

function getPost(post_id){
    return db("posts").select("*").where({post_id}).first();
}

function publishPost(post){
    return db("posts").insert(post, "*");
}

module.exports = {
    listPosts,
    getPost,
    publishPost,
};