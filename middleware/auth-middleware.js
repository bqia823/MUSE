
const userDao = require("../modules/users-dao.js");

async function addUserToLocals(req, res, next) {
  //获取客户端cookies
  const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
 
  res.locals.user = user;

  next();
}
    


// function VerifyAuthenticated(req, res, next) {
//   if (res.locals.user) {
//     next();
//   } else {
//     res.redirect("./login");
//   }
// }

module.exports = {
  addUserToLocals
  // VerifyAuthenticated
};
