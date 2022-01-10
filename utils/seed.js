"use strict";

/**
 * Script qui n'est plus vraiment utile, et qui permet de vérifier qu'un générateur de seed navigue bien dans la liste des mots
 */
var dateJour = new Date();
var aujourdhui = dateJour.getFullYear() * 10000 + (dateJour.getMonth() + 1) * 10 + dateJour.getDate();
var seed = 18;
aujourdhui += seed;
for (var i = 0; i < 10; i++) {
  var positionRandom = (aujourdhui * aujourdhui) % 112768;
  //console.log(positionRandom);
  aujourdhui++;
}
