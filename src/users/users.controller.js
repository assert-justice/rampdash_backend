const service = require("./users.service");
const collegeService = require("../colleges/colleges.service");
const groupService = require("../groups/groups.service");
const bcrypt = require("bcrypt");
// const cookieParser = require("cookie-parser");

async function listUsers(req, res){
    const users = await service.listUsers();
    // TODO: remove the hashed passwords for pete's sake
    for (const user of users) {
        // delete user.user_pwd;
    }
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

function loginUser(req, res, next){
    const requiredFields = ["user_name", "user_pwd"];
    for (const field of requiredFields) {
        if(!req.body[field]) return next(`Required field '${field}' not found!`);
    }
    const {user_name, user_pwd} = req.body;
    service.loginUser(user_name).then(user => {
        if(!user) {
            return next("Invalid user name");
        }
        if(bcrypt.compareSync(user_pwd, user.user_pwd)){
            // create token
            res.cookie("user", user.user_role, {signed: true});
            delete user.user_pwd;
            res.send(user);
        }
        else{
            next("Invalid password!");
        }
    }).catch(next);
}

function validateUser(req, res, next){
    const user = req.body;
    console.log(user);
    const fields = [
        "user_name",
        "user_role",
        "user_email",
    ];
    for (const field of fields) {
        if(user[field] === undefined) {
            const message = `Missing field ${field}!`;
            return next(message);
        }
    }
    // just to be certain. updating passwords is separate
    delete user.user_pwd;
    const {user_role, college_id, group_id} = user;
    res.locals.user = user;
    if(user_role === "admin") return next();
    if(!college_id) return next("No college id provided!");
    const college = collegeService.getCollege(college_id);
    if(!college) return next("No such college!");
    res.locals.college = college;
    if(group_id === undefined){
        return next();
    }
    // const group = groupService.getCollege(user.group_id);
    // if(!college) return next("no such group");
    // if(group.college_id !== user.college_id) return next("user college and group college do not match");
    // res.locals.group = group;
    next();
}

async function updatePassword(req, res, next){
    // get account, make sure it's activated
    // hash that sucker
    const user = res.locals.user;
    const {user_id, user_pwd, /*user_email, user_name*/} = user;
    // if(!user_id) return next("Missing user id!");
    // const user = await service.getUser(user_id);
    // if(!user) return next("Invalid user id!");
    // if(user.user_activated) return next("User has already been activated!");
    if(!user_pwd) return next("User password is required");
    // set active
    // user.user_activated = true;
    const saltRounds = 10;
    bcrypt.hash(user_pwd, saltRounds).then(hash => {
        user.user_pwd = hash;
        service.updateUser(user)
            .then(()=>res.send({message: "ok"}))
            .catch(e=>{
                next(e);
            });
    });
}

function postUser(req, res, next){
    res.locals.user.user_activated = false;
    service.postUser(res.locals.user).then(data => res.send(data[0])).catch(next);
}
async function activateUser(req, res, next){
    const {user_id, user_pwd, /*user_email, user_name*/} = req.body;
    if(!user_id) return next("Missing user id!");
    const user = await service.getUser(user_id);
    if(!user) return next("Invalid user id!");
    if(user.user_activated) return next("User has already been activated!");
    if(!user_pwd) return next("User password is required");
    // set active
    user.user_activated = true;
    const saltRounds = 10;
    bcrypt.hash(user_pwd, saltRounds).then(hash => {
        user.user_pwd = hash;
        service.updateUser(user)
            .then(()=>res.send({message: "ok"}))
            .catch(e=>{
                next(e);
            });
    });
}

function updateUser(_, res, next){
    console.log(res.locals.user);
    service.updateUser(res.locals.user)
        .then(res.send({message: "ok"}))
        .catch(e => next(e));
}

function deleteUser(_, res, next){
    service.deleteUser(res.locals.user.user_id)
        .then(()=>res.send({message: "ok"}))
        .catch(next);
}

module.exports = {
    listUsers,
    getUser: [validateUserId, getUser],
    updatePassword: [validateUserId, updatePassword],
    loginUser,
    postUser: [validateUser, postUser],
    updateUser: [validateUser, updateUser],
    activateUser,
    deleteUser: [validateUserId, deleteUser],
};