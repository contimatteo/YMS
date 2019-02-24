var SparqlController = require('../controllers/SparqlController.js')
var RecommenderController = require('../controllers/RecommenderController.js')
var AuthController = require('../controllers/AuthController.js')
var ApiController = require('../controllers/ApiController.js')
var VideosController = require('../controllers/VideosController.js')

module.exports = function (app, passport) {

  app.get('/recommender/vitali/:id', function (req, res) {
    var id = req.params.id;
    RecommenderController.vitali(id).then(function (result) {
        res.send(result)
      })
      .catch(function (error) {
        res.status(400)
        res.send(error)
      })
  })

  app.get('/recommender/random', function (req, res) {
    RecommenderController.random(null).then(function (result) {
      res.send(result)
    }).catch(function (error) {
      res.status(400)
      res.send(error)
    })
  })

  app.get('/recommender/recent/:user', function (req, res) {
    var userId = req.params.user;
    RecommenderController.recent(res, userId).then(function (result) {
      res.send(result)
    }).catch(function (error) {
      res.status(400)
      res.send(error)
    })
  })

  app.get('/recommender/related/:id', function (req, res) {
    var id = req.params.id;
    RecommenderController.related(res, id).then(function (result) {
      res.send(result)
    }).catch(function (error) {
      res.status(400)
      res.send(error)
    })
  })

  app.get('/recommender/popularity/local/absolute', function (req, res) {
    RecommenderController.localAbsolutePopularity(res).then(function (result) {
      res.send(result)
    }).catch(function (error) {
      res.status(400)
      res.send(error)
    })
  })

  app.get('/recommender/popularity/local/relative/:video', function (req, res) {
    var videoId = req.params.video;
    // var userId = req.params.user;
    RecommenderController.localRelativePopularity(res, videoId).then(function (result) {
      res.send(result)
    }).catch(function (error) {
      res.status(400)
      res.send(error)
    })
  })

  app.get('/recommender/popularity/global/relative/:video', function (req, res) {
    var videoId = req.params.video;
    RecommenderController.globalRelativePopularity(videoId).then(function ({videosData, end}) {
      res.status(!!end ? 200 : 206).json(videosData)
    }).catch(function (error) {
      res.status(400).json(error)
    })
  })

  app.get('/recommender/popularity/global/absolute', function (req, res) {
    var videoId = req.params.video;
    RecommenderController.globalAbsolutePopularity().then(function ({videosData, end}) {
      res.status(!!end ? 200 : 206).json(videosData)
    }).catch(function (error) {
      res.status(400).json(error)
    })
  })

  app.get('/recommender/similarity/artist/:video', function (req, res) {
    var videoId = req.params.video;
    RecommenderController.artistSimilarity(res, videoId).then(function (result) {
      res.send(result)
    }).catch(function (error) {
      res.status(400)
      res.send(error)
    })
  })

  app.get('/recommender/similarity/bandMembers/:video', function (req, res) {
    var videoId = req.params.video;
    RecommenderController.bandMembersSimilarity(res, videoId).then(function (result) {
      res.send(result)
    }).catch(function (error) {
      res.status(400)
      res.send(error)
    })
  })

  app.get('/recommender/similarity/genre/:video', function (req, res) {
    var videoId = req.params.video;
    RecommenderController.genreSimilarity(null, videoId).then(function (result) {
      res.status(200).json(result)
    }).catch(function (error) {
      res.status(400).json(error)
    })
  })

  app.get('/globpop', function (req, res) {
    if (req.query.id && req.query.id !== "") {
      // relative popularity globpop
      var youtubeId = req.query.id
      ApiController.globpop(youtubeId).then(function (json) {
        res.status(200).json(json)
      }).catch(function (error) {
        res.status(400).json({})
      })
    } else {
      // assolute popularity globpop
      ApiController.globpopAssolute().then(function (json) {
        res.status(200).json(json)
      }).catch(function (error) {
        res.status(400).json({})
      })
    }
  })

  app.get('/api/video/:youtubeId', function (req, res) {
    var youtubeId = req.params.youtubeId;
    if (youtubeId) {
      VideosController.getVideoByYoutubeId(youtubeId).then((videoRercord) => {
        if (videoRercord)
          res.status(200).json(videoRercord)
        else
          res.status(400).json({})
      }).catch((error) => {
        res.status(400).json(error)
      })
    }
    
  })

}