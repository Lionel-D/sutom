# Créer liste des mots à trouver

Pour définir la liste des mots qui vont être utilisé par le système, il est nécessaire de créer un fichier data/motsATrouve.txt. Ce fichier doit contenir un mot par ligne, de préférence en minuscule.

Puis, lancer la commande suivante :

```sh
node utils/melangerATrouver.js
```

Ce script va vérifier que les mots se trouvent bien dans le dictionnaire, avant de mélanger le fichier et de le mettre dans le format attendu. Le résultat sera placé dans le même fichier, qui va être utilisé ensuite par le script quotidien ./cron.sh. Le mélange ne concernera que les mots qui ne sont pas sorti, à partir du surlendemain.

## Règles du mélange

Dans la mesure du possible, lors du mélange, les règles suivantes vont être respectées :

- La longueur du mot est différente de celle du mot précédent,
- L'initial du mot est différente de l'initiale des cinq mots précédents.

Le script tire un mot au hasard, et regarde s'il respecte les règles. Si oui, il est gardé, sinon, un autre est tiré. Au bout d'un certain nombre d'echec, le script abandonne, et va juste placer les mots non encore tiré à la fin du fichier.
