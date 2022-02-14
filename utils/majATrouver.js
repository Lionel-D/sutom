"use strict";
/**
 * Petit script qui nettoie le fichier des mots à trouver pour le mettre dans le format attendu par le système
 */
var fs = require("fs");
var instanceConfiguration = require("../js/instanceConfiguration");

let aujourdhui = new Date().getTime();
let origine = instanceConfiguration.default.dateOrigine.getTime();

let numeroGrille = Math.floor((aujourdhui - origine) / (24 * 3600 * 1000));

const maxFige = numeroGrille + 1; // inclus

fs.readFile("data/motsATrouve.txt", "UTF8", function (erreur, contenu) {
  //console.log(erreur);
  var dictionnaire = contenu.split("\n");
  let motsFiges = dictionnaire.slice(0, maxFige + 1);

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

  motsFiges
    .map((mot) =>
      mot
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toUpperCase()
        .trim()
        .replace(/^\s+|\s+$/g, "")
    )
    .forEach((mot, numeroMot) =>
      fs.access("mots/" + (numeroMot + 1) + ".txt", fs.constants.F_OK, (err) => {
        if (err) {
          // Dans ce cas, le fichier n'existe pas
          fs.writeFile("mots/" + (numeroMot + 1) + ".txt", mot, (err) => {
            if (err) console.error(err);
          });
        }
      })
    );
  fs.writeFile("ts/mots/listeMotsATrouver.ts", contenu, function (err) {
    if (err) {
      console.error(err);
      return;
    }
    //file written successfully
  });
});
