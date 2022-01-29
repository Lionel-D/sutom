import LettreResultat from "./lettreResultat";
import { LettreStatut } from "./lettreStatut";
import NotificationMessage from "./notificationMessage";
import PanelManager from "./panelManager";

export default class FinDePartiePanel {
  private readonly _datePartie: Date;
  private readonly _panelManager: PanelManager;
  private readonly _statsButton: HTMLElement;

  private _resumeTexte: string = "";
  private _motATrouver: string = "";
  private _estVictoire: boolean = false;
  private _partieEstFinie: boolean = false;

  public constructor(datePartie: Date, panelManager: PanelManager) {
    this._datePartie = datePartie;
    this._panelManager = panelManager;
    this._statsButton = document.getElementById("configuration-stats-bouton") as HTMLElement;

    this._statsButton.addEventListener(
      "click",
      (() => {
        this.afficher();
      }).bind(this)
    );
  }

  public genererResume(estBonneReponse: boolean, motATrouver: string, resultats: Array<Array<LettreResultat>>): void {
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
    let dateGrille = this._datePartie.getTime();
    let origine = new Date(2022, 0, 8).getTime();
    this._motATrouver = motATrouver;
    this._estVictoire = estBonneReponse;
    this._partieEstFinie = true;

    let numeroGrille = Math.floor((dateGrille - origine) / (24 * 3600 * 1000)) + 1;

    this._resumeTexte = "SUTOM #" + numeroGrille + " " + (estBonneReponse ? resultats.length : "-") + "/6\n\n" + resultatsEmojis.join("\n");
  }

  private attacherPartage(): void {
    let resumeBouton = document.getElementById("fin-de-partie-panel-resume-bouton") as HTMLElement;
    resumeBouton.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!navigator.clipboard) {
        NotificationMessage.ajouterNotification("Votre navigateur n'est pas compatible");
      }

      navigator.clipboard
        .writeText(this._resumeTexte + "\n\nhttps://sutom.nocle.fr")
        .then(() => {
          NotificationMessage.ajouterNotification("Résumé copié dans le presse papier");
        })
        .catch((raison) => {
          NotificationMessage.ajouterNotification("Votre navigateur n'est pas compatible");
        });
    });
  }

  public afficher(): void {
    let titre: string;
    let contenu: string;
    if (!this._partieEstFinie) {
      titre = "Statistiques";
      contenu = "Vous n'avez pas encore fini votre partie du jour";
    } else {
      if (this._estVictoire) {
        titre = "Félicitations";
        contenu = "<p>Bravo, tu as gagné. Reviens demain pour une nouvelle grille.</p>";
      } else {
        titre = "Perdu";
        contenu = "<p> \
          Le mot a trouver était : " + this._motATrouver + "<br /> \
          Peut être feras-tu mieux demain ? \
        </p>";
      }
      contenu +=
        '<p>Résumé de ta partie <a href="#" id="fin-de-partie-panel-resume-bouton">Partager</a></p> \
          <pre id="fin-de-partie-panel-resume">' +
        this._resumeTexte +
        "</pre>";
    }
    this._panelManager.setContenu(titre, contenu);
    this._panelManager.setClasses(["fin-de-partie-panel"]);
    if (this._partieEstFinie) this.attacherPartage();
    this._panelManager.afficherPanel();
  }
}
