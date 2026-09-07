# E-OS Dungeon Maker

![E-OS DUNGEON MAKER](../images/E-OS%20DUNGEON%20MAKER.png)

Welcome to the **Dungeon Maker** for the E-OS console! This web-based editor allows you to design custom levels and multi-level campaigns for the ESP32 Dungeon Crawler game.

## Features
- **Procedural Generation Engine**: Click "✨ Generate Random" to instantly generate a full dungeon using the exact C++ logic from the game, ported to JavaScript.
- **Full Drawing Palette**: Paint walls, floors, doors, stairs, chests, swamps, flowers, lava, and pillars on a 32x28 grid.
- **Entity Placement**: Spawn the player, bats, skeletons, goblins, and massive 2x2 Bosses (Dragon, Lich, Golem).
- **Campaign Manager**: Chain your levels together (e.g., Level 1, Level 2, Boss Level). The tool will automatically generate a `Campaign.h` orchestrator file.
- **C++ Export**: Exports directly as C++ header files (`.h`) containing PROGMEM arrays optimized for the ESP32-S3.

## How to Use

1. Open `index.html` in any modern web browser.
2. Enter a **CODE NAME** for your level (e.g., `LEVEL_1`).
3. Draw your level, or use the random generator and modify it.
4. Click **Save As...** and save your map in the `dungeon/data/` folder.
5. Once you have created all your levels, click the **📜 Campaign Manager** button.
6. Map your levels to the corresponding floors and export the `Campaign.h` file to `dungeon/data/`.
7. Compile and upload your game to the E-OS console. The campaign will run seamlessly!
