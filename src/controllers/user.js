const db = require('../dbClient');

module.exports = {
  create: (user, callback) => {
    // Check if the username parameter is provided
    if (!user.username) return callback(new Error("Wrong user parameters"), null);

    // Create the user object
    const userObj = {
      firstname: user.firstname,
      lastname: user.lastname,
    };

    // Check if the user already exists in Redis
    db.exists(user.username, (err, exists) => {
      if (err) return callback(err, null);           // Return error if Redis fails
      if (exists === 1) return callback(new Error("User already exists"), null); // User exists

      // Save the new user to Redis
      db.hmset(user.username, userObj, (err, res) => {
        if (err) return callback(err, null);        // Return error if Redis fails
        callback(null, res);              // Return 'OK' if success
      });
    });
  },

  get: (username, callback) => {
    // Check if the username is provided
    if (!username) return callback(new Error("Username required"), null);

    // Check if the user exists in Redis
    db.exists(username, (err, exists) => {
      if (err) return callback(err, null);         // Return error if Redis fails
      if (exists !== 1) return callback(new Error("User not found"), null); // User does not exist

      // Retrieve all user fields from Redis
      db.hgetall(username, (err, user) => {
        if (err) return callback(err, null);       // Return error if Redis fails
        callback(null, { username, ...user });      // Return user object
      });
    });
  }
};
