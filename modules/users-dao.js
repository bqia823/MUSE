const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");
const crypto = require('crypto');
/**
 * Inserts the given user into the database. Then, reads the ID which the database auto-assigned, and adds it
 * to the user.
 * 
 * @param user the user to insert
 */
async function createUser(user) {
    const db = await dbPromise;
    try {
        const result = await db.run(SQL`
            insert into User (
                Username, 
                Password, 
                Real_Name, 
                Date_Of_Birth, 
                Brief_Description, 
                Avatar, 
                Is_Admin, 
                authToken
            ) values(
                ${user.Username}, 
                ${user.Password}, 
                ${user.Real_Name}, 
                ${user.Date_Of_Birth}, 
                ${user.Brief_Description}, 
                ${user.Avatar}, 
                ${user.Is_Admin}, 
                ${user.authToken})`);

        // Get the auto-generated ID value, and assign it back to the user object.
        user.User_ID = result.lastID;
        
    } catch (err) {
        console.error("Failed to insert user into database:", err);
        throw err;
    }

    // This should return the user with the new User_ID
    return user;
    // const result = await db.run(SQL`
    //     insert into User (Username, Password, Real_Name) values(${user.username}, ${user.password}, ${user.name})`);

    // Get the auto-generated ID value, and assign it back to the user object.
    // user.id = result.lastID;
}
function generateAuthToken() {
    return crypto.randomBytes(30).toString('hex');
}

/**
 * Gets the user with the given id from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {number} id the id of the user to get.
 */
async function retrieveUserById(id) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from User
        where User_ID = ${id}`);

    return user;
}

/**
 * Gets the user with the given username and password from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {string} username the user's username
 * @param {string} password the user's password
 */
async function retrieveUserWithCredentials(username, password) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from User
        where Username = ${username} and Password = ${password}`);

    return user;
}

/**
 * Gets the user with the given authToken from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {string} authToken the user's authentication token
 */
async function retrieveUserWithAuthToken(authToken) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from User
        where authToken = ${authToken}`);

    return user;
}

/**
 * Gets the user with the given username from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {string} username the user's username
 */
async function retrieveUserByUsername(username) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from User
        where Username = ${username}`);

    return user;
}

async function retrieveAllUsername() {
    const db = await dbPromise;

    const username = await db.all(SQL`
        select Username from User`);
    return username;
}

/**
 * Gets an array of all users from the database.
 */
async function retrieveAllUsers() {
    const db = await dbPromise;

    const users = await db.all(SQL`select * from User`);

    return users;
}

/**
 * Updates the given user in the database, not including auth token
 * 
 * @param user the user to update
 */
async function updateUser(user) {
    try {
    const db = await dbPromise;

        let updateString = 'update User set ';
        let updateValues = [];

        if (user.Username !== undefined) {
            updateString += 'Username = ?, ';
            updateValues.push(user.Username);
        }

        if (user.Password !== undefined) {
            updateString += 'Password = ?, ';
            updateValues.push(user.Password);
        }

        if (user.Real_Name !== undefined) {
            updateString += 'Real_Name = ?, ';
            updateValues.push(user.Real_Name);
        }

        if (user.Date_Of_Birth !== undefined) {
            updateString += 'Date_Of_Birth = ?, ';
            updateValues.push(user.Date_Of_Birth);
        }

        if (user.Brief_Description !== undefined) {
            updateString += 'Brief_Description = ?, ';
            updateValues.push(user.Brief_Description);
        }

        if (user.Avatar !== undefined) {
            updateString += 'Avatar = ?, ';
            updateValues.push(user.Avatar);
        }

        if (user.authToken !== undefined) {
            updateString += 'authToken = ?, ';
            updateValues.push(user.authToken);
        }

        // Remove the last comma and space
        updateString = updateString.slice(0, -2);
        
        updateString += ' where User_ID = ?';
        updateValues.push(user.User_ID);

        await db.run(updateString, updateValues);

    } catch (error) {
        console.error('Error in updateUser:', error);
        throw error;
    }
}



/**
 * Deletes the user with the given id from the database.
 * 
 * @param {number} id the user's id
 */
async function deleteUser(id) {
    const db = await dbPromise;

    await db.run(SQL`
        delete from User
        where User_ID = ${id}`);
}

async function getAllUsers() {
    const db = await dbPromise;
    const users = await db.all(SQL`select * from User`);
    return users;
}


// Export functions.
module.exports = {
    createUser,
    generateAuthToken,
    retrieveUserById,
    retrieveUserWithCredentials,
    retrieveUserWithAuthToken,
    retrieveUserByUsername,
    retrieveAllUsers,
    updateUser,
    deleteUser,
    getAllUsers,
    retrieveAllUsername
};
