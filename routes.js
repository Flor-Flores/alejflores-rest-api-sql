'use strict';
const express = require('express');
const { asyncHandler } = require('./middleware/async-handler');
const { User, Course } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');
const { courseValidationRules, validate } = require('./middleware/validator')
var bcrypt = require('bcryptjs');

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
router.post('/users', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);
    /////////////////////////////////// check the location (is this what was meant in the instructions?)
    res.append('Location', '/');
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

//////////////////////////////////  todo,    check the  order  of CRUD routes....

  // A /api/courses/:id DELETE route that will delete the corresponding course
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
          console.log('we did it!!!')
          await course.destroy();
          res.status(204).end();
          process.exit();
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
  
// A /api/courses/:id GET route that will return the corresponding course
//  along with the User that owns that course and a 200 HTTP status code.


router.get('/courses/:id', asyncHandler(async (req, res) => {
  try {
    // const course = await Course.findByPk(req.params.id); 
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
    process.exit();

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
    ////////////////////////////////// to do  set the location header to the uri
    res.setHeader('location', `/courses/${newCourse.id}`);
    console.log("begining of res" , res , "this is the new uri ???")
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

        
// A /api/courses/:id PUT route that will update the corresponding course
// and return a 204 HTTP status code and no content.
router.put('/courses/:id', authenticateUser, courseValidationRules(), validate, asyncHandler(async (req, res) => {

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
          console.log('we did it!!!')
          course = await Course.update({
            title: req.body.title,
            description: req.body.description,
            estimatedTime: req.body.estimatedTime,
            materialsNeeded: req.body.materialsNeeded
          },
            {where: { id: req.params.id } }
          );
          res.status(204).end();
          process.exit();
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




module.exports = router;