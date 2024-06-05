const service = require("./colleges.service");
const { body, validationResult } = require('express-validator');

async function listColleges(req, res){
    let colleges = await service.listColleges();
    res.send(colleges);
}

async function validateCollegeId(req, res, next){
    const {college_id} = req.params;
    if(!college_id) return next("no college id provided");
    // check if id exists
    service.getCollege(college_id).then(college => {
        if(!college) return next("no such college");
        res.locals.college = college;
        next();
    }).catch(next);
    // if(!college) return next("no such college");
    // res.locals.college = college;
    // next();
}

async function getCollege(req, res){
    res.send({college: res.locals.college});
}

function deleteCollege(req, res, next){
    service.deleteCollege(res.locals.college.college_id)
        .then(()=>res.send({message: "ok"}))
        .catch(next)
}

async function validateCollege(req, res, next){
    const {college} = req.body;
    if(!college) return next("No college provided");
    const validators = [
        body("college.college_name").isString().notEmpty().escape(),
        body("college.college_logo").isURL().notEmpty().escape(),
    ];
    for (const val of validators) {
        const result = await val.run(req);
        if(!result.isEmpty()){
            const err = result.array()[0];
            const message = `${err.msg} '${err.value}' at path ${err.path}`;
            return next(message);
        }
    }
    res.locals.college = college;
    next();
}

function postCollege(req, res, next){
    service.postCollege(res.locals.college)
        .then(data=>res.send({college: data[0]}))
        .catch(next);
}
function updateCollege(req, res, next){
    const {college} = req.body;
    if(!college) return next("No college in body");
    const fields = [
        "college_name",
        "college_logo",
    ];
    // console.log(college);
    // console.log(res.locals.college);
    for (const field of fields) {
        if(college[field] !== undefined) res.locals.college[field] = college[field];
    }
    // console.log(res.locals.college);
    service.updateCollege(res.locals.college)
        .then(()=>res.send({message: "ok"}))
        .catch(next)
}

module.exports = {
    listColleges,
    getCollege: [validateCollegeId, getCollege],
    deleteCollege: [validateCollegeId, deleteCollege],
    postCollege: [validateCollege, postCollege],
    updateCollege: [validateCollegeId, updateCollege],
};