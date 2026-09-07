# E-OS Tower Defense Maker

![E-OS TOWER DEFENSE MAKER](../images/E-OS%20TOWER%20DEFENSE%20MAKER.png)

Welcome to the **Tower Defense Maker** for the E-OS console! This web-based editor allows you to design custom maps, waypoints, and environments for the ESP32 Tower Defense game.

## Features
- **Pixel-Perfect Renderer**: The editor features a custom HTML5 Canvas engine that exactly replicates the C++ game renderer. You see exactly what the ESP32 will output on screen.
- **Dynamic Biome Support**: Instantly preview your maps in the three game environments (Forest, Frozen, Inferno) with real-time palette swapping.
- **Smart Path Generation**: Drawing a path automatically recalculates connections, checkerboard patterns, and borders.
- **Waypoint Extraction**: The editor automatically detects and compiles the exact turning points (waypoints) the enemy AI needs to traverse the map. 
- **C++ Export**: Exports directly as C++ header files (`.h`) containing PROGMEM arrays optimized for the ESP32-S3.

## How to Use

1. Open `index.html` in any modern web browser.
2. Select your desired Biome from the drop-down menu.
3. Draw your level: 
   - Connect a path from the **Spawn** (cave) to the **Base** (castle).
   - Place Rocks for decoration or strategic blocking.
4. Click **Save As...** and save your map in the `towerdefense/data/` folder.
5. You can also click **Load** to edit any existing levels.
6. To use your custom map in-game, toggle `USE_CUSTOM_MAP true` in `Config.h` and compile.
