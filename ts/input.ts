import Gestionnaire from "./gestionnaire";
import LettreResultat from "./entites/lettreResultat";
import { LettreStatut } from "./entites/lettreStatut";
import { ClavierDisposition } from "./entites/clavierDisposition";
import Configuration from "./entites/configuration";
import Dictionnaire from "./dictionnaire";

export enum ContexteBloquage {
  ValidationMot,
  Panel,
}

export default class Input {
  private readonly _grille: HTMLElement;
  private readonly _inputArea: HTMLElement;
  private readonly _gestionnaire: Gestionnaire;
  private readonly _premiereLettre: string;

  private _longueurMot: number;
  private _motSaisi: string;
  private _estBloque: Array<ContexteBloquage>; // TODO : Faire un dictionnaire pour savoir qui bloque, pour que si c'est bloqué par finDePartie, et que la fermeture de panel essaye de débloquer, ça ne fasse rien
  private _resultats: Array<Array<LettreResultat>>;

  public constructor(gestionnaire: Gestionnaire, configuration: Configuration, longueurMot: number, premiereLettre: string) {
    this._grille = document.getElementById("grille") as HTMLElement;
    this._inputArea = document.getElementById("input-area") as HTMLElement;
    this._premiereLettre = premiereLettre;
    this._longueurMot = longueurMot;
    this._gestionnaire = gestionnaire;
    this._motSaisi = "";
    this._estBloque = new Array<ContexteBloquage>();
    this._resultats = new Array<Array<LettreResultat>>();

    this.ajouterEvenementClavierPhysique();

    this.dessinerClavier(configuration.disposition ?? Configuration.Default.disposition);
  }

  public dessinerClavier(disposition: ClavierDisposition): void {
    let clavier = this.getDisposition(disposition);
    this._inputArea.innerHTML = "";

    for (let ligne of clavier) {
      let ligneDiv = document.createElement("div");
      ligneDiv.className = "input-ligne";

      for (let lettre of ligne) {
        let lettreDiv = document.createElement("div");
        lettreDiv.className = "input-lettre";
        switch (lettre) {
          case "_effacer":
            lettreDiv.dataset["lettre"] = lettre;
            lettreDiv.innerText = "⌫";
            break;
          case "_entree":
            lettreDiv.innerText = "↲";
            lettreDiv.dataset["lettre"] = lettre;
            lettreDiv.classList.add("input-lettre-entree");
            break;
          case "_vide":
            lettreDiv.classList.add("input-lettre-vide");
            break;
          case "_videdouble":
            lettreDiv.classList.add("input-lettre-vide-double");
            break;
          default:
            lettreDiv.dataset["lettre"] = lettre;
            lettreDiv.innerText = lettre;
        }
        ligneDiv.appendChild(lettreDiv);
      }

      this._inputArea.appendChild(ligneDiv);
    }
    this.ajouterEvenementClavierVirtuel();
    this.remettrePropositions();
  }

  private getDisposition(clavier: ClavierDisposition): Array<Array<string>> {
    switch (clavier) {
      case ClavierDisposition.Bépo:
        return [
          ["B", "E", "P", "O", "V", "D", "L", "J", "Z", "W"],
          ["A", "U", "I", "E", "C", "T", "S", "R", "N", "M"],
          ["Y", "X", "K", "Q", "G", "H", "F", "_effacer", "_entree"],
        ];
      case ClavierDisposition.Qwerty:
        return [
          ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
          ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
          ["_vide", "Z", "X", "C", "V", "B", "N", "M", "_effacer", "_entree"],
        ];
      case ClavierDisposition.Qwertz:
        return [
          ["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P"],
          ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
          ["_vide", "Y", "X", "C", "V", "B", "N", "M", "_effacer", "_entree"],
        ];
      default:
        return [
          ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
          ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"],
          ["_videdouble", "W", "X", "C", "V", "B", "N", "_effacer", "_entree"],
        ];
    }
  }

  private ajouterEvenementClavierVirtuel(): void {
    this._inputArea.querySelectorAll(".input-lettre").forEach((lettreDiv) =>
      lettreDiv.addEventListener("click", (event) => {
        event.stopPropagation();
        let div = event.currentTarget;
        if (!div) return;
        let lettre = (div as HTMLElement).dataset["lettre"];
        if (lettre === undefined) {
          return;
        } else if (lettre === "_effacer") {
          this.effacerLettre();
        } else if (lettre === "_entree") {
          this.validerMot();
        } else {
          this.saisirLettre(lettre);
        }
      })
    );
  }

  private ajouterEvenementClavierPhysique(): void {
    document.addEventListener(
      "keypress",
      ((event: KeyboardEvent) => {
        event.stopPropagation();
        let touche = event.key;

        if (touche === "Enter") {
          this.validerMot();
        } else if (/^[A-Z]$/.test(Dictionnaire.nettoyerMot(touche))) {
          this.saisirLettre(touche);
        }
      }).bind(this)
    );

    // Le retour arrière n'est détecté que par keydown
    document.addEventListener(
      "keydown",
      ((event: KeyboardEvent) => {
        event.stopPropagation();
        let touche = event.key;

        if (touche === "Backspace") {
          event.preventDefault();
          this.effacerLettre();
        }
      }).bind(this)
    );
  }

  private effacerLettre(): void {
    if (this.estBloque()) return;
    if (this._motSaisi.length !== 0) {
      this._motSaisi = this._motSaisi.substring(0, this._motSaisi.length - 1);
    }
    this._gestionnaire.actualiserAffichage(this._motSaisi);
  }

  private async validerMot(): Promise<void> {
    if (this.estBloque()) return;
    this.bloquer(ContexteBloquage.ValidationMot);
    let mot = this._motSaisi;
    let isMotValide = await this._gestionnaire.verifierMot(mot);
    if (isMotValide) {
      // Si le mot est valide, alors c'est la grille qui nous débloque
      this._motSaisi = "";
    } else this.debloquer(ContexteBloquage.ValidationMot);
  }

  private saisirLettre(lettre: string): void {
    if (this.estBloque()) return;
    if (this._motSaisi.length >= this._longueurMot) return;
    if (this._motSaisi.length === 0 && lettre.toUpperCase() !== this._premiereLettre) this._motSaisi += this._premiereLettre;
    this._motSaisi += lettre;
    this._gestionnaire.actualiserAffichage(this._motSaisi);
  }

  public bloquer(contexte: ContexteBloquage): void {
    if (!this._estBloque.includes(contexte)) this._estBloque.push(contexte);
  }

  public debloquer(contexte: ContexteBloquage): void {
    if (this._estBloque.includes(contexte)) this._estBloque.splice(this._estBloque.indexOf(contexte), 1);
  }

  private estBloque(): boolean {
    return this._estBloque.length > 0;
  }

  public updateClavier(resultats: Array<LettreResultat>): void {
    this._resultats.push(resultats); // On sauvegarde au cas où on doit redessiner tout le clavier
    this.updateClavierAvecProposition(resultats);
  }

  private remettrePropositions(): void {
    for (let resultat of this._resultats) {
      this.updateClavierAvecProposition(resultat);
    }
  }

  private updateClavierAvecProposition(resultats: Array<LettreResultat>): void {
    let statutLettres: { [lettre: string]: LettreStatut } = {};
    // console.log(statutLettres);
    for (let resultat of resultats) {
      if (!statutLettres[resultat.lettre]) statutLettres[resultat.lettre] = resultat.statut;
      else {
        switch (resultat.statut) {
          case LettreStatut.BienPlace:
            statutLettres[resultat.lettre] = LettreStatut.BienPlace;
            break;
          case LettreStatut.MalPlace:
            if (statutLettres[resultat.lettre] !== LettreStatut.BienPlace) {
              statutLettres[resultat.lettre] = LettreStatut.MalPlace;
            }
            break;
          default:
            break;
        }
      }
    }
    // console.log(statutLettres);

    let touches = this._inputArea.querySelectorAll(".input-lettre");

    for (let lettre in statutLettres) {
      let statut = statutLettres[lettre];
      for (let numTouche = 0; numTouche < touches.length; numTouche++) {
        let touche = touches.item(numTouche) as HTMLElement;
        if (touche === undefined || touche === null) continue;
        if (touche.dataset["lettre"] === lettre) {
          // console.log(lettre + " => " + statut);
          switch (statut) {
            case LettreStatut.BienPlace:
              touche.className = "";
              touche.classList.add("input-lettre");
              touche.classList.add("lettre-bien-place");
              break;
            case LettreStatut.MalPlace:
              if (touche.classList.contains("lettre-bien-place")) break;
              touche.className = "";
              touche.classList.add("input-lettre");
              touche.classList.add("lettre-mal-place");
              break;
            default:
              if (touche.classList.contains("lettre-bien-place")) break;
              if (touche.classList.contains("lettre-mal-place")) break;
              touche.className = "";
              touche.classList.add("input-lettre");
              touche.classList.add("lettre-non-trouve");
              break;
          }
        }
      }
    }
  }
}
