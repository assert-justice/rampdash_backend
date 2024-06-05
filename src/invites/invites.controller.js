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
// crud
function listInvites(req, res, next){
    service.listInvites().then(data => res.send(data)).catch(e => next(e));
}
function getInvite(req, res, next){
    res.send(res.locals.invite);
}
async function postInvite(req, res, next){
    const {invite} = req.body;
    if(!invite) return next("No invite provided");
    const validators = [
        body("invite.user_role").isString().notEmpty().escape(),
        body("invite.college_id").optional().isNumeric(),
        body("invite.group_id").optional().isNumeric(),
    ];
    for (const val of validators) {
        const result = await val.run(req);
        if(!result.isEmpty()){
            const err = result.array()[0];
            const message = `${err.msg} '${err.value}' at path ${err.path}`;
            return next(message);
        }
    }
    invite.invite_status = "pending";
    invite.invite_code = crypto.randomUUID();
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
    // getInviteByCode: [validateInviteCode, getInvite],
    postInvite,
    deleteInvite: [validateInviteId, deleteInvite],
}