const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const userDao = require("../modules/users-dao.js");
const { generateAuthToken } = require('../modules/users-dao.js');
const { retrieveUserByUsername } = require("../modules/users-dao.js");
const { addUserToLocals } = require("../middleware/auth-middleware.js");

router.get("/user_login", async function (req, res) {
    // res.clearCookie("toastMessage");
    res.render("user_login");
});

router.post("/user_login", async function (req, res) {
    // Get the username and password submitted in the form
    console.log("has entered password");
    const username = req.body.username;
    const password = req.body.password;

    // Find a matching user in the database
    const user = await retrieveUserByUsername(username);
    console.log("user after calling retrieveUserByUsername:", user);
    // Check if there's a matching user
    if (!user) {
        // res.setToastMessage("Username does not exist!");
        res.render("user_login", { toastMessage: "Username does not exist!" });
        return;
    }

    // Check if the password matches
    if (!(await bcrypt.compare(password, user.Password))) {
        // res.setToastMessage("Incorrect password entered!");
        res.render("user_login", { toastMessage: "Incorrect password entered!" });
        return;
    }

    const authToken = generateAuthToken();

    // Update user in database with new authToken
    user.authToken = authToken;
    await userDao.updateUser(user);

    // Set the authToken cookie
    res.cookie("authToken", user.authToken);
    res.setToastMessage("Login successful!");

    res.locals.user = user;
    res.redirect("/");

});

router.post("/api/user_login", async function (req, res) {
    // Get the username and password submitted in the form
    console.log("has entered password");
    const username = req.body.username;
    const password = req.body.password;

    // Find a matching user in the database
    const user = await retrieveUserByUsername(username);
    console.log("user after calling retrieveUserByUsername:", user);
    // Check if there's a matching user
    if (!user) {
        //If unsuccessful, instead a 401 response should be returned.
        res.status(401).send("Username does not exist!");
        return;
    }

    // Check if the password matches
    if (!(await bcrypt.compare(password, user.Password))) {
        //If unsuccessful, instead a 401 response should be returned.
        res.status(401).send("Incorrect password entered!");
        return;
    }

    const authToken = generateAuthToken();

    // Update user in database with new authToken
    user.authToken = authToken;
    await userDao.updateUser(user);
    //If authentication is successful, a 204 response should be returned
    res.status(204).json({ authToken: user.authToken })
    // Set the authToken cookie
    res.cookie("authToken", user.authToken);
    

    res.locals.user = user;
    res.status(200).send("Login successful!");
    

});


router.get("/logout", function (req, res) {
    res.clearCookie("authToken");
    res.locals.user = null;
    res.redirect("/");
});

router.get("/api/logout", function (req, res) {
    // a user should be logged out (presumably by
    // deleting their authentication token that was created above). Then, a 204 response should be
    // returned.
    res.clearCookie("authToken");
    res.locals.user = null;
    res.status(204).send("Logout successful!");
});


router.get("/create-account", function (req, res) {
    res.render("create_account");
})

router.post("/create_account", async function (req, res) {
    const user = {
        Username: req.body.username,
        Brief_Description: req.body.Brief_Description,
        Password: req.body.password,
        repassword: req.body.repassword,
        Date_Of_Birth: req.body.birthdate,
        Real_Name: req.body.idname,
        Avatar: req.body.icon,
        Is_Admin: false,
    };

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(user.Password, saltRounds);
        user.Password = hashedPassword;

        // Create the user
        const createdUser = await userDao.createUser(user);
        res.setToastMessage("User was successfully created");
        console.log("createdUser after calling createUser:", createdUser);
        console.log("User was successfully created: ", createdUser);

        res.redirect("/user_login");
    } catch (err) {
        console.error(err);
        res.setToastMessage(err.message);
        res.render("create_account", { toastMessage: err.message });
    }
});


router.get("/check_username/:username", async function (req, res) {
    const username = req.params.username;
    
    // Check if username already exists in the database
    const existingUser = await userDao.retrieveUserByUsername(username);
    if (existingUser) {
        res.send('Username already exists, please choose another');
    } else {
     res.send('Username is available');
    }
    });

router.get("/edit_check_username/:username", addUserToLocals, async function (req, res) {
    const username = req.params.username;
    const originalUsername = res.locals.user.Username;
    // Check if username already exists in the database
    const existingUser = await userDao.retrieveUserByUsername(username);
    if (existingUser) {
        if(username === originalUsername){
            res.send('This is your current username');
        }else{
            res.send('Username already exists, please choose another');
        }
    } else {
        res.send('Username is available');
    }
    });
module.exports = router;