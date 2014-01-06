/*
 * routes/index.js
 * 
 * Routes contains the functions (callbacks) associated with request urls.
 */

var request = require('request'); // library to make requests to remote urls

var moment = require("moment"); // date manipulation library
var userModel = require("../models/db.js"); //db model


/*
        GET /
*/
exports.index = function(req, res) {
        
        console.log("main page requested");

        // query for all astronauts
        // .find will accept 3 arguments
        // 1) an object for filtering {} (empty here)
        // 2) a string of properties to be return, 'name slug source' will return only the name, slug and source returned astronauts
        // 3) callback function with (err, results)
        //    err will include any error that occurred
        //          allAstros is our resulting array of astronauts
        userModel.find({}, 'name slug source', function(err, allUsers){

                if (err) {
                        res.send("Unable to query database for users").status(500);
                };

                console.log("retrieved " + allusers.length + " users from database");

                //build and render template
                var templateData = {
                        users : allUsers,
                        // pageTitle : "NASA Astronauts (" + allAstros.length + ")"
                }

                res.render('index.html', templateData);

        });

}

// exports.data_all = function(req, res) {

//         astroQuery = astronautModel.find({}); // query for all astronauts
//         astroQuery.sort('-birthdate');
        
//         // display only 3 fields from astronaut data
//         astroQuery.select('name photo birthdate');
        
//         astroQuery.exec(function(err, allAstros){
//                 // prepare data for JSON
//                 var jsonData = {
//                         status : 'OK',
//                         astros : allAstros
                        
//                 }

//                 res.json(jsonData);
//         });

// }

/*
        GET /astronauts/:astro_id
*/
exports.detail = function(req, res) {

        console.log("detail page requested for " + req.params.astro_id);

        //get the requested astronaut by the param on the url :astro_id
        var user_id = req.params.user_id;

        // query the database for astronaut
        var userQuery = userModel.findOne({slug:user_id});
        userQuery.exec(function(err, currentUser){

                if (err) {
                        return res.status(500).send("There was an error on the user query");
                }

                if (currentUser == null) {
                        return res.status(404).render('404.html');
                }

                console.log("Found user");
                console.log(currentUser.name);

                // formattedBirthdate function for currentAstronaut
            //    currentUser.formattedBirthdate = function() {
                        // formatting a JS date with moment
                        // http://momentjs.com/docs/#/displaying/format/
          //  return moment(this.birthdate).format("dddd, MMMM Do YYYY");
        };
                
                //query for all astronauts, return only name and slug
                userModel.find({}, 'name slug', function(err, allUsers){

                        console.log("retrieved all astronauts : " + allUsers.length);

                        //prepare template data for view
                        var templateData = {
                                astro : currentAstronaut,
                                astros : allAstros,
                                pageTitle : currentAstronaut.name
                        }

                        // render and return the template
                        res.render('detail.html', templateData);


                }) // end of .find (all) query
                
        }); // end of .findOne query

}

exports.data_detail = function(req, res) {

        console.log("detail page requested for " + req.params.user_id);

        //get the requested astronaut by the param on the url :astro_id
        var user_id = req.params.astro_id;

        // query the database for astronaut
        var userQuery = userModel.findOne({slug:user_id});
        userQuery.exec(function(err, currentUser){

                if (err) {
                        return res.status(500).send("There was an error on the user query");
                }

                if (currentUser == null) {
                        return res.status(404).render('404.html');
                }


                // formattedBirthdate function for currentAstronaut
              //  currentUser.formattedBirthdate = function() {
                        // formatting a JS date with moment
                        // http://momentjs.com/docs/#/displaying/format/
           // return moment(this.birthdate).format("dddd, MMMM Do YYYY");
        };
                
                //prepare JSON data for response
                var jsonData = {
                        user : currentUser,
                        status : 'OK'
                }

                // return JSON to requestor
                res.json(jsonData);

        }); // end of .findOne query

}

/*
        GET /create
*/
exports.userForm = function(req, res){

        var templateData = {
                page_title : 'Create a new user'
        };

        res.render('index.html', templateData);
}

/*
        POST /create
*/
exports.createUser = function(req, res) {
        
        console.log("received form submission");
        console.log(req.body);

        // accept form post data
        var newUser = new userModel({
                name : req.body.name,
                email : req.body.email,
                bg : req.body.bgUrl,
                source : {
                        name : req.body.source_name,
                        url : req.body.source_url
                },
                slug : req.body.name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'_')

        });

        // you can also add properties with the . (dot) notation
        }
        
        // save the newAstro to the database
        newUser.save(function(err){
                if (err) {
                        console.error("Error on saving new user");
                        console.error(err); // log out to Terminal all errors

                        var templateData = {
                                page_title : 'Add a new user',
                                errors : err.errors, 
                                user : req.body
                        };

                        res.render('index.html', templateData);
                        // return res.send("There was an error when creating a new astronaut");

                } else {
                        console.log("Created a new user!");
                        console.log(newUser);
                        
                        // redirect to the astronaut's page
                        res.redirect('/users/'+ newUser.slug)
                }
        });

};




exports.createCell = function(req, res) {
        
        console.log("received form submission");
        console.log(req.body);

        // accept form post data
        var newCell = new cellModel({
                layers : req.body.layers,
                posX : req.body.posX,
                posY : req.body.posY,
                Q1 : req.body.Q1,
                Q2 : req.body.Q2,
                Q3 : req.body.Q3,
                Q4 : req.body.Q4,
                slug : req.body.name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'_')

        });

        // you can also add properties with the . (dot) notation
        }
        
        // save the newAstro to the database
        newCell.save(function(err){
                if (err) {
                        console.error("Error on saving new user");
                        console.error(err); // log out to Terminal all errors
                // return res.send("There was an error when creating a new astronaut");

                } else {
                        console.log("Created a new cell!");
                        console.log(newCell);
                        
                        Q1

                        // write code to save the cell - HTML/CSS ??

                        //res.redirect('/users/'+ newUser.slug)
                }
        });

};




exports.createNotes = function(req, res) {
        
        console.log("received notes");
        console.log(req.body);

        // accept form post data
        var newNote = new noteModel({
                note : req.body.note,
                posX : req.body.posX,
                posY : req.body.posY,
                link : req.body.link,
                slug : req.body.name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'_')

        });

        // you can also add properties with the . (dot) notation
        }
        
        // save the newAstro to the database
        newNote.save(function(err){
                if (err) {
                        console.error("Error on saving new note");
                        console.error(err); // log out to Terminal all errors
                // return res.send("There was an error when creating a new astronaut");

                } else {
                        console.log("Created a new note!");
                        console.log(newNote);
                        
                        // write code to save the note - HTML/CSS ??
                         
                        //res.redirect('/users/'+ newUser.slug)
                }
        });

};




exports.postShipLog = function(req, res) {

        // Get astronaut from URL params
        var user_id = req.params.user_id;

        // query database for astronaut
        userModel.findOne({slug:user_id}, function(err, user){

                if (err) {
                        console.error("ERROR");
                        console.error(err);
                        res.send("There was an error querying for "+ user_id).status(500);
                }

                if (user != null) {

                        // found the astronaut

                        // concatenate submitted date field + time field
                        var datetimestr = req.body.logdate + " " + req.body.logtime;

                        console.log(datetimestr);
                        
                        // add a new shiplog
                        var logData = {
                                date : moment(datetimestr, "YYYY-MM-DD HH:mm").toDate(),
                                content : req.body.logcontent
                        };

                        console.log("new ship log");
                        console.log(logData);

                        user.shiplogs.push(logData);
                        user.save(function(err){
                                if (err) {
                                        console.error(err);
                                        res.send(err.message);
                                }
                        });

                        // res.redirect('/users/' + astro_id);


                } else {

                        // unable to find astronaut, return 404
                        console.error("unable to find users: " + user_id);
                        return res.status(404).render('404.html');
                }
        })
}

exports.deleteUser = function(req,res) {

        // Get astronaut from URL params
        var user_id = req.params.user_id;

        // if querystring has confirm=yes, delete record
        // else display the confirm page

        if (req.query.confirm == 'yes')  {  // ?confirm=yes
        
                userModel.remove({slug:user_id}, function(err){
                        if (err){ 
                                console.error(err);
                                res.send("Error when trying to remove astronaut: "+ user_id);
                        }

                        res.send("Removed user. <a href='/'>Back to home</a>.");
                });

        } else {
                //query astronaut and display confirm page
                userModel.findOne({slug:user_id}, function(err, user){

                        if (err) {
                                console.error("ERROR");
                                console.error(err);
                                res.send("There was an error querying for "+ user_id).status(500);
                        }

                        if (astronaut != null) {

                                var templateData = {
                                        users : user
                                };
                                
                                res.render('delete_confirm.html', templateData);
                        
                        }
                })

        }
};

// exports.remote_api = function(req, res) {

//         var remote_api_url = 'http://itpdwdexpresstemplates.herokuapp.com/data/astronauts';
//         // var remote_api_url = 'http://localhost:5000/data/astronauts';

//         // make a request to remote_api_url
//         request.get(remote_api_url, function(error, response, data){
                
//                 if (error){
//                         res.send("There was an error requesting remote api url.");
//                         return;
//                 }

//                 // Step 2 - convert 'data' to JS
//                 // convert data JSON string to native JS object
//                 var apiData = JSON.parse(data);

//                 console.log(apiData);
//                 console.log("***********");


//                 // STEP 3  - check status / respond
//                 // if apiData has property 'status == OK' then successful api request
//                 if (apiData.status == 'OK') {

//                         // prepare template data for remote_api_demo.html template
//                         var templateData = {
//                                 astronauts : apiData.astros,
//                                 rawJSON : data, 
//                                 remote_url : remote_api_url
//                         }

//                         return res.render('remote_api_demo.html', templateData);
//                 }        
//         })
// };

exports.set_session = function(req, res) {

        // set the session with the submitted form data
        req.session.userName = req.body.name;
        req.session.userColor = req.body.fav_color;

        // redirect back to where they came from
        console.log(req.referrer);
        res.redirect('/');

}