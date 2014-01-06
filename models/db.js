var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// validation function
var nameValidation = function(val) {
	console.log("inside name validation");
	console.log(val);
	
	if (val.length >= 3) {
		return true;
	} else {
		return false;
	}
}

// ship's log schema
var shipLogSchema = new Schema({
	date : Date,
	content : String
})

// define user schema
var UserSchema = new Schema({
	slug : { type: String, lowercase: true, required: true, unique: true },
	name : { type: String, required: true, validate: [nameValidation, 'Name must be at least 5 characters.']},
	email : String,
	bg : String,
	lastupdated : { type: Date, default: Date.now },
    shiplogs : [shipLogSchema]

})

// define cell schema
var CellSchema = new Schema({
    slug : { type: String, lowercase: true, required: true, unique: true },
    owner : String,
	layers : String,
	identity01 : String,
	identity02 : String,
	identity03 : String,
	posX : String,
	posY : String,
	Q1: String,
	Q2: String,
	Q3: String,
	Q4: String,
    lastupdated : { type: Date, default: Date.now },
    shiplogs : [shipLogSchema]
});

// define note schema
var NotesSchema = new Schema({
	note : String,
	owner : String,
	posX : String,
	posY : String,
	link : String,
	lastupdated : { type: Date, default: Date.now },
    shiplogs : [shipLogSchema]

})


// export 'Astronaut' model
module.exports = mongoose.model('Users',CellSchema);
module.exports = mongoose.model('Cell',CellSchema);
module.exports = mongoose.model('Notes',NotesSchema);


