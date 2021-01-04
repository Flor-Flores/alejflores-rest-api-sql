'use strict';

// Load modules
const express = require('express');
const morgan = require('morgan');
const {Sequelize} = require('sequelize');

// Sequelize instance
const sequelize = new Sequelize({
    storage : 'fsjstd-restapi.db',
    dialect: 'sqlite',
});
// import routes
const routes = require('./routes');

// Variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// Create the Express app
const app = express();

app.use(express.json());

// Setup morgan which gives us http request logging
app.use(morgan('dev'));

// Setup a friendly greeting for the root route
app.get('/', async (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// Test the DB connection and sync 
(async () => {
  console.log('Testing the connection to the database...');
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
  try {
    console.log('Syncing the database...');
    await sequelize.sync();
    console.log('Sync successful.');
  } catch (err) {
    console.error('Unable to sync the database:', err);
  }
})();

// Set /api routes 
app.use("/api", routes);

// Send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// Setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }
  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// Set our port
app.set('port', process.env.PORT || 5000);

// Start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
