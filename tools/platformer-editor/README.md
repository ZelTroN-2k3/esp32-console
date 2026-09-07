# 🚀 E-OS PLATFORMER Map Editor

![Platformer Editor Preview](../images/E-OS%20PLATFORMER%20-%20MAP%20EDITOR.png)

Welcome to the **PLATFORMER Map Editor** repository specifically designed for the **E-OS** (ESP32) system.
This tool allows you to create 2D platformer levels with pixel-perfect jump and collision management.

## 🎯 Key Features

### 1. Visual Editor and Pixel-Perfect Preview
- **Creation Grid (40x16):** Build your level with large, comfortable clickable blocks.
- **Real Preview (320x128px):** A mini-screen shows you *exactly* the final rendering on the physical ESP32 screen, in real time.
- **Jump Physics Indicator:** The preview displays the character's maximum jump trajectory (3.5 tiles high, 4.5 tiles long) to help you place your platforms without blindly guessing.

### 2. Rich Blocks and Objects
- **Construction:** Grass (with detailed borders), Bricks, and Deadly Spikes.
- **Objects:** Gold Coins, Finish Flag, and Enemies.
- Tools to clear the level or instantly fill the bottom row.

### 3. Native Export / Import
- Utilizes the **File System Access API** to open (Load) and overwrite (Save) `.h` files from the `platformer/data/` folder in a single click, generating optimized `PROGMEM` code for the ESP32 Flash memory.

## 🛠️ Technical Stack
- **Modern Web Interface:** HTML5/CSS3 Vanilla with a professional design and nice responsive margins.
- **Preview Canvas Engine:** An HTML5 `<canvas>` is drawn in real time on each click to simulate the C++ rendering (`TFT_eSPI`) of the ESP32.
- **Advanced C++ Generation:** Parsing and writing C++ array syntax from Vanilla Javascript.

---

*Developed for the E-OS ESP32 console. It's your turn to design the next platforming masterpiece!*
