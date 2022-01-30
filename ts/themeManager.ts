import Configuration from "./entites/configuration";
import { Theme } from "./entites/theme";

export default class ThemeManager {
  public constructor(config: Configuration) {
    this.changerCouleur(config.theme ?? Configuration.Default.theme);
  }

  public changerCouleur(theme: Theme): void {
    const root = document.documentElement;
    switch (theme) {
      case Theme.Clair:
        root.style.setProperty("--couleur-bien-place", "#e7002a");
        root.style.setProperty("--couleur-mal-place", "#ffbd00");
        root.style.setProperty("--couleur-fond-rgb", "255, 254, 246");
        root.style.setProperty("--couleur-police", "#000000");
        root.style.setProperty("--couleur-bordure", "#000000");
        root.style.setProperty("--couleur-icone", "rgb(55, 55, 55)");
        break;
      case Theme.ClairAccessible:
        root.style.setProperty("--couleur-bien-place", "#096800");
        root.style.setProperty("--couleur-mal-place", "#db7c00");
        root.style.setProperty("--couleur-fond-rgb", "255, 254, 246");
        root.style.setProperty("--couleur-police", "#000000");
        root.style.setProperty("--couleur-bordure", "#000000");
        root.style.setProperty("--couleur-icone", "rgb(55, 55, 55)");
        break;
      case Theme.SombreAccessible:
        root.style.setProperty("--couleur-bien-place", "#096800");
        root.style.setProperty("--couleur-mal-place", "#db7c00");
        root.style.setProperty("--couleur-fond-rgb", "43, 43, 43");
        root.style.setProperty("--couleur-police", "#ffffff");
        root.style.setProperty("--couleur-bordure", "#ffffff");
        root.style.setProperty("--couleur-icone", "rgb(200, 200, 200)");
        break;
      default:
        root.style.setProperty("--couleur-bien-place", "#e7002a");
        root.style.setProperty("--couleur-mal-place", "#ffbd00");
        root.style.setProperty("--couleur-fond-rgb", "43, 43, 43");
        root.style.setProperty("--couleur-police", "#ffffff");
        root.style.setProperty("--couleur-bordure", "#ffffff");
        root.style.setProperty("--couleur-icone", "rgb(200, 200, 200)");
    }
  }
}
