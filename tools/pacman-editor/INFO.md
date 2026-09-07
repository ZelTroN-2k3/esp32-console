# ℹ️ E-OS PACMAN Level Editor - Informations Pratiques

Bienvenue dans le guide d'utilisation de l'éditeur de niveau PACMAN.

## 🖱️ Navigation et Commandes

### Souris
- **Clic Gauche (Maintenu)** : Peindre la tuile (mur, pilule) sélectionnée en continu.
- **Clic Droit** : Raccourci pour utiliser la Gomme (Effacer une tuile), sans avoir besoin de la sélectionner dans la barre d'outils.

### Raccourcis Clavier
- **Touches `1`, `2`, `3`, `4`** : Basculer rapidement entre les différents blocs de construction :
  - `1` : Gomme (Air)
  - `2` : Mur (Wall)
  - `3` : Pilule (Dot)
  - `4` : Super Pilule (Power Pellet)

## 💾 Gestion des Fichiers

- **New** : Réinitialise la carte avec un niveau totalement vide.
- **Load** : Ouvre un fichier `.h` de niveau Pacman depuis votre ordinateur (ex: `pacman/data/Level-1.h`).
- **Save** : Si vous avez chargé un niveau, ce bouton l'écrase directement avec vos nouvelles modifications (raccourci ultra-rapide).
- **Save As...** : Exporte la grille actuelle dans un nouveau fichier `.h`. N'oubliez pas de l'ajouter dans `Config.h` de votre jeu C++ pour le rendre jouable !
