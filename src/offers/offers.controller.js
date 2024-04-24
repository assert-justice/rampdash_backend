const service = require("./offers.service");
const companiesService = require("../companies/companies.service");
const collegesService = require("../colleges/colleges.service");
const groupsService = require("../groups/groups.service");

async function listOffers(req, res){
    let offers = await service.listOffers();
    res.send(offers);
}

async function validateOfferId(req, res, next){
    const {offer_id} = req.params;
    if(!offer_id) return next("no offer id provided");
    // check if id exists
    const offer = await service.getOffer(offer_id);
    if(!offer) return next("no such offer");
    res.locals.offer = offer;
    next();
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
    res.send(res.locals.offer);
}

async function deleteOffer(req, res){
    await service.deleteOffer(res.locals.offer.offer_id);
    res.send({message: "ok"});
}

function validateOffer(req, res, next){
    const offer = req.body;
    const fields = [
        "offer_title",
        "offer_details",
        "offer_link",
        // company_id, group_id, and college_id are optional but must be valid if present
    ];
    for (const field of fields) {
        if(offer[field] === undefined) {
            const message = `Missing field ${field}!`;
            return next(message);
        }
    }
    res.locals.offer = offer;
    // check id exists
    if(offer.company_id){
        const company = companiesService.getCompany(offer.company_id);
        if(!company) return next("Invalid company id");
        res.locals.offer.company = company;
    }
    if(offer.college_id){
        const college = collegesService.getCollege(offer.college_id);
        if(!college) return 
        "offer_types",lege = college;
    }
    if(offer.group_id){
        const group = groupsService.getGroup(offer.group_id);
        if(!group) return next("Invalid group id");
        res.locals.offer.group = group;
    }
    next();
}

async function postOffer(req, res){
    const {offer} = res.locals;
    delete offer.college;
    delete offer.company;
    delete offer.group;
    const data = await service.postOffer(offer);
    res.send(data[0]);
}
async function updateOffer(req, res){
    const {offer} = res.locals;
    delete offer.college;
    delete offer.company;
    delete offer.group;
    if(offer.college_id) offer.college_id = +offer.college_id;
    await service.updateOffer(offer);
    res.send({message: "ok"});
}

module.exports = {
    listOffers,
    getOffer: [validateOfferId, getOffer],
    deleteOffer: [validateOfferId, deleteOffer],
    postOffer: [validateOffer, postOffer],
    updateOffer: [validateOffer, updateOffer],
};