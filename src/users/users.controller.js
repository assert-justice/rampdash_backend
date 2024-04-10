const service = require("./users.service");

async function listUsers(req, res){
    const users = await service.listUsers();
    res.send(users);
}

async function validateUserId(req, res, next){
    const {user_id} = req.params;
    if(!user_id) return next("no user id provided");
    // check if id exists
    const user = await service.getUser(user_id);
    if(!user) return next("no such user");
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
        if(!req.body[field]) return next(`Required field '${field}' not found!`);
    }
    const user = await service.loginUser(req.body.user_name, null);
    console.log(user)
    if(!user) return next("Invalid login");
    res.send(user);
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
            return next(message);
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
    postUser: [validateUser, postUser],
};