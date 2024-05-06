const service = require("./companies.service");

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
    res.send(res.locals.company);
}

function validateCompany(req, res, next){
    const company = req.body;
    const fields = [
        "company_name",
        "company_logo",
        "company_website",
        "company_description",
    ];
    for (const field of fields) {
        if(company[field] === undefined) {
            const message = `Missing field ${field}!`;
            return next(message);
        }
    }
    res.locals.company = company;
    next();
}

function postCompany(req, res){
    service.postCompany(res.locals.company);
    res.send(data[0]);
}

function deleteCompany(req, res, next){
    service.deleteCompany(res.locals.company.company_id)
        .then(()=>res.send({message: "ok"}))
        .catch(next);
}
function updateCompany(req, res, next){
    service.updateCompany(res.locals.company)
        .then(()=>res.send({message: "ok"}))
        .catch(next);
}

module.exports = {
    listCompanies,
    getCompany: [validateCompanyId, getCompany],
    postCompany: [validateCompany, postCompany],
    updateCompany: [validateCompany, updateCompany],
    deleteCompany: [validateCompanyId, deleteCompany],
};