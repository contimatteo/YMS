////////////////////////////////////////////////////////////////////////////////

module.exports = {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  signup(req, res) {
    res.render('signup');
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  signin(req, res) {
    res.render('signin');
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  dashboard(req, res) {
    res.render('dashboard');
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  logout(req, res) {
    req.session.destroy(function (err) {
      res.redirect('/');
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  userLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    // no logged user
    res.redirect('/signin');
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  userLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    // no logged user
    res.redirect('/signin');
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
};

////////////////////////////////////////////////////////////////////////////////