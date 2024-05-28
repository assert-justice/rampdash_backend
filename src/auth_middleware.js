
function isLoggedIn(req, res, next){
    next();
}

function isAdmin(req, res, next){
    next();
}
function isUser(req, res, next){
    next();
}

module.exports = {
    isLoggedIn,
    isAdmin,
    isUser,
}