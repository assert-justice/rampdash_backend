const service = require("./companies.service");
const { body, validationResult } = require('express-validator');

async function listCompanies(req, res){
    const companies = await service.listCompanies();
    res.send(companies);
}

async function validateCompanyId(req, res, next){
    const {company_id} = req.params;
    if(!company_id) return next("no company id provided");
    // check if id exists
    const company = await service.getCompany(company_id);
    if(!company) return next("no such company");
    res.locals.company = company;
    next();
}

function getCompany(req, res){
    res.send({company: res.locals.company});
}

async function validateCompany(req, res, next){
    const {company} = req.body;
    const validators = [
        body("company.company_name").isString().notEmpty().escape(),
        body("company.company_description").isString().escape(),
        body("company.company_logo").isURL().notEmpty(),
        body("company.company_website").isURL().notEmpty(),
    ];
    for (const val of validators) {
        const result = await val.run(req);
        if(!result.isEmpty()){
            const err = result.array()[0];
            const message = `${err.msg} '${err.value}' at path ${err.path}`;
            return next(message);
        }
    }
    res.locals.company = company;
    next();
}

function postCompany(req, res, next){
    service.postCompany(res.locals.company)
    .then(data => res.send({company: data[0]}))
    .catch(next);
}

function deleteCompany(req, res, next){
    service.deleteCompany(res.locals.company.company_id)
        .then(()=>res.send({message: "ok"}))
        .catch(next);
}

function updateCompany(req, res, next){
    const {company} = req.body;
    if(!company) return next("No company in body");
    const fields = [
        "company_name",
        "company_logo",
        "company_description",
        "company_website",
    ];
    for (const field of fields) {
        if(company[field] !== undefined) res.locals.company[field] = company[field];
    }
    service.updateCompany(res.locals.company)
        .then(()=>res.send({message: "ok"}))
        .catch(next);
}

module.exports = {
    listCompanies,
    getCompany: [validateCompanyId, getCompany],
    postCompany: [validateCompany, postCompany],
    updateCompany: [validateCompanyId, updateCompany],
    deleteCompany: [validateCompanyId, deleteCompany],
};