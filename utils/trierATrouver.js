"use strict";
/**
 * Petit script qui nettoie le fichier des mots à trouver pour le mettre dans le format attendu par le système
 */
var fs = require("fs");
var instanceConfiguration = require("../public/js/instanceConfiguration");

let aujourdhui = new Date().getTime();
let origine = instanceConfiguration.default.dateOrigine.getTime();

let numeroGrille = Math.floor((aujourdhui - origine) / (24 * 3600 * 1000));

const maxFige = numeroGrille + 1; // inclus
console.log(maxFige);
fs.readFile("data/motsATrouve.txt", "UTF8", function (erreur, contenu) {
  //console.log(erreur);
  var dictionnaire = contenu.split("\n");
  let motsFiges = dictionnaire.slice(0, maxFige + 1);
  let motsMelanges = dictionnaire.slice(maxFige + 1);
  motsMelanges.sort();

  var contenu = "";
  contenu += motsFiges.join("\n") + "\n";
  contenu += motsMelanges
    .filter(
      (mot) =>
        mot &&
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
    .join("\n");
  fs.writeFile(
    "data/motsATrouveTriee.txt",
    contenu,
    {
      flag: "w",
    },
    function (err) {
      if (err) {
        console.error(err);
        return;
      }
      //file written successfully
    }
  );
});
