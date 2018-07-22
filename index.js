var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 9000));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  //response.send('Progetto TW');
  response.render('pages/index')
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});