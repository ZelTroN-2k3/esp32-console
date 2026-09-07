# 🚀 E-OS DOOM Level Editor

![Doom Editor Preview](../images/DOOM%20LEVEL%20EDITOR.png)

Welcome to the **DOOM Level Editor** repository specifically designed for the **E-OS** (ESP32) system.
This powerful and modern tool, running entirely in your web browser, allows you to design, draw, and export levels compatible with the built-in DOOM engine of E-OS.

## 🎯 Key Features

### 1. Smooth Visual Editor
- **32x32 Grid** that is fully clickable and "paintable" by dragging.
- **Complete Palette:** 
  - **Walls (Tiles):** 9 types of walls (Bricks, Wood, Stone, Metal...), 4 types of Doors (Classic, Locked, Secret, Elevators), and Exits.
  - **Entities (Sprites):** Monsters (Zombies, Pinky, Baron), Items (Ammo, Armor, Health, Barrels, Keys), and Decorations (Lamps, Pillars).
- **Spawn Point (Player):** Easy selection of the player's starting direction (North, East, South, West) with a visual indicator.
- **Image Preview:** High-quality preview of assets (textures and sprites) in the sidebar.

### 2. Navigation and Ergonomics
- **Smooth Zoom:** Zoom with the mouse wheel (x1 up to x10) for precise details or a global view.
- **Panning:** Move freely around the map by holding down the **Right Click** (without ugly scrollbars).
- **Smart Mini-Map:** At the top right of the screen, a mini-map appears as soon as you zoom in enough (x3+). It is entirely clickable to instantly teleport you to the other side of the level.

### 3. AI-Assisted "Level Design"
- **Anti-Crash Analysis:** The `Check Map` button launches a flood-fill algorithm (8-way fill) to verify that your level is "watertight" (no leaks into the void). If a leak is detected, the problematic tiles will flash red!
- **Smart Connection Lines (A*):** The editor automatically calculates and draws (in real time) the shortest path the player will have to take to go from a **Key** to a **Locked Door**. This path intelligently avoids walls. If the door is blocked with no way out, the line turns bright red to signal a level design bug!

### 4. History and Shortcuts (Undo/Redo)
- **Ctrl + Z** and **Ctrl + Y**: Made a mistake? Easily undo up to 50 brush strokes backwards.
- **Productive shortcuts:** `E` (Eraser), `P` (Player), `T` (Pick last tile), `S` (Pick last sprite). An [INFO.md](INFO.md) document lists all keyboard tricks.

### 5. Import / Export (C++ Header)
- The level is exported directly as a `.h` file ready to be compiled by the E-OS (ESP32) system.
- The tool reads E-OS C++ macros and visually converts your code into a beautiful user interface so you can continue editing right where you left off.

## 🛠️ Technical Stack
- **HTML5 / CSS3 Vanilla:** Modern design, "Dark Mode", subtle Glassmorphism. The editor is ultra fast and lightweight.
- **Vanilla JavaScript:** No heavy frameworks. All features (A* Pathfinding, Leak detection algorithm, File System Manipulation) are coded purely in Javascript for maximum performance.
- **File System Access API:** Uses modern browser APIs to read and overwrite the `NEW-LEVEL.h` file without opening 30 download popups.
- **Dynamic SVG:** Uses vector graphics overlaid on the HTML grid for visual aid lines.

---

*Developed for the E-OS ESP32 console. Have fun designing machiavellian levels!*
