/*
Displaying Object Oriented DATA
Body Count in James Bond movies
http://www.guardian.co.uk/film/datablog/2012/oct/05/james-bond-bodycount-deaths#data
https://docs.google.com/spreadsheet/ccc?key=0AonYZs4MzlZbdEgyUE9aQktJR0ZEWFlURGlYODNISHc#gid=1

Originally developed within Jerr Thorp Data Rep class at ITP

Ported to P5.js by Sergio Majluf

Status:
- Converted data to JSON using http://www.convertcsv.com/csv-to-json.htm
- Reading data works OK
- table() still not implemented

 */



var bondData;
var films = [];
var separator = "___________________________________________";

function preload() {
    bondData = loadJSON('bondKills.json');
}

function setup() {

    createCanvas(1000, 600);
    //background(30);

    // Async Call
    /*
    bondDataAsync = loadJSON('bondKills.json', function(resp) {
        console.log("Async call is done. I loaded: ");
    });
	*/

    //f = new Film();
    loadData();


}

function draw() {
    background(30);

    films.forEach(
        function(f) {
            f.updateFilm();
            f.renderFilm();
        }
    );
}

function loadData() {
    //Table t = loadTable(url);
    //t.removeTitleRow();

    for (var i = 0; i < bondData.length; i++) { // or use t.getRowCount()
        var f = new Film();
        f.filmName = bondData[i].Film;
        f.year = bondData[i].Year;
        f.bondActor = bondData[i]["Bond actor"];
        f.bondKills = bondData[i]["Bond kills"];
        f.otherKills = bondData[i]["Others' kills"];
        f.totalKills = f.bondKills + f.otherKills;
        f.posX = 600;
        f.posY = 300;
        //println(f.filmName);
        films.push(f); // add each objetc into the Array films
    }
}

function scatter() {
    console.log(separator);
    console.log("X - Scatter");
    console.log(separator);
    films.forEach(
        function(f) {
            f.tpos.x = random(100, width - 100);
            f.tpos.y = random(100, height - 100);
            console.log(f.tpos);
        }
    );
}

function sortOnKills() {
    console.log(separator);
    console.log("K - Sort on Kills");
    console.log(separator);
    films.forEach(
        function(f) {
            f.tpos.y = height - map(f.totalKills, 0, 200, 100, height - 100);
        }
    );
}

function sortOnYear() {
    console.log(separator);
    console.log("Y - Sort on Years");
    console.log(separator);
    films.forEach(
        function(f) {
            f.tpos.x = map(f.year, 1962, 2012, 100, width - 100);
        }
    );
}

function keyPressed() {
    if (key == 'x' || key == 'X') {
        scatter();
        listAllFilms();
    }
    if (key == 'k' || key == 'K') {
        sortOnKills();
        listAllFilms();
    }
    if (key == 'y' || key == 'Y') {
        sortOnYear();
        listAllFilms();
    }
    if (key == 'r' || key == 'R') {
        renameAllFilms();
    }
}

function renameAllFilms() {
    films.forEach(
        function(item) {
            item.rename();
        }
    );
}

function listAllFilms() {
    films.forEach(
        function(item) {
            console.log(item.filmName);
        }
    );
}

function Film() {
    // data types first
    this.filmName = "";
    this.year = 0;
    this.bondActor = "";
    this.bondKills = 0;
    this.otherKills = 0;
    this.totalKills = 0;

    // var posX, posY, posZ, tposX, tposY, tposZ;

    this.pos = new PVector();
    this.tpos = new PVector();
    this.rename = function() {
        var new_name = newname;
        this.filmName = new_name;
    };

    this.updateFilm = function() {
        this.pos.lerp(this.tpos, 0.1); // PVector Linear Interpolattion only works in Processing 2.x
        // posX = lerp(this.posX, this.tposX, 0.1);
        // posY = lerp(this.posY, this.tposY, 0.1);
        // console.log()
        // pos.z = lerp(position().z, tpos.z, 0.1);

    };
    this.renderFilm = function() {
        pushMatrix();
        translate(this.pos.x, this.pos.y);
        var d = sqrt(this.totalKills) * 10;
        noStroke();
        fill(255, 90);
        ellipse(0, 0, d, d);
        console.log(this.bondKills);
        d = sqrt(this.bondKills) * 10;
        fill(255, 0, 0, 90);
        ellipse(0, 0, d, d);
        console.log(d);
        popMatrix();
    };
}

// Film.prototype.pos = new PVector();
// Film.prototype.tpos = new PVector();