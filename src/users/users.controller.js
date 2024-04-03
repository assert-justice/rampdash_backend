const service = require("./users.service");
const offerService = require("../offers/offers.service");

async function listUsers(req, res){
    const users = await service.listUsers();
    res.send(users);
}

async function validateUserId(req, res, next){
    const {user_id} = req.params;
    if(!user_id) return next(400, "no user id provided");
    // check if id exists
    const user = await service.getUser(user_id);
    if(!user) return next(400, "no such user");
    res.locals.user = user;
    next();
}

function getUser(req, res){
    res.send(res.locals.user);
}

function hashPassword(req, res, next){
    next();
    // if(!req.body.password){
    //     return
    // }
}

async function loginUser(req, res, next){
    const requiredFields = ["user_name"];
    for (const field of requiredFields) {
        if(!req.body[field]) return next(400, `Required field '${field}' not found!`);
    }
    const user = await service.loginUser(req.body.user_name, null);
    console.log(user)
    if(!user) return next(400, "Invalid login");
    res.send(user);
}

async function hasUserIdBody(req, res, next){
    if(!req.body.user_id) return next(400, "No user_id query param!");
    const user = await service.getUser(req.body.user_id);
    if(!user) return next(400, "Invalid user_id query param!");
    res.locals.user = user;
    next();
}
async function hasOfferIdBody(req, res, next){
    if(!req.body.offer_id) return next(400, "No offer_id body param!");
    const offer = await offerService.getOffer(req.body.offer_id);
    if(!offer) return next(400, "Invalid offer_id body param!");
    res.locals.offer = offer;
    next();
}

async function followOffer(req, res){
    const data = await service.followOffer(res.locals.user.user_id, res.locals.offer.offer_id);
    res.send(data[0]);
}
async function unfollowOffer(req, res){
    await service.unfollowOffer(res.locals.user.user_id, res.locals.offer.offer_id);
    res.send({message: "ok"});
}

function validateUser(req, res, next){
    const user = req.body;
    const fields = [
        "user_name",
        "user_role",
    ];
    for (const field of fields) {
        if(user[field] === undefined) {
            const message = `Missing field ${field}!`;
            console.log(message);
            return next(400, message);
        }
    }
    res.locals.user = user;
    next();
}

async function postUser(req, res){
    const data = await service.postUser(res.locals.user);
    // console.log(data[0]);
    res.send(data[0]);
}

module.exports = {
    listUsers,
    getUser: [validateUserId, getUser],
    loginUser: [hashPassword, loginUser],
    followOffer: [hasUserIdBody, hasOfferIdBody, followOffer],
    unfollowOffer: [hasUserIdBody, hasOfferIdBody, unfollowOffer],
    postUser: [validateUser, postUser],
};