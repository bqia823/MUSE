//const { use } = require("../routes/auth-route");
console.log("进入 homePage.js...");
//This is client side JS code
window.addEventListener("load", async function () {
   //获取当前用户信息
   const response1 = await fetch("/user_info");
   const user_info = await response1.json();
   const User_ID = user_info.User_ID;

  const newContent = document.querySelector("#icon-container");
  const createArticle = document.querySelectorAll(".createArticle");
  const notifications = document.querySelectorAll(".notifications");
  const navNotification = document.querySelector("#navNotification");
  const Signout = document.querySelectorAll(".Signout");
  const articlesTitle = document.querySelectorAll(".displayTitle");
  const authorInformation = document.querySelectorAll(".userClick");
  const pages = document.querySelectorAll(".pages");
  const previousPage = document.querySelector("#left");
  const navUserClick = document.querySelector("#navUserClick");
  const moreContainer = document.querySelector("#moreContainer");
  const previousDisplayTitle = document.querySelectorAll(".previousDisplayTitle");
  const notificationMore = document.querySelector("#notificationMore");
  const navCreateArticle = document.querySelector("#navCreateArticle");
  const navSignOut = document.querySelector("#navSignOut");
  const content = document.querySelectorAll(".partDiscription");
  const previousContent = document.querySelectorAll(".previousPartDiscription");
  
  //这个方法用于将文章展示区域的html标签转换为字符串
  for (let i = 0; i < content.length; i++) {
   content[i].innerHTML = content[i].innerText;
  }
  for (let i = 0; i < previousContent.length; i++) {
    previousContent[i].innerHTML = previousContent[i].innerText;
  }
  

 

  let signIn = {};
  if(!User_ID){
    signIn = document.querySelector("#sign-in");
  }

  const selectBox = document.querySelector("#sortOptions");

  let value = "";

  selectBox.addEventListener("change", function (event) {
   value = selectBox.value;
   console.log("value is " + value);
    //When the value of select box changed, we add another input element to receive the range
    if (document.cookie.includes("authToken")) {
      if (value === "publishTime") {
        window.location.href = "/home/1/publishTime";
      } else if (value === "authorName") {
        console.log("选择了authorName");
        window.location.href = "/home/1/authorName";
      } else if (value === "articleTitle") {
        window.location.href = "/home/1/articleTitle";
      }
    } else {
      if (value === "publishTime") {
        window.location.href = "/home/visitor/1/publishTime";
      } else if (value === "authorName") {
        console.log("选择了authorName");
        window.location.href = "/home/visitor/1/authorName";
      } else if (value === "articleTitle") {
        window.location.href = "/home/visitor/1/articleTitle";
      }
    }
  });

  if(!User_ID){
    signIn.addEventListener("click", function () {
      window.location.href = "/user_login";
    });
  }

  const nextPage = document.querySelector("#right");
  const path = window.location.pathname;
  const homeUserRegex = /\/home\/(\w+)/;
  const homeVisitorRegex = /\/home\/visitor\/(\w+)/;
  console.log("homeVisitorRegex" + homeVisitorRegex);
  let userCurrentPage = "";
  let visitorCurrentPage = "";
  if (document.cookie.includes("authToken")) {
    console.log("wowowowowowowowowwo");
    const userMatches = path.match(homeUserRegex);
    userCurrentPage = userMatches[1];
    const userNextPage = parseInt(userCurrentPage) + 1;
    const userPreviousPage = parseInt(userCurrentPage) - 1;
  } else {
    console.log("hahahahahahaahaha");
    const visitorMatches = path.match(homeVisitorRegex);
    const visitorCurrentPage = visitorMatches[1];
    visitorNextPage = parseInt(visitorCurrentPage) + 1;
    const visitorPreviousPage = parseInt(visitorCurrentPage) - 1;
  }

  
  previousPage.addEventListener("click", function () {
    if (document.cookie.includes("authToken")) {
      if (parseInt(userCurrentPage) != 1) {
        window.location.href = `/home/${userPreviousPage}/${value}`;
      }
    } else {
      window.location.href = `/home/visitor/${visitorPreviousPage}/${value}`;
    }
  });

  nextPage.addEventListener("click", async function () {
    console.log("nextPage clicked");
    if (document.cookie.includes("authToken")) {
      window.location.href = `/home/${userNextPage}/${value}`;
    } else {
      window.location.href = `/home/visitor/${visitorNextPage}/${value}`;
    }
  });

  for (let i = 0; i < pages.length; i++) {
    pages[i].addEventListener("click", function () {
      const toPage = pages[i].innerHTML;
      if (document.cookie.includes("authToken")) {
        window.location.href = `/home/${toPage}/${value}`;
      } else {
        window.location.href = `/home/visitor/${toPage}/${value}`;
        const pageThis = document.querySelector(`#${pages[i].id}`);
        pageThis.style.color = "#7949ff";
        pageThis.style.backgroundColor = "#e9e1ff";
      }
    });

    if (document.cookie.includes("authToken")) {
      if (parseInt(pages[i].innerHTML) === parseInt(userCurrentPage)) {
        const thisPageId = pages[i].id;
        const pageThis = document.querySelector(`#${thisPageId}`);
        pageThis.style.color = "#7949ff";
        pageThis.style.backgroundColor = "#e9e1ff";
      }
    } else {
      if (parseInt(pages[i].innerHTML) === parseInt(visitorCurrentPage)) {
        const thisPageId = pages[i].id;
        const pageThis = document.querySelector(`#${thisPageId}`);
        pageThis.style.color = "#7949ff";
        pageThis.style.backgroundColor = "#e9e1ff";
      }
    }
  }

  for (let i = 0; i < articlesTitle.length; i++) {
    articlesTitle[i].addEventListener("click", function () {
      
      const substring = articlesTitle[i].id.substring(5);
      window.location.href = `/articleView/${substring}`;
    });
  }

  for (let i = 0; i < authorInformation.length; i++) {
    
      authorInformation[i].addEventListener("click", function () {
        console.log("okokokokokokokokokookokokokokok");
        const substring = authorInformation[i].id.substring(4);
        console.log("subString" + substring);
        window.location.href =  `/profile/${substring}`;
      });  
  }

  previousDisplayTitle.forEach((element) => {
    element.addEventListener("click", function () {
      console.log("previousDisplayTitle clicked");
      const Article_ID = element.id.substring(13);
      window.location.href = `/articleView/${Article_ID}`;
    });
  });
  if(User_ID){
    moreContainer.addEventListener("click", function () {
      console.log("moreContainer clicked");
      window.location.href =  `/profile/${User_ID}`;
    });
  }

  //导航条
  if(User_ID){
  navUserClick.addEventListener("click", function () {
    window.location.href =  `/profile/${User_ID}`;
  });
}
  if(User_ID){
  navCreateArticle.addEventListener("click", function () {
    window.location.href = `/create_article`;
  });
}
  if(User_ID){
  navSignOut.addEventListener("click", function () {
    window.location.href = `/logout`;
  });

  for (let i = 0; i < Signout.length; i++) {
    userSignoutIcon[i].addEventListener("click", function () {
      window.location.href = `/signOut`;
    });
  }
}

if(User_ID){

  for (let i = 0; i < createArticle.length; i++) {
    createArticle[i].addEventListener("click", function () {
      window.location.href = `/creatArticle`;
    });
  }
}
if(User_ID){
  //鼠标移动到notification上显示下拉菜单
  navNotification.addEventListener("click", function () {
    console.log("navNotification clicked");
    window.location.href = `/notification/${User_ID}/1`;
  });


  navNotification.addEventListener("mouseover", function () {
   
      console.log("没有newcontent，显示newcontent");
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
        }else if(notification_info.NotificationType == "article_posted"){
          const articleID = notification_info.Article_ID;
          window.location.href =  `/articleView/${articleID}`;
      }
    });
  }

  
  notificationMore.addEventListener("click", function () {
    console.log("notificationMore clicked");
    window.location.href =  `/notification/${User_ID}/1`;
  });
}

    });

   

  function isMouseOver(element) {
    const rect = element.getBoundingClientRect();
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    return (
      mouseX >= rect.left &&
      mouseX <= rect.right &&
      mouseY >= rect.top &&
      mouseY <= rect.bottom
    );
  }

