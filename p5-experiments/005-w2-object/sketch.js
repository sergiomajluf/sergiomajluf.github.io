var bubble;

function setup() {
    createCanvas(600, 400);
    bubble = {
        x: width / 2,
        y: height,
        w: 100
    };
}

function draw() {
    background(50);

    fill(125);
    stroke(255);
    ellipse(bubble.x, bubble.y, bubble.w, bubble.w);

    bubble.y = bubble.y - 1;
    bubble.x = bubble.x + random(-1, 1);

    if (bubble.y < 0) bubble.y = height;

}