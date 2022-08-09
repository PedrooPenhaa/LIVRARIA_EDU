const Sequelize = require('sequelize');
const connection = require('../database/database');


const Bookcase = connection.define('Bookcase', {

  bookId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  ownerId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }

});

module.exports = Bookcase;

