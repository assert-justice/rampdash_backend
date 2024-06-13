const service = require("./invites.service");
const { body, validationResult } = require('express-validator');

// middleware
function validateInviteId(req, res, next){
    const {invite_id} = req.params;
    if(!invite_id) return next("No invite id provided");
    service.getInvite(invite_id).then(invite => {
        res.locals.invite = invite;
        next();
    }).catch(next);
}
function validateInviteCode(req, res, next){
    const {invite_code} = req.params;
    if(!invite_code) return next("No invite id provided");
    service.getInviteByCode(invite_code).then(invite => {
        res.locals.invite = invite;
        next();
    }).catch(next);
}
// crud
function listInvites(req, res, next){
    service.listInvites().then(data => res.send(data)).catch(e => next(e));
}
function getInvite(req, res, next){
    res.send(res.locals.invite);
}
async function postInvite(req, res, next){
    if(req.body.college_id === null) req.body.college_id = undefined;
    if(req.body.group_id === null) req.body.group_id = undefined;
    const validators = [
        body("invite").isObject(),
        body("invite.user_role").isString().notEmpty().escape(),
        body("invite.invite_code").isString().notEmpty().escape(),
        body("invite.invite_max_uses").isNumeric(),
        // body("invite.college_id").optional().isNumeric(),
        // body("invite.group_id").optional().isNumeric(),
    ];
    for (const val of validators) {
        const result = await val.run(req);
        if(!result.isEmpty()){
            const err = result.array()[0];
            const message = `${err.msg} '${err.value}' at path ${err.path}`;
            return next(message);
        }
    }
    const {invite} = req.body;
    invite.invite_uses = 0;
    invite.invite_status = "pending";
    // invite.invite_code = crypto.randomUUID();
    //TODO: check for key collisions properly
    service.postInvite(invite).then(invite => res.send({invite: invite[0]})).catch(next);
}

// TODO: update invite

function deleteInvite(req, res, next){
    const {invite_id} = res.locals.invite;
    service.deleteInvite(invite_id).then(()=>res.send({message: "ok"})).catch(next);
}

module.exports = {
    listInvites,
    getInvite: [validateInviteId, getInvite],
    getInviteByCode: [validateInviteCode, getInvite],
    postInvite,
    deleteInvite: [validateInviteId, deleteInvite],
}