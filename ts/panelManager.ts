export default class PanelManager {
  private readonly _panelArea: HTMLElement;
  private readonly _panelFenetre: HTMLElement;
  private readonly _panelTitre: HTMLElement;
  private readonly _panelContenu: HTMLElement;
  private readonly _panelFermetureBouton: HTMLElement;

  public constructor() {
    this._panelArea = document.getElementById("panel-area") as HTMLElement;
    this._panelFenetre = document.getElementById("panel-fenetre") as HTMLElement;
    this._panelTitre = document.getElementById("panel-fenetre-titre") as HTMLElement;
    this._panelContenu = document.getElementById("panel-fenetre-contenu") as HTMLElement;
    this._panelFermetureBouton = document.getElementById("panel-fenetre-bouton-fermeture") as HTMLElement;

    this._panelArea.addEventListener(
      "click",
      ((event: Event) => {
        event.stopPropagation();
        this.cacherPanel();
      }).bind(this)
    );

    this._panelFenetre.addEventListener(
      "click",
      ((event: Event) => {
        event.stopPropagation(); // On évite ainsi de fermer le panel en appuyant sur la fenêtre
      }).bind(this)
    );

    this._panelFermetureBouton.addEventListener(
      "click",
      ((event: Event) => {
        event.stopPropagation();
        this.cacherPanel();
      }).bind(this)
    );
  }

  public afficherPanel(): void {
    this._panelArea.style.display = "block";
  }

  public cacherPanel(): void {
    this._panelArea.style.display = "none";
  }

  public setContenu(titre: string, contenu: string): void {
    this._panelTitre.innerText = titre;
    this._panelContenu.innerHTML = contenu;
  }

  public setContenuHtmlElement(titre: string, contenu: HTMLElement): void {
    this._panelTitre.innerText = titre;
    this._panelContenu.innerHTML = "";
    this._panelContenu.appendChild(contenu);
  }

  public setClasses(classes: Array<string>): void {
    this._panelArea.className = "";
    classes.forEach((nomClasse) => this._panelArea.classList.add(nomClasse));
  }

  public setCallbackFermeture(callback: () => void): void {
    this._panelFermetureBouton.addEventListener(
      "click",
      ((event: Event) => {
        callback();
      }).bind(this),
      { once: true }
    );
  }
}
