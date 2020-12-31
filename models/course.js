const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = (sequelize)=>{
  class Course extends Model {}
  Course.init({
    // Model attributes are defined here
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A course title is required'
        },
        notEmpty: {
          msg: 'Please provide a valid title'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A course description is required'
        },
        notEmpty: {
          msg: 'Please provide a valid name'
        }
      }
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
      foreignKey: 'userId' 
    });
  };

return Course;
};
