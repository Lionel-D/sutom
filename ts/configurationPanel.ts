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
    let contenu = document.createElement("div");
    contenu.appendChild(
      this.genererConfigItem("Volume du son (si activé)", {
        1: "Faible",
        2: "Normal",
        3: "Fort",
      })
    );

    this._panelManager.setContenu(titre, contenu.innerHTML);
    this._panelManager.setClasses(["config-panel"]);
    this._panelManager.afficherPanel();
  }

  private genererConfigItem(nomConfig: string, options: { [value: number]: string }): HTMLElement {
    let div = document.createElement("div");
    div.className = "config-item";

    let label = document.createElement("label");
    label.innerText = nomConfig;
    div.appendChild(label);

    let select = document.createElement("select");
    for (let optionKey in options) {
      let optionLabel = options[optionKey];
      let optionElement = document.createElement("option");
      optionElement.value = optionKey;
      optionElement.innerText = optionLabel;
      select.appendChild(optionElement);
    }
    div.appendChild(select);

    return div;
  }
}
