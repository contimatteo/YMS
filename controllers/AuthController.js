const VERIFY_LOGIN = true

module.exports = {

  signup(request, response) {
    return response.render('pages/auth/signup');
  },

  signin(request, response) {
    return response.render('pages/auth/signin');
  },

  dashboard(request, response) {
    return response.render('pages/dashboard');
  },

  logout(request, response) {
    request.session.destroy(function (err) {
      return response.redirect('/');
    });
  },

  userLoggedIn(request, response, next) {
    // check if user is logged
    if (request.isAuthenticated()) {
      // user is logged
      return next()
    } else {
      request.session.returnTo = request.originalUrl;
      // no logged user
      if (VERIFY_LOGIN)
        response.redirect('/signin')
      else 
        return next() 
    }
  },

  currentUser(req, res) {
    if (req && req.user) {
      return req.user;
    } else {
      return null;
    }
  }

}