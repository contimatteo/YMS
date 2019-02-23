var VideosController = require('../controllers/VideosController.js')
var ArtistsController = require('../controllers/ArtistsController.js')
var AuthController = require('../controllers/AuthController.js')

const defaultVideoNumbers = 10;

module.exports = function (app, passport) {

  ////////////////////////////////// MAIN ROUTE //////////////////////////////////
  // search page route
  app.get('/', function (req, res) {
    res.render('pages/home/home')
  })

  ///////////////////////////////// VIDEOS ROUTE /////////////////////////////////
  app.get('/videos/search', AuthController.userLoggedIn, function (req, res) {
    var searchString = req.body.search_string;
    var searchType = req.body.search_type;
    var pageToken = req.query.page;
    VideosController.index(res, searchString, searchType, pageToken, defaultVideoNumbers)
  })
  
  app.post('/videos/search', AuthController.userLoggedIn, function (req, res) {
    var searchString = req.body.search_string;
    var searchType = req.body.search_type;
    var pageToken = req.query.page;
    VideosController.index(res, searchString, searchType, pageToken, defaultVideoNumbers)
  })

  // show single video
  app.get('/videos/:id', AuthController.userLoggedIn, function (req, res) {
    var youtubeId = req.params.id;
    // create and render video page
    return VideosController.create(res, youtubeId).then(function (videoObject) {
      // save video history
      var currentUser = AuthController.currentUser(req, res)
      if (currentUser)
        VideosController.storeUserAndVideoHistoryPartialAssociation(currentUser.id, videoObject.id)
      // show the video
      return VideosController.show(res, youtubeId)
    }).catch(function (error) {
      res.send(error)
    })
  })

  // route for testing video creation
  app.get('/videos/:id/create', AuthController.userLoggedIn, function (req, res) {
    var youtubeId = req.params.id;
    VideosController.create(res, youtubeId).then(function (results) {
      res.send(results)
    }).catch(function (error) {
      res.send(error)
    })
  })

  app.get('/videos/:id/viewed/:user', AuthController.userLoggedIn, function (req, res) {
    var id = req.params.id;
    var userId = req.params.user;
    VideosController.addView(res, userId, id)
  })

  ////////////////////////////////// USERS ROUTE /////////////////////////////////
  // search page route
  app.get('/user', AuthController.userLoggedIn, function (req, res) {
    res.send("/user")
  })

  app.get('/user/playlist', AuthController.userLoggedIn, function (req, res) {
    res.send("/user/playlist")
  })
  
  //////////////////////////////// ARTISTS ROUTE /////////////////////////////////
  app.get('/artists/:name/create/relations/artists', AuthController.userLoggedIn, function (req, res) {
    var name = req.params.name;
    ArtistsController.createRelated(res, name)
  })

  app.get('/suggestioned', AuthController.userLoggedIn, function (req, res) {
    VideosController.showSuggestionedVideos(res)
  })

  app.get('/about-us', AuthController.userLoggedIn, function (req, res) {
    res.render('pages/about/about-us')
  })

  app.get('/suggestioned/:genre', AuthController.userLoggedIn, function (req, res) {
    var genere = req.params.genre;
    VideosController.showSuggestionedByUs(res, genere)
  })
}