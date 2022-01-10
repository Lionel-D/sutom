import SauvegardePartie from "./sauvegardePartie";
import SauvegardeStats from "./sauvegardeStats";

export default class Sauvegardeur {
  public constructor() {}

  public sauvegarderStats(stats: SauvegardeStats): void {
    localStorage.setItem("stats", JSON.stringify(stats));
  }

  public chargerSauvegardeStats(): SauvegardeStats | undefined {
    let dataStats = localStorage.getItem("stats");
    if (!dataStats) return;

    let stats = JSON.parse(dataStats) as SauvegardeStats;
    return stats;
  }

  public sauvegarderPartieEnCours(propositions: Array<string>, datePartie: Date): void {
    let partieEnCours: SauvegardePartie = {
      propositions: propositions,
      datePartie,
    };
    localStorage.setItem("partieEnCours", JSON.stringify(partieEnCours));
  }

  public chargerSauvegardePartieEnCours(): { propositions: Array<string>; datePartie: Date } | undefined {
    let dataPartieEnCours = localStorage.getItem("partieEnCours");
    if (!dataPartieEnCours) return;

    let partieEnCours = JSON.parse(dataPartieEnCours) as SauvegardePartie;
    let aujourdhui = new Date();
    let datePartieEnCours = new Date(partieEnCours.datePartie);
    if (
      aujourdhui.getDate() !== datePartieEnCours.getDate() ||
      aujourdhui.getMonth() !== datePartieEnCours.getMonth() ||
      aujourdhui.getFullYear() !== datePartieEnCours.getFullYear()
    ) {
      localStorage.removeItem("partieEnCours");
      return;
    }
    return {
      datePartie: datePartieEnCours,
      propositions: partieEnCours.propositions,
    };
  }
}
