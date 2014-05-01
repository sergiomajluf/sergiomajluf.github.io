// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Example 9-11 ported to p5.js

function Particle() {
  this.x = width/2;
  this.y = 0;
  this.w = 16;
  this.speed = 0;
}

Particle.prototype.gravity = function() {
  // Add gravity to speed
  this.speed = this.speed + gravity;
};

Particle.prototype.move = function() {
  // Add speed to y location
  this.y = this.y + this.speed;
  // If square reaches the bottom
  // Reverse speed
  if (this.y > height) {
    this.speed = this.speed * -0.98;
    this.y = height;
    bounce =! bounce;
  }
  //if (this.speed > 0.00005) this.y = height;
};

Particle.prototype.display = function() {
  // Display the circle
  fill(101);
  stroke(255);
  ellipse(this.x,this.y,this.w,this.w);
};

