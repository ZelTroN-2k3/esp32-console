# ℹ️ E-OS PLATFORMER Map Editor - Informations Pratiques

Bienvenue dans le guide d'utilisation de l'éditeur de carte pour le jeu de plateforme E-OS.

## 🖱️ Navigation et Commandes

### Souris
- **Clic Gauche (Maintenu)** : Peindre le bloc sélectionné (herbe, brique, ennemis) en continu sur la grille.
- **Clic Droit** : Raccourci gomme ! Efface instantanément l'élément cliqué sans avoir à sélectionner l'outil Gomme.

### Raccourcis Clavier
- **Touches de `0` à `6`** : Sélectionnez instantanément votre pinceau :
  - `0` : Air (Gomme)
  - `1` : Grass Ground (Herbe)
  - `2` : Brick (Brique)
  - `3` : Spikes (Piques)
  - `4` : Gold Coin (Pièce d'or)
  - `5` : Flag (Drapeau d'arrivée)
  - `6` : Enemy (Ennemi)

## 📐 Astuces de Level Design

- **Règle d'or des Sauts :** Pour que le niveau soit réalisable par le joueur, laissez un maximum de **2 tuiles de vide horizontal** et **2 tuiles de vide vertical** entre deux plateformes. Fiez-vous à la courbe en pointillé bleue dans le petit écran d'aperçu du bas !
- Utilisez le bouton **Fill Bottom Row** pour créer instantanément un sol solide sur toute la largeur.

## 💾 Gestion des Fichiers

- Cliquez sur **Load** pour ouvrir un fichier comme `Level-1.h` depuis le dossier `platformer/data/`.
- Utilisez **Save** pour enregistrer rapidement les modifications directement dans le même fichier.
- **Attention :** Un bon niveau de plateforme doit idéalement contenir au moins un Drapeau (Flag) pour que le joueur puisse le terminer !
