# 🚀 E-OS PACMAN Level Editor

![Pacman Editor Preview](../images/PACMAN%20LEVEL%20EDITOR.png)

Welcome to the **PACMAN Level Editor** repository specifically designed for the **E-OS** (ESP32) system.
This modern, web-based visual tool allows you to design and export levels compatible with the built-in Pacman engine of E-OS.

## 🎯 Key Features

### 1. Smooth Visual Editor
- **20x14 Grid** matching the exact dimensions of the ESP32 screen (with 16x16px tiles).
- **Complete Palette:** 
  - Eraser, Wall, Dot, and Power Pellet.
- Left-click to draw, right-click for quick erase!

### 2. Export / Import (C++ Header)
- **File System API Integration:** The level can be exported directly as a `.h` file (e.g., `Level-1.h`) ready to be compiled by the E-OS system.
- **Source Code Reading:** The tool can open your existing `.h` files, extract the C++ array (e.g., `const uint8_t MAP_LEVEL_1[...] PROGMEM = { ... };`), and display it visually for editing.

### 3. Real-Time Statistics
- A statistics panel instantly shows you the number of dots, power pellets, and walls present in the level, helping you balance the gameplay.

## 🛠️ Technical Stack
- **HTML5 / CSS3 Vanilla:** Modern design, smooth interface, aesthetic buttons.
- **Vanilla JavaScript:** Efficient DOM manipulation and C++ code parsing/generation for the ESP32.
- **File System Access API:** Advanced usage to save directly to your hard drive without annoying download popups.

---

*Developed for the E-OS ESP32 console. Create the most intense mazes for Pacman!*
