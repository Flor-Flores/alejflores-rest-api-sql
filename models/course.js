const { Sequelize, DataTypes, Model } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory');

module.exports = (sequelize)=>{

  class Course extends Model {}

  Course.init({
    // Model attributes are defined here
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    estimatedTime: {
      type: DataTypes.STRING
    },
    materialsNeeded: {
      type: DataTypes.STRING
    }
  }, {
    sequelize, 
    modelName: 'Course' 
  });

  // Course association with User model: Course has one User
  Course.associate = (models) => {
    Course.belongsTo(models.User , { 
      as: 'instructor', // alias
      // attributes: {exclude: ['createdAt', 'updatedAt']},

      foreignKey: 'userId' 
    
    
    });


  };










return Course;
};
