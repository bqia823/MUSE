const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function getLikerByArticleID(Article_ID){
    const db = await dbPromise;
    const result = await db.all(SQL`
    SELECT User_ID FROM Article_Like WHERE Article_ID = ${Article_ID}
    `);
    return result;
}

async function updateLikeCountAndLiker(Article_ID, User_ID){
    const db = await dbPromise;
    await db.run(SQL`
    UPDATE Article SET Likes_Count = Likes_Count + 1 WHERE Article_ID = ${Article_ID}
    `);
    await db.run(SQL`
    INSERT INTO Article_Like (Article_ID, User_ID) VALUES (${Article_ID}, ${User_ID})
    `);
}

async function getLikeCount(Article_ID){
    const db = await dbPromise;
    const result = await db.get(SQL`
    SELECT Likes_Count FROM Article WHERE Article_ID = ${Article_ID}
    `);
    return result;
}

async function removeLikeCountAndLiker(Article_ID, User_ID){
    const db = await dbPromise;
    await db.run(SQL`
    UPDATE Article SET Likes_Count = Likes_Count - 1 WHERE Article_ID = ${Article_ID}
    `);
    await db.run(SQL`
    DELETE FROM Article_Like WHERE Article_ID = ${Article_ID} AND User_ID = ${User_ID}
    `);
}

// Export functions.
module.exports = {
    updateLikeCountAndLiker,
    getLikerByArticleID,
    getLikeCount,
    removeLikeCountAndLiker
  };
  