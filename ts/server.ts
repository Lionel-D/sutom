import express from "express";
import http from "http";
import fs from "fs";

const app = express();
const port = parseInt(String(process.env.SUTOM_PORT), 10) || 4000;

(async () => {
  app.use("/", express.static("public/"));
  app.use("/js", express.static("js/"));
  app.use("/ts", express.static("ts/"));
  app.use("/mots", express.static("mots/"));
  app.use("/node_modules/requirejs/require.js", express.static("node_modules/requirejs/require.js"));

  // Vu que le serveur node est prévu pour du test, on va créer un mot du jour s'il n'existe pas
  let aujourdhui = new Date().getTime();
  let origine = new Date(2022, 0, 8).getTime();

  let numeroGrille = Math.floor((aujourdhui - origine) / (24 * 3600 * 1000)) + 1;

  fs.access("mots/" + numeroGrille + ".txt", fs.constants.F_OK, (err) => {
    if (err) {
      fs.writeFile("mots/" + numeroGrille + ".txt", "DIFFUSION", (err) => {
        if (err) console.error(err);
      });
    }
  });

  app.use(express.json());
  const server = http.createServer(app);

  server.listen(port, () => {
    console.log(`Jeu démarré : http://localhost:${port}`);
  });
})();
