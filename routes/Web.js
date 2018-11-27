////////////////////////////////////////////////////////////////////////////////
var VideosController = require('../controllers/VideosController.js');
var ArtistsController = require('../controllers/ArtistsController.js');
var AuthController = require('../controllers/AuthController.js');
////////////////////////////////////////////////////////////////////////////////
const defaultVideoNumbers = 10;
////////////////////////////////////////////////////////////////////////////////

module.exports = function (app, passport) {
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// MAIN ROUTE //////////////////////////////////
  // search page route
  app.get('/', function (req, res) {
    res.render('pages/home/home');
  });
  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////// VIDEOS ROUTE /////////////////////////////////
  // search page route
  app.get('/videos', AuthController.userLoggedIn, function (req, res) {
    res.send("/videos");
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // search page route
  app.get('/videos/search', AuthController.userLoggedIn, function (req, res) {
    var pageToken = req.query.page;
    VideosController.index(res, "Eminem", "", pageToken, defaultVideoNumbers);
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.post('/videos/search', AuthController.userLoggedIn, function (req, res) {
    var searchString = req.body.search_string;
    var searchType = req.body.search_type;
    var pageToken = req.query.page;
    VideosController.index(res, searchString, searchType, pageToken, defaultVideoNumbers);
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // search page route
  app.get('/videos/suggestioned', AuthController.userLoggedIn, function (req, res) {
    res.send("/suggestioned");
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // show single video
  app.get('/videos/:id', AuthController.userLoggedIn, function (req, res) {
    var youtubeId = req.params.id;
    // create and render video page
    VideosController.create(res, youtubeId).then(function (videoObject) {
      VideosController.show(res, youtubeId);
      // save video history
      var currentUser = AuthController.currentUser(req, res);
      if(currentUser) 
        VideosController.storeUserAndVideoHistoryPartialAssociation(currentUser.id, videoObject.id);
    }).catch(function (error) {
      console.log("%j", error);
      res.send(error);
    });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // route for testing video creation
  app.get('/videos/:id/create', AuthController.userLoggedIn, function (req, res) {
    var youtubeId = req.params.id;
    VideosController.create(res, youtubeId).then(function (results) {
      res.send(results);
    }).catch(function (error) {
      console.log(error);
      res.send(error);
    });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/videos/:id/viewed/:user', AuthController.userLoggedIn, function (req, res) {
    var id = req.params.id;
    var userId = req.params.user;
    VideosController.addView(res, userId, id);
  });
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// USERS ROUTE /////////////////////////////////
  // search page route
  app.get('/user', AuthController.userLoggedIn, function (req, res) {
    res.send("/user");
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/user/playlist', AuthController.userLoggedIn, function (req, res) {
    res.send("/user/playlist");
  });
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////// ARTISTS ROUTE /////////////////////////////////
  // search page route
  // app.get('/artists/:name/create', function (req, res) {
  //   var name = req.params.name;
  //   ArtistsController.create(res, name).then(function (artistCreated) {
  //       res.send(artistCreated);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //       res.send(error);
  //     });
  // });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get artist info
  // app.get('/artists/:name', function (req, res) {
  //   var name = req.params.name;
  //   ArtistsController.getArtistInfo(res, name).then(function (artistData) {
  //       res.send(artistData);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //       res.send(error);
  //     });
  // });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/artists/:name/create/relations/artists', AuthController.userLoggedIn, function (req, res) {
    var name = req.params.name;
    ArtistsController.createRelated(res, name);
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/suggestioned', AuthController.userLoggedIn, function (req, res) {
    VideosController.showSuggestionedVideos(res);
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/about-us', AuthController.userLoggedIn, function (req, res) {
    res.render('pages/about/about-us')
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
};
////////////////////////////////////////////////////////////////////////////////