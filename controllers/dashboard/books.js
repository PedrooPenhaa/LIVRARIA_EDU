const Express = require('express');
const router = Express.Router();

const isAuthenticated = require('../../middlewares/isAuthenticated');

const Users = require('../../models/Users');
const Books = require('../../models/Books');
const Bookcase = require('../../models/Bookcase');

router.get('/dashboard/books', isAuthenticated, (req, res) => {
  const session = req.session.user;

  Users.findOne({ where: { id: session.id } }).then((userData) => {

    if (userData != undefined) {

      if (userData.isAdministrator) {

        Bookcase.findAll().then(async (bookcase) => {

          try {

            const books = await Books.findAll({ order: [['id', 'DESC']] });
            res.render('./dashboard/books', { session, alert: false, type: 'success', msgContent: '', books, bookcase });
            
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

router.get('/dashboard/book/edit/:id', isAuthenticated, (req, res) => {
  const session = req.session.user;
  const id = req.params.id;

  Users.findOne({ where: { id: session.id } }).then((userData) => {

    if (userData != undefined) {

      if (userData.isAdministrator) {

        Books.findOne({ where: { id } }).then((bookData) => {

          if (bookData != undefined) {

            res.render('./dashboard/bookUpdate', { session, alert: false, type: 'success', msgContent: '', bookData });

          } else {
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

router.post('/dashboard/book/update/:id', isAuthenticated, (req, res) => {
  const session = req.session.user;
  const { title, author, cape, valuee, description } = req.body;
  const id = req.params.id;
  let visible = req.body.visible === 'on' ? 1 : 0;

  Users.findOne({ where: { id: session.id } }).then((userData) => {

    if (userData != undefined) {

      if (userData.isAdministrator) {

        Books.findOne({ where: { id } }).then((bookData) => {

          if (bookData != undefined) {

            Books.update({ title, author, cape, valuee, description, visible }, { where: { id: bookData.id } }).then(async (bookData) => {

              res.redirect('/dashboard/books');
    
            }).catch((error) => {
              console.log(error);
              res.redirect('/');
            });

          } else {
            res.redirect('/');
          }

        }).catch((error) => {
          console.log(error);
          res.redirect('/');
        })
        
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

router.post('/dashboard/book/delete/:id', isAuthenticated, (req, res) => {
  const session = req.session.user;
  const id = req.params.id;

  Users.findOne({ where: { id: session.id } }).then((userData) => {

    if (userData != undefined) {

      if (userData.isAdministrator) {

        Books.findOne({ where: { id } }).then((bookData) => {

          if (bookData != undefined) {

            Books.destroy({ where: { id: bookData.id } }).then(() => {

              res.redirect('/dashboard/books');
    
            }).catch((error) => {
              console.log(error);
              res.redirect('/');
            });

          } else {
            res.redirect('/');
          }

        }).catch((error) => {
          console.log(error);
          res.redirect('/');
        })
        
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
