const Sequelize = require('sequelize');
const connection = require('../database/database');


const Users = connection.define('users', {

  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isAdministrator: {
    type: Sequelize.BOOLEAN,
    defaultValue: 0
  }

});

module.exports = Users;

