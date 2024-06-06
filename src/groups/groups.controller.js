const service = require("./groups.service");
const collegesService = require("../colleges/colleges.service");
const { body, validationResult } = require('express-validator');

async function listGroups(req, res){
    const {college_id} = req.query;
    if(college_id === undefined) service.listGroups().then(groups => res.send(groups));
    else service.listCollegeGroups(college_id).then(groups => res.send(groups));
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
    res.send({group: res.locals.group});
}

function deleteGroup(req, res, next){
    service.deleteGroup(res.locals.group.group_id)
        .then(()=>res.send({message: "ok"}))
        .catch(next);
}

async function validateGroup(req, res, next){
    const {group} = req.body;
    if(!group) return next("No group provided");
    const validators = [
        body("group.group_name").isString().notEmpty().escape(),
        body("group.college_id").isNumeric(),
    ];
    for (const val of validators) {
        const result = await val.run(req);
        if(!result.isEmpty()){
            const err = result.array()[0];
            const message = `${err.msg} '${err.value}' at path ${err.path}`;
            return next(message);
        }
    }
    // const group = req.body;
    // const fields = [
    //     "group_name",
    //     "college_id",
    // ];
    // for (const field of fields) {
    //     if(group[field] === undefined) {
    //         const message = `Missing field ${field}!`;
    //         return next(message);
    //     }
    // }
    collegesService.getCollege(group.college_id).then(college => {
        if(!college) return next("no such college");
        res.locals.group = group;
        res.locals.college = college;
        next();
    })
    .catch(e => next(e))
    // check college id exists
    // const college = collegesService.getCollege(group.college_id);
    // console.log(college);
    // if(!college) return next("no such college");
    // res.locals.group = group;
    // res.locals.college = college;
    // next();
}

function postGroup(req, res, next){
    service.postGroup(res.locals.group)
        .then(data => res.send({group: data[0]}))
        .catch(next);
}
function updateGroup(req, res, next){
    const {group} = req.body;
    const fields = [
        "group_name",
        "college_id",
    ];
    for (const field of fields) {
        if(group[field] !== undefined) res.locals.group[field] = group[field];
    }
    service.updateGroup(res.locals.group)
        .then(()=>{
            res.send({message: "ok"})
        })
        .catch(next);
}

module.exports = {
    listGroups,
    getGroup: [validateGroupId, getGroup],
    deleteGroup: [validateGroupId, deleteGroup],
    postGroup: [validateGroup, postGroup],
    updateGroup: [validateGroupId, updateGroup],
};