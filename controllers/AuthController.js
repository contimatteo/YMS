////////////////////////////////////////////////////////////////////////////////

module.exports = {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  signup(req, res) {
    res.render('pages/auth/signup');
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  signin(req, res) {
    res.render('pages/auth/signin');
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  dashboard(req, res) {
    res.render('pages/dashboard');
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  logout(req, res) {
    req.session.destroy(function (err) {
      res.redirect('/');
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  userLoggedIn(req, res, next) {
    // save request url
    req.session.previous_url = req.originalUrl;
    // check if user is authenticated
    if (req.isAuthenticated())
      return next();
    else
      // no logged user
      res.redirect('/signin');
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
};

////////////////////////////////////////////////////////////////////////////////