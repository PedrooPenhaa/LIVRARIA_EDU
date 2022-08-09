const Express = require('express');
const router = Express.Router();
const bcrypt = require('bcryptjs');

const Users = require('../../models/Users');
const Cart = require('../../models/Cart');


router.get('/register', (req, res) => {

  res.render('./authentication/register', { alert: false, type: 'success', msgContent: '' });

});


router.post('/register', (req, res) => {
  const name = req.body.namee;
  const email = req.body.email;
  const password = req.body.password;
  const retypePassword = req.body.retypePassword;

  if (password === retypePassword) {

    Users.findOne({ where: { email } }).then((userData) => {

      if (userData == undefined) {
        // Pode cadastrar!
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        Users.create({ name, email, password: hash }).then((userData) => {

          Cart.create({ ownerId: userData.id, books: { books: [] } }).then(() => {

            res.render('./authentication/register', { alert: true, type: 'success', msgContent: 'Este usuário foi cadastrado!' });

          }).catch((error) => {
            console.log(error);
            res.redirect('/');
          });

        }).catch((error) => {
          console.log(error);
          res.redirect('/');
        });

      } else {
        res.render('./authentication/register', { alert: true, type: 'error', msgContent: 'Este email já está cadastrado!' });
      }

    }).catch((error) => {

      console.log(error);
      res.redirect('/');

    });

  } else {

    res.render('./authentication/register', { alert: true, type: 'error', msgContent: 'O campo "Password" e "Retype Password" precisam ser iguais!' });

  }

});

module.exports = router;
