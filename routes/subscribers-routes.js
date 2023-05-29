const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();

const subscriberDao = require("../modules/subscribers-dao.js");
const sarahNotificationDao = require("../modules/sarah-notifications-dao.js");
const { addUserToLocals } = require("../middleware/auth-middleware.js");


router.get("/subscribersList", addUserToLocals, async function (req, res) {
    if(res.locals.user){

        const User_ID = res.locals.user.User_ID;
        console.log("进入okokokokoko" + User_ID + "路由");
        const subscribersList = await subscriberDao.getSubscribersById(User_ID);
        
        if (subscribersList && subscribersList.length > 0) {
            subscribersList.forEach(user => console.log("关注我的人 " + user.Username));
        } else {
            console.log("查询返回结果");
        }
        
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