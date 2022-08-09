const Sequelize = require('sequelize');
const connection = require('../database/database');


const Transactions = connection.define('transactions', {

  orderId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  books: {
    type: Sequelize.JSON,
    allowNull: false
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ownerId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }

});

module.exports = Transactions;

