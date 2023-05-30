const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function createArticle(article) {
  const db = await dbPromise;

  await db.run(SQL`
        INSERT INTO Article (Title, Content, Image, Likes_Count, User_ID)
        VALUES (${article.Title}, ${article.Content}, ${article.Image}, ${article.Likes_Count}, ${article.User_ID})`);
}

async function createNotificationWhenPublishNewArticle(notification) {
  const db = await dbPromise;

  const result = await db.run(SQL`
        INSERT INTO Notification (Content, Is_Read, Sender_ID, Receiver_ID, NotificationType)
        VALUES (
            ${notification.Content},
            ${notification.Is_Read},
            ${notification.Sender_ID},
            ${notification.Receiver_ID},
            ${notification.NotificationType}
        )
    `);

  console.log(`Notification created successfully`);
}

async function getFollowersByUserID(User_ID) {
  const db = await dbPromise;

  const follower = SQL`SELECT Subscriber_ID FROM Subscription WHERE Author_ID = ${User_ID}`;

  const results = await db.all(follower);

  // 这个函数应该返回一个包含所有关注者ID的数组
  return results.map((row) => row.Subscriber_ID);
}

async function getLatestArticleByUserID(User_ID) {
  const db = await dbPromise;
  const result = await db.get(SQL`
  SELECT * FROM Article WHERE User_ID = ${User_ID} ORDER BY Date DESC LIMIT 1
  `);
  return result;
}


module.exports = {
  createArticle,
  createNotificationWhenPublishNewArticle,
  getFollowersByUserID,
  getLatestArticleByUserID
};
