const db = require("../db");

function listColleges(){
    return db("colleges")
    .select("*");
}

function getCollege(college_id){
    return db("colleges").where({college_id}).select("*").first();
}

function postCollege(college){
    return db("colleges").insert(college, "*");
}
function updateCollege(college){
    const {college_id} = college;
    return db("colleges").where({college_id}).update(college);
}

function deleteCollege(college_id){
    return db("colleges").where({college_id}).delete();
}

module.exports = {
    listColleges,
    getCollege,
    postCollege,
    updateCollege,
    deleteCollege,
};