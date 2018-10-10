var AuthController = require('../controllers/AuthController.js');

module.exports = function (app, passport) {

  app.get('/signup', AuthController.signup);


  app.get('/signin', AuthController.signin);


  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/signup'
  }));


  app.get('/dashboard', AuthController.userLoggedIn, AuthController.dashboard);


  app.get('/logout', AuthController.userLoggedIn, AuthController.logout);


  // app.post('/signin', passport.authenticate('local-signin', {
  //   successRedirect: '/dashboard',
  //   failureRedirect: '/signin'
  // }));

  app.post('/signin', passport.authenticate('local-signin'), function(req, res) {
    // console.log("ci siamo")
    nextUrl = req.session.previous_url || "/";
    res.redirect(nextUrl);
    // res.redirect("/");
  });




}