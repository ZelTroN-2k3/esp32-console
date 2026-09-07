# ℹ️ E-OS PACMAN Level Editor - Practical Information

Welcome to the PACMAN level editor user guide.

## 🖱️ Navigation and Controls

### Mouse
- **Left Click (Hold):** Continuously paint the selected tile (wall, dot, etc.).
- **Right Click:** Quick shortcut to use the Eraser (delete a tile) without having to select it from the toolbar.

### Keyboard Shortcuts
- **Keys `1`, `2`, `3`, `4`:** Quickly switch between different building blocks:
  - `1`: Eraser (Air)
  - `2`: Wall
  - `3`: Dot
  - `4`: Power Pellet

## 💾 File Management

- **New:** Resets the map to a completely empty level.
- **Load:** Opens a `.h` Pacman level file from your computer (e.g., `pacman/data/Level-1.h`).
- **Save:** If you have loaded a level, this button directly overwrites it with your new modifications (ultra-fast shortcut).
- **Save As...:** Exports the current grid to a new `.h` file. Don't forget to add it to `Config.h` in your C++ game to make it playable!
