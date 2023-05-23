const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function getArticleByArticleID(Article_ID){
    const db = await dbPromise;
    const result = await db.get(SQL`
    SELECT * FROM Article WHERE Article_ID = ${Article_ID}
    `);
    return result;
}


async function getAuthorNameByArticleID(Article_ID){
    const db = await dbPromise;
    const result = await db.get(SQL`
    SELECT Username 
    FROM User 
    WHERE User_ID = (SELECT User_ID FROM Article WHERE Article_ID = ${Article_ID})
    `);
    return result;
}
async function getAuthorAvatarByArticleID(Article_ID){
    const db = await dbPromise;
    const result = await db.get(SQL`
    SELECT Avatar 
    FROM User 
    WHERE User_ID = (SELECT User_ID FROM Article WHERE Article_ID = ${Article_ID})
    `);
    return result;
  }
  

// Export functions.
module.exports = {
    getArticleByArticleID,
    getAuthorNameByArticleID,
    getAuthorAvatarByArticleID
};
  