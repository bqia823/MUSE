const express = require("express");
const router = express.Router();

const testDao = require("../modules/test-dao.js");
const likeDao = require("../modules/like-dao.js");
const userDao = require("../modules/userDao.js");
const articleDao = require("../modules/article-dao.js");

router.get("/", async function(req, res) {

    res.locals.title = "My route title!";
    // res.locals.allTestData = await testDao.retrieveAllTestData();

    res.render("home_page_user");
});

router.get("/profile", async function(req, res) {
    console.log("entering /profile...");
    res.locals.title = "My Profile";

    // For testing only
    const userID = 1; // Set this only for testing

    try {
        // Get user profile data from the database
        const userProfile = await userDao.getUserProfile(userID);

        //get the articles associated with the user
        // const articles = await userDao.getUserArticles(userID);

        // Render the profile page template
        res.render('profile', { 
            // layout: false, // Disable layout file
            userProfile: userProfile.user,
            articles: userProfile.articles // Pass the articles to the template
        });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error in /profile route:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/notification", async function(req, res) {
    console.log("entering /notification...");
    const userID = 2; // Replace this with req.user.id or similar, depending on the auth setup later

    try {
        const userProfile = await userDao.getUserProfile(userID);
        const notifications = await userDao.getNotifications(userID);
        
        res.render("notification", {
            userProfile: userProfile,
            notifications: notifications,
        });
    } catch (error) {
        console.error('Error in /notification route:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/logout", async function(req, res) {
    console.log("entering /logout...");
    const userID = 1; // Replace this with req.user.id or similar, depending on the auth setup later

    try {
        res.render("home_page_visitor");

    } catch (error) {
        console.error('Error in /logout route:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get("/createArticle", async function(req, res) {
    console.log("entering /createArticle...");
    const userID = 1; // Replace this with req.user.id or similar, depending on the auth setup later

    try {
        res.render("create-article");

    } catch (error) {
        console.error('Error in /createArticle:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/articleView/:Article_ID", async function(req, res) {   
    console.log("entering article view...");
    //测试，获取文章ID=2，
    const Article_ID = req.params.Article_ID;
    const article = await articleDao.getArticleByArticleID(Article_ID);
    res.locals.article = article;
    console.log("article: ", article);

    res.locals.author = await articleDao.getAuthorNameByArticleID(Article_ID);
    res.locals.authorAvatar = await articleDao.getAuthorAvatarByArticleID(Article_ID);
   
    const likerIDArray = await likeDao.getLikerByArticleID(Article_ID);
    console.log("likerIDArray: ", likerIDArray);

    if(res.locals.user){
        console.log("判断：有users对象储存在本地");
        if(likerIDArray.map(item => item.User_ID).includes(res.locals.user.User_ID)){
            console.log("判断：点赞这篇文章的所有用户ID里面有当前用户的ID");
            res.locals.likeIcon = "/images/liked.png";
        }else{
            console.log("判断：点赞这篇文章的所有用户ID里面没有当前用户的ID");
            res.locals.likeIcon = "/images/like.png";
        }
    }else{
        console.log("判断：没有users对象储存在本地");
        res.locals.likeIcon = "/images/like.png";
    }

    res.render("article_View");
});

  router.get("/authorpage/:id", async function(req, res) {
    console.log("entering /authorpage...");
    const userID = req.params.id;

    try {
        // Get user profile data from the database
        const userProfile = await userDao.getUserProfile(userID);

        //get the articles associated with the user
        const articles = await userDao.getUserArticles(userID);

        // Render the profile page template
        res.render('profile', { 
            userProfile: userProfile.user,
            articles: userProfile.articles, // Pass the articles to the template
            isAuthorPage: true // This variable is used to control whether to show buttons and Real_name or not
        });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error in /authorpage route:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/user/:user_id", async function(req, res) {
    console.log("entering /user/:user_id...");
    const user_id = req.params.user_id;
    const user = await userDao.getUserProfile(user_id);
    res.render("profile", { user: user, hideButtons: true, hideRealName: true });
});

router.get("/analytics", function(req, res) {
    console.log("entering /analytics...");
    res.render("analytics");
});

// Route handler for rendering the edit account page
router.get("/edit-account", async function(req, res) {
    console.log("entering /edit-account...");
    res.locals.title = "Edit Account";
  
    try {
      // Retrieve the user profile data
      const userID = 1; // Testing with the actual user ID
      const userProfile = await userDao.getUserProfile(userID);
  
      // Render the edit account page template and pass the user profile data
      res.render('edit_account', {
        userProfile: userProfile.user
      });
    } catch (error) {
      console.error('Error in /edit-account route:', error);
      res.status(500).send('Internal Server Error');
    }
  });

router.post("/edit_account", async function (req, res) {
    console.log("entering /edit_account...");
    res.locals.title = "Edit Account";

    try {
      // Retrieve the form data
      const userProfileData = {
        username: req.body.username,
        description: req.body.Brief_Description,
        password: req.body.password,
        birthdate: req.body.birthdate,
        idname: req.body.idname,
        icon: req.body.icon,
      };
  
      // Update the user profile
      await userDao.updateUserProfile(1, userProfileData); // Assuming the user ID is 1 for testing purposes
      console.log('User Profile Data:', userProfileData);
  
      res.setToastMessage("User profile updated successfully");
      res.redirect("/profile");
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.setToastMessage("Failed to update user profile");
      res.redirect("/profile");
    }
  });

// router.post("/edit_account", async function(req, res) {
//     const userID = 1; // test with the actual user ID

//     // Retrieve the updated user profile data from the form
//     const updatedProfile = {
//         id: userID,
//         username: req.body.username,
//         description: req.body.description,
//         confirmpassword: req.body.confirmpassword,
//         password: req.body.password,
//         birthdate: req.body.birthdate,
//         idname: req.body.idname,
//         icon: req.body.icon
//     };

//     // Update the user profile in the database
//     try {
//         await userDao.updateUserProfile(updatedProfile);
//         res.setToastMessage("User profile updated successfully!");
//         res.redirect("/profile");
//     } catch (error) {
//         console.error('Error updating user profile:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

router.get("/createArticle", function(req, res) {
    console.log("entering /create-article...");
    res.render("create-article");
});


module.exports = router;
