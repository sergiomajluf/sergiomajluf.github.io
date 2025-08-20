var counts = {}
var dict = {}
var txtScl, txtCcp, txtVal, txtPap, allScl, allCcp, sllVal, allPap;
var keys = [];
var sw = ["\\", "•", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "_", "a", "actualmente", "acuerdo", "adelante", "ademas", "además", "adrede", "afirmó", "agregó", "ahi", "ahora", "ahí", "al", "algo", "alguna", "algunas", "alguno", "algunos", "algún", "alli", "allí", "alrededor", "ambos", "ampleamos", "antano", "antaño", "ante", "anterior", "antes", "apenas", "aproximadamente", "aquel", "aquella", "aquellas", "aquello", "aquellos", "aqui", "aquél", "aquélla", "aquéllas", "aquéllos", "aquí", "arriba", "arribaabajo", "aseguró", "asi", "así", "atras", "aun", "aunque", "ayer", "añadió", "aún", "b", "bajo", "bastante", "bien", "breve", "buen", "buena", "buenas", "bueno", "buenos", "c", "cada", "casi", "cerca", "cierta", "ciertas", "cierto", "ciertos", "cinco", "claro", "comentó", "como", "con", "conmigo", "conocer", "conseguimos", "conseguir", "considera", "consideró", "consigo", "consigue", "consiguen", "consigues", "contigo", "contra", "cosas", "creo", "cual", "cuales", "cualquier", "cuando", "cuanta", "cuantas", "cuanto", "cuantos", "cuatro", "cuenta", "cuál", "cuáles", "cuándo", "cuánta", "cuántas", "cuánto", "cuántos", "cómo", "d", "da", "dado", "dan", "dar", "de", "debajo", "debe", "deben", "debido", "decir", "dejó", "del", "delante", "demasiado", "demás", "dentro", "deprisa", "desde", "despacio", "despues", "después", "detras", "detrás", "dia", "dias", "dice", "dicen", "dicho", "dieron", "diferente", "diferentes", "dijeron", "dijo", "dio", "donde", "dos", "durante", "día", "días", "dónde", "e", "ejemplo", "el", "ella", "ellas", "ello", "ellos", "embargo", "empleais", "emplean", "emplear", "empleas", "empleo", "en", "encima", "encuentra", "enfrente", "enseguida", "entonces", "entre", "era", "erais", "eramos", "eran", "eras", "eres", "es", "esa", "esas", "ese", "eso", "esos", "esta", "estaba", "estabais", "estaban", "estabas", "estad", "estada", "estadas", "estado", "estados", "estais", "estamos", "estan", "estando", "estar", "estaremos", "estará", "estarán", "estarás", "estaré", "estaréis", "estaría", "estaríais", "estaríamos", "estarían", "estarías", "estas", "este", "estemos", "esto", "estos", "estoy", "estuve", "estuviera", "estuvierais", "estuvieran", "estuvieras", "estuvieron", "estuviese", "estuvieseis", "estuviesen", "estuvieses", "estuvimos", "estuviste", "estuvisteis", "estuviéramos", "estuviésemos", "estuvo", "está", "estábamos", "estáis", "están", "estás", "esté", "estéis", "estén", "estés", "ex", "excepto", "existe", "existen", "explicó", "expresó", "f", "fin", "final", "fue", "fuera", "fuerais", "fueran", "fueras", "fueron", "fuese", "fueseis", "fuesen", "fueses", "fui", "fuimos", "fuiste", "fuisteis", "fuéramos", "fuésemos", "g", "general", "gran", "grandes", "gueno", "h", "ha", "haber", "habia", "habida", "habidas", "habido", "habidos", "habiendo", "habla", "hablan", "habremos", "habrá", "habrán", "habrás", "habré", "habréis", "habría", "habríais", "habríamos", "habrían", "habrías", "habéis", "había", "habíais", "habíamos", "habían", "habías", "hace", "haceis", "hacemos", "hacen", "hacer", "hacerlo", "haces", "hacia", "haciendo", "hago", "han", "has", "hasta", "hay", "haya", "hayamos", "hayan", "hayas", "hayáis", "he", "hecho", "hemos", "hicieron", "hizo", "horas", "hoy", "hube", "hubiera", "hubierais", "hubieran", "hubieras", "hubieron", "hubiese", "hubieseis", "hubiesen", "hubieses", "hubimos", "hubiste", "hubisteis", "hubiéramos", "hubiésemos", "hubo", "i", "igual", "incluso", "indicó", "informo", "informó", "intenta", "intentais", "intentamos", "intentan", "intentar", "intentas", "intento", "ir", "j", "junto", "k", "l", "la", "lado", "largo", "las", "le", "lejos", "les", "llegó", "lleva", "llevar", "lo", "los", "luego", "lugar", "m", "mal", "manera", "manifestó", "mas", "mayor", "me", "mediante", "medio", "mejor", "mencionó", "menos", "menudo", "mi", "mia", "mias", "mientras", "mio", "mios", "mis", "misma", "mismas", "mismo", "mismos", "modo", "momento", "mucha", "muchas", "mucho", "muchos", "muy", "más", "mí", "mía", "mías", "mío", "míos", "n", "nada", "nadie", "ni", "ninguna", "ningunas", "ninguno", "ningunos", "ningún", "no", "nos", "nosotras", "nosotros", "nuestra", "nuestras", "nuestro", "nuestros", "nueva", "nuevas", "nuevo", "nuevos", "nunca", "o", "ocho", "os", "otra", "otras", "otro", "otros", "p", "pais", "para", "parece", "parte", "partir", "pasada", "pasado", "paìs", "peor", "pero", "pesar", "poca", "pocas", "poco", "pocos", "podeis", "podemos", "poder", "podria", "podriais", "podriamos", "podrian", "podrias", "podrá", "podrán", "podría", "podrían", "poner", "por", "por qué", "porque", "posible", "primer", "primera", "primero", "primeros", "principalmente", "pronto", "propia", "propias", "propio", "propios", "proximo", "próximo", "próximos", "pudo", "pueda", "puede", "pueden", "puedo", "pues", "q", "qeu", "que", "quedó", "queremos", "quien", "quienes", "quiere", "quiza", "quizas", "quizá", "quizás", "quién", "quiénes", "qué", "r", "raras", "realizado", "realizar", "realizó", "repente", "respecto", "s", "sabe", "sabeis", "sabemos", "saben", "saber", "sabes", "sal", "salvo", "se", "sea", "seamos", "sean", "seas", "segun", "segunda", "segundo", "según", "seis", "ser", "sera", "seremos", "será", "serán", "serás", "seré", "seréis", "sería", "seríais", "seríamos", "serían", "serías", "seáis", "señaló", "si", "sido", "siempre", "siendo", "siete", "sigue", "siguiente", "sin", "sino", "sobre", "sois", "sola", "solamente", "solas", "solo", "solos", "somos", "son", "soy", "soyos", "su", "supuesto", "sus", "suya", "suyas", "suyo", "suyos", "sé", "sí", "sólo", "t", "tal", "tambien", "también", "tampoco", "tan", "tanto", "tarde", "te", "temprano", "tendremos", "tendrá", "tendrán", "tendrás", "tendré", "tendréis", "tendría", "tendríais", "tendríamos", "tendrían", "tendrías", "tened", "teneis", "tenemos", "tener", "tenga", "tengamos", "tengan", "tengas", "tengo", "tengáis", "tenida", "tenidas", "tenido", "tenidos", "teniendo", "tenéis", "tenía", "teníais", "teníamos", "tenían", "tenías", "tercera", "ti", "tiempo", "tiene", "tienen", "tienes", "toda", "todas", "todavia", "todavía", "todo", "todos", "total", "trabaja", "trabajais", "trabajamos", "trabajan", "trabajar", "trabajas", "trabajo", "tras", "trata", "través", "tres", "tu", "tus", "tuve", "tuviera", "tuvierais", "tuvieran", "tuvieras", "tuvieron", "tuviese", "tuvieseis", "tuviesen", "tuvieses", "tuvimos", "tuviste", "tuvisteis", "tuviéramos", "tuviésemos", "tuvo", "tuya", "tuyas", "tuyo", "tuyos", "tú", "u", "ultimo", "un", "una", "unas", "uno", "unos", "usa", "usais", "usamos", "usan", "usar", "usas", "uso", "usted", "ustedes", "v", "va", "vais", "valor", "vamos", "van", "varias", "varios", "vaya", "veces", "ver", "verdad", "verdadera", "verdadero", "vez", "vosotras", "vosotros", "voy", "vuestra", "vuestras", "vuestro", "vuestros", "w", "x", "y", "ya", "yo", "z", "él", "éramos", "ésa", "ésas", "ése", "ésos", "ésta", "éstas", "éste", "éstos", "última", "últimas", "último", "últimos"];
let arr, min, max;
var ciudad = "";
var cod = 0;

function preload() {
    txtScl = loadStrings("preguntas/sedes/santiago.txt");
    txtCcp = loadStrings("preguntas/sedes/concepcion.txt");
    txtVal = loadStrings("preguntas/sedes/valdivia.txt");
    txtPap = loadStrings("preguntas/sedes/patagonia.txt");
    f_FiraSansLI = loadFont('fira-sans/FiraSans-Regular.otf');
    f_Monosten = loadFont('monosten/Monosten-A-webfont.otf');
}

function setup() {
    var cnv = createCanvas(windowWidth * 1, windowHeight * 1);
    cnv.style('display', 'block');
    background(0, 50, 255);
    background(255);

    allScl = txtScl.join("\n");
    allCcp = txtCcp.join("\n");
    allVal = txtVal.join("\n");
    allPap = txtPap.join("\n");

    textFont(f_Monosten);
    textSize(10);

    // limpia caracteres y realiza conteo
    //limpiarString(allScl, "scl");
    //limpiarString(allCcp, "ccp");
    //limpiarString(allVal, "val");
    //limpiarString(allPap, "pap");


    cod = 1;
    prepara(cod);


    keys.sort(compare);

    //comparaSedes(counts, 40, 40, width / 1, height / 2)
    dibuja();

}

function prepara(cod) {
    switch (cod) {
        case 1:
            ciudad = "SANTIAGO";
            limpiarString(allScl, "scl");
            break;

        case 2:
            ciudad = "CONCEPCIÓN";
            limpiarString(allCcp, "ccp");
            break;

        case 3:
            ciudad = "VALDIVIA";
            limpiarString(allVal, "val");
            break;

        case 4:
            ciudad = "PATAGONIA";
            limpiarString(allPap, "pap");
            break;

        default:
            ciudad = "USS";
            limpiarString(allScl, "scl");
            limpiarString(allCcp, "ccp");
            limpiarString(allVal, "val");
            limpiarString(allPap, "pap");
            break;
    }
    console.log(ciudad)
}

function mouseReleased() {
    //cicleThroughFiles();
    //location.reload();
    //saveFrames('plot-radial-' + ciudad, 'png', 1, 1);

}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        saveFrames('plot-radial-' + ciudad, 'png', 1, 1);
    }
    return false; // prevent default
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    background(0, 50, 255);
    background(255);
    //comparaSedes(counts, 40, 40, width / 1, height / 2)
    dibuja();
}

function dibuja() {
    angleMode(RADIANS)
    keys.sort(compare);
    fill(0)
    let max_count = keys.length;
    max_count = 15;

    strokeWeight(3);
    textAlign(CENTER)
    translate(windowWidth / 2, windowHeight / 2);

    fill(0, 0, 255);
    noStroke();
    textSize(14);
    text(ciudad, 0, 0);

    for (let i = 0; i < max_count; i++) {
        noStroke();
        fill(200, 0, 0);

        var palabra = keys[i];
        strokeWeight(5);

        dict[palabra] = dict[palabra];
        stroke(16, 23, 255, 255 / i / 0.35);
        for (let j = 0; j < dict[palabra]; j++) {
            r = 250 + random(-70, 10) / j / 0.18

            angle = TWO_PI / (max_count + 0) * i;
            angle += random(-0.15, 0.15);
            x = r * cos(angle);
            y = r * sin(angle);


            point(x, y);
        }

        // text(palabra + " " + dict[palabra], 0, i * 10);
        r = 230
        var angle = TWO_PI / (max_count + 0) * i;
        var x = r * cos(angle)
        var y = r * sin(angle)

        noStroke();
        textSize(13);
        fill(255, 160)
        rect(x - textWidth(palabra) / 2, y - 12, textWidth(palabra), 15)
            //text(palabra + " " + dict[palabra], x, y);

        fill(0)
            //text(palabra + " " + dict[palabra], x, y);
        text(palabra, x, y);

    }
    stroke(0)
    fill(0)

}

function comparaSedes(counts, x, y, ancho, alto) {
    this.x = x;
    y = y + 50;
    var scaler = 5;
    ellipseMode(CENTER);

    keys.sort(compare);
    fill(0)

    push();
    textAlign(CENTER);
    translate(0, -30);
    textSize(12);
    fill(20, 170);
    text("Santiago", x + 50 + ancho * .15, y);
    text("Concepción", x + 50 + ancho * .30, y);
    text("Valdivia", x + 50 + ancho * .45, y);
    text("Patagonia", x + 50 + ancho * .60, y);
    text("USS", x + 50 + ancho * .75, y);
    pop();

    for (let i = 0; i < keys.length; i++) {
        var palabra = keys[i];

        if (dict[palabra] > 10) {
            var d = {}
            d.scl = scaler * sqrt(counts[palabra].scl);
            d.ccp = scaler * sqrt(counts[palabra].ccp);
            d.val = scaler * sqrt(counts[palabra].val);
            d.pap = scaler * sqrt(counts[palabra].pap);
            d.total = scaler * sqrt(dict[palabra]);

            fill(40, 170)
            textAlign(RIGHT, CENTER);
            text(palabra, ancho * .15, y);

            stroke(0, 50);
            line(10 + ancho * .15, y, ancho * .9, y);

            fill(40, 30)
                // stroke(255, 70)
            noStroke()
            ellipse(x + 50 + ancho * .75, y, d.total, d.total);
            noStroke();
            fill(0)
            textAlign(LEFT, CENTER)
            text(dict[palabra], ancho * .95, y);


            fill(40, 170)
            ellipse(x + 50 + ancho * .15, y, d.scl, d.scl);
            ellipse(x + 50 + ancho * .30, y, d.ccp, d.ccp);
            ellipse(x + 50 + ancho * .45, y, d.val, d.val);
            ellipse(x + 50 + ancho * .60, y, d.pap, d.pap);
            y += 15;
        }
    }




}


function limpiarString(allwords, sede) {

    var inicioBlanco = /^ /;
    // El $ indica final de cadena
    var finBlanco = / $/;
    // El global (g) es para obtener todas las posibles combinaciones
    var variosBlancos = /[ ]+/g;
    var puntuacion = /[^!-~]+/g;
    var noAlpha = /[äöüÄÖÜ]+/g;

    allwords = allwords.replace(inicioBlanco, "");
    allwords = allwords.replace(finBlanco, "");
    allwords = allwords.replace(variosBlancos, " ");
    allwords = allwords.replace(noAlpha, " ");


    // https://stackoverflow.com/a/3548615/510317
    var re = /\S+\s*/g;
    var tokens = allwords.match(re);


    for (var i = 0; i < tokens.length; i++) {
        var word = tokens[i].toLowerCase();


        // Limpiar
        word = word.replace(inicioBlanco, "");
        word = word.replace("%", "");
        word = word.replace("*", "");
        word = word.replace("/", "");
        word = word.replace("-", "");
        word = word.replace(")", "");
        word = word.replace("(", "");
        word = word.replace(".", "");
        word = word.replace(",", "");
        word = word.replace(finBlanco, "");
        word = word.replace(finBlanco, "");
        word = word.replace(finBlanco, "");
        word = word.replace('“', "");
        word = word.replace('”', "");

        word = word.replace(/(\r\n|\n|\t|\r)/gm, "");


        // Agregar a objeto counts
        // { key: "académica", scl: 2, ccp: 3, val: 7, pap: 1 };
        /* 
            { 
                académica: 13,
                { scl: 2, ccp: 3, val: 7, pap: 1} 
            };
        */
        if (!/\d+/.test(word)) {
            if (sw.indexOf(word) == -1) {
                if (counts[word] === undefined) {
                    counts[word] = { scl: null, ccp: null, val: null, pap: null };
                    keys.push(word);
                    dict[word] = 1;
                    switch (sede) {
                        case "scl":
                            counts[word].scl = 1;
                            break;
                        case "ccp":
                            counts[word].ccp = 1;
                            break;
                        case "val":
                            counts[word].val = 1;
                            break;
                        case "pap":
                            counts[word].pap = 1;
                            break;
                        default:
                            break;
                    }
                } else {
                    dict[word]++;
                    switch (sede) {
                        case "scl":
                            counts[word]["scl"]++;
                            break;
                        case "ccp":
                            counts[word]["ccp"]++;
                            break;
                        case "val":
                            counts[word]["val"]++;
                            break;
                        case "pap":
                            counts[word]["pap"]++;
                            break;
                        default:
                            break;
                    }

                }
            }
        }
    }
}

function compare(a, b) {
    var countA = dict[a];
    var countB = dict[b];
    return countB - countA;
}