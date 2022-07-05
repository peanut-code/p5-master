let ergebnisse;
let aiSpieler;
let humanSpieler;

function bestMove() {
  if (radioPlayer.value() == 'computer') {
    ergebnisse = {
      X: 1,
      O: -1,
      tie: 0
    };

    aiSpieler = spieler1;
    humanSpieler = spieler2;

  } else if (radioPlayer.value() == 'du') {
    ergebnisse = {
      X: -1,
      O: 1,
      tie: 0
    };

    aiSpieler = spieler2;
    humanSpieler = spieler1;
  }

  // damit spieler2 den Spielzug macht
  let bestesErgebnis = -Infinity;
  let spielzug;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // Ist das Feld frei?
      if (spielfeld[i][j] == '') {
        spielfeld[i][j] = aiSpieler;
        let score = minimax(spielfeld, 0, false);
        console.log("SCORE: " + score);
        console.log("BestesErgebnis: " + bestesErgebnis);
        spielfeld[i][j] = '';
        if (score > bestesErgebnis) {
          bestesErgebnis = score;
          spielzug = { i, j };
        }
      }
    }
  }
  if (spielzug != null) {
    spielfeld[spielzug.i][spielzug.j] = aiSpieler;
    aktuellerSpieler = humanSpieler;
  }
}

function minimax(spielfeld, tiefe, isMaximizing) {
  let result = werGewinnt();
  if (result !== null) {
    return ergebnisse[result];
  }

  if (isMaximizing) {
    let bestesErgebnis = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Ist das Feld frei?
        if (spielfeld[i][j] == '') {
          spielfeld[i][j] = aiSpieler;
          let score = minimax(spielfeld, tiefe + 1, false);
          spielfeld[i][j] = '';
          bestesErgebnis = max(score, bestesErgebnis);
        }
      }
    }
    return bestesErgebnis;
  } else {
    let bestesErgebnis = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Ist das Feld frei?
        if (spielfeld[i][j] == '') {
          spielfeld[i][j] = humanSpieler;
          let score = minimax(spielfeld, tiefe + 1, true);
          spielfeld[i][j] = '';
          bestesErgebnis = min(score, bestesErgebnis);
        }
      }
    }
    return bestesErgebnis;
  }
}
