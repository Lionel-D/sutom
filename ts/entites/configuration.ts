import { ClavierDisposition } from "./clavierDisposition";
import { VolumeSon } from "./volumeSon";

export default class Configuration {
  public static Default: Configuration = { hasAudio: false, afficherRegles: true, volumeSon: VolumeSon.Normal, disposition: ClavierDisposition.Azerty };

  hasAudio: boolean = false;
  afficherRegles: boolean = true;
  volumeSon: VolumeSon = VolumeSon.Normal;
  disposition: ClavierDisposition = ClavierDisposition.Azerty;
}
