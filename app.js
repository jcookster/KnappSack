
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var chores = require('./routes/chores');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/chore', routes.index);
app.get('/api/v1/chores/gid/:gid', chores.list); 
app.get('/api/v1/people/gid/:gid', chores.people); 
app.get('/api/v1/assignments/gid/:gid', chores.assignments); 
app.get('/api/v1/save/gid/:gid', chores.save); 

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
  