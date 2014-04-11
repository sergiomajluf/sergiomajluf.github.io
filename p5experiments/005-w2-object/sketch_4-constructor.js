var bubble1;
var bubble2;

function Bubble() {
    this.x = 300;
    this.y = height;
    this.w = 100;
    this.move = function() {
        this.x = this.x + random(-1, 1);
        this.y = this.y - 1;
    };
    //return this.x;
}


function setup() {
    createCanvas(600, 400);
    bubble1 = new Bubble();

    bubble2 = new Bubble();
    bubble2.x = 200;
    bubble2.y = height;
}

function draw() {
    background(50);

    fill(125);
    stroke(255);
    ellipse(bubble1.x, bubble1.y, bubble1.w, bubble1.w);
    bubble1.move();

    ellipse(bubble2.x, bubble2.y, bubble2.w, bubble2.w);
    bubble2.move();

    if (bubble1.y < 0) bubble1.y = height;
    if (bubble2.y < 0) bubble2.y = height;

}