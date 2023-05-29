const express = require('express');
const router = express.Router();

const { addUserToLocals } = require("../middleware/auth-middleware.js");
const notificationDao = require("../modules/notification-dao.js");
const sarahNotificationDao = require("../modules/sarah-notifications-dao.js");

// Handler for /notification route
router.get(
    "/notification/:User_ID/:page",
    addUserToLocals,
    async (req, res) => {
      const userID = req.params.User_ID;
      const page = parseInt(req.params.page);
      const startIndex = (page - 1) * 15;
      const endIndex = startIndex + 15;
  
      const allNotifications = await notificationDao.getAllNotificationByUserID(
        res.locals.user.User_ID
      );
  
      const slicedNotifications = allNotifications.slice(startIndex, endIndex);
  
      const totalPages = parseInt(allNotifications.length / 15) + 1;
  
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
  
      for (let i = 0; i < slicedNotifications.length; i++) {
        const sender = await sarahNotificationDao.getSenderByNotificationID(
          slicedNotifications[i].Notification_ID
        );
        slicedNotifications[i].Avatar = sender.Avatar;
        slicedNotifications[i].userName = sender.Username;
      }
  
      res.locals.notificationsList = slicedNotifications;
      res.render("notification");
    }
  );
router.get("/notification_info/:notification_ID", addUserToLocals, async function(req, res) {
    console.log("entering notification route...");
    const notification_ID = req.params.notification_ID;
    const notification = await notificationDao.retrieveNotificationByID(notification_ID);
    //当用户点击notification时，将其设为已读
    await notificationDao.updateNotificationIsRead(notification_ID);
    res.json(notification);
});

router.get("/notificationIsRead/:notification_ID", addUserToLocals, async function(req, res) {
    console.log("entering notificationIsRead route...");
    const notification_ID = req.params.notification_ID;
    await notificationDao.updateNotificationIsRead(notification_ID);
    const message = {
        message: "success"
    }
    res.json(message);
});

router.get("/getNotificationInfoOnly/:notification_ID", addUserToLocals, async function(req, res) {
    console.log("entering getNotificationInfoOnly route...");
    const notification_ID = req.params.notification_ID;
    
    const notification = await notificationDao.retrieveNotificationByID(notification_ID);
    console.log("notification是： " + notification);
    res.json(notification);
});

router.get("/delete-notification/:Notification_ID", addUserToLocals,  async (req, res) => {
    console.log("entering delete-notification route...");
    const notificationID = req.params.Notification_ID;
    const receiverID = await sarahNotificationDao.getReceiverByNotificationID(notificationID);
    console.log("receiverID是: " + receiverID.User_ID);
    if(res.locals.user){
        if(res.locals.user.User_ID == receiverID.User_ID){
            console.log("進入刪除通知");
            await notificationDao.deleteOneNotification(notificationID);
            res.redirect('/notification/' + res.locals.user.User_ID + '/1');
        }else{
            res.redirect('/');
        }
    }else{
        res.redirect('/');
    }
    
});

module.exports = router;
