// Ring Trail Class (Particle System)
// This System is a collection of other objects.

// based on Particle Systems / The Nature of Code by Daniel Shiffman
// http://natureofcode.com

function RingTrail(position) {
    this.rings = [];
}

RingTrail.prototype.addRing = function() {
    this.rings.push(new Ring(mouseX, mouseY, r, g, b));
}

RingTrail.prototype.run = function() {
    for (var i = this.rings.length - 1; i >= 0; i--) {
        var p = this.rings[i];
        p.run();
        if (p.isDead()) {
            this.rings.splice(i, 1);
        }
    }
}