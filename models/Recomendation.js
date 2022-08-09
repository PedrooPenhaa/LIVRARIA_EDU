const Sequelize = require('sequelize');
const connection = require('../database/database');


const Recomendation = connection.define('recomendation', {

  bookId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }

});

module.exports = Recomendation;

