# 🚀 E-OS PACMAN Level Editor

Bienvenue dans le dépôt du **PACMAN Level Editor** spécialement conçu pour le système **E-OS** (ESP32).
Cet outil visuel moderne fonctionnant entièrement dans votre navigateur web vous permet de concevoir et d'exporter des niveaux compatibles avec le moteur Pacman intégré de E-OS.

## 🎯 Fonctionnalités Clés

### 1. Éditeur Visuel Fluide
- Grille de **20x14** reprenant les dimensions exactes de l'écran ESP32 (avec des tuiles de 16x16px).
- **Palette Complète :** 
  - Gomme, Mur (Wall), Pilule (Dot), et Super Pilule (Power Pellet).
- Clic gauche pour dessiner, clic droit pour gommer rapidement !

### 2. Export / Import (C++ Header)
- **Intégration API de fichiers :** Le niveau s'exporte directement sous la forme d'un fichier `.h` (ex: `Level-1.h`) prêt à être compilé par le système E-OS.
- **Lecture de code source :** L'outil est capable d'ouvrir vos fichiers `.h` existants, d'en extraire le tableau C++ (ex: `const uint8_t MAP_LEVEL_1[...] PROGMEM = { ... };`) et de l'afficher visuellement pour le modifier.

### 3. Statistiques en Temps Réel
- Un panneau de statistiques vous indique instantanément le nombre de pilules, de super pilules et de murs présents dans le niveau. Cela vous aide à équilibrer le gameplay.

## 🛠️ Stack Technique
- **HTML5 / CSS3 Vanilla :** Design moderne, interface fluide, boutons esthétiques.
- **JavaScript Vanilla :** Manipulation efficace du DOM et parsing/génération de code C++ pour l'ESP32.
- **File System Access API :** Utilisation avancée pour sauvegarder directement sur votre disque dur sans fenêtres de téléchargement intempestives.

---

*Développé pour la console E-OS ESP32. Créez les labyrinthes les plus intenses pour Pacman !*
