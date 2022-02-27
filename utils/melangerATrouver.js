"use strict";
/**
 * Petit script qui nettoie le fichier des mots à trouver pour le mettre dans le format attendu par le système
 */
var fs = require("fs");

var listeMotsProposable = require("../public/js/mots/listeMotsProposables");
var instanceConfiguration = require("../public/js/instanceConfiguration");
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
let origine = instanceConfiguration.default.dateOrigine.getTime();

let numeroGrille = Math.floor((aujourdhui - origine) / (24 * 3600 * 1000));

const maxFige = numeroGrille + 1; // inclus

// console.log(maxFige);
fs.readFile("data/motsATrouve.txt", "UTF8", function (erreur, contenu) {
  //console.log(erreur);
  var dictionnaire = contenu.split("\n").filter((mot) => mot.length > 0);
  let motsFiges = dictionnaire.slice(0, maxFige + 1);
  let nbEssais = 0;
  const maxEssais = 100;
  let traitementOk = false;
  let motsMelanges = dictionnaire.slice(maxFige + 1);
  let motsMelangesFige = [...motsFiges];

  do {
    motsMelanges = shuffle(motsMelanges);
    if (motsMelanges.length === 0) break;
    // On vérifie que le mélange corresponde à nos critères
    let premieresLettres = [];
    for (let i = Math.max(0, motsMelangesFige.length - 5); i < motsMelangesFige.length; i++) {
      premieresLettres.push(motsMelangesFige[i][0].toUpperCase());
    }
    // Ainsi que la dernière longueur
    let derniereLongueur = motsMelangesFige.length > 0 ? motsMelangesFige[motsMelangesFige.length - 1].length : 0;
    let origine = 0;
    nbEssais++;
    let motsMelangesRestants = [];
    for (let i = 0; i < motsMelanges.length; i++) {
      let mot = motsMelanges[i];
      let premiereLettre = motsMelanges[i][0].toUpperCase();
      let longueur = motsMelanges[i].length;
      if (premieresLettres.includes(premiereLettre) || longueur === derniereLongueur) {
        motsMelangesRestants.push(mot);
      } else {
        if (premieresLettres.length === 5) premieresLettres.shift();
        premieresLettres.push(premiereLettre);
        derniereLongueur = longueur;
        motsMelangesFige.push(motsMelanges[i]);
        origine++;
      }
    }
    traitementOk = origine === motsMelanges.length;
    motsMelanges = [...motsMelangesRestants];
    if (nbEssais > maxEssais && motsMelangesRestants.length !== 0) {
      // Tous les mots n'ont pas pu être mélangés, donc on va remettre la fin
      motsMelangesFige = [...motsMelangesFige, ...motsMelangesRestants];
    }
  } while (!traitementOk && nbEssais <= maxEssais);

  var contenu = "";
  contenu += motsFiges.map((mot) => mot.trim().replace(/^\s+|\s+$/g, "")).join("\n") + "\n";
  contenu += motsMelangesFige
    .slice(maxFige + 1)
    .map((mot) => mot.trim().replace(/^\s+|\s+$/g, ""))
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
