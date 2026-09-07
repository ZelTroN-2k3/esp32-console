# Outil : E-OS Dungeon Maker

Cet outil vous permet de concevoir des niveaux de donjon personnalisés et d'orchestrer des campagnes complètes sur plusieurs niveaux pour le jeu ESP32 Dungeon Crawler. 
Il écrit directement des fichiers d'en-tête C++ en PROGMEM, ce qui permet à l'ESP32-S3 de les charger en mémoire sans analyse de fichiers lourde sur le microcontrôleur.

**Structure des Fichiers Clés :**
- `index.html` : L'interface utilisateur et le système de conception.
- `style.css` : Le style RPG (mode sombre) pour l'outil.
- `main.js` : Contient toute la logique pour l'interaction avec la grille, l'algorithme de génération procédurale (porté directement depuis la fonction C++ `generateMap()`), le placement des entités, le Campaign Manager, et l'exportation des fichiers.

**Intégration avec le Jeu :**
Lorsqu'une campagne personnalisée est créée, l'utilisateur exporte plusieurs fichiers `.h` (ex: `LEVEL_1.h`, `LEVEL_2.h`) et un fichier chef d'orchestre (`Campaign.h`) vers le dossier `dungeon/data/`.
Dans `dungeon/Config.h`, `USE_CUSTOM_MAP` est défini sur `true`, ce qui remplace la boucle de génération procédurale par défaut par `loadCustomMap()` et `loadCustomEnemies()`. Lorsque la campagne n'a plus d'étages prédéfinis, le jeu bascule élégamment vers la génération procédurale infinie.
