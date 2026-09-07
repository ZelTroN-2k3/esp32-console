const MAP_W = 32;
const MAP_H = 28;

// Tiles
const TILE_WALL = 0;
const TILE_FLOOR = 1;
const TILE_DOOR = 2;
const TILE_STAIRS = 3;
const TILE_CHEST = 4;
const TILE_LOCKED = 5;
const TILE_SWAMP = 6;
const TILE_FLOWER = 7;
const TILE_LAVA = 8;
const TILE_PILLAR = 9;

// Entities
const ENT_PLAYER = 99;
const ENT_BAT = 1;
const ENT_SKELETON = 2;
const ENT_GOBLIN = 3;
const ENT_BOSS_DRAGON = 4;
const ENT_BOSS_LICH = 5;
const ENT_BOSS_GOLEM = 6;

let mapTiles = Array.from({ length: MAP_H }, () => Array(MAP_W).fill(TILE_WALL));
let mapEntities = Array.from({ length: MAP_H }, () => Array(MAP_W).fill(0));

let currentToolType = 'tile'; // 'tile' or 'player' or 'enemy'
let currentToolVal = TILE_FLOOR;
let isDrawing = false;
let fileHandle = null;

const gridContainer = document.getElementById('grid-container');
const coordsDisplay = document.getElementById('coordsDisplay');
const btnSave = document.getElementById('btn-save');
const btnSaveAs = document.getElementById('btn-save-as');
const btnLoad = document.getElementById('btn-load');
const btnNew = document.getElementById('btn-new');
const btnGenerate = document.getElementById('btn-generate');
const btnClear = document.getElementById('clearBtn');
const btnFillFloor = document.getElementById('fillFloorBtn');
const currentFilenameDisplay = document.getElementById('current-filename');

// Initialize Grid
function initGrid() {
    gridContainer.innerHTML = '';
    for (let y = 0; y < MAP_H; y++) {
        for (let x = 0; x < MAP_W; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell tile-0';
            cell.dataset.x = x;
            cell.dataset.y = y;
            
            const entityLayer = document.createElement('div');
            entityLayer.className = 'entity';
            cell.appendChild(entityLayer);

            cell.addEventListener('mousedown', (e) => handleInteraction(e, x, y));
            cell.addEventListener('mouseenter', (e) => handleHover(e, x, y));
            gridContainer.appendChild(cell);
        }
    }
    updateGridVisuals();
}

function updateGridVisuals() {
    let cells = gridContainer.children;
    for (let y = 0; y < MAP_H; y++) {
        for (let x = 0; x < MAP_W; x++) {
            const index = y * MAP_W + x;
            const cell = cells[index];
            const tile = mapTiles[y][x];
            const ent = mapEntities[y][x];
            
            // Tile
            cell.className = `cell tile-${tile}`;
            
            // Entity
            const entLayer = cell.querySelector('.entity');
            entLayer.className = 'entity';
            entLayer.textContent = '';
            
            if (ent === ENT_PLAYER) {
                entLayer.classList.add('ent-player');
            } else if (ent === ENT_BAT) {
                entLayer.classList.add('ent-bat');
            } else if (ent === ENT_SKELETON) {
                entLayer.classList.add('ent-skeleton');
            } else if (ent === ENT_GOBLIN) {
                entLayer.classList.add('ent-goblin');
            } else if (ent >= ENT_BOSS_DRAGON && ent <= ENT_BOSS_GOLEM) {
                if (ent === ENT_BOSS_DRAGON) { entLayer.classList.add('ent-boss-dragon'); }
                if (ent === ENT_BOSS_LICH) { entLayer.classList.add('ent-boss-lich'); }
                if (ent === ENT_BOSS_GOLEM) { entLayer.classList.add('ent-boss-golem'); }
            }
        }
    }
}

function handleInteraction(e, x, y) {
    if (e.button === 0) { // Left click
        isDrawing = true;
        applyTool(x, y);
    } else if (e.button === 2) { // Right click -> Erase
        isDrawing = true;
        erase(x, y);
    }
}

const TILE_NAMES = ["Wall", "Floor", "Door", "Stairs", "Chest", "Locked Door", "Swamp", "Flower", "Lava", "Pillar"];
const ENT_NAMES = {
    0: "", 1: "Bat", 2: "Skeleton", 3: "Goblin", 
    4: "Boss Dragon", 5: "Boss Lich", 6: "Boss Golem", 99: "Player Spawn"
};

const tooltip = document.getElementById('floatingTooltip');

function handleHover(e, x, y) {
    coordsDisplay.textContent = `R:${y} C:${x}`;
    
    // Update hover info
    let tName = TILE_NAMES[mapTiles[y][x]] || "";
    let eName = ENT_NAMES[mapEntities[y][x]] || "";
    let info = eName ? `${eName} (on ${tName})` : tName;
    
    tooltip.textContent = info;
    tooltip.style.display = 'block';
    tooltip.style.left = (e.clientX + 15) + 'px';
    tooltip.style.top = (e.clientY + 15) + 'px';

    if (!isDrawing) return;
    
    if (e.buttons === 1) applyTool(x, y);
    else if (e.buttons === 2) erase(x, y);
}

gridContainer.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
});

document.addEventListener('mouseup', () => isDrawing = false);
gridContainer.addEventListener('contextmenu', e => e.preventDefault());

function applyTool(x, y) {
    if (currentToolType === 'tile') {
        mapTiles[y][x] = currentToolVal;
        if (currentToolVal === TILE_WALL) mapEntities[y][x] = 0; // Clear entity if placing wall
    } else {
        // Place Entity (only on floor/doors etc)
        if (mapTiles[y][x] !== TILE_WALL) {
            // If player, clear existing player
            if (currentToolVal === ENT_PLAYER) {
                for (let r=0; r<MAP_H; r++) {
                    for (let c=0; c<MAP_W; c++) {
                        if (mapEntities[r][c] === ENT_PLAYER) mapEntities[r][c] = 0;
                    }
                }
            }
            mapEntities[y][x] = currentToolVal;
        }
    }
    updateCellVisual(x, y);
}

function erase(x, y) {
    if (mapEntities[y][x] !== 0) {
        mapEntities[y][x] = 0; // Erase entity first
    } else {
        mapTiles[y][x] = TILE_WALL; // Erase to wall
    }
    updateCellVisual(x, y);
}

function updateCellVisual(x, y) {
    const index = y * MAP_W + x;
    const cell = gridContainer.children[index];
    const tile = mapTiles[y][x];
    const ent = mapEntities[y][x];
    
    cell.className = `cell tile-${tile}`;
    const entLayer = cell.querySelector('.entity');
    entLayer.className = 'entity';
    entLayer.textContent = '';
    
    if (ent === ENT_PLAYER) { entLayer.classList.add('ent-player'); }
    else if (ent === ENT_BAT) { entLayer.classList.add('ent-bat'); }
    else if (ent === ENT_SKELETON) { entLayer.classList.add('ent-skeleton'); }
    else if (ent === ENT_GOBLIN) { entLayer.classList.add('ent-goblin'); }
    else if (ent === ENT_BOSS_DRAGON) { entLayer.classList.add('ent-boss-dragon'); }
    else if (ent === ENT_BOSS_LICH) { entLayer.classList.add('ent-boss-lich'); }
    else if (ent === ENT_BOSS_GOLEM) { entLayer.classList.add('ent-boss-golem'); }
}

// UI Buttons
document.querySelectorAll('.brush-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.brush-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentToolType = btn.dataset.type;
        currentToolVal = parseInt(btn.dataset.val);
    });
});

document.querySelectorAll('.accordion').forEach(acc => {
    acc.addEventListener('click', function() {
        // If we are opening this one, close all others first
        const isOpening = !this.classList.contains('active');
        
        if (isOpening) {
            document.querySelectorAll('.accordion').forEach(other => {
                other.classList.remove('active');
                other.nextElementSibling.style.display = 'none';
            });
            this.classList.add('active');
            this.nextElementSibling.style.display = 'flex';
        } else {
            // Just close it
            this.classList.remove('active');
            this.nextElementSibling.style.display = 'none';
        }
    });
});

btnClear.addEventListener('click', () => {
    if (confirm("Clear map?")) {
        for(let y=0; y<MAP_H; y++) {
            mapTiles[y].fill(TILE_WALL);
            mapEntities[y].fill(0);
        }
        updateGridVisuals();
    }
});

btnFillFloor.addEventListener('click', () => {
    for(let y=1; y<MAP_H-1; y++) {
        for(let x=1; x<MAP_W-1; x++) {
            mapTiles[y][x] = TILE_FLOOR;
        }
    }
    updateGridVisuals();
});

// Procedural Generation (Ported from Map.h)
btnGenerate.addEventListener('click', () => {
    // 1. Fill walls
    for(let y=0; y<MAP_H; y++) {
        mapTiles[y].fill(TILE_WALL);
        mapEntities[y].fill(0);
    }

    const rooms = [];
    const maxRooms = 7;
    
    // Helper
    const carveRoom = (r) => {
        for (let y = r.y; y < r.y + r.h; y++) {
            for (let x = r.x; x < r.x + r.w; x++) {
                mapTiles[y][x] = TILE_FLOOR;
            }
        }
    };
    const carveCorridor = (x1, y1, x2, y2) => {
        let x = x1, y = y1;
        while (x !== x2) { mapTiles[y][x] = TILE_FLOOR; x += (x2 > x) ? 1 : -1; }
        while (y !== y2) { mapTiles[y][x] = TILE_FLOOR; y += (y2 > y) ? 1 : -1; }
    };
    const roomsOverlap = (a, b) => {
        const m = 1;
        return a.x - m < b.x + b.w + m && a.x + a.w + m > b.x - m &&
               a.y - m < b.y + b.h + m && a.y + a.h + m > b.y - m;
    };

    // 2. Place rooms
    for (let i = 0; i < maxRooms; i++) {
        let placed = false;
        for (let t = 0; t < 10; t++) { // tries
            let w = Math.floor(Math.random() * 5) + 4; // 4 to 8
            let h = Math.floor(Math.random() * 4) + 4; // 4 to 7
            let x = Math.floor(Math.random() * (MAP_W - w - 2)) + 1;
            let y = Math.floor(Math.random() * (MAP_H - h - 2)) + 1;
            let r = {x, y, w, h, cx: Math.floor(x + w/2), cy: Math.floor(y + h/2)};
            
            let overlap = false;
            for (let j = 0; j < rooms.length; j++) {
                if (roomsOverlap(r, rooms[j])) { overlap = true; break; }
            }
            if (!overlap) {
                rooms.push(r);
                carveRoom(r);
                placed = true;
                break;
            }
        }
    }

    if (rooms.length < 2) return btnGenerate.click(); // retry

    // 3. Corridors
    for (let i = 1; i < rooms.length; i++) {
        carveCorridor(rooms[i-1].cx, rooms[i-1].cy, rooms[i].cx, rooms[i].cy);
    }

    // 4. Start (Player) & Stairs
    mapEntities[rooms[0].cy][rooms[0].cx] = ENT_PLAYER;
    const lastRoom = rooms[rooms.length-1];
    mapTiles[lastRoom.cy][lastRoom.cx] = TILE_STAIRS;

    // 5. Chests & Enemies
    for (let i = 1; i < rooms.length; i++) {
        // Random Chest
        if (Math.random() > 0.5) {
            let cx = rooms[i].x + 1 + Math.floor(Math.random() * (rooms[i].w - 2));
            let cy = rooms[i].y + 1 + Math.floor(Math.random() * (rooms[i].h - 2));
            if (mapTiles[cy][cx] === TILE_FLOOR && mapEntities[cy][cx] === 0) {
                mapTiles[cy][cx] = TILE_CHEST;
            }
        }
        // Random Enemy
        for(let e=0; e<2; e++) {
            if (Math.random() > 0.3) {
                let ex = rooms[i].x + 1 + Math.floor(Math.random() * (rooms[i].w - 2));
                let ey = rooms[i].y + 1 + Math.floor(Math.random() * (rooms[i].h - 2));
                if (mapTiles[ey][ex] === TILE_FLOOR && mapEntities[ey][ex] === 0) {
                    let type = Math.floor(Math.random() * 3) + 1; // 1,2,3
                    mapEntities[ey][ex] = type;
                }
            }
        }
    }

    // 6. Add some doors in corridors (simple heuristic)
    for(let y=1; y<MAP_H-1; y++) {
        for(let x=1; x<MAP_W-1; x++) {
            if (mapTiles[y][x] === TILE_FLOOR) {
                // Vertical corridor
                if (mapTiles[y][x-1] === TILE_WALL && mapTiles[y][x+1] === TILE_WALL && mapTiles[y-1][x] === TILE_FLOOR && mapTiles[y+1][x] === TILE_FLOOR) {
                    if (Math.random() > 0.8) mapTiles[y][x] = TILE_DOOR;
                }
                // Horizontal corridor
                else if (mapTiles[y-1][x] === TILE_WALL && mapTiles[y+1][x] === TILE_WALL && mapTiles[y][x-1] === TILE_FLOOR && mapTiles[y][x+1] === TILE_FLOOR) {
                    if (Math.random() > 0.8) mapTiles[y][x] = TILE_DOOR;
                }
            }
        }
    }

    updateGridVisuals();
});

// File System Saving / Loading (similar to Pacman/Platformer)
async function generateCppCode() {
    let name = document.getElementById('levelCodeName').value.replace(/[^a-zA-Z0-9_]/g, '_').toUpperCase();
    if(name.length === 0) name = "CUSTOM_DUNGEON";

    let code = `// E-OS Dungeon Maker Custom Map: ${name}\n`;
    code += `#include <Arduino.h>\n\n`;
    code += `const uint8_t ${name}_TILES[${MAP_H}][${MAP_W}] PROGMEM = {\n`;
    for (let y = 0; y < MAP_H; y++) {
        let row = mapTiles[y].map(t => t.toString().padStart(2, ' ')).join(', ');
        code += `    { ${row} },\n`;
    }
    code += `};\n\n`;

    code += `const uint8_t ${name}_ENTITIES[${MAP_H}][${MAP_W}] PROGMEM = {\n`;
    for (let y = 0; y < MAP_H; y++) {
        let row = mapEntities[y].map(e => e.toString().padStart(2, ' ')).join(', ');
        code += `    { ${row} },\n`;
    }
    code += `};\n`;
    
    return code;
}

btnSaveAs.addEventListener('click', async () => {
    let codeName = document.getElementById('levelCodeName').value.replace(/[^a-zA-Z0-9_]/g, '_').toUpperCase();
    if(codeName.length === 0) codeName = "CUSTOM_DUNGEON";

    try {
        const handle = await window.showSaveFilePicker({
            suggestedName: `${codeName}.h`,
            types: [{ description: 'C++ Header', accept: {'text/plain': ['.h']} }]
        });
        fileHandle = handle;
        const writable = await fileHandle.createWritable();
        const code = await generateCppCode();
        await writable.write(code);
        await writable.close();
        btnSave.disabled = false;
        currentFilenameDisplay.textContent = fileHandle.name;
        alert("Saved successfully! Remember to save it in dungeon/data/");
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error(err);
        }
    }
});

btnSave.addEventListener('click', async () => {
    if (!fileHandle) return;
    try {
        const writable = await fileHandle.createWritable();
        const code = await generateCppCode();
        await writable.write(code);
        await writable.close();
        alert("Saved successfully!");
    } catch (err) {
        console.error(err);
    }
});

btnLoad.addEventListener('click', async () => {
    try {
        const [handle] = await window.showOpenFilePicker({
            types: [{ description: 'C++ Header', accept: {'text/plain': ['.h']} }]
        });
        const file = await handle.getFile();
        const text = await file.text();
        
        // Very basic parsing for _TILES and _ENTITIES arrays
        const tilesMatch = text.match(/_TILES.*?=\s*\{([\s\S]*?)\};/);
        const entsMatch = text.match(/_ENTITIES.*?=\s*\{([\s\S]*?)\};/);
        
        // Try to extract the Code Name from the array definition
        const nameMatch = text.match(/const\s+uint8_t\s+([a-zA-Z0-9_]+)_TILES/);
        if (nameMatch) {
            document.getElementById('levelCodeName').value = nameMatch[1];
        }
        
        if (tilesMatch && entsMatch) {
            parseArrayStr(tilesMatch[1], mapTiles);
            parseArrayStr(entsMatch[1], mapEntities);
            fileHandle = handle;
            btnSave.disabled = false;
            currentFilenameDisplay.textContent = fileHandle.name;
            updateGridVisuals();
        } else {
            alert("Could not parse file. Make sure it's a Dungeon Maker .h file.");
        }
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error(err);
        }
    }
});

function parseArrayStr(str, targetArray) {
    let clean = str.replace(/\{/g, '').replace(/\}/g, '').split(',').map(s => s.trim()).filter(s => s !== '');
    let i = 0;
    for (let y = 0; y < MAP_H; y++) {
        for (let x = 0; x < MAP_W; x++) {
            if (i < clean.length) {
                targetArray[y][x] = parseInt(clean[i]) || 0;
                i++;
            }
        }
    }
}
// Start
initGrid();

// ==========================================
// SPRITE RENDERING (WYSIWYG CONSOLE STYLE)
// ==========================================
// RGB565 to Hex converter helper
function rgb565toHex(rgb565) {
    let r = (rgb565 >> 11) & 0x1F;
    let g = (rgb565 >> 5) & 0x3F;
    let b = rgb565 & 0x1F;
    r = Math.round((r * 255) / 31);
    g = Math.round((g * 255) / 63);
    b = Math.round((b * 255) / 31);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Colors from C++ Config.h
const C = {
    Wall: rgb565toHex(0x3186),
    WallHL: rgb565toHex(0x4A49),
    BatBody: rgb565toHex(0x8284),
    BatDark: rgb565toHex(0x4104),
    BatEye: '#ff0000',
    GoblinBody: rgb565toHex(0x1384),
    GoblinDark: rgb565toHex(0x0182),
    GoblinEye: '#ffaa00',
    SkeletonBody: '#ffffff',
    SkeletonDark: rgb565toHex(0x3186),
    SkeletonEye: '#000000',
    DragonBody: rgb565toHex(0x05E0),
    LichBody: rgb565toHex(0xA11F),
    GolemBody: rgb565toHex(0xA514),
    BossDark: '#000000',
    BossEye: '#ff0000',
    PlayerBody: rgb565toHex(0xFFFF),
    PlayerDark: rgb565toHex(0x6B4D)
};

// Character maps (from Renderer.h)
const CHARMAPS = {
    BAT: [
        "........",
        ".D....D.",
        "DDD..DDD",
        ".DDEEDD.",
        "..DDDD..",
        "...DD..."
    ],
    GOBLIN: [
        ".B....B.",
        "KBBBBBBK",
        "KBEBBEBK",
        "KBBBBBBK",
        ".KBDDBK.",
        ".KBBBBK."
    ],
    SKELETON: [
        ".BBBBBB.",
        ".BKBBKB.",
        "..BBBB..",
        "...BB...",
        ".BBBBBB.",
        ".BDBBDB."
    ],
    DRAGON: [
        "....W......W....",
        "....B......B....",
        "....BB....BB....",
        ".....BBBBBB.....",
        ".....BEBBEB.....",
        ".....BBBBBB.....",
        "W.....BDDB.....W",
        "BB....BBBB....BB",
        "BBB..BBBBBB..BBB",
        "BBBB.BBDDBB.BBBB"
    ],
    LICH: [
        ".............P..",
        "....BBBB.....C..",
        "...BBBBBBBB..C..",
        "...BSSSSSSB..C..",
        "...BSGSSGSB..C..",
        "....BSSSSB...C..",
        "...BBBBBBBB..C..",
        "..BBBBBBBBBB.C..",
        "..BDBBBBBBDBWC..",
        "..BDBBBBBBDB.C.."
    ],
    GOLEM: [
        "....KKKKKKK.....",
        "...KBDBBBDBK....",
        "...KBOOBOOBK....",
        "...KBBBBBBBK....",
        "..KKBBBBBBBKK...",
        ".KBBBBBBBBBBBK..",
        ".KBDBBBDBBBDBK..",
        ".KBBKBBBBBKBBK..",
        ".KBDKBBDBBKBDK..",
        ".KBBKBBBBBKBBK.."
    ],
    PLAYER: [
        "........",
        ".WWWWWW.",
        ".W.WW.W.",
        "WWWWWWWW",
        "...DD...",
        "..DDDD..",
        ".D.DD.D.",
        "S......S"
    ],
    CHEST: [
        "........",
        "........",
        ".CCCCCC.",
        ".BBBBBB.",
        ".CCCKCC.",
        ".CCCCCC.",
        ".CCCCCC.",
        "........"
    ]
};

function generateSpriteDataURL(charmap, colBody, colDark, colEye) {
    const canvas = document.createElement('canvas');
    const rows = charmap.length;
    const cols = charmap[0].length;
    // Scale up for visibility in editor
    const scale = cols > 8 ? 2 : 4; 
    canvas.width = cols * scale;
    canvas.height = rows * scale;
    const ctx = canvas.getContext('2d');
    
    // Draw pixel by pixel
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const ch = charmap[y][x];
            let color = null;
            if (ch === 'B' || ch === 'W') color = colBody;
            if (ch === 'D' || ch === 'K') color = colDark;
            if (ch === 'E' || ch === 'O') color = colEye;
            if (ch === 'S') color = '#aaa'; // Sword
            if (ch === 'P' || ch === 'C') color = '#f0f'; // Purple staff

            // Special chest colors
            if (charmap === CHARMAPS.CHEST) {
                if (ch === 'C') color = rgb565toHex(0xFC00); // Chest body
                if (ch === 'B') color = '#000000'; // Chest line
                if (ch === 'K') color = rgb565toHex(0xFFE0); // Chest lock
            }

            if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(x * scale, y * scale, scale, scale);
            }
        }
    }
    return canvas.toDataURL();
}

// Generate all sprites
const sprites = {
    bat: generateSpriteDataURL(CHARMAPS.BAT, C.BatBody, C.BatDark, C.BatEye),
    goblin: generateSpriteDataURL(CHARMAPS.GOBLIN, C.GoblinBody, C.GoblinDark, C.GoblinEye),
    skeleton: generateSpriteDataURL(CHARMAPS.SKELETON, C.SkeletonBody, C.SkeletonDark, C.SkeletonEye),
    dragon: generateSpriteDataURL(CHARMAPS.DRAGON, C.DragonBody, C.BossDark, C.BossEye),
    lich: generateSpriteDataURL(CHARMAPS.LICH, C.LichBody, C.BossDark, C.BossEye),
    golem: generateSpriteDataURL(CHARMAPS.GOLEM, C.GolemBody, C.BossDark, C.BossEye),
    player: generateSpriteDataURL(CHARMAPS.PLAYER, C.PlayerBody, C.PlayerDark, '#fff'),
    chest: generateSpriteDataURL(CHARMAPS.CHEST, null, null, null)
};

// Inject CSS variables for the generated sprites and colors
document.documentElement.style.setProperty('--spr-bat', `url(${sprites.bat})`);
document.documentElement.style.setProperty('--spr-goblin', `url(${sprites.goblin})`);
document.documentElement.style.setProperty('--spr-skeleton', `url(${sprites.skeleton})`);
document.documentElement.style.setProperty('--spr-dragon', `url(${sprites.dragon})`);
document.documentElement.style.setProperty('--spr-lich', `url(${sprites.lich})`);
document.documentElement.style.setProperty('--spr-golem', `url(${sprites.golem})`);
document.documentElement.style.setProperty('--spr-player', `url(${sprites.player})`);
document.documentElement.style.setProperty('--spr-chest', `url(${sprites.chest})`);
document.documentElement.style.setProperty('--col-wall', C.Wall);
document.documentElement.style.setProperty('--col-wall-hl', C.WallHL);

// ==========================================
// GRID CONSTANTS
// ==========================================
const btnCampaignMgr = document.getElementById('btn-campaign-mgr');
const campaignModal = document.getElementById('campaign-modal');
const btnCloseCampaign = document.getElementById('btn-close-campaign');
const btnAddFloor = document.getElementById('btn-add-floor');
const campaignList = document.getElementById('campaign-list');
const btnExportCampaign = document.getElementById('btn-export-campaign');

let campaignFloors = [
    { floor: 1, name: 'LEVEL_1' },
    { floor: 2, name: 'LEVEL_2' },
    { floor: 3, name: 'LEVEL_BOSS' }
];

btnCampaignMgr.addEventListener('click', () => {
    campaignModal.style.display = 'flex';
    renderCampaignList();
});

btnCloseCampaign.addEventListener('click', () => {
    campaignModal.style.display = 'none';
});

function renderCampaignList() {
    campaignList.innerHTML = '';
    campaignFloors.forEach((item, index) => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.gap = '8px';
        row.style.alignItems = 'center';

        row.innerHTML = `
            <span style="width:60px; color:var(--text);">Floor ${item.floor}</span>
            <input type="text" value="${item.name}" class="campaign-input" data-idx="${index}" style="flex:1; padding:4px 8px; border-radius:4px; border:1px solid var(--border); background:rgba(0,0,0,0.5); color:#fff; text-transform:uppercase;">
            <button class="btn-del-floor" data-idx="${index}" style="background:transparent; border:none; color:#ff4444; cursor:pointer;">❌</button>
        `;
        campaignList.appendChild(row);
    });

    document.querySelectorAll('.campaign-input').forEach(inp => {
        inp.addEventListener('change', (e) => {
            const idx = parseInt(e.target.dataset.idx);
            campaignFloors[idx].name = e.target.value.replace(/[^a-zA-Z0-9_]/g, '_').toUpperCase();
            e.target.value = campaignFloors[idx].name;
        });
    });

    document.querySelectorAll('.btn-del-floor').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.dataset.idx);
            campaignFloors.splice(idx, 1);
            // Re-assign floors
            campaignFloors.forEach((c, i) => c.floor = i + 1);
            renderCampaignList();
        });
    });
}

btnAddFloor.addEventListener('click', () => {
    const nextFloor = campaignFloors.length + 1;
    campaignFloors.push({ floor: nextFloor, name: `LEVEL_${nextFloor}` });
    renderCampaignList();
});

btnExportCampaign.addEventListener('click', async () => {
    let code = `// E-OS Dungeon Maker - Campaign Orchestrator\n`;
    code += `#pragma once\n`;
    code += `#include <Arduino.h>\n\n`;
    code += `// Generated Includes\n`;
    
    // Use a Set to avoid including the same file twice if a level is reused
    const uniqueNames = [...new Set(campaignFloors.map(c => c.name))];
    uniqueNames.forEach(name => {
        code += `#include "${name}.h"\n`;
    });

    code += `\n// Tiles Dispatcher\n`;
    code += `inline const uint8_t (*getCustomTiles(int floor))[32] {\n`;
    code += `    switch (floor) {\n`;
    campaignFloors.forEach(c => {
        code += `        case ${c.floor}: return ${c.name}_TILES;\n`;
    });
    code += `        default: return nullptr;\n`;
    code += `    }\n}\n\n`;

    code += `// Entities Dispatcher\n`;
    code += `inline const uint8_t (*getCustomEntities(int floor))[32] {\n`;
    code += `    switch (floor) {\n`;
    campaignFloors.forEach(c => {
        code += `        case ${c.floor}: return ${c.name}_ENTITIES;\n`;
    });
    code += `        default: return nullptr;\n`;
    code += `    }\n}\n`;

    try {
        const handle = await window.showSaveFilePicker({
            suggestedName: 'Campaign.h',
            types: [{ description: 'C++ Header', accept: {'text/plain': ['.h']} }]
        });
        const writable = await handle.createWritable();
        await writable.write(code);
        await writable.close();
        
        alert("Campaign exported! Save it inside dungeon/data/ alongside your level files.");
        campaignModal.style.display = 'none';
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error("Export cancelled or failed:", err);
        }
    }
});
