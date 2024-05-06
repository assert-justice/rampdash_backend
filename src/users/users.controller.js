const service = require("./users.service");
const collegeService = require("../colleges/colleges.service");
const groupService = require("../groups/groups.service");

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
    await service.loginUser(req.body.user_name, null).then(user => {
        if(!user) return next("Invalid login");
        res.send(user);
    }).catch(next);
}

function validateUser(req, res, next){
    const user = req.body;
    const fields = [
        "user_name",
        "user_role",
        // "college_id",
    ];
    for (const field of fields) {
        if(user[field] === undefined) {
            const message = `Missing field ${field}!`;
            return next(message);
        }
    }
    res.locals.user = user;
    if(user.user_role === "admin") return next();
    const college = collegeService.getCollege(user.college_id);
    if(!college) return next("no such college");
    res.locals.college = college;
    if(user.group_id === undefined){
        return next();
    }
    // const group = groupService.getCollege(user.group_id);
    // if(!college) return next("no such group");
    // if(group.college_id !== user.college_id) return next("user college and group college do not match");
    // res.locals.group = group;
    next();
}

function postUser(req, res, next){
    service.postUser(res.locals.user).then(data => res.send(data[0])).catch(next);
}

module.exports = {
    listUsers,
    getUser: [validateUserId, getUser],
    loginUser: [hashPassword, loginUser],
    postUser: [validateUser, postUser],
};