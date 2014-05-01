var s0 = function( sketch ) {

  var gray = 0; 

  sketch.setup = function() {
    sketch.createCanvas(400, 400);
  };

  sketch.draw = function() {
    sketch.background(gray);
    sketch.rect(sketch.width/2, sketch.height/2, 50, 50);
  }

  sketch.mousePressed = function() {
    gray += 10;
  }

};

var myp5_0 = new p5(s0, 'canvas0');



var s1 = function( sketch ) {

  var gray = 0; 

  sketch.setup = function() {
    sketch.createCanvas(400, 400);
  };

  sketch.draw = function() {
    sketch.background(255, 0, 100);
    sketch.fill(gray);
    sketch.noStroke();
    sketch.rect(sketch.width/2, sketch.height/2, 50, 50);
  }

  sketch.mousePressed = function() {
    gray += 10;
  }
};


var myp5_1 = new p5(s1, 'canvas1');

