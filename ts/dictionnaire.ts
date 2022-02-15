import InstanceConfiguration from "./instanceConfiguration";
import ListeMotsProposables from "./mots/listeMotsProposables";
export default class Dictionnaire {
  public constructor() {}

  public static async getMot(datePartie: Date): Promise<string> {
    let aujourdhui = datePartie.getTime();
    let origine = InstanceConfiguration.dateOrigine.getTime();

    let numeroGrille = Math.floor((aujourdhui - origine) / (24 * 3600 * 1000)) + 1;

    return await fetch("mots/" + numeroGrille + ".txt").then((resultat) => resultat.text());
  }

  public static estMotValide(mot: string): boolean {
    mot = this.nettoyerMot(mot);
    return mot.length >= 6 && mot.length <= 9 && ListeMotsProposables.Dictionnaire.includes(mot);
  }

  public static nettoyerMot(mot: string): string {
    return mot
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();
  }
}
