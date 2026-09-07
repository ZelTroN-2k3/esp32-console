const MAP_W = 20;
const MAP_H = 14;

let grid = [];
let currentToolType = 'tile';
let currentToolVal = 0;
let isDrawing = false;

// DOM Elements
const gridContainer = document.getElementById('grid-container');
const coordsDisplay = document.getElementById('coordsDisplay');
const btnClear = document.getElementById('btn-clear');
const btnSaveAs = document.getElementById('btn-save-as');
const btnLoad = document.getElementById('btn-load');
const levelNameInput = document.getElementById('level-name');
const currentFilename = document.getElementById('current-filename');
const biomeSelect = document.getElementById('biome-select');
const zoomSlider = document.getElementById('zoom-slider');
const zoomVal = document.getElementById('zoom-val');

zoomSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    const zoomMultiplier = val / 8;
    zoomVal.innerText = `x${zoomMultiplier}`;
    document.documentElement.style.setProperty('--cell-size', `${val}px`);
});

const BIOME_COLORS = {
    forest: {
        grass: '#4caf50', grassAlt: '#388e3c', dec: '#1b5e20', lt: '#aed581', flower: '#ffffff',
        path: '#d7ccc8', pathAlt: '#bcaaa4', pathEdge: '#8d6e63', pathDot: '#ffcc80',
        rock: '#78909c', rockSh: '#455a64', rockHl: '#b0bec5',
        shadow: 'rgba(0,0,0,0.5)', cave: '#424242', caveIn: '#000000',
        castle: '#8d6e63', castleLt: '#d7ccc8', castleDk: '#4e342e', flag: '#f44336'
    },
    frozen: {
        grass: '#b3e5fc', grassAlt: '#81d4fa', dec: '#0277bd', lt: '#ffffff', flower: '#e1f5fe',
        path: '#b2ebf2', pathAlt: '#80deea', pathEdge: '#4dd0e1', pathDot: '#ffffff',
        rock: '#00bcd4', rockSh: '#00838f', rockHl: '#84ffff',
        shadow: 'rgba(0,0,0,0.3)', cave: '#424242', caveIn: '#000000',
        castle: '#90a4ae', castleLt: '#cfd8dc', castleDk: '#546e7a', flag: '#f44336'
    },
    inferno: {
        grass: '#4e342e', grassAlt: '#3e2723', dec: '#212121', lt: '#5d4037', flower: '#ff9800',
        path: '#ff5722', pathAlt: '#e64a19', pathEdge: '#bf360c', pathDot: '#ffeb3b',
        rock: '#212121', rockSh: '#000000', rockHl: '#757575',
        shadow: 'rgba(0,0,0,0.7)', cave: '#212121', caveIn: '#000000',
        castle: '#424242', castleLt: '#757575', castleDk: '#000000', flag: '#f44336'
    }
};

const offCanvas = document.createElement('canvas');
offCanvas.width = 8;
offCanvas.height = 8;
const ctx = offCanvas.getContext('2d');

biomeSelect.addEventListener('change', () => {
    for (let y = 0; y < MAP_H; y++) {
        for (let x = 0; x < MAP_W; x++) {
            updateCellImage(getCell(x, y), x, y, grid[y][x]);
        }
    }
});

function isPathLike(t) { return t === 1 || t === 4 || t === 3; }

function updateCellImage(cell, x, y, type) {
    if (!cell) return;
    const theme = BIOME_COLORS[biomeSelect.value];
    ctx.clearRect(0, 0, 8, 8);
    
    const drawGrass = () => {
        ctx.fillStyle = ((x + y) % 2 !== 0) ? theme.grassAlt : theme.grass;
        ctx.fillRect(0, 0, 8, 8);
        let h = (x * 31 + y * 17) & 31;
        if (h === 0) {
            ctx.fillStyle = theme.dec; ctx.fillRect(2, 5, 1, 1); ctx.fillRect(4, 5, 1, 1);
            ctx.fillStyle = theme.lt; ctx.fillRect(3, 4, 1, 1);
        } else if (h === 11) {
            ctx.fillStyle = theme.dec; ctx.fillRect(5, 2, 1, 2);
        } else if (h === 22) {
            ctx.fillStyle = theme.flower; ctx.fillRect(3, 3, 1, 1);
            ctx.fillStyle = theme.dec; ctx.fillRect(3, 4, 1, 1);
        }
    };
    
    const drawPath = () => {
        ctx.fillStyle = ((x + y) % 2 !== 0) ? theme.pathAlt : theme.path;
        ctx.fillRect(0, 0, 8, 8);
        
        ctx.fillStyle = theme.pathEdge;
        if (y > 0 && !isPathLike(grid[y - 1][x])) ctx.fillRect(0, 0, 8, 1);
        if (y < MAP_H - 1 && !isPathLike(grid[y + 1][x])) ctx.fillRect(0, 7, 8, 1);
        if (x > 0 && !isPathLike(grid[y][x - 1])) ctx.fillRect(0, 0, 1, 8);
        if (x < MAP_W - 1 && !isPathLike(grid[y][x + 1])) ctx.fillRect(7, 0, 1, 8);

        let d = (x * 11 + y * 23) & 15;
        ctx.fillStyle = theme.pathDot;
        if (d === 0) { ctx.fillRect(2, 3, 1, 1); }
        else if (d === 7) { ctx.fillRect(5, 5, 1, 1); ctx.fillRect(6, 4, 1, 1); }
    };

    if (type === 0) { drawGrass(); }
    else if (type === 1) { drawPath(); }
    else if (type === 5) {
        drawGrass();
        ctx.fillStyle = theme.shadow; ctx.fillRect(3, 6, 4, 1);
        ctx.fillStyle = theme.rockSh; ctx.fillRect(1, 2, 6, 5);
        ctx.fillStyle = theme.rock;   ctx.fillRect(1, 2, 5, 4);
        ctx.fillStyle = theme.rockHl; ctx.fillRect(2, 2, 3, 1); ctx.fillRect(2, 3, 1, 1);
    }
    else if (type === 4) { // Spawn
        drawPath();
        ctx.fillStyle = theme.cave;   ctx.fillRect(0, 0, 7, 8);
        ctx.fillStyle = theme.caveIn; ctx.fillRect(1, 2, 5, 6);
        ctx.fillStyle = theme.rockHl; ctx.fillRect(0, 0, 6, 1); ctx.fillRect(6, 1, 1, 1);
    }
    else if (type === 3) { // Base
        drawPath();
        ctx.fillStyle = theme.castle; ctx.fillRect(0, 2, 8, 6);
        ctx.fillStyle = theme.castleLt; ctx.fillRect(0, 2, 1, 6);
        ctx.fillStyle = theme.castleDk; ctx.fillRect(7, 2, 1, 6);
        ctx.clearRect(1, 2, 1, 1); ctx.clearRect(4, 2, 1, 1); // Battlements
        ctx.fillStyle = theme.caveIn; ctx.fillRect(3, 5, 2, 3); // Door
        // Flag
        ctx.fillStyle = theme.castleLt; ctx.fillRect(4, 0, 1, 2);
        ctx.fillStyle = theme.flag; ctx.fillRect(5, 0, 3, 1);
    }

    cell.style.backgroundImage = `url(${offCanvas.toDataURL()})`;
    cell.style.backgroundSize = '100%';
    cell.style.backgroundRepeat = 'no-repeat';
    cell.style.imageRendering = 'pixelated';
}

// Initialize Grid
function initGrid() {
    gridContainer.innerHTML = '';
    grid = [];
    for (let y = 0; y < MAP_H; y++) {
        let row = [];
        for (let x = 0; x < MAP_W; x++) {
            row.push(0); // 0 = Grass
            const cell = document.createElement('div');
            cell.className = 'cell tile-0';
            cell.dataset.x = x;
            cell.dataset.y = y;
            
            // Mouse Events
            cell.addEventListener('mousedown', (e) => {
                isDrawing = true;
                applyTool(x, y);
            });
            cell.addEventListener('mouseenter', (e) => {
                coordsDisplay.innerText = `X:${x} Y:${y}`;
                if (isDrawing) applyTool(x, y);
            });
            
            gridContainer.appendChild(cell);
            updateCellImage(cell, x, y, 0);
        }
        grid.push(row);
    }
}

document.body.addEventListener('mouseup', () => isDrawing = false);

// Apply Tool
function applyTool(x, y) {
    if (currentToolType === 'tile') {
        grid[y][x] = currentToolVal;
        const cell = getCell(x, y);
        cell.className = `cell tile-${currentToolVal}`;
        updateCellImage(cell, x, y, currentToolVal);
        
        // Redraw neighbors so Path edges update dynamically
        if (y > 0) updateCellImage(getCell(x, y - 1), x, y - 1, grid[y - 1][x]);
        if (y < MAP_H - 1) updateCellImage(getCell(x, y + 1), x, y + 1, grid[y + 1][x]);
        if (x > 0) updateCellImage(getCell(x - 1, y), x - 1, y, grid[y][x - 1]);
        if (x < MAP_W - 1) updateCellImage(getCell(x + 1, y), x + 1, y, grid[y][x + 1]);
    }
}

function getCell(x, y) {
    return gridContainer.children[y * MAP_W + x];
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
        const isOpening = !this.classList.contains('active');
        if (isOpening) {
            document.querySelectorAll('.accordion').forEach(other => {
                other.classList.remove('active');
                other.nextElementSibling.style.display = 'none';
            });
            this.classList.add('active');
            this.nextElementSibling.style.display = 'flex';
        } else {
            this.classList.remove('active');
            this.nextElementSibling.style.display = 'none';
        }
    });
});

btnClear.addEventListener('click', () => {
    if (confirm("Clear map?")) {
        initGrid();
    }
});

// PATHFINDING & WAYPOINTS
function calculateWaypoints() {
    let spawn = null;
    let base = null;
    let spawnCount = 0;
    let baseCount = 0;

    // 1. Find Spawn and Base
    for (let y = 0; y < MAP_H; y++) {
        for (let x = 0; x < MAP_W; x++) {
            if (grid[y][x] === 4) { spawn = {x, y}; spawnCount++; }
            if (grid[y][x] === 3) { base = {x, y}; baseCount++; }
        }
    }

    if (spawnCount !== 1) throw new Error(`You must place EXACTLY ONE Spawn (Skull) tile. Found: ${spawnCount}`);
    if (baseCount !== 1) throw new Error(`You must place EXACTLY ONE Base (Castle) tile. Found: ${baseCount}`);

    let waypoints = [spawn];
    let curr = spawn;
    let prev = null;
    let currDir = null; // {dx, dy}

    while (curr.x !== base.x || curr.y !== base.y) {
        // Find valid neighbor
        const neighbors = [
            {x: curr.x, y: curr.y - 1}, // Up
            {x: curr.x, y: curr.y + 1}, // Down
            {x: curr.x - 1, y: curr.y}, // Left
            {x: curr.x + 1, y: curr.y}  // Right
        ];

        let validNeighbors = neighbors.filter(n => {
            if (n.x < 0 || n.x >= MAP_W || n.y < 0 || n.y >= MAP_H) return false;
            if (prev && n.x === prev.x && n.y === prev.y) return false; // Don't go back
            const t = grid[n.y][n.x];
            return t === 1 || t === 3; // Must be Path or Base
        });

        if (validNeighbors.length === 0) {
            throw new Error(`The path is broken! It must connect the Spawn to the Base continuously.`);
        }
        if (validNeighbors.length > 1) {
            throw new Error(`The path forks at X:${curr.x} Y:${curr.y}. Tower Defense requires a single continuous path without forks.`);
        }

        const next = validNeighbors[0];
        const dir = { dx: next.x - curr.x, dy: next.y - curr.y };

        if (currDir !== null) {
            if (dir.dx !== currDir.dx || dir.dy !== currDir.dy) {
                // Direction changed! This is a corner (waypoint).
                waypoints.push(curr);
            }
        }

        currDir = dir;
        prev = curr;
        curr = next;
    }

    // Push the final Base coordinate
    waypoints.push(base);

    if (waypoints.length > 8) {
        throw new Error(`Too many corners! The game engine supports a maximum of 8 waypoints. Your path has ${waypoints.length}.`);
    }

    // The game requires the array to be exactly 8 long. If shorter, duplicate the last waypoint.
    const exportWaypoints = [...waypoints];
    while (exportWaypoints.length < 8) {
        exportWaypoints.push(base);
    }

    return { waypoints, exportWaypoints, count: waypoints.length };
}


// EXPORT LOGIC
btnSaveAs.addEventListener('click', async () => {
    try {
        const wpData = calculateWaypoints();
        let name = levelNameInput.value.replace(/[^a-zA-Z0-9_]/g, '_').toUpperCase() || 'CUSTOM_LEVEL';
        
        let code = `// E-OS Tower Defense - Custom Map\n`;
        code += `#pragma once\n\n`;
        code += `#include <Arduino.h>\n\n`;

        // MAP ARRAY
        code += `constexpr uint8_t ${name}_MAP[14][20] = {\n`;
        for (let y = 0; y < MAP_H; y++) {
            code += `    {` + grid[y].join(', ') + `}` + (y < MAP_H - 1 ? ',' : '') + `\n`;
        }
        code += `};\n\n`;

        // WAYPOINTS
        code += `constexpr int8_t ${name}_WPS[8][2] = {\n`;
        const wpStrings = wpData.exportWaypoints.map(w => `{${w.x}, ${w.y}}`);
        code += `    ` + wpStrings.join(', ') + `\n`;
        code += `};\n\n`;

        code += `constexpr int ${name}_WP_COUNT = ${wpData.count};\n`;

        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: 'CustomMap.h',
                types: [{ description: 'C++ Header', accept: {'text/plain': ['.h']} }]
            });
            const writable = await handle.createWritable();
            await writable.write(code);
            await writable.close();
            
            currentFilename.innerText = handle.name;
            alert(`Map successfully exported!`);
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error(err);
                alert("Error saving file. Check console.");
            }
        }

    } catch (e) {
        alert("Pathfinding Error:\n" + e.message);
    }
});

// LOAD LOGIC
btnLoad.addEventListener('click', async () => {
    try {
        const [fileHandle] = await window.showOpenFilePicker({
            types: [{ description: 'C++ Header', accept: {'text/plain': ['.h']} }]
        });
        const file = await fileHandle.getFile();
        const text = await file.text();
        
        const rowRegex = /\{\s*([0-9\s,]+)\s*\}/g;
        let match;
        let newGrid = [];
        while ((match = rowRegex.exec(text)) !== null) {
            const rowStr = match[1];
            const nums = rowStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            if (nums.length === MAP_W) {
                newGrid.push(nums);
            }
        }
        
        if (newGrid.length >= MAP_H) {
            // First, update the internal grid state completely
            for (let y = 0; y < MAP_H; y++) {
                for (let x = 0; x < MAP_W; x++) {
                    grid[y][x] = newGrid[y][x];
                }
            }
            // Then, redraw all cells so neighbor checks work correctly
            for (let y = 0; y < MAP_H; y++) {
                for (let x = 0; x < MAP_W; x++) {
                    const cell = getCell(x, y);
                    cell.className = `cell tile-${grid[y][x]}`;
                    updateCellImage(cell, x, y, grid[y][x]);
                }
            }
            console.log('Map loaded successfully!');
            const nameMatch = text.match(/constexpr uint8_t ([A-Z0-9_]+)_MAP/);
            if (nameMatch) {
                levelNameInput.value = nameMatch[1];
            }
            currentFilename.innerText = file.name;
        } else {
            alert("Could not parse a valid 20x14 map from this file.");
        }
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error(err);
            alert("Error loading file.");
        }
    }
});

// START
initGrid();
