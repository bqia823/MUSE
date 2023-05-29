const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();
const notificationDao = require("../modules/notification-dao.js");
const subscriberDao = require("../modules/subscribers-dao.js");
const sarahNotificationDao = require("../modules/sarah-notifications-dao.js");
const { addUserToLocals } = require("../middleware/auth-middleware.js");


router.get("/subscribersList/:page", addUserToLocals, async function (req, res) {
    //get notification unread number渲染出未读通知数量
    const allNotifications = await notificationDao.getAllNotificationByUserID(res.locals.user.User_ID);
    res.locals.unReadComment = allNotifications.length;
    const page = parseInt(req.params.page);
    const startIndex = (page - 1) * 15;
    const endIndex = startIndex + 15;
    if(res.locals.user){

        const User_ID = res.locals.user.User_ID;
        console.log("进入okokokokoko" + User_ID + "路由");
        const subscribersList = await subscriberDao.getSubscribersById(User_ID);
        
         //分页
         const slicedSubscribersList = subscribersList.slice(startIndex, endIndex);
  
         const totalPages = parseInt(subscribersList.length / 15) + 1;
   
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
         res.locals.slicedSubscribersList = slicedSubscribersList;
        res.locals.subscribersList = subscribersList;

          // 获得三个提醒项
 
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
        res.render("subscribersList");
       
    }else{
        res.redirect("/");
    }
});





module.exports = router;