window.addEventListener("load", async function () {
    console.log("notification Window loaded.");
    const notificationText = document.querySelectorAll(".text");
    for(let i = 0; i < notificationText.length; i++){
        notificationText[i].style.cursor = "pointer";
        const notificationID = notificationText[i].getAttribute("id");   
        const response5 = await fetch(`/getNotificationInfoOnly/${notificationID}`);
        const notification_details = await response5.json();
       if(notification_details.Is_Read == 0){
            console.log("notification is not read");
            notificationText[i].style.fontWeight = "bold";
            }
        notificationText[i].addEventListener("click", async function () {
          console.log("notification clicked");
          console.log("notificationID" + notificationID);
          const response5 = await fetch(`/notification_info/${notificationID}`);
          const notification_info = await response5.json();
       
          if(notification_info.NotificationType == "Comment" || notification_info.NotificationType == "Reply"){
              const articleID = notification_info.Article_ID;
              window.location.href =  `/articleView/${articleID}`;
          }else if(notification_info.NotificationType == "Follow"){
              const profileID = notification_info.Sender_ID;
              window.location.href =  `/profile/${profileID}`;
          }
      });
    }

});