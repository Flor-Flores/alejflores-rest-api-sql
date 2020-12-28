'use strict';

const express = require('express');
const { asyncHandler } = require('./middleware/async-handler');
const { User, Course } = require('./models');
// const { authenticateUser } = require('./middleware/auth-user');

// Construct a router instance.
const router = express.Router();


// Route that returns the current authenticated user.
// router.get('/users',authenticateUser, asyncHandler(async (req, res) => {

// }));


// Route that returns a list of users.

// Route that returns a list of users.
router.get('/users', async (req, res) => {

  res.json({ 
      "test": "ok"
  });

});


// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
  const user = req.body;


    console.log(user + " this is hell");
    res.status(201).json({ "message": "Account successfully created!" }).end();




  try {
    console.log(req.body);
    // const jane = await User.create({ 
    //   firstName: "John",
    //   lastName: "Smith",
    //   emailAddress: "ooohssssdddn@smith.com",
    //   password: "password"
  
    // });
    // console.log(req.body);


    await User.create(req.body);
    res.status(201).json({ "message": "Account successfully created!" });
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

module.exports = router;