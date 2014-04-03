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



var bondData, lion;
var films = new Array();

function preload() {
    bondData = loadJSON('bondKills.json');
}

function setup() {

    createCanvas(800, 480);
    background(30);

    // Async Call
    /*
    bondDataAsync = loadJSON('bondKills.json', function(resp) {
        console.log("Async call is done. I loaded: ");
    });
	*/

    f = new Film();
    loadData();

}

function draw() {
    //background(0);

    // for (var f in films) {
    //     f.update();
    //     f.dibuja();
    // }
}

function loadData() {
    //Table t = loadTable(url);
    //t.removeTitleRow();

    for (var i = 0; i < bondData.length; i++) { // or use t.getRowCount()
        var f = new Film();
        f.filmName = bondData[i]["Film"];
        f.year = bondData[i]["Year"];
        f.bondActor = bondData[i]["Bond actor"];
        f.bondKills = bondData[i]["Bond kills"];
        f.otherKills = bondData[i]["Others' kills"];
        f.totalKills = f.bondKills + f.otherKills;
        //println(f.filmName);
        films.push(f); // add each objetc into the Array films
    }
}

function scatter() {
    console.log("scatter");
    for (var f in films) {
        f.tpos.x = random(100, width - 100);
        f.tpos.y = random(100, height - 100);
    }
}

function sortOnKills() {
    console.log("Sort on Kills");
    for (var f in films) {
        f.tpos.y = height - map(f.totalKills, 0, 200, 100, height - 100);
    }
}

function sortOnYear() {
    console.log("Sort on Years");
    for (var f in films) {
        f.tpos.x = map(f.year, 1962, 2012, 100, width - 100);
    }
}

function iskeyPressed() {
    if (key == 'x') scatter();
    if (key == 'k') sortOnKills();
    if (key == 'y') sortOnYear();
}

function Film() {
    // data types first
    var filmName;
    var year;
    var bondActor;
    var bondKills;
    var otherKills;
    var totalKills;

    var pos = new PVector();
    var tpos = new PVector();

    this.update = function() {
        //pos.lerp(tpos, 0.1); // PVector Linear Interpolattion only works in Processing 2.x

        pos.x = lerp(pos.x, tpos.x, 0.1);
        pos.y = lerp(pos.y, tpos.y, 0.1);
        pos.z = lerp(pos.z, tpos.z, 0.1);
        // pos.z = 0;
    }

    this.dibuja = function() {
        pushMatrix();
        translate(pos.x, pos.y, pos.z);
        var d = sqrt(totalKills) * 10;
        noStroke();
        fill(255, 150);
        ellipse(0, 0, d, d);

        d = sqrt(bondKills) * 10;
        fill(255, 0, 0, 150);
        ellipse(0, 0, d, d);

        popMatrix();
    }

}