import { ClavierDisposition } from "./clavierDisposition";
import { Theme } from "./theme";
import { VolumeSon } from "./volumeSon";

export default class Configuration {
  public static Default: Configuration = {
    hasAudio: false,
    afficherRegles: true,
    afficherChrono: false,
    volumeSon: VolumeSon.Normal,
    disposition: ClavierDisposition.Azerty,
    theme: Theme.Sombre,
  };

  hasAudio: boolean = false;
  afficherRegles: boolean = true;
  afficherChrono: boolean = false;
  volumeSon: VolumeSon = VolumeSon.Normal;
  disposition: ClavierDisposition = ClavierDisposition.Azerty;
  theme: Theme = Theme.Sombre;
}
