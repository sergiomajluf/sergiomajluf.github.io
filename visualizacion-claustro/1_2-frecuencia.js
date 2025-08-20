var container;
var txt;
var counts = {};
var keys = [];
var sw = ["\\", "•", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "_", "a", "actualmente", "acuerdo", "adelante", "ademas", "además", "adrede", "afirmó", "agregó", "ahi", "ahora", "ahí", "al", "algo", "alguna", "algunas", "alguno", "algunos", "algún", "alli", "allí", "alrededor", "ambos", "ampleamos", "antano", "antaño", "ante", "anterior", "antes", "apenas", "aproximadamente", "aquel", "aquella", "aquellas", "aquello", "aquellos", "aqui", "aquél", "aquélla", "aquéllas", "aquéllos", "aquí", "arriba", "arribaabajo", "aseguró", "asi", "así", "atras", "aun", "aunque", "ayer", "añadió", "aún", "b", "bajo", "bastante", "bien", "breve", "buen", "buena", "buenas", "bueno", "buenos", "c", "cada", "casi", "cerca", "cierta", "ciertas", "cierto", "ciertos", "cinco", "claro", "comentó", "como", "con", "conmigo", "conocer", "conseguimos", "conseguir", "considera", "consideró", "consigo", "consigue", "consiguen", "consigues", "contigo", "contra", "cosas", "creo", "cual", "cuales", "cualquier", "cuando", "cuanta", "cuantas", "cuanto", "cuantos", "cuatro", "cuenta", "cuál", "cuáles", "cuándo", "cuánta", "cuántas", "cuánto", "cuántos", "cómo", "d", "da", "dado", "dan", "dar", "de", "debajo", "debe", "deben", "debido", "decir", "dejó", "del", "delante", "demasiado", "demás", "dentro", "deprisa", "desde", "despacio", "despues", "después", "detras", "detrás", "dia", "dias", "dice", "dicen", "dicho", "dieron", "diferente", "diferentes", "dijeron", "dijo", "dio", "donde", "dos", "durante", "día", "días", "dónde", "e", "ejemplo", "el", "ella", "ellas", "ello", "ellos", "embargo", "empleais", "emplean", "emplear", "empleas", "empleo", "en", "encima", "encuentra", "enfrente", "enseguida", "entonces", "entre", "era", "erais", "eramos", "eran", "eras", "eres", "es", "esa", "esas", "ese", "eso", "esos", "esta", "estaba", "estabais", "estaban", "estabas", "estad", "estada", "estadas", "estado", "estados", "estais", "estamos", "estan", "estando", "estar", "estaremos", "estará", "estarán", "estarás", "estaré", "estaréis", "estaría", "estaríais", "estaríamos", "estarían", "estarías", "estas", "este", "estemos", "esto", "estos", "estoy", "estuve", "estuviera", "estuvierais", "estuvieran", "estuvieras", "estuvieron", "estuviese", "estuvieseis", "estuviesen", "estuvieses", "estuvimos", "estuviste", "estuvisteis", "estuviéramos", "estuviésemos", "estuvo", "está", "estábamos", "estáis", "están", "estás", "esté", "estéis", "estén", "estés", "ex", "excepto", "existe", "existen", "explicó", "expresó", "f", "fin", "final", "fue", "fuera", "fuerais", "fueran", "fueras", "fueron", "fuese", "fueseis", "fuesen", "fueses", "fui", "fuimos", "fuiste", "fuisteis", "fuéramos", "fuésemos", "g", "general", "gran", "grandes", "gueno", "h", "ha", "haber", "habia", "habida", "habidas", "habido", "habidos", "habiendo", "habla", "hablan", "habremos", "habrá", "habrán", "habrás", "habré", "habréis", "habría", "habríais", "habríamos", "habrían", "habrías", "habéis", "había", "habíais", "habíamos", "habían", "habías", "hace", "haceis", "hacemos", "hacen", "hacer", "hacerlo", "haces", "hacia", "haciendo", "hago", "han", "has", "hasta", "hay", "haya", "hayamos", "hayan", "hayas", "hayáis", "he", "hecho", "hemos", "hicieron", "hizo", "horas", "hoy", "hube", "hubiera", "hubierais", "hubieran", "hubieras", "hubieron", "hubiese", "hubieseis", "hubiesen", "hubieses", "hubimos", "hubiste", "hubisteis", "hubiéramos", "hubiésemos", "hubo", "i", "igual", "incluso", "indicó", "informo", "informó", "intenta", "intentais", "intentamos", "intentan", "intentar", "intentas", "intento", "ir", "j", "junto", "k", "l", "la", "lado", "largo", "las", "le", "lejos", "les", "llegó", "lleva", "llevar", "lo", "los", "luego", "lugar", "m", "mal", "manera", "manifestó", "mas", "mayor", "me", "mediante", "medio", "mejor", "mencionó", "menos", "menudo", "mi", "mia", "mias", "mientras", "mio", "mios", "mis", "misma", "mismas", "mismo", "mismos", "modo", "momento", "mucha", "muchas", "mucho", "muchos", "muy", "más", "mí", "mía", "mías", "mío", "míos", "n", "nada", "nadie", "ni", "ninguna", "ningunas", "ninguno", "ningunos", "ningún", "no", "nos", "nosotras", "nosotros", "nuestra", "nuestras", "nuestro", "nuestros", "nueva", "nuevas", "nuevo", "nuevos", "nunca", "o", "ocho", "os", "otra", "otras", "otro", "otros", "p", "pais", "para", "parece", "parte", "partir", "pasada", "pasado", "paìs", "peor", "pero", "pesar", "poca", "pocas", "poco", "pocos", "podeis", "podemos", "poder", "podria", "podriais", "podriamos", "podrian", "podrias", "podrá", "podrán", "podría", "podrían", "poner", "por", "por qué", "porque", "posible", "primer", "primera", "primero", "primeros", "principalmente", "pronto", "propia", "propias", "propio", "propios", "proximo", "próximo", "próximos", "pudo", "pueda", "puede", "pueden", "puedo", "pues", "q", "qeu", "que", "quedó", "queremos", "quien", "quienes", "quiere", "quiza", "quizas", "quizá", "quizás", "quién", "quiénes", "qué", "r", "raras", "realizado", "realizar", "realizó", "repente", "respecto", "s", "sabe", "sabeis", "sabemos", "saben", "saber", "sabes", "sal", "salvo", "se", "sea", "seamos", "sean", "seas", "segun", "segunda", "segundo", "según", "seis", "ser", "sera", "seremos", "será", "serán", "serás", "seré", "seréis", "sería", "seríais", "seríamos", "serían", "serías", "seáis", "señaló", "si", "sido", "siempre", "siendo", "siete", "sigue", "siguiente", "sin", "sino", "sobre", "sois", "sola", "solamente", "solas", "solo", "solos", "somos", "son", "soy", "soyos", "su", "supuesto", "sus", "suya", "suyas", "suyo", "suyos", "sé", "sí", "sólo", "t", "tal", "tambien", "también", "tampoco", "tan", "tanto", "tarde", "te", "temprano", "tendremos", "tendrá", "tendrán", "tendrás", "tendré", "tendréis", "tendría", "tendríais", "tendríamos", "tendrían", "tendrías", "tened", "teneis", "tenemos", "tener", "tenga", "tengamos", "tengan", "tengas", "tengo", "tengáis", "tenida", "tenidas", "tenido", "tenidos", "teniendo", "tenéis", "tenía", "teníais", "teníamos", "tenían", "tenías", "tercera", "ti", "tiempo", "tiene", "tienen", "tienes", "toda", "todas", "todavia", "todavía", "todo", "todos", "total", "trabaja", "trabajais", "trabajamos", "trabajan", "trabajar", "trabajas", "trabajo", "tras", "trata", "través", "tres", "tu", "tus", "tuve", "tuviera", "tuvierais", "tuvieran", "tuvieras", "tuvieron", "tuviese", "tuvieseis", "tuviesen", "tuvieses", "tuvimos", "tuviste", "tuvisteis", "tuviéramos", "tuviésemos", "tuvo", "tuya", "tuyas", "tuyo", "tuyos", "tú", "u", "ultimo", "un", "una", "unas", "uno", "unos", "usa", "usais", "usamos", "usan", "usar", "usas", "uso", "usted", "ustedes", "v", "va", "vais", "valor", "vamos", "van", "varias", "varios", "vaya", "veces", "ver", "verdad", "verdadera", "verdadero", "vez", "vosotras", "vosotros", "voy", "vuestra", "vuestras", "vuestro", "vuestros", "w", "x", "y", "ya", "yo", "z", "él", "éramos", "ésa", "ésas", "ése", "ésos", "ésta", "éstas", "éste", "éstos", "última", "últimas", "último", "últimos"];
let arr, min, max;
var tokens;
var pregunta, mesa, ciudad;

var archivo;


var counter = 0;

var archivos = [
    "t1",
    "t4",
    "p01-01-s",
    "p01-02-c",
    "p01-02-v",
    "p01-05-p",
    "p01-06-p",
    "p01-16-s",
    "p02-02-c",
    "p02-02-s",
    "p02-02-v",
    "p02-05-p",
    "p02-17-s",
    "p03-03-s",
    "p03-07-p",
    "p03-12-v",
    "p03-18-s",
    "p04-04-s",
    "p04-09-p",
    "p04-12-v",
    "p05-01-p",
    "p05-04-c",
    "p05-05-s",
    "p05-06-v",
    "p06-04-v",
    "p06-05-c",
    "p06-06-p",
    "p06-06-s",
    "p06-11-p",
    "p07-03-v",
    "p07-05-c",
    "p07-07-c",
    "p07-07-s",
    "p07-08-p",
    "p07-09-v",
    "p07-11-p",
    "p08-02-p",
    "p08-06-c",
    "p08-07-c",
    "p08-08-s",
    "p08-08-v",
    "p09-04-p",
    "p09-05-v",
    "p09-06-c",
    "p09-09-s",
    "p09-10-p",
    "p10-05-v",
    "p10-07-p",
    "p10-09-c",
    "p10-10-s",
    "p11-01-p",
    "p11-07-v",
    "p11-10-c",
    "p11-11-s",
    "p12-08-c",
    "p12-10-p",
    "p12-10-v",
    "p12-12-s",
    "p13-03-p",
    "p13-10-v",
    "p13-12-c",
    "p13-13-s",
    "p14-02-p",
    "p14-11-v",
    "p14-13-v",
    "p14-14-s",
    "p15-03-p",
    "p15-11-c",
    "p15-11-v",
    "p15-13-v",
    "p15-15-s",
    "p16-04-p",
    "p17-08-p",
    "p18-09-p",
    "p18-14-c"
]


function preload() {
    var l_arch = archivos.length;
    var rand = int(random(archivos.length));
    archivo = archivos[rand];
    console.log(archivo);


    var codSede = archivo[archivo.length - 1];
    console.log(codSede);

    switch (codSede) {
        case "s":
            txt = loadStrings(`preguntas/santiago/${archivo}.txt`);
            break;

        case "c":
            txt = loadStrings(`preguntas/concepcion/${archivo}.txt`);
            break;

        case "v":
            txt = loadStrings(`preguntas/valdivia/${archivo}.txt`);
            break;

        case "p":
            txt = loadStrings(`preguntas/patagonia/${archivo}.txt`);
            break;

        default:
            break;
    }

    //txt = loadStrings("preguntas/santiago.txt");
    //txt = loadStrings("preguntas/concepcion.txt");
    //txt = loadStrings("preguntas/valdivia.txt");
    //txt = loadStrings("preguntas/patagonia.txt");



    f_FiraSans = loadFont('fira-sans/FiraSans-Bold.otf');
    f_FiraSansLI = loadFont('fira-sans/FiraSans-Regular.otf');

}

function setup() {
    container = select('.container');
    var allwords = txt.join("\n");


    // limpia caracteres y realiza conteo
    limpiarString(allwords);

    // ordena según frecuencia
    keys.sort(compare);



    // guarda los valores máx y mín dentro del conteo
    arr = Object.values(counts);
    min = Math.min(...arr);
    max = Math.max(...arr);


    var cnv = createCanvas(windowWidth, windowHeight);
    cnv.style('display', 'block');
    background(0, 50, 255);

    var partes = archivo.split("-");
    pregunta = partes[0];
    mesa = partes[1];

    switch (partes[2]) {
        case "s":
            ciudad = "Santiago"
            break;
        case "c":
            ciudad = "Concepción"
            break;
        case "v":
            ciudad = "Valdivia"
            break;
        case "p":
            ciudad = "Patagonia"
            break;
        default:
            break;
    }
    partes[2];

    instrucciones(archivo)
    histograma(10, 120, width - 20, 100, keys, counts);
    textos();

}

function instrucciones() {
    fill(220);
    textAlign(CENTER);
    textFont(f_FiraSans);
    textSize(30);
    pregunta = capitalize(pregunta);
    text(pregunta + " Mesa " + mesa + " " + ciudad, width / 2, 40);

    textSize(11);
    textFont(f_FiraSansLI);
    text("Haz click para cargar otra Ciudad/Mesa", width / 2, 60);

}

function compare(a, b) {
    var countA = counts[a];
    var countB = counts[b];
    return countB - countA;
}



function mouseReleased(counter) {

    location.reload();

}

function cicleThroughFiles() {
    if (counter < 2) {
        counter++;
    } else {
        counter = 0;
    }
    switch (counter) {
        case 0:
            txt = loadStrings("preguntas/santiago.txt");
            break;
        case 1:
            txt = loadStrings("preguntas/concepcion.txt");
            break;

        case 2:
            txt = loadStrings("preguntas/valdivia.txt");
            break;
        case 3:
            txt = loadStrings("preguntas/patagonia.txt");
            break;
        default:
            break;
    }
    setTimeout(function() {
        var allwords = txt.join("\n");
        limpiarString(allwords);
        windowResized()
        console.log("done");
    }, 3000)
}

function limpiarString(allwords) {
    var inicioBlanco = /^ /;
    // El $ indica final de cadena
    var finBlanco = / $/;
    // El global (g) es para obtener todas las posibles combinaciones
    var variosBlancos = /[ ]+/g;
    var puntuacion = /[^!-~]+/g;
    var noAlpha = /[äöüÄÖÜ]+/g;

    // allwords = allwords.replace(inicioBlanco, "");
    // allwords = allwords.replace(finBlanco, "");
    // allwords = allwords.replace(variosBlancos, " ");
    // allwords = allwords.replace(noAlpha, " ");


    // https://stackoverflow.com/a/3548615/510317
    var re = /\S+\s*/g;
    tokens = allwords.match(re);
    // console.log(tokens);

    for (var i = 0; i < tokens.length; i++) {
        var word = tokens[i].toLowerCase();


        // Limpiar
        word = word.replace(inicioBlanco, "");
        word = word.replace("(", "");
        word = word.replace(")", "");
        word = word.replace(".", "");
        word = word.replace(",", "");
        word = word.replace(finBlanco, "");
        word = word.replace(finBlanco, "");
        word = word.replace(finBlanco, "");
        word = word.replace('“', "");
        word = word.replace('”', "");

        word = word.replace(/(\r\n|\n|\t|\r)/gm, "");



        if (!/\d+/.test(word)) {
            if (sw.indexOf(word) == -1) {
                if (counts[word] === undefined) {
                    counts[word] = 1;
                    keys.push(word);
                } else {
                    counts[word]++;
                }
            }
        }
    }
}

function textos() {

    // textFont(f_FiraSans);
    textAlign(LEFT);

    fill(100, 180);
    var wordX = 0;
    var wordY = 0;
    var acumuladoX = 0;
    var acumuladoY = 250;
    //blendMode(MULTIPLY);

    for (let i = 0; i < keys.length; i++) {
        var key = keys[i];
        var wordCount = counts[key];
        var wordHeight = wordCount * 0.75;

        textSize(30);
        // textSize(map(wordHeight, min, max, 5, 150));
        wordX = textWidth(key) + 15;

        if (acumuladoX > windowWidth - wordX) {
            acumuladoX = 0;
            acumuladoY += wordHeight * 2.5;
        }

        // fill(
        //     map(wordCount, min, max, 50, 0),
        //     0,
        //     map(wordCount, min, max, 250, 0),
        //     map(wordCount, min, max, 10, 205)
        // );

        fill(map(wordCount, min, max, 255, 200), map(wordCount, min, max, 10, 205))

        // console.log(key, wordCount);
        // rect(acumuladoX, wordY - wordHeight, wordHeight, wordHeight);
        text(key, acumuladoX + random(20), acumuladoY);

        acumuladoX += wordX;



    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(0, 50, 255);
    histograma(10, 120, width - 20, 100, keys, counts);
    textos();
}

function histograma(x, y, w, h, keys, counts) {
    textFont(f_FiraSansLI);
    textAlign(RIGHT);
    textSize(8);

    var ancho = (w - x * 2);
    var espacio = ancho / keys.length;


    push();
    translate(x, y);



    push();
    rotate(-PI / 2);
    for (let i = 0; i < keys.length; i++) {
        var key = keys[i];
        var wordCount = counts[key];

        var lh = map(wordCount, 1, max, 2, h);

        fill(255, 70);
        noStroke();
        text(key, -10, i * espacio);

        stroke(255, 175);
        strokeWeight(2)
        line(0, i * espacio, lh, i * espacio);




    }
    pop();

    pop();
}

function textHeight(text, maxWidth) {
    var words = text.split(' ');
    var line = '';
    var h = this._textLeading;

    for (var i = 0; i < words.length; i++) {
        var testLine = line + words[i] + ' ';
        var testWidth = drawingContext.measureText(testLine).width;

        if (testWidth > maxWidth && i > 0) {
            line = words[i] + ' ';
            h += this._textLeading;
        } else {
            line = testLine;
        }
    }

    return h;
}


function capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
}