let spielfeld;

var radio;
var radioPlayer;

let button;

let breite = 400;
let hoehe = 400;
let w;
let h;

let spieler1 = 'X';
let spieler2 = 'O';
let aktuellerSpieler = spieler1;

let ergebnisAusgabe;
let ergebnisAusgabeP;

let availableSpot;

let winnerPosition;

let fr = 5; //über die Bildrate steuert man die Spielgeschwindigkeit beim pcOnlyMode!

function setup() {
    createCanvas(breite, hoehe).parent('gameContainer');
    frameRate(fr);

    radio = createRadio("r1");
    radio.parent("r1");
    radio.option('pcOnlyMode', 'Simulation.............');
    radio.option('humanOnlyMode', 'Zweispieler............');
    radio.option('aiMode', 'Mensch vs. AI.......');
    radio.option('rndMode', 'Mensch vs. PC.....');

    radioPlayer = createRadio("r2");
    radioPlayer.parent('r2');
    radioPlayer.option('du', 'Du........................');
    radioPlayer.option('computer', 'PC........................');

    spielAufbau();

    button = createButton("neues Spiel!");
    button.mousePressed(function () {
        spielAufbau();
        loop();
    });
    button.parent('selectContainer');
}

function spielAufbau() {
    availableSpot = [];
    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
            availableSpot.push([i, j]);
        }
    }

    spielfeld = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    gewinner = null;
    aktuellerSpieler = spieler1;
    if (ergebnisAusgabe != null) {
        ergebnisAusgabeP.remove();
    }

    radio.selected('rndMode').checked = true;
    radioPlayer.selected('du').checked = true;
}

function dreiGleiche(a, b, c) {
    return (a == b && b == c && a != '');
}

function werGewinnt() {
    let gewinner = null;

    strokeWeight(7);
    stroke('rgba(4, 97, 159, 0.70)');

    let position = [hoehe / 3 / 2, hoehe / 2, hoehe / 1.2];

    // horizontaler Check
    for (let i = 0; i < 3; i++) {
        if (dreiGleiche(spielfeld[i][0], spielfeld[i][1], spielfeld[i][2])) {
            gewinner = spielfeld[i][0];
            winnerPosition = [position[i], 0, position[i], hoehe];
        }
    }

    // vertikaler Check
    for (let i = 0; i < 3; i++) {
        if (dreiGleiche(spielfeld[0][i], spielfeld[1][i], spielfeld[2][i])) {
            gewinner = spielfeld[0][i];
            winnerPosition = [0, position[i], breite, position[i]];
        }
    }

    // diagonaler Check links-rechts
    if (dreiGleiche(spielfeld[0][0], spielfeld[1][1], spielfeld[2][2])) {
        gewinner = spielfeld[0][0];
        winnerPosition = [0, 0, breite, hoehe];
    }

    // diagonaler Check rechts-links
    if (dreiGleiche(spielfeld[2][0], spielfeld[1][1], spielfeld[0][2])) {
        gewinner = spielfeld[2][0];
        winnerPosition = [breite, 0, 0, hoehe];
    }

    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (spielfeld[i][j] == '') {
                openSpots++;
            }
        }
    }

    if (gewinner == null && openSpots == 0) {
        return 'tie';
        console.log('tie');
    } else {
        return gewinner;
        console.log(gewinner);
    }
}

function mousePressed() {
    if (mouseX > 0 && mouseX < breite && mouseY > 0 && mouseY < hoehe) {
        console.log("IM CANVAS");

        if (radio.value() == 'aiMode' && radioPlayer.value() == 'du') {
            humanAgainsAI();
        } else if (radio.value() == 'humanOnlyMode') {
            humanOnly();
        } else if (radioPlayer.value() == 'computer' && radio.value() == 'rndMode' || radio.value() == 'aiMode') {
            humansTurn();
        } else if (radio.value() == 'rndMode' && radioPlayer.value() == 'du') {
            humanAgainstComputer();
        } else {
        }
    }
}

function humanAgainsAI() {
    if (aktuellerSpieler == spieler1) {
        let i = floor(mouseX / w);
        let j = floor(mouseY / h);
        if (spielfeld[i][j] == '') {
            spielfeld[i][j] = spieler1;
            aktuellerSpieler = spieler2;
            bestMove();
        }
    }
}

function humanOnly() {
    if (aktuellerSpieler == spieler1) {
        let i = floor(mouseX / w);
        let j = floor(mouseY / h);
        if (spielfeld[i][j] == '') {
            spielfeld[i][j] = spieler1;
            aktuellerSpieler = spieler2;
        }
    } else {
        let i = floor(mouseX / w);
        let j = floor(mouseY / h);
        if (spielfeld[i][j] == '') {
            spielfeld[i][j] = spieler2;
            aktuellerSpieler = spieler1;
        }
    }
}

// die Spielfelder werden random vom pc befüllt wie bei einer Simulation
function humanAgainstComputer() {
    if (aktuellerSpieler == spieler1) {
        let i = floor(mouseX / w);
        let j = floor(mouseY / h);
        if (spielfeld[i][j] == '') {
            spielfeld[i][j] = spieler1;
            aktuellerSpieler = spieler2;

            let available = [];
            for (let k = 0; k < 3; k++) {
                for (let l = 0; l < 3; l++) {
                    if (spielfeld[k][l] == '') {
                        console.log("spielfeld[k][l]: " + spielfeld[k][l]);
                        available.push({ k, l });
                    }
                }
            }

            let move = random(available);
            if (move != null) {
                spielfeld[move.k][move.l] = spieler2;
                aktuellerSpieler = spieler1;
            }
        }
    }
}

function draw() {
    background(46);
    w = breite / 3;
    h = hoehe / 3;
    strokeWeight(4);
    stroke('white');

    line(w, 0, w, hoehe);
    line(w * 2, 0, w * 2, hoehe);
    line(0, h, breite, h);
    line(0, h * 2, breite, h * 2).strokeWeight(10);

    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
            let x = w * i + w / 2;
            let y = h * j + h / 2;
            let spot = spielfeld[i][j];
            textSize(32);
            if (spot == spieler2) {
                noFill();
                ellipse(x, y, w / 2);
            } else if (spot == spieler1) {
                let xr = w / 4;
                line(x - xr, y - xr, x + xr, y + xr);
                line(x + xr, y - xr, x - xr, y + xr);
            }
        }
    }

    ergebnisAusgabe = werGewinnt();
    if (ergebnisAusgabe != null) {
        noLoop();
        ergebnisAusgabeP = createP('')
        ergebnisAusgabeP.parent('selectContainer');
        ergebnisAusgabeP.id('ausgabe');
        if (ergebnisAusgabe == 'tie') {
            ergebnisAusgabeP.html('Unentschieden!');
        } else {
            ergebnisAusgabeP.html(`${ergebnisAusgabe} gewinnt!`);
            line(winnerPosition[0], winnerPosition[1], winnerPosition[2], winnerPosition[3]);
        }
    }

    if (radio.value() == 'pcOnlyMode' || radio.value() == 'humanOnlyMode') {
        radioPlayer.attribute("disabled", true);
    } else {
        radioPlayer.removeAttribute("disabled");
    }

    if (radio.value() == 'pcOnlyMode') {
        pcOnly();
    } else if (radioPlayer.value() == 'computer') {
        if (radio.value() == 'rndMode') {
            computerAgainstHuman();
        }

        if (radio.value() == 'aiMode') {
            aiAgainstHuman();
        }
    }
}

function pcOnly() {
    let index = floor(random(availableSpot.length));
    let spot = availableSpot.splice(index, 1)[0];
    if (spot != null) {
        let i = spot[0];
        let j = spot[1];
        if (aktuellerSpieler == spieler1) {
            spielfeld[i][j] = spieler1;
            aktuellerSpieler = spieler2;
        } else {
            spielfeld[i][j] = spieler2;
            aktuellerSpieler = spieler1;
        }
    }
}

function computerAgainstHuman() {
    if (aktuellerSpieler == spieler1) {
        let available = [];
        for (let k = 0; k < 3; k++) {
            for (let l = 0; l < 3; l++) {
                if (spielfeld[k][l] == '') {
                    console.log("spielfeld[k][l]: " + spielfeld[k][l]);
                    available.push({ k, l });
                }
            }
        }

        let move = random(available);
        if (move != null) {
            spielfeld[move.k][move.l] = spieler1;
            aktuellerSpieler = spieler2;
        }
    }
}

function aiAgainstHuman() {
    if (aktuellerSpieler == spieler1) {
        bestMove();
    }
}

function humansTurn() {
    if (aktuellerSpieler == spieler2) {
        let i = floor(mouseX / w);
        let j = floor(mouseY / h);
        if (spielfeld[i][j] == '') {
            spielfeld[i][j] = spieler2;
            aktuellerSpieler = spieler1;
        }
    }
}
