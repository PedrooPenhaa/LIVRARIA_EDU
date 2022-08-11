const Express = require('express');
const Books = require('../../models/Books');
const Recomendation = require('../../models/Recomendation');
const router = Express.Router();

router.get('/', (req, res) => {
  const session = req.session.user;

  Books.findAll({ order: [['id', 'DESC']], limit: 5 }).then(async (lastBooks) => {

    try {

      const better = await Recomendation.findOne({ where: { id: 1 } });

      if (better) {

        Books.findOne({ where: { id: better.bookId } }).then((betterData) => {

          res.render('./system/home', { session, lastBooks, betterData });
  
        }).catch((error) => {
          console.log(error);
          res.redirect('/');
        });

      } else {

        res.render('./system/home', { session, lastBooks, betterData: null });

      }

    } catch (error) {
      console.log(error);
      res.redirect('/');
    }

  }).catch((error) => {
    console.log(error);
    res.redirect('/');
  });

});

module.exports = router;
