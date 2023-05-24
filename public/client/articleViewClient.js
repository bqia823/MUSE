console.log("reply client js...");
window.addEventListener("load", async function() {
    const response = await fetch("/user_login_status");
    const loginStatus = await response.json();
    console.log("loginStatus: " + loginStatus);
    var currentURL = window.location.href;
    console.log(currentURL);



    isAuthor(currentURL);
    replyDiv();
    showToastMessage(loginStatus);
    blockCommentArea(loginStatus);

});

function replyDiv(){
    const reply = document.querySelectorAll(".reply");
    const replyTextDiv = document.querySelectorAll(".reply-text-div");
    const subReply = document.querySelectorAll(".sub-reply");
    for(let i = 0; i < reply.length; i++){
        reply[i].addEventListener("click", function(){
            console.log("reply clicked...");
            replyTextDiv[i].innerHTML = `
            <form action="/reply" method="POST">
                <div class="reply-text">
                    <textarea rows="3" name="reply" class="reply-textarea"></textarea>
                    <button class="writereply">Reply</button>
                </div>
            </form>
            `;
        });
    }
    for(let i = 0; i < subReply.length; i++){
        subReply[i].addEventListener("click", function(){
            console.log("subreply clicked...");
            replyTextDiv[i].innerHTML = `
            <form action="/reply" method="POST">
                <div class="reply-text">
                    <textarea rows="3" name="reply" class="reply-textarea"></textarea>
                    <button class="writereply">Reply</button>
                </div>
            </form>
            `;
        });
    }
//也许需要用到fetch（文章id/父级id  ）
};

function showToastMessage(loginStatus){
    // 获取 toastMessage 元素
    if(loginStatus == "false"){
        const toastMessage = document.querySelector('.toastmessage');

        toastMessage.style.cursor = 'pointer';

        toastMessage.addEventListener("click", function(){
            toastMessage.style.display = 'none';
        });
    }
}

async function blockCommentArea(loginStatus){
    if(loginStatus == false){
        console.log("loginStatus是false，禁用评论区");
        const commentBtn = document.querySelector("#writecomment");
        commentBtn.disabled = true;
        commentBtn.style.cursor = "not-allowed";
        const textarea = document.querySelector(".comment-textarea");
        textarea.disabled = true;
        
    }else{
        console.log("loginStatus是true，启用评论区");
    }
}

async function isAuthor(currentURL){
    const parsedUrl = new URL(currentURL);
    const articleId = parsedUrl.pathname.split('/').pop();

    console.log("client side" + articleId); 
    const removeDiv = document.querySelectorAll(".removediv");
    const subRemoveDiv = document.querySelectorAll(".sub-removediv");

    const response = await fetch(`/is_article_author/${articleId}`) ;
    const isAuthor = await response.text();
    if (isAuthor === "true") {
        console.log("isAuthor is true");
        for (let i = 0; i < removeDiv.length; i++) {
            removeDiv[i].innerHTML = `
                <img src="/images/deleteaccount.png" class="removeicon">
                <a href="/remove" class="remove">Remove</a>
            `;
        }
        for (let i = 0; i < subRemoveDiv.length; i++) {
            subRemoveDiv[i].innerHTML = `
                <img src="/images/deleteaccount.png" class="sub-removeicon">
                <a href="/remove" class="sub-remove">Remove</a>
            `;
        }
    }
    
}

async function isReplyAuthor(currentURL){

}