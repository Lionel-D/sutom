"use strict";
/**
 * Petit script qui nettoie le fichier des mots à trouver pour le mettre dans le format attendu par le système
 */
var fs = require("fs");
var listeMotsProposable = require("../js/mots/listeMotsProposables");
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

let aujourdhui = new Date().getTime();
let origine = new Date(2022, 0, 8).getTime();

let numeroGrille = Math.floor((aujourdhui - origine) / (24 * 3600 * 1000));

const maxFige = numeroGrille + 1; // inclus
console.log(maxFige);
fs.readFile("data/motsATrouve.txt", "UTF8", function (erreur, contenu) {
  //console.log(erreur);
  var dictionnaire = contenu.split("\n");
  let motsFiges = dictionnaire.slice(0, maxFige + 1);
  let motsMelanges;
  let nbEssais = 0;
  do {
    motsMelanges = shuffle(dictionnaire.slice(maxFige + 1));
    nbEssais++;
  } while (motsFiges[motsFiges.length - 1][0].toUpperCase() === motsMelanges[0][0].toUpperCase() && nbEssais <= 20);

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
        !mot.toUpperCase().startsWith("Z") &&
        listeMotsProposable.default.Dictionnaire.includes(mot)
    )
    .join("\n");
  fs.writeFile(
    "data/motsATrouve.txt",
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
