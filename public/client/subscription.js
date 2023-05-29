window.addEventListener('load', async function() {
    console.log('subscription Window loaded.');
    //获取当前用户信息
    const response1 = await fetch("/user_info");
    const user_info = await response1.json();
    const User_ID = user_info.User_ID;
    //判断用户是否登录，如果登录，显示导航条上的部分内容
    const homeBtn = document.querySelector("#home");
    const signInBtn = document.querySelector("#sign-in");
    const notificationBtn = document.querySelector("#notification");
    const profileBtn = document.querySelector("#profile");
    const createArticleBtn = document.querySelector("#create-article");
    const logoutBtn = document.querySelector("#log-out");
    const followButton = document.querySelectorAll(".follow-button");
    const fansDisplayBar = document.querySelectorAll(".fansDisplayBar");
    if(User_ID){
        
        signInBtn.style.display = "none";
        profileBtn.style.display = "block";
        createArticleBtn.style.display = "block";
        logoutBtn.style.display = "block";
        notificationBtn.style.display = "block";

    }else if(User_ID == null){
    
        signInBtn.style.display = "block";
        profileBtn.style.display = "none";
        createArticleBtn.style.display = "none";
        logoutBtn.style.display = "none";
        notificationBtn.style.display = "none";
        
        
    }
    
    //当鼠标移动到notificaiton按钮时，显示通知
    const newContent = document.querySelector("#icon-container");
    const notifications = document.querySelectorAll(".notifications");
    // const redDot = document.querySelectorAll(".red-dot");
      
    if(User_ID){
        notificationBtn.addEventListener("mouseover", function () {

                newContent.style.display = "flex";
          });
          newContent.addEventListener("mouseover", function () {
         
            newContent.style.display = "flex";
          });
          newContent.addEventListener("mouseout", function () {
         
            if(newContent.style.display === "flex"){
              newContent.style.display = "none";
            }
          });
          //点击notification，跳转到对应的文章
          for(let i = 0; i < notifications.length; i++){
              notifications[i].style.cursor = "pointer";
              notifications[i].addEventListener("click", async function () {
                console.log("notification clicked");
                let notificationID = notifications[i].getAttribute("id");      
                notificationID = notificationID.substring(13);
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
          const notificationMore = document.querySelector("#notificationMore");
          
          notificationMore.addEventListener("click", function () {
            console.log("notificationMore clicked");
            window.location.href =  `/notification/${User_ID}`;
          });
    }
    //点击unfollowbutton，取消关注
    //显示follow按钮的状态
    // for(let i = 0; i < fansDisplayBar.length; i++){
    //   const profileID = fansDisplayBar[i].getAttribute("id");
    //   const response6 = await fetch(`/checkIsFollowing/${profileID}`);
    //   const isFollowing = await response6.json();
    //   if(isFollowing.isFollowing == true){
    //     followButton.innerHTML = "Unfollow";
    //     followButton.classList.remove('follow');
    //     followButton.classList.add('unfollow');
    //   }else{
    //     followButton.innerHTML = "Follow";
    //     followButton.classList.remove('unfollow');
    //     followButton.classList.add('follow');

    //   }
    // }      
    for(let i = 0; i < followButton.length; i++){
      followButton[i].addEventListener('click', async () => {
          let userId = followButton[i].dataset.userId;
          console.log('客户端Follow Button clicked - User ID:', userId);
          // 切换关注状态Toggle the follow button
          // toggleFollow(userId);
          await fetch(`/unfollow/${userId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          window.location.reload();
      });
    }
   

});

function toggleFollow(userId) {
 
  const followButton = document.querySelector('.follow-button');
  const isFollowing = followButton.classList.contains('unfollow');

  console.log('Is Following:', isFollowing);

  if (isFollowing) {
    console.log('Unfollow logic');
    unfollowUser(userId)
        .then(() => {
            console.log('Unfollow successful');
            followButton.classList.remove('unfollow');
            followButton.innerText = 'Follow';
        })
        .catch((error) => {
            console.error('Error unfollowing user:', error);
        });

         // Show alert message for unfollow
         alert('You have unfollowed the user');

  } else {
    console.log('Follow logic');
    console.log('客户端following - User ID:', userId);
    followUser(userId)
        .then(() => {
            console.log('Follow successful');
            followButton.classList.add('unfollow');
            followButton.innerText = 'Unfollow';
        })
        .catch((error) => {
            console.error('Error following user:', error);
        });
  }
}


function followUser(userId) {
  // Implement the logic to send a request to the server to add the subscription
  console.log('客户端FollowUser方法 - User ID:', userId);
  return fetch(`/follow/${userId}`, { method: 'POST' })
      .then((response) => {
          if (!response.ok) {
              throw new Error(response.statusText);
          }
      });
}

function unfollowUser(userId) {
  // Implement the logic to send a request to the server to remove the subscription
  console.log('Unfollow User - User ID:', userId);
  return fetch(`/unfollow/${userId}`, { method: 'POST' })
      .then((response) => {
          if (!response.ok) {
              throw new Error(response.statusText);
          }
      });
}
