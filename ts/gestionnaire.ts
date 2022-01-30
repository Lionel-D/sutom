import Dictionnaire from "./dictionnaire";
import Grille from "./grille";
import Input from "./input";
import LettreResultat from "./entites/lettreResultat";
import { LettreStatut } from "./entites/lettreStatut";
import FinDePartiePanel from "./finDePartiePanel";
import NotificationMessage from "./notificationMessage";
import SauvegardeStats from "./entites/sauvegardeStats";
import Sauvegardeur from "./sauvegardeur";
import Configuration from "./entites/configuration";
import PartieEnCours from "./entites/partieEnCours";
import PanelManager from "./panelManager";
import ReglesPanel from "./reglesPanel";
import ConfigurationPanel from "./configurationPanel";
import AudioPanel from "./audioPanel";

export default class Gestionnaire {
  private readonly _dictionnaire: Dictionnaire;
  private _grille: Grille | null = null;
  private _input: Input | null = null;
  private readonly _reglesPanel: ReglesPanel;
  private readonly _finDePartiePanel: FinDePartiePanel;
  private readonly _configurationPanel: ConfigurationPanel;
  private readonly _propositions: Array<string>;
  private readonly _resultats: Array<Array<LettreResultat>>;
  private readonly _panelManager: PanelManager;
  private readonly _audioPanel: AudioPanel;

  private _motATrouver: string = "";
  private _compositionMotATrouver: { [lettre: string]: number } = {};
  private _maxNbPropositions: number = 6;
  private _datePartieEnCours: Date;
  private _stats: SauvegardeStats = { partiesJouees: 0, partiesGagnees: 0 };
  private _config: Configuration = Configuration.Default;

  public constructor() {
    this._config = Sauvegardeur.chargerConfig() ?? this._config;

    let partieEnCours = this.chargerPartieEnCours();

    if (partieEnCours.datePartie) {
      this._datePartieEnCours = partieEnCours.datePartie;
    } else {
      this._datePartieEnCours = new Date();
    }

    this._dictionnaire = new Dictionnaire();
    this._propositions = new Array<string>();
    this._resultats = new Array<Array<LettreResultat>>();
    this._audioPanel = new AudioPanel(this._config);
    this._panelManager = new PanelManager();
    this._reglesPanel = new ReglesPanel(this._panelManager);
    this._finDePartiePanel = new FinDePartiePanel(this._datePartieEnCours, this._panelManager);
    this._configurationPanel = new ConfigurationPanel(this._panelManager, this._audioPanel);

    this.choisirMot(this._datePartieEnCours).then((mot) => {
      this._motATrouver = mot;
      this._grille = new Grille(this._motATrouver.length, this._maxNbPropositions, this._motATrouver[0], this._audioPanel);
      this._input = new Input(this, this._motATrouver.length, this._motATrouver[0]);
      this._compositionMotATrouver = this.decompose(this._motATrouver);
      this.chargerPropositions(partieEnCours.propositions);
    });

    this.afficherReglesSiNecessaire();
  }

  private chargerPartieEnCours(): PartieEnCours {
    this._stats = Sauvegardeur.chargerSauvegardeStats() ?? { partiesJouees: 0, partiesGagnees: 0 };

    let sauvegardePartieEnCours = Sauvegardeur.chargerSauvegardePartieEnCours();
    if (sauvegardePartieEnCours) return sauvegardePartieEnCours;

    return new PartieEnCours();
  }

  private chargerPropositions(propositions: Array<string> | undefined): void {
    if (!propositions || propositions.length === 0) return;
    for (let mot of propositions) {
      this.verifierMot(mot, true);
    }
  }

  private enregistrerPartieDansStats(): void {
    this._stats.partiesJouees++;
    if (this._resultats.some((resultat) => resultat.every((item) => item.statut === LettreStatut.BienPlace))) this._stats.partiesGagnees++;
    this._stats.dernierePartie = this._datePartieEnCours;

    Sauvegardeur.sauvegarderStats(this._stats);
  }

  private sauvegarderPartieEnCours(): void {
    Sauvegardeur.sauvegarderPartieEnCours(this._propositions, this._datePartieEnCours);
  }

  private async choisirMot(datePartie: Date): Promise<string> {
    return this._dictionnaire.nettoyerMot(await this._dictionnaire.getMot(datePartie));
  }

  private decompose(mot: string): { [lettre: string]: number } {
    let composition: { [lettre: string]: number } = {};
    for (let position = 0; position < mot.length; position++) {
      let lettre = mot[position];
      if (composition[lettre]) composition[lettre]++;
      else composition[lettre] = 1;
    }
    return composition;
  }

  public verifierMot(mot: string, skipAnimation: boolean = false): void {
    mot = this._dictionnaire.nettoyerMot(mot);
    //console.debug(mot + " => " + (this._dictionnaire.estMotValide(mot) ? "Oui" : "non"));
    if (mot.length !== this._motATrouver.length) {
      NotificationMessage.ajouterNotification("Le mot proposé est trop court");
      return;
    }
    if (mot[0] !== this._motATrouver[0]) {
      NotificationMessage.ajouterNotification("Le mot proposé doit commencer par la même lettre que le mot recherché");
      return;
    }
    if (!this._dictionnaire.estMotValide(mot)) {
      NotificationMessage.ajouterNotification("Ce mot n'est pas dans notre dictionnaire");
      return;
    }
    if (!this._datePartieEnCours) this._datePartieEnCours = new Date();
    let resultats = this.analyserMot(mot);
    let isBonneReponse = resultats.every((item) => item.statut === LettreStatut.BienPlace);
    this._propositions.push(mot);
    this._resultats.push(resultats);

    if (isBonneReponse || this._propositions.length === this._maxNbPropositions) {
      this._finDePartiePanel.genererResume(isBonneReponse, this._motATrouver, this._resultats);
      this.enregistrerPartieDansStats();
    }

    if (this._grille)
      this._grille.validerMot(mot, resultats, isBonneReponse, skipAnimation, () => {
        if (this._input) {
          this._input.updateClavier(resultats);
          if (isBonneReponse || this._propositions.length === this._maxNbPropositions) {
            this._input.bloquer();
            this._finDePartiePanel.afficher();
          }
        }
      });

    this.sauvegarderPartieEnCours();
  }

  public actualiserAffichage(mot: string): void {
    if (this._grille) this._grille.actualiserAffichage(this._dictionnaire.nettoyerMot(mot));
  }

  private analyserMot(mot: string): Array<LettreResultat> {
    let resultats = new Array<LettreResultat>();
    mot = mot.toUpperCase();

    let composition = { ...this._compositionMotATrouver };

    for (let position = 0; position < this._motATrouver.length; position++) {
      let lettreATrouve = this._motATrouver[position];
      let lettreProposee = mot[position];

      if (lettreATrouve === lettreProposee) {
        composition[lettreProposee]--;
      }
    }

    for (let position = 0; position < this._motATrouver.length; position++) {
      let lettreATrouve = this._motATrouver[position];
      let lettreProposee = mot[position];

      let resultat = new LettreResultat();
      resultat.lettre = lettreProposee;

      if (lettreATrouve === lettreProposee) {
        resultat.statut = LettreStatut.BienPlace;
      } else if (this._motATrouver.includes(lettreProposee)) {
        if (composition[lettreProposee] > 0) {
          resultat.statut = LettreStatut.MalPlace;
          composition[lettreProposee]--;
        } else {
          resultat.statut = LettreStatut.NonTrouve;
        }
      } else {
        resultat.statut = LettreStatut.NonTrouve;
      }

      resultats.push(resultat);
    }

    return resultats;
  }

  private afficherReglesSiNecessaire(): void {
    if (this._config.afficherRegles !== undefined && !this._config.afficherRegles) return;

    this._reglesPanel.afficher();
  }
}
