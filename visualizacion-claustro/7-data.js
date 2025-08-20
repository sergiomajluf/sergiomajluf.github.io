var gobierno;
var elemento;
let pre_x = 0;
let pre_y = 0;

function preload() {
    txtScl = loadStrings("preguntas/sedes/santiago.txt");
    txtCcp = loadStrings("preguntas/sedes/concepcion.txt");
    txtVal = loadStrings("preguntas/sedes/valdivia.txt");
    txtPap = loadStrings("preguntas/sedes/patagonia.txt");
    f_FiraSansLI = loadFont('fira-sans/FiraSans-Regular.otf');
    f_Monosten = loadFont('monosten/Monosten-A-webfont.otf');

    // Get the most recent earthquake in the database
    let url = '7-info.json';

    gobierno = loadJSON(url);

}


function setup() {
    var cnv = createCanvas(windowWidth * 5, windowHeight * 5);
    cnv.style('display', 'block');
    background(200);

    textFont(f_Monosten);
    textSize(10);

    stroke(255, 0, 0);
    fill(155, 20);
    strokeWeight(2);
    //console.table(gobierno.data)


}

function draw() {



    for (const reparticion in gobierno.data) {
        if (gobierno.data.hasOwnProperty(reparticion)) {
            elemento = gobierno.data[reparticion];


            let lon = elemento.geojson.geometry.coordinates[0];
            let lat = elemento.geojson.geometry.coordinates[1];

            let x, y;

            x = map(lon, -180, 180, 0, width / 2);
            y = map(lat, 90, -90, 0, height / 2);


            if (elemento.tag === "Ministerios") {
                stroke(255, 0, 0, 180);
                fill(255, 0, 0, 180);
            } else if (elemento.tag === "Municipalidades") {
                stroke(0, 0, 255, 5);
                fill(0, 0, 255, 5);
            } else if (elemento.tag === "Gobernaciones") {
                stroke(0, 255, 0, 40);
                fill(0, 255, 0, 40);
            }
            //ellipse(x, y, 2, 2);
            ellipse(x, y, 2, 2);
            // noStroke();
            // text(elemento.name, x, y)
            //createP(elemento.tag + " - " + elemento.name + " - @" + elemento.twitter);


        }
    }

}



function mouseReleased() {
    //cicleThroughFiles();
    //location.reload();
    //saveFrames('plot-radial-' + ciudad, 'png', 1, 1);
    console.log(mouseX, mouseY);



}

function keyPressed() {

}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(255);

}

function dibuja() {


}



function compare(a, b) {
    var countA = dict[a];
    var countB = dict[b];
    return countB - countA;
}