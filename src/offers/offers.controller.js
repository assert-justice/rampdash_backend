const service = require("./offers.service");
const companiesService = require("../companies/companies.service");

async function listOffers(req, res){
    const {user_id, following} = req.query;
    let offers;
    if(user_id){
        if(following){
            offers = await service.listOffersFollowed(user_id);
        }
        else{
            // offers = await service.listOffersNotFollowed(user_id);
            offers = await service.listOffersNotFollowed(user_id);
            // whereNot isn't working
            // offers = offers.filter(c=>c.user_id != user_id);
        }
    }
    else{
        offers = await service.listOffers();
    }
    // should do this in sql but dgaf
    const offerIds = new Set();
    offers = offers.filter(o => {
        if(offerIds.has(o.offer_id)) return false;
        offerIds.add(o.offer_id);
        delete o.user_offer_id;
        delete o.user_id;
        return true;
    })
    res.send(offers);
}

async function validateOfferId(req, res, next){
    const {offer_id} = req.params;
    if(!offer_id) return next(400, "no offer id provided");
    // check if id exists
    const offer = await service.getOffer(offer_id);
    if(!offer) return next(400, "no such offer");
    res.locals.offer = offer;
    next();
}

async function getOffer(req, res){
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
        "offer_types",
        "offer_details",
        "offer_expires",
        "company_id",
    ];
    for (const field of fields) {
        if(offer[field] === undefined) {
            const message = `Missing field ${field}!`;
            console.log(message);
            return next(400, message);
        }
    }
    // check id exists
    const company = companiesService.getCompany(offer.company_id);
    if(!company) return next(400, "no such company");
    res.locals.offer = offer;
    res.locals.company = company;
    next();
}

async function postOffer(req, res){
    const data = await service.postOffer(res.locals.offer);
    res.send(data[0]);
}
async function updateOffer(req, res){
    await service.postOffer(res.locals.offer);
    res.send({message: "ok"});
}

module.exports = {
    listOffers,
    getOffer: [validateOfferId, getOffer],
    deleteOffer: [validateOfferId, deleteOffer],
    postOffer: [validateOffer, postOffer],
    updateOffer: [validateOffer, updateOffer],
};