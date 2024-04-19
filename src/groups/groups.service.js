const db = require("../db");

function listGroups(){
    return db("groups")
    .join("companies", "groups.company_id", "=", "companies.company_id")
    .select("*");
}

function getGroup(group_id){
    return db("groups").where({group_id}).join("companies", "groups.company_id", "=", "companies.company_id").select("*").first();
}

function postGroup(group){
    return db("groups").insert(group, "*");
}
function updateGroup(group){
    const {group_id} = group;
    db("groups").where({group_id}).update(group);
}

function deleteGroup(group_id){
    db("groups").where({group_id}).delete();
}

module.exports = {
    listGroups,
    getGroup,
    postGroup,
    updateGroup,
    deleteGroup,
};