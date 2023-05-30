const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();
const sarahNotificationDao = require("../modules/sarah-notifications-dao.js");
const followsDao = require("../modules/follows-dao.js");
const notificationDao = require("../modules/notification-dao.js");
const { addUserToLocals } = require("../middleware/auth-middleware.js");

router.get("/followsList/:page", addUserToLocals, async function (req, res) {
    // //get notification unread number渲染出未读通知数量
    // const allNotifications = await notificationDao.getAllNotificationByUserID(res.locals.user.User_ID);
    // res.locals.unReadComment = allNotifications.length;
    
      const page = parseInt(req.params.page);
      const startIndex = (page - 1) * 15;
      const endIndex = startIndex + 15;

    if(res.locals.user){
        const User_ID = res.locals.user.User_ID; // Or from req.user.User_ID
        console.log("进入okokokokoko" + User_ID + "路由");
        const followsList = await followsDao.getFollowsById(User_ID);
        
        //分页
        const slicedFollowsList = followsList.slice(startIndex, endIndex);
  
        const totalPages = parseInt(followsList.length / 15) + 1;
  
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
        res.locals.followsList = followsList;

        res.locals.slicedFollowsList = slicedFollowsList;
        

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
        
        res.locals.notifications = notifications;
        //判断是否有未读通知
        if(unreadNotificationsCount.count > 0){
            console.log("有未读通知");
            res.locals.hasUnreadNotifications = true;
            }
    }

        res.render("followsList");
    }else{
        res.redirect("/");
    }
});

module.exports = router;
