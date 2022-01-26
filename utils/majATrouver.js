"use strict";
/**
 * Petit script qui nettoie le fichier des mots à trouver pour le mettre dans le format attendu par le système
 */
var fs = require("fs");

let aujourdhui = new Date().getTime();
let origine = new Date(2022, 0, 8).getTime();

let numeroGrille = Math.floor((aujourdhui - origine) / (24 * 3600 * 1000));

const maxFige = numeroGrille + 1; // inclus

fs.readFile("data/motsATrouve.txt", "UTF8", function (erreur, contenu) {
  //console.log(erreur);
  var dictionnaire = contenu.split("\n");
  let motsFiges = dictionnaire.slice(0, maxFige + 2);

  contenu = "export default class ListeMotsATrouver {\n";
  contenu += " public static readonly Liste: Array<string> = [\n";
  contenu += motsFiges
    .map(
      (mot) =>
        '"' +
        mot
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toUpperCase() +
        '",'
    )
    .join("\n");
  contenu += "\n  ]";
  contenu += "\n}";
  fs.writeFile("ts/mots/listeMotsATrouver.ts", contenu, function (err) {
    if (err) {
      console.error(err);
      return;
    }
    //file written successfully
  });
});
