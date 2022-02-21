import ListeMotsProposables from "./mots/listeMotsProposables";
export default class Dictionnaire {
  public constructor() {}

  public static async getMot(idPartie: string, datePartie: Date): Promise<string> {
    return await this.getNomFichier(idPartie, datePartie)
      .then((nom) => fetch("mots/" + nom + ".txt"))
      .then(
        (resultat) =>
          new Promise((resolve, reject) => {
            if (!resultat.ok) return reject("Mot non trouvé");

            return resolve(resultat.text());
          })
      );
  }

  private static async getNomFichier(idPartie: string, datePartie: Date): Promise<string> {
    let datePartieStr =
      datePartie.getFullYear().toString() +
      "-" +
      (datePartie.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      datePartie.getDate().toString().padStart(2, "0");

    return btoa(idPartie + "-" + datePartieStr);
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
