# E-OS Tower Defense Maker

![E-OS TOWER DEFENSE MAKER](../images/E-OS%20TOWER%20DEFENSE%20MAKER.png)

Bienvenue dans le **Tower Defense Maker** pour la console E-OS ! Cet éditeur Web vous permet de concevoir des cartes personnalisées, des chemins et des environnements pour le jeu ESP32 Tower Defense.

## Fonctionnalités
- **Rendu Pixel-Perfect** : L'éditeur intègre un moteur HTML5 Canvas sur mesure qui réplique exactement le moteur de rendu C++ du jeu. Vous voyez exactement ce que l'ESP32 affichera à l'écran.
- **Support des Biomes Dynamiques** : Prévisualisez instantanément vos cartes dans les trois environnements du jeu (Forest, Frozen, Inferno) avec un changement de palette en temps réel.
- **Génération Intelligente des Chemins** : Dessiner un chemin recalcule automatiquement les connexions, les motifs en damier et les bordures.
- **Extraction des Waypoints** : L'éditeur détecte et compile automatiquement les points de virage exacts (waypoints) dont l'IA des ennemis a besoin pour traverser la carte.
- **Export C++** : Exporte directement sous forme de fichiers d'en-tête C++ (`.h`) contenant des tableaux PROGMEM optimisés pour l'ESP32-S3.

## Comment l'utiliser

1. Ouvrez `index.html` dans n'importe quel navigateur web moderne.
2. Sélectionnez le Biome désiré dans le menu déroulant.
3. Dessinez votre niveau :
   - Connectez un chemin depuis le **Spawn** (grotte) jusqu'à la **Base** (château).
   - Placez des Rochers pour la décoration ou pour bloquer stratégiquement.
4. Cliquez sur **Save As...** et enregistrez votre carte dans le dossier `towerdefense/data/`.
5. Vous pouvez également cliquer sur **Load** pour modifier des niveaux existants.
6. Pour utiliser votre carte personnalisée en jeu, activez `USE_CUSTOM_MAP true` dans `Config.h` et compilez.
