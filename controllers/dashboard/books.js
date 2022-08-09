const Express = require('express');
const router = Express.Router();

const isAuthenticated = require('../../middlewares/isAuthenticated');

const Users = require('../../models/Users');
const Books = require('../../models/Books');

router.get('/dashboard/books', isAuthenticated, (req, res) => {
  const session = req.session.user;

  Users.findOne({ where: { id: session.id } }).then(async (userData) => {

    if (userData != undefined) {

      if (userData.isAdministrator) {

        try {

          const books = await Books.findAll({ order: [['id', 'DESC']] });
          res.render('./dashboard/books', { session, alert: false, type: 'success', msgContent: '', books });
          
        } catch (error) {
         
          console.log(error);
          res.redirect('/');

        }

        
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

router.get('/dashboard/books/new', isAuthenticated, (req, res) => {
  const session = req.session.user;

  Users.findOne({ where: { id: session.id } }).then((userData) => {

    if (userData != undefined) {

      if (userData.isAdministrator) {

        res.render('./dashboard/booksNew', { session, alert: false, type: 'success', msgContent: '' });
        
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

router.post('/dashboard/books/new', isAuthenticated, (req, res) => {
  const session = req.session.user;
  const { title, author, cape, valuee, description } = req.body;
  let visible = req.body.visible === 'on' ? 1 : 0;

  Users.findOne({ where: { id: session.id } }).then((userData) => {

    if (userData != undefined) {

      if (userData.isAdministrator) {

        Books.create({ title, author, cape, valuee, description, visible }).then(async (bookData) => {

          try {
            
          const books = await Books.findAll({ order: [[id, 'DESC']] });
          res.render('./dashboard/books', { session, alert: true, type: 'success', msgContent: `${bookData.title} foi cadastrado com sucesso!`, books });

          } catch (error) {
            console.log(error);
            res.redirect('/');            
          }

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
