/**
 *  Swap Tile game
 * 	by Sergio Majluf
 *	final project for Creative Javascript class at ITP
 *	Instructor Dan Shiffman
 *
 */

var w = 500;
var h = 500;
var rad = 5;
var thickness = 3;
var count = 0;
var r, g, b;
var ring_trails;


var squares = [];



function setup() {
    // this notation allow creating and manipulatin multiple canvasses
    canvas1 = createCanvas();
    canvas1.size(w, h);
    background(255);
    // canvas1.position(((window.innerWidth / 2) - w / 2), ((window.innerHeight / 2) - h / 2));
    smooth();
    noFill();
    var square = '<a href="#" class="square" data-col="i" data-row="j"></a>';
    
    for (var i = 0; i < 20; ++i) {
    	for (var j = 0; j < 20; ++j) {
	    	var temp = new Square();
	    	temp.x = (25*i);
	    	temp.y = (25*j);
	    	squares.push(temp);
	    	createHTML(square).position((25*i), (25*j));
   		}
    }
}

function draw() {
 
};






function Square() {
  this.x = 0; 
  this.y = 0; 
  this.state = 1; 
  this.size = 25;

  // A boolean variable keeps track of the object's state.
  this.mouse = false;
}

Square.prototype.display = function() {
  // Boolean variable determines Stripe color.
  if (this.mouse) { 
    fill(255);
  } else {
    fill(255,100);
  }
  
  noStroke();
  rect(this.x,this.y,this.size,this.size);
}


// Check to see if point (mx,my) is inside the Stripe.
Square.prototype.rollover = function(mx, my) { 
  // Left edge is x, Right edge is x + w
  if (mx > this.x && mx < this.x + this.w) {
    this.mouse = true;
  } else {
    this.mouse = false;
  }
}
