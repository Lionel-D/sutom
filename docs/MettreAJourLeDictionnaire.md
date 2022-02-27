# Mettre à jour le dictionnaire

Si vous souhaitez mettre à jour le dictionnaire, ou y ajouter des mots, il faut modifier le fichier data/mots.txt. Ce fichier comporte un mot par ligne, et sert de base pour la génération des autres fichiers.

Pour générer les fichiers listeMotsProposables, qui servent de dictionnaire, il faut appeler la commande suivante, depuis la racine de l'instance :

```sh
node utils/nettoyage.js
```

Ce script va vérifier la liste des mots, ne garder que les mots acceptés dans les règles, les formater correctement (les mettre en majuscule, et enlevé les accents), puis les découper par longueur et par initiale, dans les fichiers ts/mots/listeMotsProposables.\*.

Liste des règles suivi par les mots :

- Le mot n'est pas un nom propre (qui commence par une majuscule dans le fichier mots.txt)
- Le mot est entre 6 et 9 lettres
- Le mot ne commence pas par une lettre rare, à savoir : K, Q, W, X, Y, Z
- Le mot ne contient pas d'espace, d'apostrophe ou de trait d'union
