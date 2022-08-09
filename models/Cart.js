const Sequelize = require('sequelize');
const connection = require('../database/database');


const Cart = connection.define('Cart', {

  ownerId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  books: {
    type: Sequelize.JSON,
    allowNull: false
  }

});

module.exports = Cart;

