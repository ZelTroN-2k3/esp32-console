# Tool: E-OS Dungeon Maker

This tool allows you to design custom dungeon levels and orchestrate entire multi-level campaigns for the ESP32 Dungeon Crawler game. 
It writes directly to C++ header files in PROGMEM, allowing the ESP32-S3 to load them into memory without heavy file parsing on the microcontroller.

**Key File Structure:**
- `index.html`: The user interface and design system.
- `style.css`: The dark-mode RPG styling for the tool.
- `main.js`: Contains all the logic for grid interaction, the procedural generation algorithm (ported directly from the C++ `generateMap()` function), entity placement, Campaign Manager, and file exporting.

**Integration with the Game:**
When a custom campaign is designed, the user exports multiple `.h` files (e.g. `LEVEL_1.h`, `LEVEL_2.h`) and one orchestrator file (`Campaign.h`) to the `dungeon/data/` folder.
In `dungeon/Config.h`, `USE_CUSTOM_MAP` is set to `true`, which replaces the default procedural generation loop with `loadCustomMap()` and `loadCustomEnemies()`. When the campaign runs out of predefined floors, the game gracefully falls back to endless procedural generation.
