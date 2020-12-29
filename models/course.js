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
      type: DataTypes.TEXT
    },
    estimatedTime: {
      type: DataTypes.STRING
    },
    materialsNeeded: {
      type: DataTypes.STRING
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Course' // We need to choose the model name
  });


  // Course association with User model: Course has one User
  Course.associate = (models) => {

    // Course.belongsTo(models.User , { foreignKey: 'userId' });
    Course.belongsTo(models.User , { 
      as: 'instructor', // alias

      foreignKey: 'userId' 
    
    
    });


    // , {
    //   as: 'director', // alias
    //   foreignKey: {
    //     fieldName: 'directorPersonId',
    //     allowNull: false,
    //   },
    // }


  };










return Course;
};
