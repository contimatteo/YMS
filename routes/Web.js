////////////////////////////////////////////////////////////////////////////////
var VideosControllerClass = require('../controllers/VideosController.js');
var TestControllerClass = require('../controllers/TestController.js');
var AuthController = require('../controllers/AuthController.js');
////////////////////////////////////////////////////////////////////////////////
const VideosController = new VideosControllerClass();
const TestController = new TestControllerClass();
const defaultVideoNumbers = 10;
////////////////////////////////////////////////////////////////////////////////
module.exports = function (app, passport) {
  // main route
  app.get('/', function (request, response) {
    response.render('pages/home/home');
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // VIDEOS ROUTES
  // search page route
  app.get('/videos', AuthController.userLoggedIn, function (request, response) {
    response.send("/videos");
  });
  // search page route
  app.get('/videos/search', AuthController.userLoggedIn, function (request, response) {
    // console.log(request.query.page);
    var pageToken=request.query.page;
    VideosController.index(response, "Nothing Else Matters", "", pageToken, defaultVideoNumbers);
  });
  app.post('/videos/search', AuthController.userLoggedIn, function (request, response) {
    var searchString=request.body.search_string;
    var searchType=request.body.search_type;
    var pageToken=request.query.page;
    console.log(request.query.page);
    VideosController.index(response, searchString, searchType, pageToken, defaultVideoNumbers);
  });
  // search page route
  app.get('/videos/suggestioned', AuthController.userLoggedIn, function (request, response) {
    response.send("/suggestioned");
  });
  // api testing route
  app.get('/videos/:id', AuthController.userLoggedIn, function (request, response) {
    var id = request.params.id;
    VideosController.show(response, id);
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/enri', function (request, response) {
    VideosController.initializeArtists(response);
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/user', AuthController.userLoggedIn, function (request, response) {
   response.send("/user");
  });
  app.get('/user/playlist', AuthController.userLoggedIn, function (request, response) {
    response.send("/user/playlist");
  });
  
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
};
////////////////////////////////////////////////////////////////////////////////