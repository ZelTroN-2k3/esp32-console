# E-OS Dungeon Maker

![E-OS DUNGEON MAKER](../images/E-OS%20DUNGEON%20MAKER.png)

Bienvenue dans le **Dungeon Maker** pour la console E-OS ! Cet éditeur Web vous permet de concevoir des niveaux personnalisés et des campagnes complètes pour le jeu Dungeon Crawler sur ESP32.

## Fonctionnalités
- **Moteur de Génération Procédurale** : Cliquez sur "✨ Generate Random" pour générer instantanément un donjon complet en utilisant la véritable logique C++ du jeu, traduite en JavaScript.
- **Palette de Dessin Complète** : Peignez des murs, sols, portes, escaliers, coffres, marécages, fleurs, lave et piliers sur une grille de 32x28.
- **Placement d'Entités** : Placez le joueur, des chauves-souris, squelettes, gobelins, et même d'énormes Boss 2x2 (Dragon, Liche, Golem).
- **Campaign Manager** : Enchaînez vos niveaux (ex: Niveau 1, Niveau 2, Niveau Boss). L'outil génèrera automatiquement un fichier chef d'orchestre `Campaign.h`.
- **Export C++** : Exporte directement sous forme de fichiers d'en-tête C++ (`.h`) contenant des tableaux PROGMEM optimisés pour l'ESP32-S3.

## Comment l'utiliser

1. Ouvrez `index.html` dans un navigateur Web moderne.
2. Entrez un **CODE NAME** pour votre niveau (ex: `LEVEL_1`).
3. Dessinez votre niveau, ou utilisez le générateur aléatoire puis modifiez-le.
4. Cliquez sur **Save As...** et sauvegardez votre carte dans le dossier `dungeon/data/`.
5. Une fois tous vos niveaux créés, cliquez sur le bouton **📜 Campaign Manager**.
6. Associez vos niveaux aux étages correspondants et exportez le fichier `Campaign.h` dans `dungeon/data/`.
7. Compilez et téléversez votre jeu sur la console E-OS. La campagne se lancera de manière fluide !
