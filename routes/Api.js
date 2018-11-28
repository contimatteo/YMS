////////////////////////////////////////////////////////////////////////////////
var SparqlController = require('../controllers/SparqlController.js');
var RecommenderController = require('../controllers/RecommenderController.js');
var AuthController = require('../controllers/AuthController.js');
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
module.exports = function (app, passport) {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/recommender/vitali/:id', function (req, res) {
    var id = req.params.id;
    RecommenderController.vitali(id).then(function (result) {
        res.send(result);
      })
      .catch(function (error) {
        res.status(400);
        res.send(error);
      });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/recommender/popularity/local/absolute', AuthController.userLoggedIn, function (req, res) {
    RecommenderController.localAbsolutePopularity(res).then(function (result) {
      res.send(result);
    }).catch(function (error) {
      res.status(400);
      res.send(error);
    });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/recommender/popularity/local/relative/:video', AuthController.userLoggedIn, function (req, res) {
    var videoId = req.params.video;
    // var userId = req.params.user;
    RecommenderController.localRelativePopularity(res, videoId).then(function (result) {
      res.send(result);
    }).catch(function (error) {
      res.status(400);
      res.send(error);
    });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/recommender/random', AuthController.userLoggedIn, function (req, res) {
    RecommenderController.random(null).then(function (result) {
      res.send(result);
    }).catch(function (error) {
      res.status(400);
      res.send(error);
    });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/recommender/recent/:user', AuthController.userLoggedIn, function (req, res) {
    var userId = req.params.user;
    RecommenderController.recent(res,userId).then(function (result) {
      res.send(result);
    }).catch(function (error) {
      res.status(400);
      res.send(error);
    });
  });
   // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   app.get('/recommender/related/:id', AuthController.userLoggedIn, function (req, res) {
    var id = req.params.id;
    RecommenderController.related(res,id).then(function (result) {
      res.send(result);
    }).catch(function (error) {
      res.status(400);
      res.send(error);
    });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/recommender/popularity/global/relative/:video', AuthController.userLoggedIn, function (req, res) {
    var videoId = req.params.video;
    RecommenderController.globalRelativePopularity(videoId).then(function (result) {
      res.send(result);
    }).catch(function (error) {
      res.status(400);
      res.send(error);
    });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/recommender/popularity/global/absolute/:video', AuthController.userLoggedIn, function (req, res) {
    var videoId = req.params.video;
    RecommenderController.globalAbsolutePopularity(videoId).then(function (result) {
      res.send(result);
    }).catch(function (error) {
      res.status(400);
      res.send(error);
    });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/recommender/similarity/artist/:video', AuthController.userLoggedIn, function (req, res) {
    var videoId = req.params.video;
    RecommenderController.artistSimilarity(res, videoId).then(function (result) {
      res.send(result);
    }).catch(function (error) {
      res.status(400);
      res.send(error);
    });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/recommender/similarity/bandMembers/:video', AuthController.userLoggedIn, function (req, res) {
    var videoId = req.params.video;
    RecommenderController.bandMembersSimilarity(res, videoId).then(function (result) {
      res.send(result);
    }).catch(function (error) {
      res.status(400);
      res.send(error);
    });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/recommender/similarity/genre/:video', AuthController.userLoggedIn, function (req, res) {
    var videoId = req.params.video;
    RecommenderController.genreSimilarity(null, videoId).then(function (result) {
      res.send(result);
    }).catch(function (error) {
      res.status(400);
      res.send(error);
    });
  });

};
////////////////////////////////////////////////////////////////////////////////
