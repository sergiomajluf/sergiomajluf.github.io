/*
Displaying Object Oriented DATA
Body Count in James Bond movies
http://www.guardian.co.uk/film/datablog/2012/oct/05/james-bond-bodycount-deaths#data
https://docs.google.com/spreadsheet/ccc?key=0AonYZs4MzlZbdEgyUE9aQktJR0ZEWFlURGlYODNISHc#gid=1

Originally developed within Jerr Thorp Data Rep class at ITP

Ported to P5.js by Sergio Majluf
April 2014

Status:
- Converted data to JSON using http://www.convertcsv.com/csv-to-json.htm
- Reading data works OK
- table() still not implemented
- keyboard and mouse input (js) trigger functions
- OOP implemented

 */



var bondData = [];
var films = [];
var separator = "___________________________________________";
var w = 1024;
var h = window.innerHeight - 160;
var today = new Date();
var minYear = today.getFullYear();
var maxYear = 0;
var minKills;
var totalKills;

/* Preload data into Array of objects*/
function preload() {
    bondData = loadJSON('bondKills.json');
}

function renameCanvas() {
    $("canvas").each(function(index) {
        $(this).removeAttr("style");
        $(this).attr("id", "canvas" + index);
    });
    $("canvas").wrap("<div id='sketch'>");
}

function setup() {
    createCanvas(w, h);

    // This would be the way to make an Async Load
    /*
    bondDataAsync = loadJSON('bondKills.json', function(resp) {
        console.log("Async call is done. I loaded: ");
    });
    */
    createObjects();
    renameCanvas();

}


function draw() {
    //background(30);
    clear();
    drawTicks();
    drawLines();


    films.forEach(
        function(f) {
            f.updateFilm();
            f.renderFilm();
        }
    );
}

/* Find min and max year */
function drawTicks() {
    var i = 0;
    stroke(100);
    strokeWeight(2);
    films.forEach(function(f) {
        var tickX = map(f.year, minYear, maxYear, 100, width - 100);

        fill(220, 0, 0)
        stroke(220, 0, 0, 100)
        textAlign(CENTER)

        if (i % 2) {
            line(tickX, (height - 100), tickX, (height - 90));
            text(f.year, tickX, height - 80)
        } else {
            line(tickX, (height - 100), tickX, (height - 70));
            text(f.year, tickX, height - 60)
        }
        i++;
    });

}
/* Just some horizontal lines */
function drawLines() {
    stroke(100);
    strokeWeight(0.5);
    for (var i = 0; i < 13; i++) {
        var ypos = height - (50 * i);
        //line(0, ypos, width, ypos);
    }

    films.forEach(function(f) {
        var tickY = height - map(f.totalKills, 0, 200, 100, height - 100);
        line(100, tickY, width - 100, tickY);
    });

    //  Baseline
    stroke(200);
    strokeWeight(1.5);
    line(100, (height - 100), width - 100, height - 100);

}

/* Create and init film objects from preloaded data*/
function createObjects() {

    //  There is a Table object in Processing, still not ported to P5.js
    //  Table t = loadTable(url);
    //  t.removeTitleRow();

    for (var i = 0; i < bondData.length; i++) { // or use t.getRowCount()
        var f = new Film();
        f.filmName = bondData[i].Film;
        f.year = bondData[i].Year;
        f.bondActor = bondData[i]["Bond actor"];
        f.bondKills = bondData[i]["Bond kills"];
        f.otherKills = bondData[i]["Others' kills"];
        f.totalKills = f.bondKills + f.otherKills;

        // add each objetc into the Array films
        films.push(f);

        //Save the first and last year ti create the timeline
        if (f.year < minYear) minYear = f.year;
        if (f.year > maxYear) maxYear = f.year;
        if (f.totalKills < totalKills) totalKills = f.totalKills;
    }
}

function scatter() {
    console.log(separator);
    console.log("X - Scatter");
    films.forEach(
        function(f) {
            f.tpos.x = random(100, width - 100);
            f.tpos.y = random(100, height - 100);
        }
    );
}

function sortOnKills() {
    console.log(separator);
    console.log("K - Sort on Kills");
    films.forEach(
        function(f) {
            f.tpos.y = height - map(f.totalKills, 0, 200, 100, height - 100);
        }
    );
}

function sortOnYear() {
    console.log(separator);
    console.log("Y - Sort on Years");
    films.forEach(
        function(f) {
            f.tpos.x = map(f.year, minYear, maxYear, 100, width - 100);
        }
    );
}

function keyPressed() {
    if (key == 'x' || key == 'X') {
        scatter();
    }
    if (key == 'k' || key == 'K') {
        sortOnKills();
    }
    if (key == 'y' || key == 'Y') {
        sortOnYear();
    }
}

/* Fill Class - object template and Draw/Update methods */
function Film() {
    // create variables with 'this.' so they are exposed to the object
    this.filmName = "";
    this.year = 0;
    this.bondActor = "";
    this.bondKills = 0;
    this.otherKills = 0;
    this.totalKills = 0;
    this.pos = new PVector();
    this.tpos = new PVector();

    this.updateFilm = function() {
        this.pos.lerp(this.tpos, 0.12);
    };

    this.renderFilm = function() {
        pushMatrix();
        translate(this.pos.x, this.pos.y);
        var d = sqrt(this.totalKills) * 10;
        noStroke();
        fill(255, 130);
        ellipse(0, 0, d, d);
        d = sqrt(this.bondKills) * 10;
        fill(255, 0, 0, 130);
        ellipse(0, 0, d, d);
        popMatrix();
    };
}