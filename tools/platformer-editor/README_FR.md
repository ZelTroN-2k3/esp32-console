# 🚀 E-OS PLATFORMER Map Editor

![Aperçu de l'éditeur Platformer](../images/E-OS%20PLATFORMER%20-%20MAP%20EDITOR.png)

Bienvenue dans le dépôt du **PLATFORMER Map Editor** spécialement conçu pour le système **E-OS** (ESP32).
Cet outil permet de créer des niveaux de jeu de plateforme 2D avec une gestion pixel-perfect des sauts et des collisions.

## 🎯 Fonctionnalités Clés

### 1. Éditeur Visuel et Aperçu Pixel-Perfect
- **Grille de Création (40x16) :** Construisez votre niveau avec de gros blocs confortables à cliquer.
- **Aperçu Réel (320x128px) :** Un mini-écran vous montre *exactement* le rendu final sur l'écran physique de l'ESP32, en temps réel.
- **Indicateur de Saut (Jump Physics) :** L'aperçu affiche la trajectoire de saut maximale du personnage (3.5 tuiles de haut, 4.5 de long) pour vous aider à placer vos plateformes sans tester à l'aveugle.

### 2. Blocs et Objets Riches
- **Construction :** Herbe (avec bordure détaillée), Briques, et Piques mortelles.
- **Objets :** Pièces d'or (Coins), Drapeau de fin (Finish), et Ennemis.
- Outils pour vider le niveau ou remplir instantanément le sol.

### 3. Export / Import natif
- Utilisation de la **File System Access API** pour ouvrir (Load) et écraser (Save) les fichiers `.h` du dossier `platformer/data/` en un seul clic, générant un code `PROGMEM` optimisé pour la mémoire Flash de l'ESP32.

## 🛠️ Stack Technique
- **Interface Web Moderne :** HTML5/CSS3 Vanilla avec un design professionnel et de belles marges responsives.
- **Moteur de Preview Canvas :** Un `<canvas>` HTML5 est dessiné en temps réel à chaque clic pour simuler le rendu C++ (`TFT_eSPI`) de l'ESP32.
- **Génération C++ Avancée :** Analyse et écriture de la syntaxe d'array C++ à partir du Javascript Vanilla.

---

*Développé pour la console E-OS ESP32. À vous de concevoir le prochain chef-d'œuvre de plateforme !*
