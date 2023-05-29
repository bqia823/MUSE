const express = require("express");
const router = express.Router();

const { v4: uuid } = require("uuid");

const articleDao = require("../modules/article-dao.js");
const likeDao = require("../modules/like-dao.js");
const commentDao = require("../modules/comment-dao.js");
const userDao = require("../modules/users-dao.js");
const sarahArticleDao = require("../modules/sarah-articles-dao.js");
const sarahCommentDao = require("../modules/sarah-comment-dao.js");
const sarahNotificationDao = require("../modules/sarah-notifications-dao.js");
const notificationDao = require("../modules/notification-dao.js");

const { addUserToLocals } = require("../middleware/auth-middleware.js");


router.get("/user_info", addUserToLocals, async function(req, res) {
  console.log("entering user_info route...");

  if(res.locals.user){
      res.json(res.locals.user);
  }else{
      const user = {
          User_ID: null
      }
      res.json(user);
  }

});

router.get("/api/users", addUserToLocals, async function(req, res) {
  if(res.locals.user || res.locals.user.Is_Admin){
     res.status(401).send("Unauthorized");
  }else{
//     an array of all users should be returned, as JSON.
      const users = await userDao.getAllUsers();
      res.json(users);
  }
     

});

router.get("/", addUserToLocals, function (req, res) {
    if (res.locals.user) {
      res.redirect("/home/1/publishTime");
    } else {
      res.redirect("/home/visitor/1/publishTime");
    }
  });
  
  router.get("/home/visitor/:pages/:sort", addUserToLocals, async function (req, res) {
    console.log("user是" + res.locals.user);
    const page = parseInt(req.params.pages); // 获取页码
    const sort = req.params.sort; // 获取页码
    const pageSize = 15; // 每页显示的文章数量
    //根据页数截取15篇文章
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    //文章排序方式
  
    //Getting all sorted articles
    let allArticles = [];
  
    // allArticles = await sarahArticleDao.getAllArticlesByPublishTime();
  
    if (sort === "authorName") {
      allArticles = await sarahArticleDao.getAllArticlesByAuthorName();
      console.log("articles" + allArticles);
    } else if (sort === "articleTitle") {
      allArticles = await sarahArticleDao.getAllArticlesByTitle();
    } else if (sort === "publishTime") {
      allArticles = await sarahArticleDao.getAllArticlesByPublishTime();
    }
  
    const slicedArticles = allArticles.slice(startIndex, endIndex);
  
    //Setting up page bar view
    const totalPages = parseInt(allArticles.length / 15) + 1;
  
    let pageBar = [];
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pageBar.push(i);
      }
    } else if (totalPages > 3 && page + 2 <= totalPages) {
      for (let i = 1; i < totalPages; i++) {
        if (
          i == page - 2 ||
          i == page - 1 ||
          i == page ||
          i == page + 1 ||
          i == page + 2
        ) {
          pageBar.push(i);
        }
      }
    }
  
    res.locals.pages = pageBar;
  
    for (let i = 0; i < slicedArticles.length; i++) {
      allComments = await sarahCommentDao.getAllCommentById(
        slicedArticles[i].Article_ID
      );
      slicedArticles[i].commentNumber = allComments.length;
      slicedArticles[i].userInformation = await sarahArticleDao.getAuthorByArticleID(
        slicedArticles[i].Article_ID
      );
    }
  
    res.locals.fifteenArticles = slicedArticles;
  
    res.render("home_page_visitor");
  });
  
  // Whenever we navigate to /, verify that we're authenticated. If we are, render the home view.
  router.get("/home/:pages/:sort", addUserToLocals, async function (req, res) {
    if(!res.locals.user){
      res.redirect("/home/visitor/1/publishTime");
    }
    //get current page
    const page = parseInt(req.params.pages); // 获取页码
    //get current sort
    const sort = req.params.sort;
    //show maximum 15 articles per page
    const pageSize = 15;
    //get 15 articles based on current page
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
  
    //Getting all sorted articles
    let allArticles = [];
  
    if (sort === "authorName") {
      allArticles = await sarahArticleDao.getAllArticlesByAuthorName();
    } else if (sort === "articleTitle") {
      allArticles = await sarahArticleDao.getAllArticlesByTitle();
    } else if (sort === "publishTime") {
      allArticles = await sarahArticleDao.getAllArticlesByPublishTime();
    }
  
    const slicedArticles = allArticles.slice(startIndex, endIndex);
  
    //Setting up page bar view
    const totalPages = parseInt(allArticles.length / 15) + 1;
    console.log(`total page is ${totalPages}`);
  
    let pageBar = [];
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pageBar.push(i);
      }
    } else if (totalPages > 3 && page + 2 <= totalPages) {
      for (let i = 1; i < totalPages; i++) {
        if (
          i == page - 2 ||
          i == page - 1 ||
          i == page ||
          i == page + 1 ||
          i == page + 2
        ) {
          pageBar.push(i);
        }
      }
    }
  
    res.locals.pages = pageBar;
  
    //Getting three most rescent notifications
    // const notificationList = await notificationDao.getAllNotificationByUserID(res.locals.user.User_ID);
    if(res.locals.user){
    const notifications = await sarahNotificationDao.getThreeNotifications(res.locals.user.User_ID);
    
   
  
    for (let i = 0; i < notifications.length; i++) {
      notifications[i].userInformation =
        await sarahNotificationDao.getSenderByNotificationID(notifications[i].Notification_ID);
    }
    //获得所有未读通知数量
    const unreadNotificationsCount = await sarahNotificationDao.getUnreadNotificationCountByUserID(res.locals.user.User_ID);
    res.locals.unreadNotificationsCount = unreadNotificationsCount;
    res.locals.notifications = notifications;
    //判断是否有未读通知
    if(unreadNotificationsCount.count > 0){
      console.log("有未读通知");
      res.locals.hasUnreadNotifications = true;
      }
   
  }

    //Getting all articles on one page
    const user = res.locals.user;
    for (let i = 0; i < slicedArticles.length; i++) {
      allComments = await sarahCommentDao.getAllCommentById(
        slicedArticles[i].Article_ID
      );
      slicedArticles[i].commentNumber = allComments.length;
      slicedArticles[i].userInformation = await sarahArticleDao.getAuthorByArticleID(
        slicedArticles[i].Article_ID
      );
      const liker = sarahArticleDao.getLikerByArticleID(slicedArticles[i].Article_ID);
        if(res.locals.user){
            if (user.User_ID === liker.User_ID) {
                slicedArticles[i].like = "liked.png";
            } else {
                slicedArticles[i].like = "like.png";
            }
        }
    }
    res.locals.fifteenArticles = slicedArticles;
    if(res.locals.user){
      const fourArticles = await sarahArticleDao.getMyArticles(4, user.User_ID);

          for (let i = 0; i < fourArticles.length; i++) {
          fourArticles[i].user = await sarahArticleDao.getAuthorByArticleID(fourArticles[i].Article_ID);
          }
      
    
      res.locals.fourArticles = fourArticles;
    }
    res.render("home_page_user");
  });


module.exports = router;