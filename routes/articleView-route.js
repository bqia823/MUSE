const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
const Handlebars = require('handlebars');

const articleDao = require("../modules/article-dao.js");
const likeDao = require("../modules/like-dao.js");
const commentDao = require("../modules/comment-dao.js");
const userDao = require("../modules/users-dao.js");

const { addUserToLocals } = require("../middleware/auth-middleware.js");

// router.get("/user_register", async function(req, res) {

// });

router.get("/articleView/:Article_ID", addUserToLocals, async function(req, res) {   
    console.log("entering article view...");
    //测试，获取文章ID=2，
    const Article_ID = req.params.Article_ID;
    const article = await articleDao.getArticleByArticleID(Article_ID);
    res.locals.article = article; 
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
 

    //获得评论数
    const commentCount = await commentDao.getTotalCommentCount(Article_ID);
    res.locals.commentCount = commentCount;
    //获得评论数组
    const commentArray = await commentDao.getAllCommentById(Article_ID); 
    //遍历评论数组，获取每个评论的用户名和头像
    for(let i = 0; i < commentArray.length; i++){
        commentArray[i].childUsername = await commentDao.getCommentorNameByCommentID(commentArray[i].Comment_ID);
        commentArray[i].parentUsername = await commentDao.getParentUsernameByCommentID(commentArray[i].Comment_ID);
        commentArray[i].childAvatar = await commentDao.getCommentorAvatarByCommentID(commentArray[i].Comment_ID); 
        if(res.locals.user){
            commentArray[i].myComment = commentArray[i].User_ID == res.locals.user.User_ID;
        }
    }
    res.locals.commentArray = commentArray;
    
    if(res.locals.user){
        if(res.locals.user.User_ID == article.User_ID){
            console.log("判断：当前用户是文章作者");
            res.locals.isAuthor = true;
            
        }
    }

    Handlebars.registerHelper('ifCond', function(v1, v2, options) {
        if (v1 === v2) {
          return options.fn(this);
        }
        return options.inverse(this);
      });
   

    res.render("article_View");
});

router.get("/like", addUserToLocals, async function(req, res){
    console.log("entering like route...");
 
    const Article_ID = req.query.Article_ID;
    console.log("Article_ID: " + Article_ID);
    console.log("res.locals.likeIcon: " + res.locals.likeIcon);
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
    const comment = {
        Article_ID: Article_ID,
        Comment_Text: req.body.comment,
        User_ID: res.locals.user.User_ID,
        Parent_ID: null
    }
    if(comment.Comment_Text.length == 0){
        res.setToastMessage("Comment cannot be empty!");
        res.redirect(req.headers.referer);
    }
    await commentDao.createComment(comment);

    res.redirect(req.headers.referer);
});

router.post("/reply", async function(req, res){
    const reply = req.body.reply;

    // res.redirect("/articleView" + Article_ID);
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
            res.send("true");
        }else{
            res.send("false");
        }
    }else{
        res.send("false");
    }
});

router.get("/is_comment_author/:Article_ID", addUserToLocals, async function(req, res){
    console.log("entering is_comment_author route...");
  

    const Article_ID = req.params.Article_ID;
    const commentArray = await commentDao.getAllCommentById(Article_ID);
    if(res.locals.user){
       for(let i = 0; i < commentArray.length; i++){
           if(commentArray[i].User_ID == res.locals.user.User_ID){
               res.send("true");
               return;
           }
       }
    }
    res.send("false");
    
});


module.exports = router;