////////////////////////////////////////////////////////////////////////////////

module.exports = {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  signup(request, response) {
    return response.render('pages/auth/signup');
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  signin(request, response) {
    return response.render('pages/auth/signin');
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  dashboard(request, response) {
    return response.render('pages/dashboard');
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  logout(request, response) {
    request.session.destroy(function (err) {
      return response.redirect('/');
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
      response.redirect('/signin');
      // return next();
    }
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  currentUser(req, res) {
    if (req && req.user) {
        return req.user;
    } else {
        return null;
    }
}
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
};

////////////////////////////////////////////////////////////////////////////////