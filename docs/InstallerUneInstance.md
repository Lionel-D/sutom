# Installer une instance

Si vous souhaitez installer une instance du jeu, voici ce qu'il faut savoir :

- L'ensemble des fichiers à exposer sont dans le dossier public/
- Pour ajouter ou modifier le dictionnaire, consulter MettreAJourLeDictionnaire.md
- Pour faire une liste de mots à trouver, consulter CreerListeMotsATrouver.md

Le système est prévu pour pouvoir être jouer avec un mot par jour. Il y a une date d'origine, inscrite dans ts/instanceConfiguration.ts, qui sert de référence pour savoir quel est le mot à tirer, ainsi que pour connaître le numéro de grille.

La mise à jour du mot se fait en appelant chaque jour ./cron.sh. Ce script va préparer le fichier avec le mot du lendemain dans public/mots/

Au niveau de l'instance, il y a également un identifiant de partie, ce qui permet de faire tourner plusieurs parties en parallèle. Un identifiant de partie est indiqué dans ts/instanceConfiguration.ts, c'est ce qui est utilisé quand aucune partie précise n'est indiquée. Sinon, il suffit d'aller sur le site avec un paramètre à la fin de l'url. Après le croisillon (#), il faut mettre p=, suivi de l'identifiant de partie. Le tout doit être encodé en base64 afin d'éviter tout soucis. Si l'url contient plusieurs paramètres, ils doivent alors être séparé par slash (/) avant d'être encodé en base64.

## Nom de l'instance

Si vous souhaitez faire une instance public, merci de ne pas la nommer SUTOM, ou de mettre SUTOM dans son nom, afin d'éviter toute confusion.

Les fichiers qui comportent le nom du jeu sont : public/index.html (deux occurences), ts/finDePartiePanel.ts (une occurence). Vous pouvez aussi adapter les règles qui se trouvent dans ts/reglesPanel.ts
