const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
const Handlebars = require('handlebars');

const articleDao = require("../modules/article-dao.js");
const likeDao = require("../modules/like-dao.js");
const commentDao = require("../modules/comment-dao.js");
const userDao = require("../modules/users-dao.js");
const notificationDao = require("../modules/notification-dao.js");
const sarahNotificationDao = require("../modules/sarah-notifications-dao.js");

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


router.get("/showComments", addUserToLocals, async function(req, res) {
    const Article_ID = req.query.Article_ID;
    const commentArray = await commentDao.getAllCommentById(Article_ID);
    
    res.json(commentArray);
});

router.get("/articleView/:Article_ID", addUserToLocals, async function(req, res) {   
    console.log("entering article view...");

    const Article_ID = req.params.Article_ID;
    const article = await articleDao.getArticleByArticleID(Article_ID);
    res.locals.article = article; 
    res.locals.author = await articleDao.getAuthorNameByArticleID(Article_ID);
    res.locals.authorAvatar = await articleDao.getAuthorAvatarByArticleID(Article_ID);
    
    //显示点赞状态
    const likerIDArray = await likeDao.getLikerByArticleID(Article_ID);
    if(res.locals.user){     
        if(likerIDArray.map(item => item.User_ID).includes(res.locals.user.User_ID)){      
            res.locals.likeIcon = "/images/liked.png";
        }else{

            res.locals.likeIcon = "/images/like.png";
        }
    }else{
        res.locals.likeIcon = "/images/like.png";
    }

    // //获得评论数
    const commentCount = await commentDao.getTotalCommentCount(Article_ID);
    res.locals.commentCount = commentCount;

    // 获得三个提醒项
    if(res.locals.user){
        //get notification unread number渲染出未读通知数量
        const allNotifications = await notificationDao.getAllNotificationByUserID(res.locals.user.User_ID);
        res.locals.unReadComment = allNotifications.length;

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

    res.render("article_View");


});

router.get("/like", addUserToLocals, async function(req, res){
    console.log("entering like route...");
 
    const Article_ID = req.query.Article_ID;
    const article = await articleDao.getArticleByArticleID(Article_ID);
    console.log("article: ", article);


    //获得所有点赞这篇文章的用户ID
    const likerIDArray = await likeDao.getLikerByArticleID(Article_ID);
    if(res.locals.user){
        console.log("LIKE判断：有users对象储存在本地");
        if(likerIDArray.map(item => item.User_ID).includes(res.locals.user.User_ID)){
            console.log("LIKE判断：点赞这篇文章的所有用户ID里面有当前用户的ID, 取消点赞");
            res.locals.likeIcon = "/images/like.png";
            await likeDao.removeLikeCountAndLiker(Article_ID, res.locals.user.User_ID);
            const likeCount = await likeDao.getLikeCount(Article_ID);
            res.locals.likeCount = likeCount;
            res.redirect(req.headers.referer);
        }else{
            console.log("LIKE判断：点赞这篇文章的所有用户ID里面没有当前用户的ID，点赞");
            res.locals.likeIcon = "/images/liked.png";
            await likeDao.updateLikeCountAndLiker(Article_ID, res.locals.user.User_ID);
            const likeCount = await likeDao.getLikeCount(Article_ID);
            res.locals.likeCount = likeCount;
            //当用户点赞后，通知作者
            // await notificationDao.createNotificationWhenLike(res.locals.user, article); 
            res.redirect(req.headers.referer);
        }
    }else{
        console.log("LIKE判断：没有users对象储存在本地");
        res.setToastMessage("You need to login first!");
        res.locals.likeIcon = "/images/like.png";
        res.redirect(req.headers.referer);
    }

  });

router.post("/writecomment", addUserToLocals, async function(req, res){
    const Article_ID = req.query.Article_ID;
    const article = await articleDao.getArticleByArticleID(Article_ID);
    const comment = {
        Article_ID: Article_ID,
        Comment_Text: req.body.comment,
        User_ID: res.locals.user.User_ID,
        Parent_Comment_ID: null
    }
    if(comment.Comment_Text.length == 0){
        res.setToastMessage("Comment cannot be empty!");
        res.redirect(req.headers.referer);
    }
    await commentDao.createComment(comment);
    await notificationDao.createNotificationWhenComment(res.locals.user, article);

    res.redirect(req.headers.referer);
});

router.post("/reply/:Article_ID/:Comment_ID", addUserToLocals, async function(req, res){
    console.log("entering reply route...");
    const Article_ID = req.params.Article_ID;
    const article = await articleDao.getArticleByArticleID(Article_ID);
    const Comment_ID = req.params.Comment_ID;

    const replyContent = req.body.reply;
    const reply = {
        Comment_Text: replyContent,
        Article_ID: Article_ID,
        User_ID: res.locals.user.User_ID,
        Parent_Comment_ID: Comment_ID
    }
    if(reply.Comment_Text.length == 0){
        res.setToastMessage("Comment cannot be empty!");
        res.redirect(req.headers.referer);
    }
    await commentDao.createComment(reply);
    const Receiver_ID = await commentDao.getUserIDByCommentID(Comment_ID);
    console.log("Receiver_ID: ", Receiver_ID);
    await notificationDao.createNotificationWhenReply(res.locals.user, Receiver_ID.User_ID, article);


    res.redirect(req.headers.referer);
});

router.get("/user_login_status", addUserToLocals, async function(req, res){
    console.log("entering user_login_status route...");
    if(res.locals.user){
        res.send("true");
    }else{
        res.send("false");
    }
});

router.get("/is_article_author/:Article_ID", addUserToLocals, async function(req, res){
    console.log("entering is_article_author route...");
    const Article_ID = req.params.Article_ID;
    const article = await articleDao.getArticleByArticleID(Article_ID);
   
    if(res.locals.user){
        if(res.locals.user.User_ID == article.User_ID){
            console.log("is_article_author: true");
            const result = {isAuthor: true};
            res.json(result);
        }else{
            
            const result = {isAuthor: false};
            res.json(result);
        }
    }else{
        const result = {isAuthor: false};
        res.json(result);
    }
});

router.get("/removecomment/:Comment_ID", addUserToLocals, async function(req, res){
    console.log("entering removecomment route...");
    const Comment_ID = req.params.Comment_ID;
    await commentDao.removeComment(Comment_ID);
    res.setToastMessage("Comment removed!");
    res.redirect(req.headers.referer);   
});


module.exports = router;