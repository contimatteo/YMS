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
    req.session.previous_url = req.originalUrl;  // save request url
    // check if user is logged
    if (req.isAuthenticated()) {
      // user is logged
      return next();
    }
    else {
      // no logged user
      // res.redirect('/signin');
      return next();
    }
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
};

////////////////////////////////////////////////////////////////////////////////