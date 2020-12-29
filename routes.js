'use strict';

const express = require('express');
const { asyncHandler } = require('./middleware/async-handler');
const { User, Course } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');

// Construct a router instance.
const router = express.Router();


// Route that returns the current authenticated user.

router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;

  try {
  res.json({
    name: user.firstName,
    username: user.emailAddress
  });
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
  const user = req.body;

  try {
    await User.create(req.body);
    /////////////////////////////////// check the location
    res.set('location', '/');
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
  const user = req.currentUser;

  try {

    const courses = await Course.findAll();
    // console.log(courses.every(course => course instanceof Course)); // true
    // console.log("All courses:", JSON.stringify(courses, null, 2));

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

//////////////////////////////////  todo,    check the order  of CRUD routes....


  // A /api/courses/:id DELETE route that will delete the corresponding course
  //  and return a 204 HTTP status code and no conte nt.
  router.delete('/courses/:id', asyncHandler(async (req, res) => {

    try {
      const course = await Course.findByPk(req.params.id); 
      console.log(course)
      await course.destroy();

  
      res.status(204).end();
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
  


// A /api/courses/:id GET route that will return the corresponding course
//  along with the User that owns that course and a 200 HTTP status code.
router.get('/courses/:id', asyncHandler(async (req, res) => {

  try {
    // const course = await Course.findByPk(req.params.id); 
    const course = await Course.findOne({ 
      where: { id: req.params.id },
      include: [
        {
          model:User,
          as: 'instructor'
        }
      ],
      through: {
        // this removes the through model properties from being included
        attributes: [],
      }
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
router.post('/courses/', asyncHandler(async (req, res) => {
  const user = req.body;

  try {
    await Course.create(req.body);
    ////////////////////////////////// to do  set the location header to the uri
    res.set('location', '/courses/:id');

    console.log(res.location, "this is the new uri")
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


// A /api/courses/:id PUT route that will update the corresponding course
// and return a 204 HTTP status code and no content.
router.put('/courses/:id', asyncHandler(async (req, res) => {
  // var course = req.course;
  // console.log(course)


  try {
    // const course = await Course.findByPk(req.params.id); 
    const course = await Course.update({
      title: req.body.title,
      description: req.body.description,
      estimatedTime: req.body.estimatedTime,
      materialsNeeded: req.body.materialsNeeded
    },
      {where: { id: req.params.id } }

      // {description: req.body.description},
      // {estimatedTime: req.body.estimatedTime},
      // {materialsNeeded: req.body.materialsNeeded},

    );


    // res.json({});
    res.status(204).end();
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




module.exports = router;