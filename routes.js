'use strict';
const express = require('express');
const { asyncHandler } = require('./middleware/async-handler');
const { User, Course } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');

// Construct a router instance.
const router = express.Router();

// Route that returns the current authenticated user.
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const currentUser = req.currentUser;
  try {
    res.json({currentUser});
    res.status(201).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

// Route that creates a new user.
router.post('/users',  asyncHandler(async (req, res) => {
  // Create a new user instance with the req.body info.
  const newUser = req.body;
  try {
    await User.create(newUser);
    res.location('/');
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

// A /api/courses GET route that will return a list of all courses 
// including the User that owns each course and a 200 HTTP status code.
router.get('/courses', asyncHandler(async (req, res) => {
  try {
    const courses = await Course.findAll({ 
      attributes: {exclude: ['createdAt', 'updatedAt']},
      include: [
        {
          model:User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName', 'emailAddress']
        }
      ],
    });
    res.json(courses);
    res.status(200).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

// A /api/courses/:id GET route that will return the corresponding course
//  along with the User that owns that course and a 200 HTTP status code.
router.get('/courses/:id', asyncHandler(async (req, res) => {
  try {
    const course = await Course.findOne({ 
      attributes: {exclude: ['createdAt', 'updatedAt']},
      where: { id: req.params.id },
      include: [
        {
          model:User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName', 'emailAddress']
        }
      ],
    });
    res.json(course);
    res.status(200).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

// A /api/courses POST route that will create a new course, 
// set the Location header to the URI for the newly created course, 
// and return a 201 HTTP status code and no content.
router.post('/courses/', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const newCourse = await Course.create(req.body);
    res.location(`/courses/${newCourse.id}`); 
    res.status(201).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

// A /api/courses/:id PUT route that will update the corresponding course (if it belongs to the currentUser via authenticateUser)
// and return a 204 HTTP status code and no content.
router.put('/courses/:id', authenticateUser,  asyncHandler(async (req, res) => {
  
  try {
    let course = await Course.findOne({ 
      attributes: {exclude: ['createdAt', 'updatedAt']},
      where: { id: req.params.id },
      include: [
        {
          model:User,
          as: 'instructor',
          attributes: ['id']
        }
      ],
    });
    if(course.userId === req.currentUser.id){
      course = await Course.update({
        title: req.body.title,
        description: req.body.description,
        estimatedTime: req.body.estimatedTime,
        materialsNeeded: req.body.materialsNeeded
      },
        {where: { id: req.params.id } }
      );
      res.status(204).end();
    } else {
      res.status(403).json({ message: 'You did not create this course, therefore you can not edit it.' }).end();
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;  
    } 
  }
}));

  // A /api/courses/:id DELETE route that will delete the corresponding (if it belongs to the currentUser via authenticateUser) course
  //  and return a 204 HTTP status code and no content.
  router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    try {
      let course = await Course.findOne({ 
        attributes: {exclude: ['createdAt', 'updatedAt']},
        where: { id: req.params.id },
        include: [
          {
            model:User,
            as: 'instructor',
            attributes: ['id']
          }
        ],
      });
        if(course.userId === req.currentUser.id){
          await course.destroy();
          res.status(204).end();
        } else {
          res.status(403).json({ message: 'You did not create this course, therefore you can not delete it.' }).end();
        }
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









