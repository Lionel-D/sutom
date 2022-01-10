import LettreResultat from "./lettreResultat";
import { LettreStatut } from "./lettreStatut";

export default class Grille {
  private readonly _grille: HTMLElement;
  private readonly _propositions: Array<string>;
  private readonly _resultats: Array<Array<LettreResultat>>;
  private readonly _longueurMot: number;
  private readonly _maxPropositions: number;
  private _indice: Array<string | undefined>;
  private _motActuel: number;

  public constructor(longueurMot: number, maxPropositions: number, indice: string) {
    this._grille = document.getElementById("grille") as HTMLElement;
    //console.log("Chargement de la grille");

    this._longueurMot = longueurMot;
    this._maxPropositions = maxPropositions;
    this._indice = new Array<string | undefined>(longueurMot);
    this._indice[0] = indice;

    this._propositions = new Array<string>();
    this._resultats = new Array<Array<LettreResultat>>();
    this._motActuel = 0;
    this.afficherGrille();
  }

  private afficherGrille() {
    let table = document.createElement("table");
    for (let nbMot = 0; nbMot < this._maxPropositions; nbMot++) {
      let ligne = document.createElement("tr");
      let mot = this._propositions.length <= nbMot ? "" : this._propositions[nbMot];
      for (let nbLettre = 0; nbLettre < this._longueurMot; nbLettre++) {
        let cellule = document.createElement("td");
        let contenuCellule: string = "";
        if (nbMot < this._motActuel || (nbMot === this._motActuel && mot.length !== 0)) {
          if (mot.length <= nbLettre) {
            contenuCellule = ".";
          } else {
            contenuCellule = mot[nbLettre].toUpperCase();
          }
        } else if (nbMot === this._motActuel) {
          let lettreIndice = this._indice[nbLettre];
          if (lettreIndice !== undefined) contenuCellule = lettreIndice;
          else contenuCellule = ".";
        }
        if (this._resultats.length > nbMot && this._resultats[nbMot][nbLettre]) {
          let resultat = this._resultats[nbMot][nbLettre];
          let emoji: string = "🟦";
          switch (resultat.statut) {
            case LettreStatut.BienPlace:
              emoji = "🟥";
              cellule.classList.add("bien-place", "resultat");
              break;
            case LettreStatut.MalPlace:
              emoji = "🟡";
              cellule.classList.add("mal-place", "resultat");
              break;
            default:
              emoji = "🟦";
              cellule.classList.add("non-trouve", "resultat");
          }
          // console.log(resultat.lettre + " => " + emoji);
        }
        cellule.innerText = contenuCellule;
        ligne.appendChild(cellule);
      }

      table.appendChild(ligne);
    }
    this._grille.innerHTML = "";
    this._grille.appendChild(table);
  }

  public actualiserAffichage(mot: string) {
    this.saisirMot(this._motActuel, mot);

    this.afficherGrille();
  }

  public validerMot(mot: string, resultats: Array<LettreResultat>, isBonneReponse: boolean, skipAnimation: boolean = false): void {
    this.saisirMot(this._motActuel, mot);
    this.mettreAJourIndice(resultats);
    this._resultats.push(resultats);

    if (!skipAnimation) this.animerResultats(resultats);

    if (isBonneReponse) {
      this.bloquerGrille();
    } else {
      this._motActuel++;
    }

    if (skipAnimation) this.afficherGrille();
  }

  private animerResultats(resultats: Array<LettreResultat>): void {
    let table = this._grille.getElementsByTagName("table").item(0);
    if (table === null) {
      this.afficherGrille();
      return;
    }

    let ligne = table.getElementsByTagName("tr").item(this._motActuel);
    if (ligne === null) {
      this.afficherGrille();
      return;
    }

    let td = ligne.getElementsByTagName("td");
    this.animerLettre(td, resultats, 0);
  }

  private animerLettre(td: HTMLCollectionOf<HTMLTableCellElement>, resultats: Array<LettreResultat>, numLettre: number): void {
    if (numLettre >= td.length) {
      this.afficherGrille();
      return;
    }
    let cellule = td[numLettre];
    let resultat = resultats[numLettre];
    cellule.innerHTML = resultat.lettre;
    switch (resultat.statut) {
      case LettreStatut.BienPlace:
        cellule.classList.add("bien-place", "resultat");

        break;
      case LettreStatut.MalPlace:
        cellule.classList.add("mal-place", "resultat");

        break;
      default:
        cellule.classList.add("non-trouve", "resultat");
    }
    setTimeout((() => this.animerLettre(td, resultats, numLettre + 1)).bind(this), 250);
  }

  private mettreAJourIndice(resultats: Array<LettreResultat>): void {
    for (let i = 0; i < this._indice.length; i++) {
      if (!this._indice[i]) {
        this._indice[i] = resultats[i].statut === LettreStatut.BienPlace ? resultats[i].lettre : undefined;
      }
    }
  }

  private saisirMot(position: number, mot: string): void {
    if (this._propositions.length <= position) {
      this._propositions.push("");
    }
    this._propositions[position] = mot;
  }

  private bloquerGrille(): void {}
}
