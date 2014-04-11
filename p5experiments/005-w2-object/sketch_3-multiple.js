var bubble;

function setup() {
    createCanvas(600, 400);
    bubble = {
        x: width / 2,
        y: height,
        w: 100,
        move: function() {
            this.x = this.x + random(-1, 1);
            this.y = this.y - 1;
        }
    };

    bubble2 = Object.create(bubble);
    bubble2.x = 200;
    bubble2.y = height;
}

function draw() {
    background(50);

    fill(125);
    stroke(255);
    ellipse(bubble.x, bubble.y, bubble.w, bubble.w);
    bubble.move();

    ellipse(bubble2.x, bubble2.y, bubble2.w, bubble2.w);
    bubble2.move();

    if (bubble.y < 0) bubble.y = height;
    if (bubble2.y < 0) bubble2.y = height;

}