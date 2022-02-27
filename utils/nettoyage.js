"use strict";

/**
 * Petit script qui nettoie le fichier dictionnaire pour le mettre dans le format attendu par le système
 */
var fs = require("fs");

fs.readFile("data/mots.txt", "UTF8", function (erreur, contenu) {
  //console.log(erreur);
  var dictionnaire = contenu
    .split("\n")
    .filter((mot) => mot)
    .map((mot) =>
      mot
        .normalize("NFD")
        .replace(/æ/gu, "ae")
        .replace(/œ/gu, "oe")
        .replace(/\p{Diacritic}/gu, "")
    )
    .filter(
      (mot) =>
        !(mot[0] === mot[0].toUpperCase()) &&
        mot.length >= 6 &&
        mot.length <= 9 &&
        !mot.includes("!") &&
        !mot.includes(" ") &&
        !mot.includes("-") &&
        !mot.toUpperCase().startsWith("K") &&
        !mot.toUpperCase().startsWith("Q") &&
        !mot.toUpperCase().startsWith("W") &&
        !mot.toUpperCase().startsWith("X") &&
        !mot.toUpperCase().startsWith("Y") &&
        !mot.toUpperCase().startsWith("Z")
    )
    .filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });
  dictionnaire.sort();
  contenu = "public static readonly Dictionnaire: Array<string> = [\n";
  contenu += dictionnaire
    .map(function (mot) {
      return '"' + mot.toUpperCase() + '",';
    })
    .join("\n");
  contenu += "\n];";
  fs.writeFile("data/motsNettoyes.txt", contenu, function (err) {
    if (err) {
      console.error(err);
      return;
    }
    //file written successfully
  });
});
