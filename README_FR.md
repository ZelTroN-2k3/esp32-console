<div align="right">
  <a href="README.md">English</a> | <a href="README_TR.md">Türkçe</a> | <b>Français</b>
</div>

<div align="center">
  <img src="docs/images/Front.jpg" alt="Console E-OS" width="350" style="border-radius: 12px;"/>
  <br/><br/>
  <h1>E-OS — Console Portable ESP32-S3</h1>
  <p>Un projet de console de jeu portable artisanale basée sur ESP32-S3, à double écran (TFT+OLED), fonctionnant sous une architecture FreeRTOS.</p>
  
  <p>
    <img src="https://img.shields.io/badge/MCU-ESP32--S3-blue?style=for-the-badge&logo=espressif" alt="ESP32-S3"/>
    <img src="https://img.shields.io/badge/OS-FreeRTOS-yellow?style=for-the-badge" alt="FreeRTOS"/>
    <img src="https://img.shields.io/badge/RAM-8MB_PSRAM-purple?style=for-the-badge" alt="PSRAM"/>
    <img src="https://img.shields.io/badge/Flash-16MB-green?style=for-the-badge" alt="Flash"/>
  </p>
  
  <h3>
    <a href="https://emir173.github.io/esp32-console/">🌐 Site Web du Projet</a>
  </h3>
</div>

---

## À propos du Projet
Ce projet est une console portable développée de zéro en utilisant le microcontrôleur ESP32-S3. Sans s'appuyer sur aucun framework d'interface utilisateur (UI) ou émulateur préconçus, le système d'exploitation (E-OS) et les moteurs de jeu ont été codés sur mesure en C++ pour fonctionner spécifiquement sur ce matériel.

### Architecture Matérielle
- **Processeur :** ESP32-S3 Dual-Core fonctionnant à 240 MHz.
- **Double Écran :** 
  - *Écran Principal :* 160x128 Couleur TFT (SPI). Gère le rendu principal du jeu et l'UI.
  - *Écran Secondaire :* 128x64 OLED (I2C). Situé en haut de l'appareil ; affiche le statut du système et les meilleurs scores.
- **Mémoire :** 16MB Flash + 8MB PSRAM OPI. La large bande passante mémoire garantit une expérience sans saccade.
- **Audio & Contrôles :** Buzzer 8-bit et un joystick analogique (avec filtrage de zone morte matériel).
- **Stockage :** Intégration de carte Micro SD pour les ressources du jeu.

---

## Architecture Logicielle (E-OS)
- **FreeRTOS :** Un cœur de processeur (Core 0) gère la logique du jeu, tandis que l'autre cœur (Core 1) est entièrement dédié au rendu visuel.
- **Menu Carrousel :** Présente une conception de menu rotatif et animé pour naviguer entre les jeux.
- **Pause Matérielle :** Grâce à la gestion des tâches RTOS, les jeux peuvent être mis en pause instantanément au niveau matériel.

---

## 15 Jeux sur Mesure
Tous les jeux sont fortement optimisés pour la résolution et les limites matérielles de l'appareil.

<table>
  <tr>
    <td width="200" align="center"><img src="docs/screenshots/DOOM/D3_gif.gif" width="180" style="border-radius: 6px;"></td>
    <td valign="middle"><b>DOOM :</b> Moteur de raycasting de style Doom.</td>
  </tr>
  <tr>
    <td width="200" align="center"><img src="docs/screenshots/Mode7/M2_gif.gif" width="180" style="border-radius: 6px;"></td>
    <td valign="middle"><b>MODE 7 RACING :</b> Mécaniques de course classiques. Collectez les points de contrôle et laissez vos rivaux derrière vous.</td>
  </tr>
  <tr>
    <td width="200" align="center"><img src="docs/screenshots/Wireframe3D/W2_gif.gif" width="180" style="border-radius: 6px;"></td>
    <td valign="middle"><b>WIRE-FRAME 3D :</b> Batailles spatiales en 3D contre des forces extraterrestres.</td>
  </tr>
  <tr>
    <td width="200" align="center"><img src="docs/screenshots/GalacticStrike/G2_gif.gif" width="180" style="border-radius: 6px;"></td>
    <td valign="middle"><b>GALACTIC STRIKE :</b> Survivez aux flottes ennemies, collectez des bonus et battez des boss.</td>
  </tr>
  <tr>
    <td width="200" align="center"><img src="docs/screenshots/Platformer/P2_gif.gif" width="180" style="border-radius: 6px;"></td>
    <td valign="middle"><b>PLATFORMER :</b> Surmontez les obstacles, esquivez les pièges et terminez les niveaux.</td>
  </tr>
  <tr>
    <td width="200" align="center"><img src="docs/screenshots/SpaceInvaders/S2_gif.gif" width="180" style="border-radius: 6px;"></td>
    <td valign="middle"><b>SPACE INVADERS :</b> Survivez à des vagues successives d'extraterrestres.</td>
  </tr>
  <tr>
    <td width="200" align="center"><img src="docs/screenshots/Arkanoid/A2_gif.gif" width="180" style="border-radius: 6px;"></td>
    <td valign="middle"><b>ARKANOID :</b> Brisez toutes les briques avec une balle qui accélère.</td>
  </tr>
  <tr>
    <td width="200" align="center"><img src="docs/screenshots/Pacman/P2_gif.gif" width="180" style="border-radius: 6px;"></td>
    <td valign="middle"><b>PAC-MAN :</b> Échappez aux fantômes et collectez tous les points dans le labyrinthe.</td>
  </tr>
  <tr>
    <td width="200" align="center"><img src="docs/screenshots/Flappy/F3_Gif.gif" width="180" style="border-radius: 6px;"></td>
    <td valign="middle"><b>FLAPPY BIRD :</b> Volez prudemment à travers les tuyaux.</td>
  </tr>
  <tr>
    <td width="200" align="center"><img src="docs/screenshots/Snake/S2_gif.gif" width="180" style="border-radius: 6px;"></td>
    <td valign="middle"><b>SNAKE :</b> Agrandissez votre queue sans heurter les murs ni vous-même.</td>
  </tr>
  <tr>
    <td width="200" align="center"><img src="docs/screenshots/Tetris/T2_gif.gif" width="180" style="border-radius: 6px;"></td>
    <td valign="middle"><b>TETRIS :</b> Empilez les blocs, nettoyez les lignes ; le jeu accélère avec les niveaux.</td>
  </tr>
  <tr>
    <td width="200" align="center"><img src="docs/screenshots/Dungeon/D5_gif.gif" width="180" style="border-radius: 6px;"></td>
    <td valign="middle"><b>DUNGEON :</b> Jeu d'exploration de donjons en vue de dessus avec combats de boss, système de magie, marchand et différents biomes.</td>
  </tr>
  <tr>
    <td width="200" align="center"><img src="docs/screenshots/TowerDefense/T3_gif.gif" width="180" style="border-radius: 6px;"></td>
    <td valign="middle"><b>TOWER DEFENSE :</b> Stratégie par vagues : placez des tours, améliorez-les et gérez les vagues ennemies.</td>
  </tr>
  <tr>
    <td width="200" align="center"><img src="docs/screenshots/Game2048/2048_2_Gif.gif" width="180" style="border-radius: 6px;"></td>
    <td valign="middle"><b>2048 :</b> Combinez les mêmes nombres pour atteindre la tuile 2048.</td>
  </tr>
  <tr>
    <td width="200" align="center"><img src="docs/screenshots/Rhythm/R2_gif.gif" width="180" style="border-radius: 6px;"></td>
    <td valign="middle"><b>RHYTHM :</b> Suivez le rythme de la musique et attrapez les notes en néon tombantes.</td>
  </tr>
</table>

## 3 Applications

<table>
  <tr>
    <td width="200" align="center"><img src="docs/screenshots/Flight/F2_gif.gif" width="180" style="border-radius: 6px;"></td>
    <td valign="middle"><b>FLIGHT TRACKER :</b> Système de suivi des vols en temps quasi-réel utilisant l'API OpenSky Network.</td>
  </tr>
  <tr>
    <td width="200" align="center"><img src="docs/screenshots/Tools/T1.png" width="180" style="border-radius: 6px;"></td>
    <td valign="middle"><b>TOOLS :</b> Application utilitaire contenant un chronomètre et un métronome.</td>
  </tr>
  <tr>
    <td width="200" align="center"><img src="docs/screenshots/Draw/D2_gif.gif" width="180" style="border-radius: 6px;"></td>
    <td valign="middle"><b>DRAW (ETCH-A-SKETCH) :</b> Application de dessin classique. Changez de mode et dessinez en couleur.</td>
  </tr>
</table>

## Éditeurs de Niveaux sur Navigateur

Ce projet inclut également des éditeurs de cartes avancés accessibles via un navigateur web (HTML5/JS). Ils fonctionnent entièrement côté client et génèrent du code C++ compatible avec l'ESP32.

<table>
  <tr>
    <td width="200" align="center"><img src="tools/images/E-OS%20DUNGEON%20MAKER.png" width="180" style="border-radius: 6px;"></td>
    <td valign="middle"><b>DUNGEON MAKER :</b> Générez de manière procédurale, modifiez et orchestrez des campagnes à plusieurs niveaux pour le jeu Dungeon.</td>
  </tr>
  <tr>
    <td width="200" align="center"><img src="tools/images/E-OS%20TOWER%20DEFENSE%20MAKER.png" width="180" style="border-radius: 6px;"></td>
    <td valign="middle"><b>TOWER DEFENSE MAKER :</b> Éditeur de cartes pixel-perfect avec rendu de biomes en temps réel et détection automatique des waypoints.</td>
  </tr>
  <tr>
    <td width="200" align="center"><img src="tools/images/E-OS%20PLATFORMER%20%E2%80%94%20MAP%20EDITOR.png" width="180" style="border-radius: 6px;"></td>
    <td valign="middle"><b>PLATFORMER EDITOR :</b> Créez vos propres niveaux de plateforme 2D, placez ennemis et pièces, et exportez en C++.</td>
  </tr>
  <tr>
    <td width="200" align="center"><img src="tools/images/DOOM%20LEVEL%20EDITOR.png" width="180" style="border-radius: 6px;"></td>
    <td valign="middle"><b>DOOM EDITOR :</b> Dessinez vos propres cartes en raycasting, placez les murs, sprites et points d'apparition.</td>
  </tr>
  <tr>
    <td width="200" align="center"><img src="tools/images/PACMAN%20LEVEL%20EDITOR.png" width="180" style="border-radius: 6px;"></td>
    <td valign="middle"><b>PACMAN EDITOR :</b> Construisez vos labyrinthes classiques et définissez le chemin des fantômes.</td>
  </tr>
</table>

## Système d'Exploitation (E-OS Launcher)
Le **E-OS Launcher** agit comme système d'exploitation principal, offrant un menu carrousel rotatif fluide qui héberge tous les jeux.

- **Pause Matérielle :** Suspendez instantanément la tâche RTOS active en appuyant sur le bouton du joystick dans n'importe quel jeu.
- **Double-Buffering :** Le menu carrousel fonctionne sans aucune déchirure d'image (tear-free), offrant des transitions fluides comme sur smartphone.
- **Bootloader OTA :** Lit les exécutables (binary) depuis la carte SD et les écrit sur la mémoire flash.
- **Contrôle Matériel du Son :** Coupez, baissez (LOW) ou augmentez le volume au maximum (HIGH) globalement via le menu Settings.
- **Surcouche FPS :** Un compteur de taux de rafraîchissement (FPS) en temps réel est disponible pour les développeurs.
- **Dual-Core Asynchrone :** Le Core 0 gère exclusivement les tâches de fond et la logique de jeu, tandis que le Core 1 est dédié au rendu graphique.

---

## Système de Capture d'Écran (Via USB)
Les captures d'écran et les GIFs sont enregistrés **via la connexion série USB**. Le `FrameDumper` asynchrone transfère le framebuffer vers le PC pendant que le jeu continue de tourner à 60 FPS.
Pour traiter ces données et les sauvegarder sous forme de PNG ou GIF, des outils Python (`capture.py`, `capture_gif.py`, etc.) situés dans le dossier `tools/` sont utilisés.

---

## Comment Compiler

### Bibliothèques Requises
- `TFT_eSPI` — Pilote de l'écran TFT (ST7735)
- `U8g2` — Pilote de l'écran OLED (SH1106)
- `SD` — Accès à la carte SD
- `Preferences` — Sauvegarde NVS des meilleurs scores

### Étapes d'Installation
1. **Configuration de TFT_eSPI :** Copiez le fichier `User_Setup.h` dans votre dossier de bibliothèque TFT_eSPI :
   ```
   Windows: C:\Users\<utilisateur>\Documents\Arduino\libraries\TFT_eSPI\User_Setup.h
   ```
2. **Partitions :** Utilisez le fichier `partitions.csv` fourni dans chaque dossier de jeu.
3. **Configuration de la Carte (Arduino IDE) :**
   - Carte : **ESP32S3 Dev Module**
   - Flash Size : **16MB (128Mb)**
   - PSRAM : **OPI 8MB**
   - Partition Scheme : **Custom** (partitions.csv)
4. **Compilation :** Chaque jeu se compile comme un fichier `.ino` séparé dans son propre dossier. `launcher.ino` est l'OS principal.

### Configuration des Broches (Pins)

| Broche | Fonction |
|--------|----------|
| 12 | SPI SCK |
| 11 | SPI MOSI |
| 42 | SPI MISO |
| 15 | TFT CS |
| 10 | SD CS |
| 41 | TFT DC |
| 8 | I2C SDA (OLED) |
| 9 | I2C SCL (OLED) |
| 1 | Joystick X |
| 2 | Joystick Y |
| 18 | Joystick SW |
| 3 | Bouton A |
| 21 | Bouton B |
| 4 | Bouton C |
| 6 | Bouton D |
| 5 | Buzzer |

---
<div align="center">
  <i>Projet de Console E-OS</i>
</div>
