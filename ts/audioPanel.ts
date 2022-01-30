import Configuration from "./entites/configuration";
import Sauvegardeur from "./sauvegardeur";

export default class AudioPanel {
  private readonly _configAudioBouton: HTMLElement;
  private readonly _iconeAudio: HTMLElement;

  private readonly _audioLettreBienPlace: HTMLAudioElement;
  private readonly _audioLettreMalPlace: HTMLAudioElement;
  private readonly _audioLettreNonTrouve: HTMLAudioElement;

  private readonly _longueurSon: number = 220;

  private _hasAudio: boolean = false;

  public constructor(configuration: Configuration) {
    this._configAudioBouton = document.getElementById("configuration-audio-bouton") as HTMLElement;
    this._iconeAudio = document.getElementById("configuration-audio-icone") as HTMLElement;
    this._audioLettreBienPlace = document.getElementById("son-lettre-bien-place") as HTMLAudioElement;
    this._audioLettreMalPlace = document.getElementById("son-lettre-mal-place") as HTMLAudioElement;
    this._audioLettreNonTrouve = document.getElementById("son-lettre-non-trouve") as HTMLAudioElement;

    this.setVolumeSonore(configuration.volumeSon ?? Configuration.Default.volumeSon);
    this.toggleSon(configuration.hasAudio, true);

    this._configAudioBouton.addEventListener(
      "click",
      ((event: MouseEvent) => {
        event.stopPropagation();
        this.toggleSon(!this._hasAudio);
        Sauvegardeur.sauvegarderConfig({
          ...(Sauvegardeur.chargerConfig() ?? Configuration.Default),
          hasAudio: this._hasAudio,
        });
        this._configAudioBouton.blur();
      }).bind(this)
    );
  }

  private toggleSon(hasAudio: boolean, chargement: boolean = false): void {
    this._hasAudio = hasAudio;
    if (!hasAudio) {
      this._iconeAudio.innerHTML = '<use href="#icone-son-desactive" fill="var(--couleur-icone)"></use>';
    } else {
      this._iconeAudio.innerHTML = '<use href="#icone-son-active" fill="var(--couleur-icone)"></use>';
      this._audioLettreBienPlace.preload = "auto";
      if (!chargement) this.jouerSonLettreBienPlace();
      this._audioLettreMalPlace.preload = "auto";
      this._audioLettreNonTrouve.preload = "auto";
    }
  }

  public setVolumeSonore(volume: number): void {
    let volumeTag = volume / 100;
    this._audioLettreBienPlace.volume = volumeTag;
    this._audioLettreMalPlace.volume = volumeTag;
    this._audioLettreNonTrouve.volume = volumeTag;
  }

  public jouerSonLettreBienPlace(callback?: () => void): void {
    this.jouerSon(this._audioLettreBienPlace, callback);
  }

  public jouerSonLettreMalPlace(callback?: () => void): void {
    this.jouerSon(this._audioLettreMalPlace, callback);
  }

  public jouerSonLettreNonTrouve(callback?: () => void): void {
    this.jouerSon(this._audioLettreNonTrouve, callback);
  }

  private jouerSon(baliseAudio: HTMLAudioElement, callback?: () => void): void {
    if (!this._hasAudio) {
      if (callback) setTimeout(callback, this._longueurSon);
      return;
    }
    baliseAudio.currentTime = 0;
    if (callback) baliseAudio.addEventListener("ended", callback, { once: true });
    try {
      baliseAudio.play().catch(
        (() => {
          this._hasAudio = false;
          if (callback) setTimeout(callback, this._longueurSon);
        }).bind(this)
      );
    } catch (
      ex // Parfois, le play ne retourne pas de promise…
    ) {
      this._hasAudio = false;
      if (callback) setTimeout(callback, this._longueurSon);
    }
  }
}
