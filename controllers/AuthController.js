////////////////////////////////////////////////////////////////////////////////

module.exports = {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  signup(request, response) {
    response.render('pages/auth/signup');
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  signin(request, response) {
    response.render('pages/auth/signin');
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  dashboard(request, response) {
    response.render('pages/dashboard');
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  logout(request, response) {
    request.session.destroy(function (err) {
      response.redirect('/');
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  userLoggedIn(request, response, next) {
    // save request url
    request.session.previous_url = request.originalUrl; 
    // check if user is logged
    if (request.isAuthenticated()) {
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
  currentUser(request, response, next) {
    if (request.user) {
        return request.user;
    } else {
        return null;
    }
}
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
};

////////////////////////////////////////////////////////////////////////////////