const service = require("./users.service");
const collegeService = require("../colleges/colleges.service");
const groupService = require("../groups/groups.service");
const inviteService = require("../invites/invites.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require('express-validator');

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
    res.send({user: res.locals.user});
}

function loginUser(req, res, next){
    const requiredFields = ["user_name", "user_pwd"];
    for (const field of requiredFields) {
        if(!req.body[field]) return next(`Required field '${field}' not found!`);
    }
    // console.log(req.body);
    const {user_name, user_pwd} = req.body;
    service.loginUser(user_name).then(user => {
        if(!user) {
            return next("Invalid user name");
        }
        if(bcrypt.compareSync(user_pwd, user.user_pwd)){
            // create token
            const token = jwt.sign({ userId: user.user_id }, process.env.SECRET, { expiresIn: '1h' });
            delete user.user_pwd;
            res.send({user, token});
        }
        else{
            next("Invalid password!");
        }
    }).catch(next);
}

async function updatePassword(req, res, next){
    // get account, make sure it's activated
    // hash that sucker
    const validators = [
        body("user").isObject(),
        body("user.user_pwd").isString().notEmpty().escape(),
        body("user.new_user_pwd").isString().notEmpty().escape(),
    ];
    for (const val of validators) {
        const result = await val.run(req);
        if(!result.isEmpty()){
            const err = result.array()[0];
            const message = `${err.msg} '${err.value}' at path ${err.path}`;
            return next(message);
        }
    }
    const {user_pwd, new_user_pwd} = req.body.user;
    // TODO: confirm old user password is a match
    bcrypt.hash(new_user_pwd, 10).then(hash => {
        res.locals.user.user_pwd = hash;
        service.updateUser(res.locals.user)
            .then(()=>res.send({message: "ok"}))
            .catch(e=>{
                next(e);
            });
    });
}

// function postUser(req, res, next){
//     service.postUser(res.locals.user).then(data => res.send({user: data[0]})).catch(next);
// }
async function activateUser(req, res, next){
    const {invite_code} = req.params;
    let invite;
    if(!invite_code) return next("No invite code");
    try{
        invite = await inviteService.getInviteByCode(invite_code);
    }
    catch(e){
        return next(e);
    }
    if(!invite) return next("Invalid invite");
    // if invite_max_uses is 0 the invite can be used indefinitely
    if(invite.invite_max_uses && invite.invite_uses >= invite.invite_max_uses) return next("Invite uses exceeded!");
    invite.invite_uses++;
    await inviteService.updateInvite(invite);
    const validators = [
        body("user").isObject(),
        body("user.user_name").isString().notEmpty().escape(),
        body("user.user_email").isEmail().escape(),
        body("user.user_pwd").isString().notEmpty(),
    ];
    for (const val of validators) {
        const result = await val.run(req);
        if(!result.isEmpty()){
            const err = result.array()[0];
            const message = `${err.msg} '${err.value}' at path ${err.path}`;
            return next(message);
        }
    }
    const {user} = req.body;
    user.user_role = invite.user_role;
    user.college_id = invite.college_id;
    user.group_id = invite.group_id;
    const {user_pwd} = user;
    bcrypt.hash(user_pwd, 8).then(hash => {
        user.user_pwd = hash;
        service.postUser(user)
            .then(data=>res.send({user: data[0]}))
            .catch(e=>{
                next(e);
            });
    });
}

function updateUser(req, res, next){
    const {user} = req.body;
    if(!user) return next("No user object supplied");
    const fields = [
        "user_name",
        "user_email",
    ];
    if(res.locals.current_user.user_role === "admin") {
        fields.push("user_role");
        fields.push("college_id");
        fields.push("group_id");
    }
    for (const field of fields) {
        if(user[field] !== undefined) res.locals.user[field] = user[field];
    }
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
    // postUser: [validateUser, postUser],
    loginUser,
    updateUser: [validateUserId, updateUser],
    updatePassword: [validateUserId, updatePassword],
    activateUser,
    deleteUser: [validateUserId, deleteUser],
};