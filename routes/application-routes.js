const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");

const articleDao = require("../modules/article-dao.js");
const user_loginDao = require("../modules/user_login-dao.js");
const userDao = require("../modules/users-dao.js");

router.get("/", async function(req, res) {
    console.log("enter home appage");
    res.locals.title = "My route title!";
    res.locals.allData = await articleDao.getArticleByArticleID(1);

    res.render("home");
});

router.get("/user_login", async function(req, res) {

    res.render("user_login");
});

router.post("/user_login", async function(req, res) {
    
     // Get the username and password submitted in the form
     const username = req.body.username;
     const password = req.body.password;
 
     // Find a matching user in the database
     const user = await userDao.retrieveUserWithCredentials(username, password);
 
     // if there is a matching user...
     if (user) {
         // Auth success - give that user an authToken, save the token in a cookie, and redirect to the homepage.
         const authToken = uuid();
         user.authToken = authToken;
         await userDao.updateUser(user);
         res.cookie("authToken", authToken);
         res.locals.user = user;
         res.redirect("/");
     }
 
     // Otherwise, if there's no matching user...
     else {
         // Auth fail
         res.locals.user = null;
         res.setToastMessage("Authentication failed!");
         res.redirect("./user_login");
     }

    res.render("user_login");
});

module.exports = router;