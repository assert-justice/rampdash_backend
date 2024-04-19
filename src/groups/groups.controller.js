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
    const group = await service.getgroup(group_id);
    if(!group) return next("no such group");
    res.locals.group = group;
    next();
}

async function getGroup(req, res){
    res.send(res.locals.group);
}

async function deleteGroup(req, res){
    await service.deleteGroup(res.locals.group.group_id);
    res.send({message: "ok"});
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
            console.log(message);
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

async function postGroup(req, res){
    const data = await service.postGroup(res.locals.group);
    res.send(data[0]);
}
async function updateGroup(req, res){
    await service.postGroup(res.locals.group);
    res.send({message: "ok"});
}

module.exports = {
    listGroups,
    getGroup: [validateGroupId, getGroup],
    deleteGroup: [validateGroupId, deleteGroup],
    postGroup: [validateGroup, postGroup],
    updateGroup: [validateGroup, updateGroup],
};