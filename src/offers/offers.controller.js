const service = require("./offers.service");
const companiesService = require("../companies/companies.service");
const collegesService = require("../colleges/colleges.service");
const groupsService = require("../groups/groups.service");
const { body, validationResult } = require('express-validator');

function listOffers(req, res, next){
    const {college_id} = req.query;
    if(college_id === undefined)service.listOffers().then(offers=>res.send(offers)).catch(next);
    else service.listCollegeOffers(college_id).then(offers=>res.send(offers)).catch(next);
}

function validateOfferId(req, res, next){
    const {offer_id} = req.params;
    if(!offer_id) return next("no offer id provided");
    // check if id exists
    service.getOffer(offer_id).then(offer => {
        if(!offer) return next("no such offer");
        res.locals.offer = offer;
        next();
    }).catch(next);
}

async function getOffer(req, res){
    const {offer} = res.locals;
    if(offer.company_id){
        const company = await companiesService.getCompany(offer.company_id);
        if(!company) return next("Invalid company id");
        res.locals.offer.company = company;
    }
    if(offer.college_id){
        const college = await collegesService.getCollege(offer.college_id);
        if(!college) return next("Invalid college id");
        res.locals.offer.college = college;
    }
    if(offer.group_id){
        const group = await groupsService.getGroup(offer.group_id);
        if(!group) return next("Invalid group id");
        res.locals.offer.group = group;
    }
    res.send({offer: res.locals.offer});
}

async function deleteOffer(req, res, next){
    service.deleteOffer(res.locals.offer.offer_id).then(()=>res.send({message: "ok"}))
        .catch(next);
}

async function validateOffer(req, res, next){
    const {offer} = req.body;
    if(!offer) return next("No offer provided");
    const validators = [
        body("offer.offer_title").isString().notEmpty().escape(),
        body("offer.offer_details").isString().escape(),
        body("offer.offer_link").isURL().notEmpty(),
        body("offer.company_id").isNumeric(),
        body("offer.college_id").isNumeric().optional(),
        body("offer.group_id").isNumeric().optional(),
    ];
    for (const val of validators) {
        const result = await val.run(req);
        if(!result.isEmpty()){
            const err = result.array()[0];
            const message = `${err.msg} '${err.value}' at path ${err.path}`;
            return next(message);
        }
    }
    res.locals.offer = offer;
    // check id exists
    const company = companiesService.getCompany(offer.company_id);
    if(!company) return next("Invalid company id");
    // res.locals.offer.company = company;
    if(offer.college_id){
        const college = collegesService.getCollege(offer.college_id);
        if(!college) return next("Invalid college id");
        // res.locals.offer.college = college;
    }
    if(offer.group_id){
        const group = groupsService.getGroup(offer.group_id);
        if(!group) return next("Invalid group id");
        // res.locals.offer.group = group;
    }
    next();
}

async function postOffer(req, res, next){
    const {offer} = req.body;
    const fields = [
        "offer_title",
        "offer_details",
        "offer_link",
        "company_id", 
        "group_id", 
        "college_id", 
    ];
    for (const field of fields) {
        if(offer[field] !== undefined) res.locals.offer[field] = offer[field];
    }
    service.postOffer(res.locals.offer).then(data => res.send({offer: data[0]}))
        .catch(err => {
            next(err);
        });
}
function updateOffer(req, res, next){
    const {offer} = req.body;
    const fields = [
        "offer_title",
        "offer_details",
        "offer_link",
        "company_id", 
        "group_id", 
        "college_id", 
    ];
    for (const field of fields) {
        if(offer[field] !== undefined) res.locals.offer[field] = offer[field];
    }
    service.updateOffer(res.locals.offer).then(()=>res.send({message: "ok"})).catch(next);
}

module.exports = {
    listOffers,
    getOffer: [validateOfferId, getOffer],
    deleteOffer: [validateOfferId, deleteOffer],
    postOffer: [validateOffer, postOffer],
    updateOffer: [validateOfferId, updateOffer],
};