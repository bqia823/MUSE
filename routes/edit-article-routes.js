const{ v4: uuid } = require('uuid');
const express = require("express");
const router = express.Router();

const sarahNotificationDao = require('../modules/sarah-notifications-dao.js');
const editArticleDao = require('../modules/edit-article-dao.js');
const { addUserToLocals } = require('../middleware/auth-middleware.js');
const upload = require('../middleware/multer-uploader.js'); // 导入 multer 上传中间件
const fs = require('fs');
const path = require('path');


router.get("/editArticle/:Article_ID", addUserToLocals, async function(req, res) {
    const Article_ID = req.params.Article_ID;
    const article = await editArticleDao.getArticleById(Article_ID);
    if(res.locals.user){
        const notifications = await sarahNotificationDao.getThreeNotifications(res.locals.user.User_ID);  
        for (let i = 0; i < notifications.length; i++) {
        notifications[i].userInformation =
            await sarahNotificationDao.getSenderByNotificationID(notifications[i].Notification_ID);
        }
    
        res.locals.notifications = notifications;
    }
    console.log("进入" + Article_ID + "路由");
    console.log("article的内容", article);
    res.locals.article = article;
    // console.log("article的图片", article.Image);

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
    }
    
    res.render("edit_article");
});


router.post ("/editArticle/:Article_ID", addUserToLocals, upload.single('imageFile'), async function (req, res) {
    console.log("publishArticle路由");
    console.log("req.body.content", req.body.content);
    let articleID = req.params.Article_ID;;
    if(res.locals.user){
        console.log("articleID", articleID);
        const fileInfo = req.file;
        const oldFileName = fileInfo.path;
        const newFileName = `./public/uploadedFiles/${fileInfo.originalname}`;
        console.log(newFileName);
        fs.renameSync(oldFileName, newFileName);

        const article = {
            Article_ID: articleID,
            Title: req.body.title,
            Content: req.body.content,
            Image: fileInfo.originalname,  // 使用上传后的文件名作为 Image 属性的值
            Likes_Count: 0,
            User_ID: 1
        } 
    
        res.locals.fileName = fileInfo.originalname;
    

        if (article.Title.length == 0 && article.Content.length == 0) {
            // res.setToastMessage("Title and content cannot be empty!");
            res.json({ success: false });
        } else {
            await editArticleDao.editArticle(article);
            console.log("编辑后的article", article);
            // res.redirect("/");
            res.json({ success: true });
        }   
    } else {
        res.redirect("/user_login");
    }
});

module.exports = router;






    






