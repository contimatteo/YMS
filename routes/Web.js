////////////////////////////////////////////////////////////////////////////////
var VideosController = require('../controllers/VideosController.js');
var ArtistsController = require('../controllers/ArtistsController.js');
var TestControllerClass = require('../controllers/TestController.js');
var AuthController = require('../controllers/AuthController.js');
////////////////////////////////////////////////////////////////////////////////
const TestController = new TestControllerClass();
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
  // search page route
  app.get('/videos/search', AuthController.userLoggedIn, function (req, res) {
    var pageToken = req.query.page;
    VideosController.index(res, "Nothing Else Matters", "", pageToken, defaultVideoNumbers);
  });
  app.post('/videos/search', AuthController.userLoggedIn, function (req, res) {
    var searchString = req.body.search_string;
    var searchType = req.body.search_type;
    var pageToken = req.query.page;
    VideosController.index(res, searchString, searchType, pageToken, defaultVideoNumbers);
  });
  // search page route
  app.get('/videos/suggestioned', AuthController.userLoggedIn, function (req, res) {
    res.send("/suggestioned");
  });
  // api testing route
  app.get('/videos/:id', AuthController.userLoggedIn, function (req, res) {
    var id = req.params.id;
    VideosController.show(res, id);
  });
  app.get('/videos/create/:title', function (req, res) {
    var title = req.params.title;
    VideosController.create(res, title).then(function (videoCreated) {
        res.send(videoCreated);
      })
      .catch(function (error) {
        res.send(error);
      });
  });
  app.get('/videos/:id/viewed/:user', function (req, res) {
    var id = req.params.id;
    var userId = req.params.userId;
    // VideoController.createRelated(res, name);
  });
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// USERS ROUTE /////////////////////////////////
  // search page route
  app.get('/user', AuthController.userLoggedIn, function (req, res) {
    res.send("/user");
  });
  app.get('/user/playlist', AuthController.userLoggedIn, function (req, res) {
    res.send("/user/playlist");
  });
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////// ARTISTS ROUTE /////////////////////////////////
  // search page route
  app.get('/artists/create/:name', function (req, res) {
    var name = req.params.name;
    ArtistsController.create(res, name).then(function (artistCreated) {
        res.send(artistCreated);
      })
      .catch(function (error) {
        res.send(error);
      });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get artist info
  app.get('/artists/:name', function (req, res) {
    var name = req.params.name;
    ArtistsController.getArtistInfo(res, name).then(function (artistData) {
        res.send(artistData);
      })
      .catch(function (error) {
        res.send(error);
      });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/artists/create/:name/relations/artists', function (req, res) {
    var name = req.params.name;
    ArtistsController.createRelated(res, name);
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
};
////////////////////////////////////////////////////////////////////////////////