<<<<<<< HEAD

/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');


// the ExpressJS App
var app = express();

// configuration of port, templates (/views), static files (/public)
// and other expressjs settings for the web server.
app.configure(function(){

  // server port number
  app.set('port', process.env.PORT || 5000);

  //  templates directory to 'views'
  app.set('views', __dirname + '/views');

  // setup template engine - we're using Hogan-Express
  app.set('view engine', 'html');
  app.set('layout','layout');
  app.engine('html', require('hogan-express')); // https://github.com/vol4ok/hogan-express

  app.use(express.favicon());
  // app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

  // database - skipping until week 5
  // app.db = mongoose.connect(process.env.MONGOLAB_URI);
  // console.log("connected to database");
  
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/* 
SKIPPING FOR FUTURE CLASSES
SESSIONS w/ MongoDB (store sessions across multiple dynos)
COOKIEHASH in your .env file (also share with heroku) 
*/
// app.use(express.cookieParser(process.env.COOKIEHASH));
// app.use(express.session({ 
//     store: new mongoStore({url:process.env.MONGOLAB_URI, maxAge: 300000})
//     , secret: process.env.COOKIEHASH
//   })
// );

// ROUTES

// ROUTES

var routes = require('./routes/index.js');

app.get('/', routes.index);

//new astronaut routes
app.get('/create',routes.userForm); //display form
app.post('/create',routes.createUser); //form POST submits here

// display a single astronaut
app.get('/users/:user_id', routes.detail);

// edit astronaut
app.get('/users/:user_id/edit', routes.editUserForm); //GET display form
app.post('/users/:user_id/edit', routes.updateUser); //POST update database

// delete astronaut
app.get('/users/:user_id/delete', routes.deleteUser);

// add ship's log
app.post('/users/:astro_id/addshiplog', routes.postShipLog);

// API JSON Data routes
app.get('/data/users',routes.data_all);
app.get('/data/users/:user_id', routes.data_detail);

// consume a remote API
//app.get('/remote_api_demo', routes.remote_api);

app.post('/set_session', routes.set_session);

// create NodeJS HTTP server using 'app'
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});




=======

/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');


// the ExpressJS App
var app = express();

// configuration of port, templates (/views), static files (/public)
// and other expressjs settings for the web server.
app.configure(function(){

  // server port number
  app.set('port', process.env.PORT || 5000);

  //  templates directory to 'views'
  app.set('views', __dirname + '/views');

  // setup template engine - we're using Hogan-Express
  app.set('view engine', 'html');
  app.set('layout','layout');
  app.engine('html', require('hogan-express')); // https://github.com/vol4ok/hogan-express

  app.use(express.favicon());
  // app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

  // database - skipping until week 5
  // app.db = mongoose.connect(process.env.MONGOLAB_URI);
  // console.log("connected to database");
  
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/* 
SKIPPING FOR FUTURE CLASSES
SESSIONS w/ MongoDB (store sessions across multiple dynos)
COOKIEHASH in your .env file (also share with heroku) 
*/
// app.use(express.cookieParser(process.env.COOKIEHASH));
// app.use(express.session({ 
//     store: new mongoStore({url:process.env.MONGOLAB_URI, maxAge: 300000})
//     , secret: process.env.COOKIEHASH
//   })
// );

// ROUTES

// ROUTES

var routes = require('./routes/index.js');

app.get('/', routes.index);

//new astronaut routes
app.get('/create',routes.userForm); //display form
app.post('/create',routes.createUser); //form POST submits here

// display a single astronaut
app.get('/users/:user_id', routes.detail);

// edit astronaut
app.get('/users/:user_id/edit', routes.editUserForm); //GET display form
app.post('/users/:user_id/edit', routes.updateUser); //POST update database

// delete astronaut
app.get('/users/:user_id/delete', routes.deleteUser);

// add ship's log
app.post('/users/:astro_id/addshiplog', routes.postShipLog);

// API JSON Data routes
app.get('/data/users',routes.data_all);
app.get('/data/users/:user_id', routes.data_detail);

// consume a remote API
//app.get('/remote_api_demo', routes.remote_api);

app.post('/set_session', routes.set_session);

// create NodeJS HTTP server using 'app'
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});




>>>>>>> 0826dbb3d562f591c5635b2b9cfd67758a4730b8
