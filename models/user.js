const { Sequelize, DataTypes, Model } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory');

module.exports = (sequelize)=>{

  class User extends Model {}

  User.init({
    // Model attributes are defined here
    firstName: {
      type: DataTypes.STRING
      // allowNull: false
    },
    lastName: {
      type: DataTypes.STRING
    },
    emailAddress: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'User' // We need to choose the model name
  });

// User association with Course model: User has many Course
User.associate = (models) => {

  // User.hasMany(models.Course );
  User.hasMany(models.Course , { 
    as: 'instructor', // alias

    foreignKey: 'userId' 
  
  
  });



};




  return User;
};
