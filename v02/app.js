/**
Moral Courage App
Thank you Internet and http://blog.ijasoneverett.com/2013/04/a-sample-app-with-node-js-express-and-mongodb-part-2/
**/

/*
 Module dependencies.
*/

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , StudentProvider = require('./studentprovider').StudentProvider;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.favicon(path.join(__dirname, 'public/i/favicon.ico')));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var studentProvider= new StudentProvider('localhost', 27017);

//Routes
app.get('/', function(req, res){
  studentProvider.findAll(function(error, students){
      res.render('index', {
            title: 'Admin Area',
            students:students
        });
  });
});


app.get('/student/new', function(req, res) {
    res.render('student_new', {
        title: 'New Student'
    });
});

//save new student
app.post('/student/new', function(req, res){
    studentProvider.save({
        name: req.param('name'),
        email: req.param('email'),
        answer1: req.param('answer1'),
        answer2: req.param('answer2'),
        answer3: req.param('answer3'),
        answer4: req.param('answer4')
    }, function( error, docs) {
        res.redirect('/')
    });
});

//Spiral on Student
app.get('/student/:id/spiral', function(req, res) {
        studentProvider.findById(req.param('_id'), function(error, student) {
                res.render('student_spiral',
                { 
                        student: student
                });
        });
});

//update an student
app.get('/student/:id/edit', function(req, res) {
        studentProvider.findById(req.param('_id'), function(error, student) {
                res.render('student_edit',
                { 
                        student: student,
                        title: 'Edit Profile'
                });
        });
});

//save updated student
app.post('/student/:id/edit', function(req, res) {
        studentProvider.update(req.param('_id'),{
            name: req.param('name'),
            email: req.param('email'),
       		answer1: req.param('answer1'),
	        answer2: req.param('answer2'),
	        answer3: req.param('answer3'),
	        answer4: req.param('answer4')
        }, function(error, docs) {
                res.redirect('/')
        });
});

//delete an student
app.post('/student/:id/delete', function(req, res) {
        studentProvider.delete(req.param('_id'), function(error, docs) {
                res.redirect('/')
        });
});

app.listen(3000);