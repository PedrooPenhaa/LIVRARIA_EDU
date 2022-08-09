const Sequelize = require('sequelize');
const connection = require('../database/database');


const Books = connection.define('books', {

  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  author: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cape: {
    type: Sequelize.STRING,
    allowNull: false
  },
  valuee: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  visible: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: 1
  }

});

module.exports = Books;

