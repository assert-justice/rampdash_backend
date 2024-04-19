const db = require("../db");

function listColleges(){
    return db("colleges")
    .select("*");
}

function getCollege(college_id){
    return db("colleges").where({college_id}).join("companies", "colleges.company_id", "=", "companies.company_id").select("*").first();
}

function postCollege(college){
    return db("colleges").insert(college, "*");
}
function updateCollege(college){
    const {college_id} = college;
    db("colleges").where({college_id}).update(college);
}

function deleteCollege(college_id){
    db("colleges").where({college_id}).delete();
}

module.exports = {
    listColleges,
    getCollege,
    postCollege,
    updateCollege,
    deleteCollege,
};