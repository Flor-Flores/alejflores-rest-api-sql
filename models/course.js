const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = (sequelize)=>{
  class Course extends Model {}
  Course.init({
    // Model attributes are defined here
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        customValidator(value) {
        let regex = /[^\s]/; // whitespace regex
        let valAuth =  value.replace(regex, ''); // check for whitespace to avoid whitespace only submissions
          if (valAuth < 10  ) {
            throw new Error("title can't be empty or less than 10 character (not including spaces)");
          }
        },
        notNull: {
          msg: 'a title is required'
        },
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        customValidator(value) {
        let regex = /[^\s]/; // whitespace regex
        let valAuth =  value.replace(regex, ''); // check for whitespace to avoid whitespace only submissions
          if (valAuth < 10  ) {
            throw new Error("description can't be empty or less than 10 character (not including spaces)");
          }
        },
        notNull: {
          msg: 'a description is required'
        },
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
