const Express = require('express');
const router = Express.Router();

const isAuthenticated = require('../../middlewares/isAuthenticated');

const Users = require('../../models/Users');

router.get('/dashboard/members', isAuthenticated, (req, res) => {
  const session = req.session.user;

  Users.findOne({ where: { id: session.id } }).then((userData) => {

    if (userData != undefined) {

      if (userData.isAdministrator) {

        Users.findAndCountAll().then((allUsers) => {

          res.render('./dashboard/members', { session, alert: false, type: 'success', msgContent: '', allUsers });

        }).catch((error) => {
          console.log(error);
          res.redirect('/');
        });
        
      } else {
        res.redirect('/');
      }

    } else {
      res.redirect('/');
    }

  }).catch((error) => {
    console.log(error);
    res.redirect('/');
  });

});

module.exports = router;
