const service = require("./groups.service");
const collegesService = require("../colleges/colleges.service");

async function listGroups(req, res){
    let groups = await service.listgroups();
    res.send(groups);
}

async function validateGroupId(req, res, next){
    const {group_id} = req.params;
    if(!group_id) return next("no group id provided");
    // check if id exists
    const group = await service.getGroup(group_id);
    if(!group) return next("no such group");
    res.locals.group = group;
    next();
}

function getGroup(req, res){
    res.send(res.locals.group);
}

function deleteGroup(req, res, next){
    service.deleteGroup(res.locals.group.group_id)
        .then(()=>res.send({message: "ok"}))
        .catch(next);
}

function validateGroup(req, res, next){
    const group = req.body;
    const fields = [
        "group_title",
        "college_id",
    ];
    for (const field of fields) {
        if(group[field] === undefined) {
            const message = `Missing field ${field}!`;
            return next(message);
        }
    }
    // check college id exists
    const college = collegesService.getCollege(group.college_id);
    if(!college) return next("no such college");
    res.locals.group = group;
    res.locals.college = college;
    next();
}

function postGroup(req, res, next){
    service.postGroup(res.locals.group)
        .then(data => res.send(data[0]))
        .catch(next);
}
function updateGroup(req, res, next){
    service.postGroup(res.locals.group)
        .then(()=>res.send({message: "ok"}))
        .catch(next);
}

module.exports = {
    listGroups,
    getGroup: [validateGroupId, getGroup],
    deleteGroup: [validateGroupId, deleteGroup],
    postGroup: [validateGroup, postGroup],
    updateGroup: [validateGroup, updateGroup],
};