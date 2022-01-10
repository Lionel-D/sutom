"use strict";
/**
 * Petit script pour avoir quelques stats sur la liste des mots à trouver
 */
var fs = require("fs");

fs.readFile("public/motsATrouve.txt", "UTF8", function (erreur, contenu) {
  //console.log(erreur);
  var dictionnaire = contenu.split("\n");
  let lettres = {};
  for (let mot of dictionnaire) {
    if (!mot) continue;
    let initiale = mot[0].toUpperCase();
    let motClean = mot.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    let longueur = motClean.length;

    if (lettres[initiale] === undefined) lettres[initiale] = { 6: 0, 7: 0, 8: 0, 9: 0 };

    lettres[initiale][longueur.toString()]++;
  }

  console.log("  |  6  |  7  |  8  |  9  |");
  for (let lettre in lettres) {
    let stats = lettres[lettre];
    console.log(
      lettre +
        " | " +
        stats["6"].toString().padStart(3) +
        " | " +
        stats["7"].toString().padStart(3) +
        " | " +
        stats["8"].toString().padStart(3) +
        " | " +
        stats["9"].toString().padStart(3) +
        " |"
    );
  }
});
