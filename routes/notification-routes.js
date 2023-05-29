const express = require('express');
const router = express.Router();

const { addUserToLocals } = require("../middleware/auth-middleware.js");
const notificationDao = require("../modules/notification-dao.js");
const sarahNotificationDao = require("../modules/sarah-notifications-dao.js");

// Handler for /notification route
router.get('/notification/:User_ID', addUserToLocals,  async (req, res) => {
    const userID = req.params.User_ID;
    if(res.locals.user){
        if(res.locals.user.User_ID == userID){
        const notifications = await notificationDao.getAllNotificationByUserID(res.locals.user.User_ID);
        res.locals.notificationsList = notifications;
        res.render('notification');
        }else{
            res.redirect('/');
        }
    }else{
        res.redirect('/');
    }
    
});

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
            res.redirect('/notification/' + res.locals.user.User_ID);
        }else{
            res.redirect('/');
        }
    }else{
        res.redirect('/');
    }
    
});

module.exports = router;
