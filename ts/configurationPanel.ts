import Configuration from "./configuration";
import PanelManager from "./panelManager";
import Sauvegardeur from "./sauvegardeur";

export default class ConfigurationPanel {
  private readonly _panelManager: PanelManager;
  private readonly _configBouton: HTMLElement;

  public constructor(panelManager: PanelManager) {
    this._panelManager = panelManager;
    this._configBouton = document.getElementById("configuration-config-bouton") as HTMLElement;

    this._configBouton.addEventListener(
      "click",
      (() => {
        this.afficher();
      }).bind(this)
    );
  }

  public afficher(): void {
    let titre = "Configuration";
    let contenu = "";

    this._panelManager.setContenu(titre, contenu);
    this._panelManager.setClasses(["config-panel"]);
    this._panelManager.afficherPanel();
  }
}
