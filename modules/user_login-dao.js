const database = require('./database');

exports.getUser = async function(username) {
  // Here you would make a call to your database to get the user by username.
  // The exact implementation depends on your database and query language.
  // Here's an example with a fictional database module:

  const result = await database.query('SELECT * FROM users WHERE username = ?', [username]);
  if (result.rows.length > 0) {
    return result.rows[0];
  } else {
    return null;
  }
}


exports.createUser = async function(username, password) {
    // Here you would make a call to your database to insert a new user.
    // Again, the exact implementation depends on your database and query language.
    // Here's an example with a fictional database module:
  
    const result = await database.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    return result.affectedRows > 0;
  }
  