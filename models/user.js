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

  // User.hasMany(Course)
  // the defined model is the class itself
  console.log(User === sequelize.models.User); // true

  return User;
};
