# 🚀 E-OS DOOM Level Editor

Bienvenue dans le dépôt du **DOOM Level Editor** spécialement conçu pour le système **E-OS** (ESP32).
Cet outil puissant et moderne fonctionnant entièrement dans votre navigateur web vous permet de concevoir, dessiner et exporter des niveaux compatibles avec le moteur DOOM intégré de E-OS.

## 🎯 Fonctionnalités Clés

### 1. Éditeur Visuel Fluide
- Grille de **32x32** entièrement cliquable et "peignable" par glissement.
- **Palette Complète :** 
  - **Murs (Tiles) :** 9 types de murs (Briques, Bois, Pierre, Métal...), 4 types de Portes (Classiques, Verrouillées, Secrètes, Ascenseurs), et Sorties.
  - **Entités (Sprites) :** Monstres (Zombies, Pinky, Baron), Objets (Munitions, Armures, Santé, Barils, Clés) et Décors (Lampes, Piliers).
- **Point de Spawn (Joueur) :** Choix facile de la direction du joueur (Nord, Est, Sud, Ouest) avec un indicateur visuel.
- **Aperçu d'Image :** Prévisualisation des assets (textures et sprites) en haute qualité dans le menu latéral.

### 2. Navigation et Ergonomie
- **Zoom Fluide :** Zoomez à la molette (x1 jusqu'à x10) pour des détails précis ou une vue globale.
- **Panoramique :** Déplacez-vous sur la carte librement en maintenant le **Clic Droit** enfoncé (sans scrollbars disgracieuses).
- **Mini-Map Intelligente :** En haut à droite de l'écran, une mini-map s'affiche dès que vous zoomez assez (x3+). Elle est entièrement cliquable pour vous téléporter à l'autre bout du niveau instantanément.

### 3. Assistance "Level Design" par IA
- **Analyse Anti-Crash :** Le bouton `Check Map` lance un algorithme de flood-fill (remplissage 8-way) pour vérifier que votre niveau est "étanche" (pas de fuites vers le néant). Si une fuite est détectée, les cases problématiques clignotent en rouge !
- **Lignes de Connexion Intelligentes (A*) :** L'éditeur calcule et trace automatiquement (en temps réel) le chemin le plus court que le joueur devra emprunter pour aller d'une **Clé** à une **Porte Verrouillée**. Ce tracé évite intelligemment les murs. Si la porte est bloquée sans issue, la ligne devient rouge vif pour signaler un bug de level design !

### 4. Historique et Raccourcis (Undo/Redo)
- **Ctrl + Z** et **Ctrl + Y** : Vous vous êtes trompé ? Annulez facilement jusqu'à 50 coups de pinceau en arrière.
- **Raccourcis productifs :** `E` (Gomme), `P` (Joueur), `T` (Reprendre dernier mur), `S` (Reprendre dernier sprite). Un document [HELP.md](HELP.md) liste toutes les astuces clavier.

### 5. Import / Export (C++ Header)
- Le niveau s'exporte directement sous la forme d'un fichier `.h` prêt à être compilé par le système E-OS (ESP32).
- L'outil lit les macros C++ de E-OS et convertit visuellement votre code en une belle interface utilisateur pour pouvoir continuer votre édition là où vous l'aviez laissée.

## 🛠️ Stack Technique
- **HTML5 / CSS3 Vanilla :** Design moderne, "Dark Mode", Glassmorphism subtil. L'éditeur est ultra rapide et léger.
- **JavaScript Vanilla :** Pas de framework lourd. Toutes les fonctionnalités (Pathfinding A*, Algorithme de détection de fuites, Manipulation du système de fichiers) sont codées purement en Javascript pour des performances maximales.
- **File System Access API :** Utilisation des APIs modernes de navigateur pour lire et écraser le fichier `NEW-LEVEL.h` sans ouvrir 30 fenêtres de téléchargement.
- **SVG Dynamique :** Utilisation de graphiques vectoriels superposés à la grille HTML pour les tracés de lignes d'aide visuelle.

---

*Développé pour la console E-OS ESP32. Amusez-vous bien à concevoir des niveaux machiavéliques !*
