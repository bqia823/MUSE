const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();

const articleDao = require("../modules/article-dao.js");
const createArticleDao = require("../modules/create-article-dao.js");
const sarahNotificationDao = require("../modules/sarah-notifications-dao.js");
const notificationDao = require("../modules/notification-dao.js");
// const newArticleNotificationDao = require('../modules/notification-new-article-dao.js');

const { addUserToLocals } = require("../middleware/auth-middleware.js");
const { getFollowersByUserID } = require("../modules/create-article-dao.js");

const upload = require("../middleware/multer-uploader.js"); // 导入 multer 上传中间件
const fs = require("fs");
const path = require("path");


router.get("/create_article", addUserToLocals, async function (req, res) {
  console.log("enter create_article");
  // //get notification unread number渲染出未读通知数量
  // const allNotifications = await notificationDao.getAllNotificationByUserID(res.locals.user.User_ID);
  // res.locals.unReadComment = allNotifications.length;

   // 获得三个提醒项
   if(res.locals.user){
    const notifications = await sarahNotificationDao.getThreeNotifications(res.locals.user.User_ID);  
    for (let i = 0; i < notifications.length; i++) {
    notifications[i].userInformation =
        await sarahNotificationDao.getSenderByNotificationID(notifications[i].Notification_ID);
    }
      //获得所有未读通知数量
      const unreadNotificationsCount = await sarahNotificationDao.getUnreadNotificationCountByUserID(res.locals.user.User_ID);
      res.locals.unreadNotificationsCount = unreadNotificationsCount;
   //判断是否有未读通知
   if(unreadNotificationsCount.count > 0){
    console.log("有未读通知");
    res.locals.hasUnreadNotifications = true;
    }
    res.locals.notifications = notifications;
  }else{
    res.redirect("/user_login");
  }

  res.render("create_article");
});

router.post("/createArticle/:User_ID", addUserToLocals, upload.single("imageFile"), async function (req, res) {
    console.log("enter createArticle");
    const userID = req.params.User_ID;
    const fileInfo = req.file;
    let imageName = ""; // 默认图片名为空
  
    // 如果用户上传了图片
    if(fileInfo){
    console.log("fileInfo: ", fileInfo);
    const oldFileName = fileInfo.path;
    const newFileName = `./public/uploadedFiles/${fileInfo.originalname}`;
    fs.renameSync(oldFileName, newFileName);
    console.log("fileInfo.originalname: ", fileInfo.originalname);
    console.log("oldFileName: ", oldFileName);
    console.log("newFileName: ", newFileName);
    imageName = fileInfo.originalname; // 使用上传后的文件名作为 Image 属性的值
  }
    const article = {
      Title: req.body.title,
      Content: req.body.content,
      Image: imageName, // 使用上传后的文件名作为 Image 属性的值
      Likes_Count: 0,
      User_ID: userID,
    };

    res.locals.fileName = imageName;
    

    //如果标题或内容为空，不允许发布文章
  if (article.Title.trim().length == 0 || article.Content.trim().length == 0) {
      // res.setToastMessage("Title and content cannot be empty!");
      res.json({ success: false, message: 'Title and content cannot be empty!' });
    } else {
      
      await createArticleDao.createArticle(article);

      //加入notification功能
      const authorUserName = await articleDao.getAuthorNameByArticleID(article.Article_ID);
      console.log("authorUserName: ", authorUserName);
      const followers = await getFollowersByUserID(article.User_ID);
      for (const follower of followers) {
        const notification = {
          Content: `Your subscribed author ${authorUserName.Username} has a new article posted!`,
          Is_Read: true,
          Sender_ID: article.User_ID,
          Receiver_ID: follower, // follower就是关注者（订阅者）的ID
          NotificationType: "article_posted",
          Article_ID: article.Article_ID,
        };
        await createArticleDao.createNotificationWhenPublishNewArticle(notification);
      }

      // res.redirect("/");
      res.json({ success: true });
    }
  }
);

router.get("/directToArticlePageAfterPublish", addUserToLocals, async function (req, res) {
  console.log("enter directToArticlePageAfterPublish");
  if(res.locals.user){
    const latestArticle = await createArticleDao.getLatestArticleByUserID(res.locals.user.User_ID);
    // const articleID = latestArticle.Article_ID;
    res.json(latestArticle);
  }else{
    res.redirect("/user_login");
  }
});

module.exports = router;
