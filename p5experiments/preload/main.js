// =======================================================
// This is just a little module to simulate the behavior
// of swizzling the loadJSON method for calls made in the
// preload function.
//
// I use https://github.com/ded/reqwest for the ajax
// calls.
// =======================================================
var MockApp = (function(reqwest, exports) {
	var preload_count = 0;

	exports.run = function() {
		if (typeof preload == 'function') {
			exports.loadJSON = preloadJSON;
			preload();
			exports.loadJSON = loadJSON;
		} else {
			exports.loadJSON = loadJSON;
			setup();
		}
	};

	// just to make sure i can call other things
	exports.println = function(msg) {
		console.log(msg);
	};


	// JSON sketches
	function loadJSON(url, callback) {
		var self = [];
		reqwest(url, function (resp) {
			for (var k in resp) self[k] = resp[k];
			callback(resp);
		});
		return self;
	}

	function preloadJSON(url) {
		preload_count++;
		return loadJSON(url, function (resp) {
			if (--preload_count === 0) setup();
		});
	}

	return exports;
})(reqwest, window);




// =======================================================
// Simple "sketch" with both preloaded and async loading
// of JSON.
// =======================================================
var animals, lion;
function preload() {
	animals = loadJSON('array.json');
}

function setup() {
	console.log("Preloaded json is: ", animals);

	println("Printed before an async call.");
	lion = loadJSON('object.json', function(resp) {
		console.log("Async call is done. I loaded: ", resp);
	});
	println("Printed right after the async call, but not in the callback.");
}



// =======================================================
// run the mock app
// =======================================================
MockApp.run();
