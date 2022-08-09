const Bookcase = require('./Bookcase');
const Books =  require('./Books');
const Recomendation = require('./Recomendation');
const Users = require('./Users');
const Cart = require('./Cart');
const Transactions = require('./Transactions');

Users.sync({ force: true });
Books.sync({ force: true });
Recomendation.sync({ force: true });
Bookcase.sync({ force: true });
Cart.sync({ force: true });
Transactions.sync({ force: true });
