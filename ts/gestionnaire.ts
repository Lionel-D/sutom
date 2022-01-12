import Dictionnaire from "./dictionnaire";
import Grille from "./grille";
import Input from "./input";
import LettreResultat from "./lettreResultat";
import { LettreStatut } from "./lettreStatut";
import FinDePartiePanel from "./finDePartiePanel";
import NotificationMessage from "./notificationMessage";
import SauvegardeStats from "./sauvegardeStats";
import Sauvegardeur from "./sauvegardeur";

export default class Gestionnaire {
  private readonly _dictionnaire: Dictionnaire;
  private readonly _grille: Grille;
  private readonly _input: Input;
  private readonly _sauvegardeur: Sauvegardeur;
  private readonly _victoirePanel: FinDePartiePanel;
  private readonly _propositions: Array<string>;
  private readonly _resultats: Array<Array<LettreResultat>>;

  private _motATrouver: string;
  private _compositionMotATrouver: { [lettre: string]: number };
  private _maxNbPropositions: number = 6;
  private _datePartieEnCours: Date | undefined;
  private _stats: SauvegardeStats = { partiesJouees: 0, partiesGagnees: 0 };

  public constructor() {
    this._dictionnaire = new Dictionnaire();
    this._motATrouver = this.choisirMot();
    this._grille = new Grille(this._motATrouver.length, this._maxNbPropositions, this._motATrouver[0]);
    this._input = new Input(this, this._motATrouver.length);
    this._sauvegardeur = new Sauvegardeur();
    this._victoirePanel = new FinDePartiePanel();
    this._propositions = new Array<string>();
    this._resultats = new Array<Array<LettreResultat>>();
    this._compositionMotATrouver = this.decompose(this._motATrouver);

    this.chargerSauvegarde();
  }

  private chargerSauvegarde(): void {
    let sauvegardePartieEnCours = this._sauvegardeur.chargerSauvegardePartieEnCours();
    if (sauvegardePartieEnCours) {
      this._datePartieEnCours = sauvegardePartieEnCours.datePartie;
      for (let mot of sauvegardePartieEnCours.propositions) {
        this.verifierMot(mot, true);
      }
    }
    this._stats = this._sauvegardeur.chargerSauvegardeStats() ?? { partiesJouees: 0, partiesGagnees: 0 };
  }

  private enregistrerPartieDansStats(): void {
    this._stats.partiesJouees++;
    if (this._resultats.some((resultat) => resultat.every((item) => item.statut === LettreStatut.BienPlace))) this._stats.partiesGagnees++;
    this._stats.dernierePartie = this._datePartieEnCours;

    this._sauvegardeur.sauvegarderStats(this._stats);
  }

  private sauvegarderPartieEnCours(): void {
    let datePartieEnCours = this._datePartieEnCours ?? new Date();

    this._sauvegardeur.sauvegarderPartieEnCours(this._propositions, datePartieEnCours);
  }

  private choisirMot(): string {
    return this._dictionnaire.nettoyerMot(this._dictionnaire.getMot());
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
    this._grille.validerMot(mot, resultats, isBonneReponse, skipAnimation);
    this._input.updateClavier(resultats);

    if (isBonneReponse || this._propositions.length === this._maxNbPropositions) {
      this._input.bloquer();
      this._victoirePanel.genererResume(isBonneReponse, this._resultats);
      this._victoirePanel.afficher(isBonneReponse, this._motATrouver);
      this.enregistrerPartieDansStats();
    }

    this.sauvegarderPartieEnCours();
  }

  public actualiserAffichage(mot: string): void {
    this._grille.actualiserAffichage(this._dictionnaire.nettoyerMot(mot));
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
}
