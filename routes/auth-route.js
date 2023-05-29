const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const userDao = require("../modules/users-dao.js");
const { generateAuthToken } = require('../modules/users-dao.js');
const { retrieveUserByUsername } = require("../modules/users-dao.js");

router.get("/user_login", async function (req, res) {
    res.clearCookie("toastMessage");
    res.render("user_login");
});

router.post("/user_login", async function (req, res) {
    // Get the username and password submitted in the form
    console.log("已输入密码");
    const username = req.body.username;
    const password = req.body.password;

    // Find a matching user in the database
    const user = await retrieveUserByUsername(username);
    console.log("user after calling retrieveUserByUsername:", user);
    // Check if there's a matching user
    if (!user) {
        res.setToastMessage("Username does not exist!");
        res.render("user_login");
        return;
    }

    // Check if the password matches
    if (!(await bcrypt.compare(password, user.Password))) {
        res.setToastMessage("Incorrect password entered!");
        res.render("user_login");
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



router.get("/logout", function (req, res) {
    res.clearCookie("authToken");
    res.locals.user = null;
    res.redirect("/");
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
        if (!(user.Username.length >= 3 && user.Username.length <= 10)) {
            throw new Error('Please limit username to 3-10 characters');
        }
        // Check if username already exists in the database
        const existingUser = await userDao.retrieveUserByUsername(user.Username);
        if (existingUser) {
            throw new Error('Username already exists, please choose another');
        }
        if (!(user.Brief_Description.length >= 1 && user.Brief_Description.length <= 50)) {
            throw new Error('Please describe yourself in 50 words');
        }
        if (user.Password.length < 1) {
            throw new Error('Password at least 1 characters');
        }
        if (user.Password !== user.repassword) {
            throw new Error('The passwords entered twice are inconsistent');
        }

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
        res.render("create_account");
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
module.exports = router;