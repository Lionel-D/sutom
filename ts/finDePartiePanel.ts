import Configuration from "./entites/configuration";
import LettreResultat from "./entites/lettreResultat";
import { LettreStatut } from "./entites/lettreStatut";
import InstanceConfiguration from "./instanceConfiguration";
import NotificationMessage from "./notificationMessage";
import PanelManager from "./panelManager";
import Sauvegardeur from "./sauvegardeur";

export default class FinDePartiePanel {
  private readonly _datePartie: Date;
  private readonly _panelManager: PanelManager;
  private readonly _statsButton: HTMLElement;

  private _resumeTexte: string = "";
  private _resumeTexteLegacy: string = "";
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

  public genererResume(estBonneReponse: boolean, motATrouver: string, resultats: Array<Array<LettreResultat>>, dureeMs: number): void {
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

    let resultatsEmojisLegacy = resultats.map((mot) =>
      mot
        .map((resultat) => resultat.statut)
        .reduce((ligne, statut) => {
          switch (statut) {
            case LettreStatut.BienPlace:
              return ligne + '<span class="emoji-carre-rouge">🟥</span>';
            case LettreStatut.MalPlace:
              return ligne + '<span class="emoji-cercle-jaune">🟡</span>';
            default:
              return ligne + '<span class="emoji-carre-bleu">🟦</span>';
          }
        }, "")
    );
    let dateGrille = this._datePartie.getTime();
    let origine = InstanceConfiguration.dateOrigine.getTime();
    this._motATrouver = motATrouver;
    this._estVictoire = estBonneReponse;
    this._partieEstFinie = true;

    let numeroGrille = Math.floor((dateGrille - origine) / (24 * 3600 * 1000)) + 1;

    let afficherChrono = (Sauvegardeur.chargerConfig() ?? Configuration.Default).afficherChrono;

    const entete =
      "SUTOM #" +
      numeroGrille +
      " " +
      (estBonneReponse ? resultats.length : "-") +
      "/6" +
      (afficherChrono ? " " + this.genererTempsHumain(dureeMs) : "") +
      "\n\n";
    this._resumeTexte = entete + resultatsEmojis.join("\n");
    this._resumeTexteLegacy = entete + resultatsEmojisLegacy.join("\n");
  }

  private genererTempsHumain(dureeMs: number): string {
    // Note : Durée est en millisecondes.
    let duree = Math.floor(dureeMs / 1000);
    let retour = "";

    if (duree >= 3600) {
      retour += Math.floor(duree / 3600) + "h";
    }

    retour +=
      Math.floor((duree / 60) % 60)
        .toString()
        .padStart(2, "0") + ":";
    retour += Math.floor(duree % 60)
      .toString()
      .padStart(2, "0");

    return retour;
  }

  private attacherPartage(): void {
    let resumeBouton = document.getElementById("fin-de-partie-panel-resume-bouton") as HTMLElement;
    resumeBouton.addEventListener("click", (event) => {
      event.stopPropagation();
      new Promise((resolve, reject) => {
        if (window.navigator.clipboard !== undefined) {
          return resolve(window.navigator.clipboard.writeText(this._resumeTexte + "\n\nhttps://sutom.nocle.fr"));
        }

        return reject();
      })
        .catch(
          () =>
            new Promise((resolve, reject) => {
              if (window.navigator.share !== undefined) return resolve(navigator.share({ text: this._resumeTexte + "\n\nhttps://sutom.nocle.fr" }));

              return reject();
            })
        )
        .then(() => {
          NotificationMessage.ajouterNotificationPanel("Résumé copié dans le presse papier");
        })
        .catch((raison) => {
          NotificationMessage.ajouterNotificationPanel("Votre navigateur n'est pas compatible");
        });
    });
  }

  public afficher(): void {
    let titre: string;
    let contenu: string = "";

    if (!this._partieEstFinie) {
      titre = "Statistiques";
      contenu += '<p class="fin-de-partie-panel-phrase">Vous n\'avez pas encore fini votre partie du jour.</p>';
    } else {
      if (this._estVictoire) {
        titre = "Félicitations";
        contenu += '<p class="fin-de-partie-panel-phrase">Bravo, tu as gagné. Reviens demain pour une nouvelle grille.</p>';
      } else {
        titre = "Perdu";
        contenu +=
          '<p class="fin-de-partie-panel-phrase"> \
          Le mot à trouver était : ' +
          this._motATrouver +
          "<br /> \
          Peut-être feras-tu mieux demain ? \
        </p>";
      }
      contenu +=
        '<p>Résumé de ta partie − <a href="#" id="fin-de-partie-panel-resume-bouton">Partager</a></p> \
          <pre id="fin-de-partie-panel-resume">' +
        this._resumeTexteLegacy +
        "</pre>";
    }

    let stats = Sauvegardeur.chargerSauvegardeStats();
    if (stats) {
      contenu +=
        '<p>Statistiques</p><div class="stats-area"><div class="stats-ligne"><div class="stats-cellule">Parties :</div>' +
        `<div class="stats-cellule">${stats.partiesGagnees}/${stats.partiesJouees}</div>` +
        "</div>" +
        `<div class="stats-ligne"><div class="stats-cellule">1/6 :</div><div class="stats-cellule">${stats.repartition[1]}</div></div>` +
        `<div class="stats-ligne"><div class="stats-cellule">2/6 :</div><div class="stats-cellule">${stats.repartition[2]}</div></div>` +
        `<div class="stats-ligne"><div class="stats-cellule">3/6 :</div><div class="stats-cellule">${stats.repartition[3]}</div></div>` +
        `<div class="stats-ligne"><div class="stats-cellule">4/6 :</div><div class="stats-cellule">${stats.repartition[4]}</div></div>` +
        `<div class="stats-ligne"><div class="stats-cellule">5/6 :</div><div class="stats-cellule">${stats.repartition[5]}</div></div>` +
        `<div class="stats-ligne"><div class="stats-cellule">6/6 :</div><div class="stats-cellule">${stats.repartition[6]}</div></div>` +
        `<div class="stats-ligne"><div class="stats-cellule">-/6 :</div><div class="stats-cellule">${stats.repartition["-"]}</div></div>` +
        `<div class="stats-ligne"><div class="stats-cellule">Moyenne :</div><div class="stats-cellule">${this.getMoyenne(stats.repartition)}</div></div>` +
        '<div class="stats-ligne"><div class="stats-cellule">Lettres :</div>' +
        '<div class="stats-cellule">' +
        `${stats.lettresRepartitions.bienPlace} 🟥 ` +
        `${stats.lettresRepartitions.malPlace} 🟡 ` +
        `${stats.lettresRepartitions.nonTrouve} 🟦` +
        "</div>" +
        "</div>" +
        "</div>";
    }

    this._panelManager.setContenu(titre, contenu);
    this._panelManager.setClasses(["fin-de-partie-panel"]);
    if (this._partieEstFinie) this.attacherPartage();
    this._panelManager.afficherPanel();
  }

  private getMoyenne(repartition: { 1: number; 2: number; 3: number; 4: number; 5: number; 6: number; "-": number }): string {
    return (
      (repartition[1] * 1 + repartition[2] * 2 + repartition[3] * 3 + repartition[4] * 4 + repartition[5] * 5 + repartition[6] * 6 + repartition["-"] * 6) /
      (repartition[1] + repartition[2] + repartition[3] + repartition[4] + repartition[5] + repartition[6] + repartition["-"])
    ).toLocaleString("fr-FR", { maximumFractionDigits: 2 });
  }
}
