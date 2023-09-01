
const userDao = require("../modules/users-dao.js");

async function addUserToLocals(req, res, next) {
  const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);

  res.locals.user = user;

  next();
}
  

module.exports = {
  addUserToLocals
};
