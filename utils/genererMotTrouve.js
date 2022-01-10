"use strict";

/**
 * Petit script qui permet de remplir rapidement (mais manuellement) la liste des fichiers à trouver.
 */
var fs = require("fs");
var readlineSync = require("readline-sync");

function start() {
  let motsGardes = [];
  fs.readFile("public/mots.txt", "UTF8", function (erreur, contenu) {
    //console.log(erreur);
    var dictionnaire = contenu.split("\n");
    while (true) {
      var motTrouve = false;
      var mot = "";
      do {
        var position = Math.floor(Math.random() * dictionnaire.length);
        mot = dictionnaire[position];
        let motAnalyse = mot.normalize("NFD").replace(/\p{Diacritic}/gu, "");
        motTrouve =
          !(motAnalyse[0] === motAnalyse[0].toUpperCase()) &&
          motAnalyse.length >= 6 &&
          motAnalyse.length <= 9 &&
          !motAnalyse.includes("!") &&
          !motAnalyse.includes(" ") &&
          !motAnalyse.includes("-") &&
          !mot.toUpperCase().startsWith("K") &&
          !mot.toUpperCase().startsWith("Q") &&
          !mot.toUpperCase().startsWith("W") &&
          !mot.toUpperCase().startsWith("X") &&
          !mot.toUpperCase().startsWith("Y") &&
          !mot.toUpperCase().startsWith("Z");
      } while (!motTrouve);
      console.log(mot);

      let reponse = readlineSync.question("On garde ? [O]ui ou [N]on (ou [STOP])\n");
      if (reponse.toLowerCase() === "stop") break;
      let isGarde = reponse.toLowerCase() === "o";
      if (isGarde) motsGardes.push(mot);
    }
    fs.appendFile("public/motsATrouve.txt", motsGardes.join("\n") + "\n", (err) => {
      if (err) {
        console.error(err);
        return;
      }
      //file written successfully
    });
  });
}

start();
