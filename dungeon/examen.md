Listed directory dungeon
Ran command: `cat d:\www\esp32-console\esp32-console\dungeon\dungeon.ino | Select-Object -First 30`

L'examen du dossier `/dungeon` est terminé ! 🕵️‍♂️

C'est un jeu vraiment complet et impressionnant. Voici ce que j'ai découvert sur **E-OS DUNGEON CRAWLER v2.0** :

### 1. ⚔️ Le Type de Jeu (Roguelike / RPG)
Il s'agit d'un "Dungeon Crawler" (exploration de donjons) de type **Roguelike**. 
Le gameplay est basé sur une grille : on se déplace case par case, et le simple fait de "marcher" sur un ennemi déclenche une attaque. 
C'est un grand classique très addictif !

### 2. 🗂️ Une Architecture C++ Modulaire (Très propre)
Le code n'est pas entassé dans un seul fichier, il est magnifiquement séparé en plusieurs modules logiques (Header files `.h`), 
ce qui le rend très professionnel :
- `dungeon.ino` : Le moteur principal (boucle de jeu à 60 FPS, gestion des boutons, menu principal).
- `Map.h` : La génération et la gestion du terrain.
- `Player.h` : Les statistiques du héros (santé, niveau, XP).
- `Enemies.h` : L'intelligence artificielle et les caractéristiques des monstres.
- `Combat.h` : Le système de dégâts et de combats au tour par tour (bump-to-attack).
- `Items.h` & `Spells.h` : La gestion du butin (coffres), de l'inventaire et des sorts magiques.
- `Renderer.h` : Tout ce qui gère l'affichage graphique sur l'écran couleur 160x128.
- `SaveManager.h` : Un système de sauvegarde de la progression (probablement dans la mémoire NVS de l'ESP32).

### 3. 🎮 Des fonctionnalités très riches
D'après les commentaires en tête de fichier, le jeu possède de nombreuses fonctionnalités avancées :
- Un système **d'Inventaire** complet (Bouton C).
- Un **Livre de Sorts / Magie** (Bouton B).
- Des **Marchands** (pour acheter/vendre de l'équipement).
- Des **Combats de Boss** avec des écrans d'introduction dédiés.
- Des coffres à ouvrir.

*Remarque : Comme pour les autres jeux (Pacman et Platformer), 
les commentaires dans le code source sont actuellement en **Turc**.*
