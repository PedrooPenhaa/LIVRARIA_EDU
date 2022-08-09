const Express = require('express');
const router = Express.Router();

const bcrypt = require('bcryptjs');

const Users = require('../../models/Users');

router.get('/login', (req, res) => {

  res.render('./authentication/login', { alert: false, type: 'success', msgContent: '' });

});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  Users.findOne({ where: { email } }).then((userData) => {

    if (userData != undefined) {

      const isValid = bcrypt.compareSync(password, userData.password);

      if (isValid) {

        req.session.user = {
          id: userData.id,
          name: userData.name
        }
        
        res.redirect('/');

      } else {

        res.render('./authentication/login', { alert: true, type: 'error', msgContent: 'Email ou senha não conferem!' });

      }

    } else {

      res.render('./authentication/login', { alert: true, type: 'error', msgContent: 'Email ou senha não conferem!' });

    }

  }).catch((error) => {
    console.log(error);
    res.redirect('/');
  });

});

module.exports = router;
