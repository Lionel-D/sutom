import Gestionnaire from "./gestionnaire";
import LettreResultat from "./lettreResultat";
import { LettreStatut } from "./lettreStatut";

export default class Input {
  private readonly _grille: HTMLElement;
  private readonly _inputArea: HTMLElement;
  private readonly _gestionnaire: Gestionnaire;

  private _longueurMot: number;
  private _motSaisi: string;
  private _estBloque: boolean;

  public constructor(gestionnaire: Gestionnaire, longueurMot: number) {
    this._grille = document.getElementById("grille") as HTMLElement;
    this._inputArea = document.getElementById("input-area") as HTMLElement;
    this._longueurMot = longueurMot;
    this._gestionnaire = gestionnaire;
    this._motSaisi = "";
    this._estBloque = false;

    document.addEventListener(
      "keypress",
      ((event: KeyboardEvent) => {
        event.stopPropagation();
        let touche = event.key;

        if (touche === "Enter") {
          this.validerMot();
        } else if (touche !== "Backspace") {
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
          this.effacerLettre();
        }
      }).bind(this)
    );

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

  private effacerLettre(): void {
    if (this._estBloque) return;
    if (this._motSaisi.length !== 0) {
      this._motSaisi = this._motSaisi.substring(0, this._motSaisi.length - 1);
    }
    this._gestionnaire.actualiserAffichage(this._motSaisi);
  }

  private validerMot(): void {
    if (this._estBloque) return;
    let mot = this._motSaisi;
    this._gestionnaire.verifierMot(mot);
    if (mot.length === this._longueurMot) {
      this._motSaisi = "";
    }
  }

  private saisirLettre(lettre: string): void {
    if (this._estBloque) return;
    if (this._motSaisi.length >= this._longueurMot) return;
    this._motSaisi += lettre;
    this._gestionnaire.actualiserAffichage(this._motSaisi);
  }

  public bloquer(): void {
    this._estBloque = true;
  }

  public updateClavier(resultats: Array<LettreResultat>): void {
    if (this._estBloque) return;
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
          break;
        }
      }
    }
  }
}
