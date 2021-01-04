const { Sequelize, DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize)=>{
  class User extends Model {}
  User.init({
    // Model attributes are defined here
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'a name is required'
        },
        is: {
          args:/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{0,}$/i, // must not start with a "space" but allows spaces in between
          msg: 'please enter a valid name, at least one character long'}
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'a name is required'
        },
        is: {args:/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{0,}$/i,
        msg: 'please enter a valid last name, at least one character long'}
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'The email address already exists!'
      },
      validate: {
        isEmail: {
          msg: 'Please provide a valid email address'
        },
        notNull: {
          msg: 'An email is required'
        },
      },
    },
    password: {
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        notNull: {
          msg: 'a valid password is required, it should be at least 8 characters and not include spaces'
        },
        notEmpty: {
          msg: 'a password is required, it should be at least 8 characters and not include spaces'
        },
        notContains: {
          args:'noSpace',
          msg: 'please do not use spaces, password should be at least 8 characters and not include spaces'
        },
      },
      set(value) {
        // prepare to encrypt the password, if we have a password, and it is not set to null, check for whitespace, and length and validate accordingly. 
        if (value) {
          if ( value !== null ) {
            // test that password does not contain spaces
            if (/\s/.test(value)) {
            // if it does it sets its value to noSpace, triggers notContains validation. 
              this.setDataValue('password', 'noSpace');
            } 
            else  if (value.length < 8) {
              // if it does it sets its value to noSpace, and notContains validation gets triggered. 
                this.setDataValue('password', " ");
            } else{
              // if password does not contain spaces, encryp it. 
              const hashedPassword = bcrypt.hashSync(value, 10);
              this.setDataValue('password', hashedPassword);
            }
          } 
        }
      }
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'User' // We need to choose the model name
  });

// User association with Course model: User has many Course
  User.associate = (models) => {
    User.hasMany(models.Course , { 
      as: 'instructor', // alias
      foreignKey: 'userId' 
    });
  };
  return User;
};



