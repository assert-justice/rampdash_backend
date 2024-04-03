const service = require("./companies.service");

async function listCompanies(req, res){
    const companies = await service.listCompanies();
    res.send(companies);
}

async function validateCompanyId(req, res, next){
    const {company_id} = req.params;
    if(!company_id) return next(400, "no company id provided");
    // check if id exists
    const company = await service.getCompany(company_id);
    if(!company) return next(400, "no such company");
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
            console.log(message);
            return next(400, message);
        }
    }
    res.locals.company = company;
    next();
}

async function postCompany(req, res){
    const data = await service.postCompany(res.locals.company);
    // console.log(data[0]);
    res.send(data[0]);
}

async function deleteCompany(req, res){
    await service.deleteCompany(res.locals.company.company_id);
    res.send({message: "ok"});
}
async function updateCompany(req, res){
    await service.updateCompany(res.locals.company);
    res.send({message: "ok"});
}

module.exports = {
    listCompanies,
    getCompany: [validateCompanyId, getCompany],
    postCompany: [validateCompany, postCompany],
    updateCompany: [validateCompany, updateCompany],
    deleteCompany: [validateCompanyId, deleteCompany],
};