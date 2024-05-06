const service = require("./colleges.service");

async function listColleges(req, res){
    let colleges = await service.listColleges();
    res.send(colleges);
}

async function validateCollegeId(req, res, next){
    const {college_id} = req.params;
    if(!college_id) return next("no college id provided");
    // check if id exists
    const college = await service.getCollege(college_id);
    if(!college) return next("no such college");
    res.locals.college = college;
    next();
}

async function getCollege(req, res){
    res.send(res.locals.college);
}

function deleteCollege(req, res, next){
    service.deleteCollege(res.locals.college.college_id)
        .then(()=>res.send({message: "ok"}))
        .catch(next)
}

function validateCollege(req, res, next){
    const college = req.body;
    const fields = [
        "college_name",
        "college_logo",
    ];
    for (const field of fields) {
        if(college[field] === undefined) {
            const message = `Missing field ${field}!`;
            return next(message);
        }
    }
    res.locals.college = college;
    next();
}

function postCollege(req, res, next){
    service.postCollege(res.locals.college)
        .then(data=>res.send(data[0]))
        .catch(next);
}
function updateCollege(req, res){
    service.updateCollege(res.locals.college)
        .then(()=>res.send({message: "ok"}))
        .catch(next)
}

module.exports = {
    listColleges,
    getCollege: [validateCollegeId, getCollege],
    deleteCollege: [validateCollegeId, deleteCollege],
    postCollege: [validateCollege, postCollege],
    updateCollege: [validateCollege, updateCollege],
};