const Express = require('express');
const Books = require('../../models/Books');
const Recomendation = require('../../models/Recomendation');
const Bookcase = require('../../models/Bookcase');
const router = Express.Router();
const Cart = require('../../models/Cart');
const Users = require('../../models/Users');
const Transactions = require(`../../models/Transactions`);

const MercadoPago = require('mercadopago');

const isAuthenticated = require('../../middlewares/isAuthenticated');

router.get('/book/:id', async (req, res) => {
  const session = req.session.user;
  const id = Number(req.params.id);

  try {

    if (isNaN(id)) throw new Error('O id deve ser um número!');

    const book = await Books.findOne({ where: { id } });

    if (book == undefined) throw new Error('Livro não encontrado!');

    res.render('./system/bookDetail', { session, book });

  } catch (error) {
    console.log(error);
    res.redirect('/');
  }

});

router.get('/bookcase', (req, res) => {
  const session = req.session.user;

  if (session != undefined) {

    Books.findAll().then((allBooks) => {

      Books.findAll({ order: [['id', 'DESC']], limit: 5 }).then(async (lastBooks) => {

        try {

          const better = await Recomendation.findOne({ where: { id: 1 } });

          Books.findOne({ where: { id: better.bookId } }).then((betterData) => {

            Bookcase.findAll({ where: { ownerId: session.id } }).then((myBooks) => {

              res.render('./system/bookcase', { session, lastBooks, betterData, myBooks, allBooks });

            }).catch((error) => {
              console.log(error);
              res.redirect('/');
            });

          }).catch((error) => {
            console.log(error);
            res.redirect('/');
          });

        } catch (error) {
          console.log(error);
          res.redirect('/');
        }

      }).catch((error) => {
        console.log(error);
        res.redirect('/');
      });

    }).catch((error) => {
      console.log(error);
      res.redirect('/');
    });

  } else {

    res.redirect('/login');

  }

});

router.post('/addItemCart/:id', isAuthenticated, async (req, res) => {
  const session = req.session.user;
  const id = req.params.id;

  Books.findOne({ where: { id } }).then((bookData) => {

    if (bookData) {

      Cart.findOne({ where: { ownerId: session.id } }).then((cartData) => {

        if (cartData.books.books.indexOf(id) === -1) {

          const newCart = [...cartData.books.books, id];

          Cart.update({ books: { books: newCart } }, { where: { ownerId: session.id } }).then(() => {

            res.redirect('/cart');

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
      });

    } else {
      res.redirect('/');
    }

  }).catch((error) => {
    console.log(error);
    res.redirect('/');
  });

});

router.get('/cart', isAuthenticated, async (req, res) => {
  const session = req.session.user;

  try {

    const myCart = await Cart.findOne({ where: { ownerId: session.id } });
    const allBooks = await Books.findAll();

    res.render('./system/cart', { myCart, allBooks });

  } catch (error) {
    console.log(error);
    res.redirect('/');
  }

});

router.post('/checkout', isAuthenticated, (req, res) => {
  const session = req.session.user;

  Users.findOne({ where: { id: session.id } }).then((userData) => {

    const dateNow = Date.now();
    const orderId = `${userData.id}-${dateNow}`;

    Cart.findOne({ where: { ownerId: session.id } }).then((cartData) => {

      Books.findAll().then(async (allBooks) => {

        Transactions.create({ orderId, status: 'pending', books: cartData.books, ownerId: userData.id }).then((transaction) => {

          Cart.update({ books: { books: [] } }, { where: { ownerId: userData.id } }).then(async () => {

            let total = 0;

            transaction.books.books.forEach((myBook) => {

              allBooks.forEach((book) => {

                if (Number(myBook) === book.id) {

                  total += book.valuee;

                }

              });

            });

            const dados = {
              items: [
                item = {
                  id: orderId,
                  title: `Compra na Livraria Livro Bom.`,
                  quantity: 1,
                  currency_id: 'BRL',
                  unit_price: parseFloat(total)
                }
              ],
              prayer: {
                email: userData.email
              },
              external_reference: orderId
            }

            try {
              const pagamento = await MercadoPago.preferences.create(dados);

              res.redirect(pagamento.body.init_point);

            } catch (error) {
              res.send(error);
            }


          }).catch((error) => {
            console.log(error);
            res.redirect('/');
          });

        }).catch((error) => {
          console.log(error);
          res.redirect('/');
        });

      }).catch((error) => {
        console.log(error);
        res.redirect('/');
      });

    }).catch((error) => {
      console.log(error);
      res.redirect('/');
    });
    
  }).catch((error) => {
    console.log(error);
    res.redirect('/');
  });

});

router.post('/not', (req, res) => {
  const id = req.query.id;

  setTimeout(() => {

    const filter = {
      "order.id": id
    }

    MercadoPago.payment.search({ qs: filter }).then(async (data) => {
      const payment = data.body.results[0];

      if (payment != undefined && payment.status === 'approved') {
        
        await res.send('ok');
        await Transactions.update({ status: payment.status }, { where: { orderId: payment.external_reference } });
        
        Transactions.findOne({ where: { orderId: payment.external_reference } }).then((transaction) => {

          transaction.books.books.forEach((myBook) => {

            Bookcase.create({ bookId: myBook, ownerId: Number(payment.external_reference.split('-')[0]) }).then(() => {

              console.log(`user ${Number(payment.external_reference.split('-')[0])} recebeu o livro ${myBook}`);

            }).catch((error) => {
              console.log(error);
            });

          });

        }).catch((error) => {
          console.log(error);
        });


      }

    }).catch((error) => {
      console.log(error);
    });

  }, 20000);

});


router.get('/myTransactions', isAuthenticated, (req, res) => {
  const session = req.session.user;

  Users.findOne({ where: { id: session.id } }).then((userData) => {

    if (userData != undefined) {

      Transactions.findAll({ where: { ownerId: userData.id } }).then(async (transactions) => {

        const allBooks = await Books.findAll();

        res.render('./system/myTransactions', { session, transactions, allBooks });

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
  });


});

module.exports = router;
