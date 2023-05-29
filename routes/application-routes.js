const express = require("express");
const router = express.Router();
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