const userDb = require("../modules/database.js");

function addUserToLocals(req, res, next) {
    const user = userDb.getUserWithAuthToken(req.cookies.authToken);
    res.locals.user = user;
    next();
}

function verifyAuthenticated(req, res, next) {
    if (res.locals.user) {
        next();
    }
    else {
        res.redirect("./user_login");
    }
}

module.exports = {
    addUserToLocals,
    verifyAuthenticated
}