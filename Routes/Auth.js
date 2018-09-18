var AuthController = require('../Controllers/AuthController.js');
var AuthHelper = require('../Controllers/Helpers/AuthHelper.js');

module.exports = function (app, passport) {

  app.get('/signup', AuthController.signup);


  app.get('/signin', AuthController.signin);


  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/signup'
  }));


  app.get('/dashboard', AuthHelper.userLoggedIn, AuthController.dashboard);


  app.get('/logout', AuthHelper.userLoggedIn, AuthController.logout);


  app.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/dashboard',
    failureRedirect: '/signin'
  }));


  // function isLoggedIn(req, res, next) {
  //   if (req.isAuthenticated())
  //     return next();
  //   // no logged user
  //   res.redirect('/signin');
  // }


}