export default class SauvegardeStats {
  public static Default: SauvegardeStats = {
    partiesJouees: 0,
    partiesGagnees: 0,
    dernierePartie: new Date(),
    repartition: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      "-": 0,
    },
    lettresRepartitions: {
      bienPlace: 0,
      malPlace: 0,
      nonTrouve: 0,
    },
  };

  dernierePartie: Date = new Date();
  partiesJouees: number = 0;
  partiesGagnees: number = 0;
  repartition: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    "-": number;
  } = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    "-": 0,
  };
  lettresRepartitions: {
    bienPlace: number;
    malPlace: number;
    nonTrouve: number;
  } = {
    bienPlace: 0,
    malPlace: 0,
    nonTrouve: 0,
  };
}
