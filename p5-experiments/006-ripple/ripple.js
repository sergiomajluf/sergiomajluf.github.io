/**
 
 Recreating smooth circles done with D3.js
 http://bl.ocks.org/mbostock/1062544
 this is easier done with d3 :)

 Sergio Majluf
 ITP - NY - April 2014

 http://sergiomajluf.github.io/p5-experiments/006-ripple/

*/

// Global Variables
var w = 720;
var h = 480;
var rad = 5;
var thickness = 3;
var count = 0;
var r, g, b;
var ring_trails;


function setup() {
    // this notation allow creating and manipulatin multiple canvasses
    canvas1 = createCanvas();
    canvas1.size(w, h);
    canvas1.position(((window.innerWidth / 2) - w / 2), ((window.innerHeight / 2) - h / 2));
    smooth();
    noFill();
    // Create 'particle/rings system'
    ring_trails = new RingTrail(new PVector(w / 2, h / 2));
}

function draw() {
    context(canvas1);
    background(30);
    frameRate(40);

    // count determines how long is the color chain
    count < 360 ? count++ : count = 0;
    // frequency, the number of steps. Must be proportional to Pi
    makeColorGradient((2 * Math.PI / 60), 1, 2, 4, 128, 127, 330)

    ring_trails.run();

};

function mouseMoved() {
    ring_trails.addRing();
}

function makeColorGradient(frequency, phase1, phase2, phase3, center, amplitude, len) {
    // http://krazydad.com/tutorials/makecolors.php
    if (len == undefined) len = 50;
    if (center == undefined) center = 128;
    if (amplitude == undefined) amplitude = 127;
    if (count == undefined) count = 36;

    // I need to output all colors at once, uncomment the 'for loop' lines.
    // for (var i = 0; i < len; ++i) {
    r = Math.sin((frequency * count) + (phase1 * Math.PI / 3)) * amplitude + center;
    g = Math.sin((frequency * count) + (phase2 * Math.PI / 3)) * amplitude + center;
    b = Math.sin((frequency * count) + (phase3 * Math.PI / 3)) * amplitude + center;
    //}
}