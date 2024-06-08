const jwt = require("jsonwebtoken");
const usersService = require("./users/users.service");

function isLoggedIn(req, res, next){
    const {token} = req.query;
    // console.log("token", token);
    if(!token){
        return next("Cannot authorize, no token supplied");
    }
    jwt.verify(token, process.env.SECRET, (err, tokenData)=>{
        if(err) {
            // console.log("err:", err);
            return next("Cannot authorize, invalid token");
        }
        usersService.getUser(tokenData.userId)
            .then(user => {
                res.locals.current_user = user
                next();
            }).catch(e => next(e));
    });
}

function isAdmin(req, res, next){
    const {current_user} = res.locals;
    if (current_user.user_role !== "admin")return next("Cannot authorize, user is not admin");
    next();
}
function isSelf(req, res, next){
    const {user_id} = req.params;
    if(!user_id) return next("No user id supplied!");
    const {current_user} = res.locals;
    if(user_id !== current_user.user_id) return next("Unauthorized user");
    next();
}

function isSelfOrAdmin(req, res, next){
    const {user_id} = req.params;
    if(!user_id) return next("No user id supplied!");
    const {current_user} = res.locals;
    // console.log(user_id, current_user, user_id !== current_user.user_id);
    if(current_user.user_role !== "admin" && +user_id !== current_user.user_id) return next("Unauthorized user");
    next();
}

module.exports = {
    isLoggedIn,
    isAdmin: [isLoggedIn, isAdmin],
    isSelf: [isLoggedIn, isSelf],
    isSelfOrAdmin: [isLoggedIn, isSelfOrAdmin],
}