# ℹ️ E-OS PLATFORMER Map Editor - Practical Information

Welcome to the map editor user guide for the E-OS platformer game.

## 🖱️ Navigation and Controls

### Mouse
- **Left Click (Hold):** Continuously paint the selected block (grass, brick, enemies) on the grid.
- **Right Click:** Eraser shortcut! Instantly deletes the clicked element without having to select the Eraser tool.

### Keyboard Shortcuts
- **Keys `0` to `6`:** Instantly select your brush:
  - `0`: Air (Eraser)
  - `1`: Grass Ground
  - `2`: Brick
  - `3`: Spikes
  - `4`: Gold Coin
  - `5`: Flag (Finish)
  - `6`: Enemy

## 📐 Level Design Tips

- **Golden Rule for Jumps:** For the level to be playable, leave a maximum of **2 horizontal empty tiles** and **2 vertical empty tiles** between two platforms. Rely on the dotted blue curve in the small preview screen at the bottom!
- Use the **Fill Bottom Row** button to instantly create a solid floor across the entire width.

## 💾 File Management

- Click **Load** to open a file like `Level-1.h` from the `platformer/data/` folder.
- Use **Save** to quickly record modifications directly back to the same file.
- **Note:** A good platformer level should ideally contain at least one Flag so the player can finish it!
