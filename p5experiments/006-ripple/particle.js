// Expanding Ring Class
// Ellipse get's bigger on update, and hcange colors

// based on Particle Systems / The Nature of Code by Daniel Shiffman
// http://natureofcode.com


function Ring(_mX, _mY, _r, _g, _b) {

    this.position = new PVector(_mX, _mY);
    this.rippleSize = new PVector(rad, rad);
    this.bigRipple = new PVector(rad * 40, rad * 40);
    this.lifespan = 320;

    this.thickness = thickness;

    this.r = _r;
    this.g = _g;
    this.b = _b;

}

Ring.prototype.run = function() {
    this.update();
    this.display();
}

Ring.prototype.update = function() {
    this.lifespan -= 5;
    this.rippleSize.lerp(this.bigRipple, 0.05);
    this.thickness -= 0.05;
    strokeWeight(this.thickness);


}

Ring.prototype.display = function() {

    stroke(this.r, this.g, this.b, this.lifespan);
    ellipse(this.position.x, this.position.y, this.rippleSize.x, this.rippleSize.y);
}

// Is the ring still useful?
Ring.prototype.isDead = function() {
    if (this.lifespan < 10) {
        return true;
    } else {
        return false;
    }
}