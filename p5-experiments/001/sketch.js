// originally from http://rathercumbersome.com/p5/
var walkers = new Array(1000);

function setup() {
    createCanvas(screen.width, screen.height);
    for (var i = 0; i < walkers.length; i++) {
        walkers[i] = new Walker();
    }
    //noStroke();
}

function draw() {
    for (var i = 0; i < walkers.length; i++) {
        walkers[i].update();
        walkers[i].display();
    }
}

function Walker() {
    this.x = random(screen.width);
    this.y = random(screen.height);
    this.r = random(10, 70);
    this.c = color(random(255), random(255), random(255))

    this.update = function() {
        this.x += random(-5, 5);
        this.y += random(-5, 5);

    };
};

Walker.prototype.display = function() {
    fill(this.c, 200);
    ellipse(this.x, this.y, this.r, this.r);

};