const db = require("../db");

function listCompanies(){
    return db("companies").select("*");
}

function getCompany(company_id){
    return db("companies").select("*").where({company_id}).first();
}

function postCompany(company){
    return db("companies").insert(company, "*");
}
async function deleteCompany(company_id){
    await db("companies").where({company_id}).del();
}
async function updateCompany(company){
    const {company_id} = company;
    await db("companies").where({company_id}).update(company);
}

module.exports = {
    listCompanies,
    getCompany,
    postCompany,
    deleteCompany,
    updateCompany,
};