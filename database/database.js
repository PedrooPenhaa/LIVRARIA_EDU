const Sequelize = require('sequelize');

const connection = new Sequelize('SEU BANCO DE DADOS', 'root', 'SUA SENHA', {

    host: 'localhost',
    dialect: 'mysql',
    timezone: '-00:03'

});

module.exports = connection;


