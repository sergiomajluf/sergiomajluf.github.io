/*
Object Oriented DATA
 
 Body Count in James Bond movies
 http://www.guardian.co.uk/film/datablog/2012/oct/05/james-bond-bodycount-deaths#data
 https://docs.google.com/spreadsheet/ccc?key=0AonYZs4MzlZbdEgyUE9aQktJR0ZEWFlURGlYODNISHc#gid=1
 
 */

var films = new Array();

function setup() {
    createCanvas(800, 600);

    var f = new Film();
    loadData("bondData.csv");
}

function draw() {
    background(0);
    for (var f in films) {
        f.update();
        f.render();
    }
}

function scatter() {
    for (var f in films) {
        f.tpos.x = random(100, width - 100);
        f.tpos.y = random(100, height - 100);
    }
}

function sortOnKills() {
    for (var f in films) {
        f.tpos.y = height - map(f.totalKills, 0, 200, 100, height - 100);
    }
}

function sortOnYear() {
    for (var f in films) {
        f.tpos.x = map(f.year, 1962, 2012, 100, width - 100);
    }
}

function loadData(url) {
    Table t = loadTable(url);
    t.removeTitleRow();
    for (int i = 0; i < 26; i++) { // or use t.getRowCount()
        Film f = new Film();
        f.filmName = t.getString(i, "Film");
        f.year = t.getInt(i, "Year");
        f.bondActor = t.getString(i, "Bond actor");
        f.bondKills = t.getInt(i, "Bond kills");
        f.otherKills = t.getInt(i, "Others' kills");
        f.totalKills = f.bondKills + f.otherKills;
        //println(f.filmName);

        films.add(f); // add each objetc into the ArrayList films
    }
}


function keyPressed() {
    if (key == 'x') scatter();
    if (key == 'k') sortOnKills();
    if (key == 'y') sortOnYear();
}









function Film() {
    // data types first
    var filmName; //String
    var year; //int
    var bondActor; //String
    var bondKills; //int
    var otherKills; //int
    var totalKills; //int

    PVector pos = new PVector();
    PVector tpos = new PVector();



    this.update = function() {
        //pos.lerp(tpos, 0.1); // PVector Linear Interpolattion only works in Processing 2.x

        pos.x = lerp(pos.x, tpos.x, 0.1);
        pos.y = lerp(pos.y, tpos.y, 0.1);
        pos.z = lerp(pos.z, tpos.z, 0.1);

    }

    this.render = function() {
        pushMatrix();
        translate(pos.x, pos.y, pos.z);
        float d = sqrt(totalKills) * 10;
        noStroke();
        fill(255, 150);
        ellipse(0, 0, d, d);

        d = sqrt(bondKills) * 10;
        fill(255, 0, 0, 150);
        ellipse(0, 0, d, d);

        popMatrix();
    }

}