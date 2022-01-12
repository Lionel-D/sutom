import LettreResultat from "./lettreResultat";
import { LettreStatut } from "./lettreStatut";
import NotificationMessage from "./notificationMessage";

export default class FinDePartiePanel {
  private readonly _finDePartiePanel: HTMLElement;
  private readonly _victoirePanel: HTMLElement;
  private readonly _defaitePanel: HTMLElement;
  private readonly _defaitePanelMot: HTMLElement;
  private readonly _resume: HTMLPreElement;
  private readonly _resumeBouton: HTMLElement;

  private _resumeTexte: string = "";

  public constructor() {
    this._finDePartiePanel = document.getElementById("fin-de-partie-panel") as HTMLElement;
    this._victoirePanel = document.getElementById("victoire-panel") as HTMLElement;
    this._defaitePanel = document.getElementById("defaite-panel") as HTMLElement;
    this._defaitePanelMot = document.getElementById("defaite-panel-mot") as HTMLElement;
    this._resume = document.getElementById("fin-de-partie-panel-resume") as HTMLPreElement;
    this._resumeBouton = document.getElementById("fin-de-partie-panel-resume-bouton") as HTMLElement;

    this._resumeBouton.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!navigator.clipboard) {
        NotificationMessage.ajouterNotification("Votre navigateur n'est pas compatible");
      }

      navigator.clipboard.writeText(this._resumeTexte + "\n\nhttps://sutom.nocle.fr");

      NotificationMessage.ajouterNotification("Résumé copié dans le presse papier");
    });
  }

  public genererResume(aBonneReponse: boolean, resultats: Array<Array<LettreResultat>>): void {
    let resultatsEmojis = resultats.map((mot) =>
      mot
        .map((resultat) => resultat.statut)
        .reduce((ligne, statut) => {
          switch (statut) {
            case LettreStatut.BienPlace:
              return ligne + "🟥";
            case LettreStatut.MalPlace:
              return ligne + "🟡";
            default:
              return ligne + "🟦";
          }
        }, "")
    );
    let aujourdhui = new Date().getTime();
    let origine = new Date(2022, 0, 8).getTime();

    let numeroGrille = Math.floor((aujourdhui - origine) / (24 * 3600 * 1000)) + 1;

    this._resumeTexte = "SUTOM #" + numeroGrille + " " + (aBonneReponse ? resultats.length : "-") + "/6\n\n" + resultatsEmojis.join("\n");
    this._resume.innerText = this._resumeTexte;
  }

  public afficher(estVictoire: boolean, motATrouver: string): void {
    this._finDePartiePanel.style.display = "block";

    if (estVictoire) this._victoirePanel.style.display = "block";
    else {
      this._defaitePanelMot.innerText = motATrouver;
      this._defaitePanel.style.display = "block";
    }
  }
}
