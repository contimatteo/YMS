////////////////////////////////////////////////////////////////////////////////

// IMPORT MODULE
var express     =   require('express');
var ApiRoutes   =   require('./routes/Api');
var WebRoutes   =   require('./routes/Web');
var AuthRoutes  =   require('./routes/Auth');
var cors        =   require('cors');
var bodyParser  =   require('body-parser');
var passport    =   require('passport');
var session     =   require('express-session');

////////////////////////////////////////////////////////////////////////////////

// IMPORT SCHEMA
// ...

////////////////////////////////////////////////////////////////////////////////

// INSTANCE GLOBAL OBJECT
var app = express();
// app.use(cors({ origin: 'http://italiancoders.it'}));   // project url
app.use(cors());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

////////////////////////////////////////////////////////////////////////////////

// PASSPORT
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
require('./libraries/Passport.js')(passport);

////////////////////////////////////////////////////////////////////////////////

// MIDDLEWARE 1
app.use(function(request, response, next) {
  if (request.isAuthenticated()) {
   response.locals.currentUser = request.user;
  }
  else {
    response.locals.currentUser = null;
  }
  next();
});

////////////////////////////////////////////////////////////////////////////////

// MIDDLEWARE 2
app.use(function(req, res, next) {
  // console.log("MIDDLEWARE 2 : controllo di sicurezza passatto correttamente");
  next();
});

////////////////////////////////////////////////////////////////////////////////

// set enviroment configuration
app.set('port', (8000 || process.env.PORT || 9000));
app.use(express.static(__dirname + '/static'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

////////////////////////////////////////////////////////////////////////////////

// ROUTES
ApiRoutes(app, passport);
WebRoutes(app, passport);
AuthRoutes(app, passport);

////////////////////////////////////////////////////////////////////////////////

// PASSPORT
require('./libraries/Passport.js')(passport);

////////////////////////////////////////////////////////////////////////////////

// LISTENER
app.listen(app.get('port'), function() {
  console.log("••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••");
  console.log("••••••••••••••••• YOUTUBE MUSIC SPIDER ["+app.get('port')+"] •••••••••••••••••");
  console.log("••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••");
});

////////////////////////////////////////////////////////////////////////////////

