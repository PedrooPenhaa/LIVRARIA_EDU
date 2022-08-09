const Express = require('express');
const session = require('express-session');

const MercadoPago = require('mercadopago');

const connection = require('./database/database');


const app = Express();

// const allModels = require('./models/allModels');

app.use(session({
  secret: 'XHDE-ASDF-JKSX-SDCV-ASEE-WDSSA-ASDFE',
  cookie: { maxAge: (((1000 * 60) * 60) * 24) },
  resave: true,
  saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.use(Express.static('public'));
app.use(Express.json({ limit: '50mb' }));

app.use(Express.urlencoded({ extended: true, limit: '50mb' }));

const loginController = require('./controllers/authentication/login');
const registerController = require('./controllers/authentication/register');
const homeController = require('./controllers/system/home');
const bookController = require('./controllers/system/books');

const dashHomeController = require('./controllers/dashboard/home');
const dashBooksController = require('./controllers/dashboard/books');
const dashMembersController = require('./controllers/dashboard/members');


app.use('/', homeController);
app.use('/', bookController);
app.use('/', registerController);
app.use('/', loginController);
app.use('/', dashHomeController);
app.use('/', dashBooksController);
app.use('/', dashMembersController);

MercadoPago.configure({
  sandbox: true, 
  access_token: ''
});

connection.authenticate().then(() => {
  
  console.log('Conectei com Banco de Dados!');

  app.listen(8080, (error) => {

    if (!error) {

      console.log('Servidor rodando na porta 8080!');

    } else {
      console.log(error);
    }

  });


}).catch((error) => {

  console.log(error);

});
