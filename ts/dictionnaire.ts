import ListeMotsProposables from "./mots/listeMotsProposables";
import ListeMotsATrouver from "./mots/listeMotsATrouver";
export default class Dictionnaire {
  public constructor() {}

  public getMot(datePartie: Date): string {
    let aujourdhui = datePartie.getTime();
    let origine = new Date(2022, 0, 8).getTime();

    let numeroGrille = Math.floor((aujourdhui - origine) / (24 * 3600 * 1000));

    return ListeMotsATrouver.Liste[numeroGrille % ListeMotsATrouver.Liste.length];
  }

  public estMotValide(mot: string): boolean {
    mot = this.nettoyerMot(mot);
    return mot.length >= 6 && mot.length <= 9 && ListeMotsProposables.Dictionnaire.includes(mot);
  }

  public nettoyerMot(mot: string): string {
    return mot
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();
  }
}
