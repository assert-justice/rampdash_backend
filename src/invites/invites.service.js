const db = require("../db");

const inviteFields = ["invite_id", "invite_status", "invite_code", "user_role", "group_id", "college_id", "invite_uses", "invite_max_uses"];

function listInvites(){
    return db("invites").select(...inviteFields);
}
function getInvite(invite_id){
    return db("invites").select(...inviteFields).where({invite_id}).first();
}
function getInviteByCode(invite_code){
    return db("invites").select(...inviteFields).where({invite_code, invite_status: "pending"}).first();
}
function postInvite(invite){
    return db("invites").insert(invite, inviteFields);
}
function updateInvite(invite){
    const {invite_id} = invite;
    return db("invites").where({invite_id}).update(invite);
}
function deleteInvite(invite_id){
    return db("invites").where({invite_id}).delete();
}
// async function isInviteValid(invite_id){
//     // returns a bool in a promise
//     const invite = await getInvite(invite_id);
//     if(!invite) return false;
// }
// async function incrementInvite(invite_id){}

module.exports = {
    listInvites,
    getInvite,
    getInviteByCode,
    postInvite,
    updateInvite,
    deleteInvite,
}