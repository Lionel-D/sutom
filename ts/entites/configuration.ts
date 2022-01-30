import { VolumeSon } from "./volumeSon";

export default class Configuration {
  public static Default: Configuration = { hasAudio: false, afficherRegles: true, volumeSon: VolumeSon.Normal };

  hasAudio: boolean = false;
  afficherRegles: boolean = true;
  volumeSon: VolumeSon = VolumeSon.Normal;
}
