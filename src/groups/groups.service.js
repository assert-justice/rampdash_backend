const db = require("../db");

function listGroups(){
    return db("groups").select("*");
}

function listCollegeGroups(college_id){
    return db("groups")
    .where({college_id})//.orWhereNull("college_id")
    .select("*");
}

function getGroup(group_id){
    return db("groups").where({group_id}).select("*").first();
}

function postGroup(group){
    return db("groups").insert(group, "*");
}
function updateGroup(group){
    const {group_id} = group;
    return db("groups").where({group_id}).update(group);
}

function deleteGroup(group_id){
    return db("groups").where({group_id}).delete();
}

module.exports = {
    listGroups,
    listCollegeGroups,
    getGroup,
    postGroup,
    updateGroup,
    deleteGroup,
};