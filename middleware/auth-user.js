'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('../models');

// Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser = async (req, res, next) => {
  let message; // store the message to display

  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);
  console.log(credentials)
  // If the user's credentials are available...
    // Attempt to retrieve the user from the data store
    // by their username (i.e. the user's "key"
    // from the Authorization header).
    if (credentials) {
    const user = await User.findOne({ where: {emailAddress: credentials.name} });

    if (user) {
      console.log(user);
      const authenticated = bcrypt
        .compareSync(credentials.pass, user.password);
      if (authenticated) {
        console.log(`Authentication successful for username: ${user.firstName + ' ' + user.lastName}`);

        // Store the user on the Request object.
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.firstName}`;
      }
      } else {
        message = `User not found for username: ${credentials.firstName}`;
      }
      } else {
        console.log(" auth header   not     found")
        message = 'Auth header not found';
      }

  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  }
};
