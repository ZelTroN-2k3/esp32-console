// --- Constants & Config ---
const GRID_SIZE = 32;

const TILES = [
    { id: 1, name: "Wall 1", color: "#555", img: "duvar1.bmp" },
    { id: 2, name: "Wall 2", color: "#666", img: "duvar2.bmp" },
    { id: 3, name: "Wall 3", color: "#777", img: "duvar3.bmp" },
    { id: 6, name: "Door", color: "#8b4513", img: "kapi.bmp" },
    { id: 7, name: "Locked Door", color: "#d2691e", img: "kilitli.bmp" },
    { id: 8, name: "Exit", color: "#00ff00", img: "cikis.bmp" },
    { id: 9, name: "Elevator", color: "#4682b4", img: "s_on.bmp" },
    { id: 31, name: "Secret", color: "#444", img: "duvar1.bmp" }
];

const SPRITES = [
    { id: 5, name: "Zombie", color: "#8b4513", img: "z_dur.bmp", short: "Z" },
    { id: 9, name: "Ammo", color: "#ffff00", img: "mermi.bmp", short: "Am" },
    { id: 10, name: "Health", color: "#ff0000", img: "can.bmp", short: "+" },
    { id: 11, name: "Key", color: "#ffd700", img: "anahtar.bmp", short: "K" },
    { id: 14, name: "Baron", color: "#ff4500", img: "b_dur.bmp", short: "B" },
    { id: 15, name: "Barrel", color: "#228b22", img: "v_dur.bmp", short: "Ba" },
    { id: 17, name: "Pinky", color: "#ff69b4", img: "p_dur.bmp", short: "P" },
    { id: 43, name: "Armor", color: "#00ff00", img: "armor.bmp", short: "Ar" },
    { id: 50, name: "Lamp", color: "#ffff00", img: "lamba.bmp", short: "L" },
    { id: 51, name: "Pillar", color: "#a9a9a9", img: "sutun.bmp", short: "Pi" },
    { id: 52, name: "Corpse", color: "#8b0000", img: "z_ceset.bmp", short: "C" },
    { id: 53, name: "Candelabra", color: "#daa520", img: "samdan.bmp", short: "Ca" },
    { id: 54, name: "Skulls", color: "#d3d3d3", img: "kafatasi.bmp", short: "S" }
];

// --- Application State ---
let mapData = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
let spriteData = []; // Array of { x, y, type }
let playerStart = { x: 4.5, y: 28.5, dir: 'N' };

let currentAction = { type: 'tile', id: 1 }; // type: 'tile', 'sprite', 'player', 'erase'
let isDragging = false;

// History for Undo/Redo
let historyStack = [];
let historyIndex = -1;

// Tracking last used tools
let lastUsedTile = 1;
let lastUsedSprite = 5;

// --- DOM Elements ---
const gridContainer = document.getElementById('grid-container');
const tilePalette = document.getElementById('tile-palette');
const spritePalette = document.getElementById('sprite-palette');
const actionPalette = document.getElementById('action-palette');

const exportBtn = document.getElementById('btn-export');
const exportModal = document.getElementById('export-modal');
const closeExportModalBtn = document.getElementById('btn-close-export');
const copyBtn = document.getElementById('btn-copy');
const exportTextarea = document.getElementById('export-textarea');

const importBtn = document.getElementById('btn-import');
const importModal = document.getElementById('import-modal');
const closeImportModalBtn = document.getElementById('btn-close-import');
const doImportBtn = document.getElementById('btn-do-import');
const importTextarea = document.getElementById('import-textarea');

// --- Initialization ---
function init() {
    buildPalettes();
    buildGrid();
    setupEventListeners();
    updateZoomDisplay();
    updatePaletteSelection();
    updateLinks();
    
    // Initial history state
    pushState();
    
    // Initial minimap draw
    requestAnimationFrame(drawMinimap);
}

function buildPalettes() {
    // Tiles
    TILES.forEach(t => {
        const div = document.createElement('div');
        div.className = 'palette-item';
        div.dataset.type = 'tile';
        div.dataset.id = t.id;
        div.title = t.name;
        div.innerHTML = `<div class="preview" style="background-color: ${t.color}"></div><span class="label">${t.name}</span>`;
        div.addEventListener('click', () => selectAction('tile', t.id));
        tilePalette.appendChild(div);
    });

    // Sprites
    SPRITES.forEach(s => {
        const div = document.createElement('div');
        div.className = 'palette-item';
        div.dataset.type = 'sprite';
        div.dataset.id = s.id;
        div.title = s.name;
        div.innerHTML = `<div class="preview sprite-preview" style="background-color: ${s.color}">${s.short}</div><span class="label">${s.name}</span>`;
        div.addEventListener('click', () => selectAction('sprite', s.id));
        spritePalette.appendChild(div);
    });

    // Actions
    Array.from(actionPalette.children).forEach(child => {
        child.addEventListener('click', () => {
            selectAction(child.dataset.action, null);
        });
    });
}

function buildGrid() {
    gridContainer.innerHTML = '';
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            
            cell.addEventListener('mousedown', (e) => {
                if (e.button === 0) { // Left click only for drawing
                    isDragging = true;
                    handleCellInteraction(x, y);
                }
            });
            cell.addEventListener('mouseenter', (e) => {
                if (isDragging) handleCellInteraction(x, y);
                const coordsEl = document.getElementById('footer-coords');
                if (coordsEl) coordsEl.innerText = `X: ${x} : Y: ${y}`;
            });
            
            gridContainer.appendChild(cell);
            updateCellVisuals(x, y);
        }
    }
    
    // Re-create SVG Overlay for drawing lines
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'link-svg';
    svg.setAttribute('style', 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 50;');
    gridContainer.appendChild(svg);
}

function setupEventListeners() {
    // Events
    document.addEventListener('mouseup', (e) => {
        if (e.button === 0) { // Left click
            if (isDragging) {
                isDragging = false;
                pushState();
            }
        } else if (e.button === 2) { // Right click
            if (isPanning) {
                isPanning = false;
                document.querySelector('.editor-area').style.cursor = '';
            }
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey) {
            if (e.key.toLowerCase() === 'z') {
                if (e.shiftKey) redo();
                else undo();
                e.preventDefault();
            } else if (e.key.toLowerCase() === 'y') {
                redo();
                e.preventDefault();
            } else if (e.key.toLowerCase() === 's') {
                document.getElementById('btn-save').click();
                e.preventDefault();
            } else if (e.key.toLowerCase() === 'o') {
                document.getElementById('btn-load').click();
                e.preventDefault();
            }
            return;
        }
        
        // Single key shortcuts
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            switch(e.key.toLowerCase()) {
                case 'e': selectAction('erase', null); break;
                case 'p': selectAction('player', null); break;
                case 't': selectAction('tile', lastUsedTile); break;
                case 's': selectAction('sprite', lastUsedSprite); break;
            }
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isPanning) {
            const editorArea = document.querySelector('.editor-area');
            const dx = e.clientX - panStartX;
            const dy = e.clientY - panStartY;
            editorArea.scrollLeft = scrollStartX - dx;
            editorArea.scrollTop = scrollStartY - dy;
            drawMinimap();
        }
    });
    
    const editorArea = document.querySelector('.editor-area');
    
    editorArea.addEventListener('contextmenu', e => e.preventDefault());
    
    editorArea.addEventListener('mousedown', (e) => {
        if (e.button === 2) { // Right click
            isPanning = true;
            panStartX = e.clientX;
            panStartY = e.clientY;
            scrollStartX = editorArea.scrollLeft;
            scrollStartY = editorArea.scrollTop;
            editorArea.style.cursor = 'grabbing';
            e.preventDefault();
        }
    });
    
    gridContainer.addEventListener('mouseleave', () => {
        const coordsEl = document.getElementById('footer-coords');
        if (coordsEl) coordsEl.innerText = `X: -- : Y: --`;
    });
    
    // Zoom Event
    gridContainer.addEventListener('wheel', (e) => {
        // Only zoom if hovering the grid
        e.preventDefault();
        if (e.deltaY < 0) { // Zoom in
            currentZoomLevel = Math.min(10, currentZoomLevel + 1);
        } else { // Zoom out
            currentZoomLevel = Math.max(1, currentZoomLevel - 1);
        }
        updateZoomDisplay();
    });
    
    document.getElementById('btn-check-map').addEventListener('click', onCheckMap);
    
    editorArea.addEventListener('scroll', drawMinimap);
    
    // Minimap navigation
    const minimap = document.getElementById('minimap');
    if (minimap) {
        minimap.addEventListener('mousedown', (e) => {
            const rect = minimap.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            const gridContainer = document.getElementById('grid-container');
            const gridRect = gridContainer.getBoundingClientRect();
            
            // scale back to grid px
            const targetX = (clickX / 256) * gridRect.width;
            const targetY = (clickY / 256) * gridRect.height;
            
            const area = document.querySelector('.editor-area');
            area.scrollLeft = targetX - (area.clientWidth / 2);
            area.scrollTop = targetY - (area.clientHeight / 2);
            drawMinimap();
        });
    }
    
    // File API Events
    document.getElementById('btn-new').addEventListener('click', onNewLevel);
    document.getElementById('btn-load').addEventListener('click', onLoadLevel);
    document.getElementById('btn-save').addEventListener('click', onSaveLevel);
    document.getElementById('btn-save-as').addEventListener('click', onSaveAsLevel);
}

// --- File System Access API ---
let currentFileHandle = null;
let currentFileName = "NEW-LEVEL.h";
let currentZoomLevel = 2; // Level 2 is 20px

// --- Panning State ---
let isPanning = false;
let panStartX = 0;
let panStartY = 0;
let scrollStartX = 0;
let scrollStartY = 0;

// --- Map Validation ---
function onCheckMap() {
    const startX = Math.floor(playerStart.x);
    const startY = Math.floor(playerStart.y);
    
    if (startX < 0 || startX >= GRID_SIZE || startY < 0 || startY >= GRID_SIZE) {
        alert("ERROR: Player is out of bounds!");
        return;
    }
    
    const visited = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false));
    const queue = [[startX, startY]];
    visited[startY][startX] = true;
    
    let isLeaking = false;
    let leakPoints = [];
    
    while(queue.length > 0) {
        const [x, y] = queue.shift();
        
        // If an empty space touches the outer border, it's a leak
        if (x === 0 || x === GRID_SIZE - 1 || y === 0 || y === GRID_SIZE - 1) {
            isLeaking = true;
            leakPoints.push({x, y});
        }
        
        // 8-way flood fill to be safe against diagonal squeezing
        const neighbors = [
            [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1],
            [x + 1, y + 1], [x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1]
        ];
        
        for (let [nx, ny] of neighbors) {
            if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
                const tile = mapData[ny][nx];
                // 0=Empty, 6=Door, 7=Locked, 8=Exit, 9=Elev, 31=Secret
                const isPassable = (tile === 0 || tile === 6 || tile === 7 || tile === 8 || tile === 9 || tile === 31);
                
                if (!visited[ny][nx] && isPassable) {
                    visited[ny][nx] = true;
                    queue.push([nx, ny]);
                }
            }
        }
    }
    
    // Clear previous leak visual warnings
    document.querySelectorAll('.cell.leak-warning').forEach(c => c.classList.remove('leak-warning'));
    
    if (isLeaking) {
        leakPoints.forEach(p => {
            const index = p.y * GRID_SIZE + p.x;
            const cell = gridContainer.children[index];
            if (cell) cell.classList.add('leak-warning');
        });
        alert(`WARNING: Map has ${leakPoints.length} leak(s)! The player can walk out of bounds. The leak points on the edge are highlighted in red.`);
    } else {
        alert("SUCCESS: The map is perfectly enclosed!");
    }
}

// --- Mini Map ---
function drawMinimap() {
    const canvas = document.getElementById('minimap');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 256, 256);
    
    // Draw cells
    const cellSize = 256 / GRID_SIZE;
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (mapData[y][x] > 0) {
                ctx.fillStyle = getTileColor(mapData[y][x]);
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
    
    // Draw player
    ctx.fillStyle = '#00ffff';
    ctx.beginPath();
    ctx.arc(playerStart.x * cellSize, playerStart.y * cellSize, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw viewport box
    const editorArea = document.querySelector('.editor-area');
    const gridContainer = document.getElementById('grid-container');
    const gridRect = gridContainer.getBoundingClientRect();
    const areaRect = editorArea.getBoundingClientRect();
    
    let visX = areaRect.left - gridRect.left;
    let visY = areaRect.top - gridRect.top;
    let visW = areaRect.width;
    let visH = areaRect.height;
    
    const rectScale = 256 / gridRect.width;
    
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.strokeRect(visX * rectScale, visY * rectScale, visW * rectScale, visH * rectScale);
}

function updateZoomDisplay() {
    // Zoom levels: 1 = 16px, 10 = 52px
    const pxSize = 12 + (currentZoomLevel * 4);
    document.documentElement.style.setProperty('--cell-size', `${pxSize}px`);
    const el = document.getElementById('footer-zoom');
    if (el) el.innerText = `ZOOM: x${currentZoomLevel}`;
    
    const minimapContainer = document.getElementById('minimap-container');
    if (minimapContainer) {
        if (currentZoomLevel >= 3) {
            minimapContainer.style.display = 'block';
            drawMinimap();
        } else {
            minimapContainer.style.display = 'none';
        }
    }
    updateLinks();
}

// --- Visual Links ---
function updateLinks() {
    const svg = document.getElementById('link-svg');
    if (!svg) return;
    
    // Clear existing lines
    svg.innerHTML = '';
    
    // Find all Keys (sprite id 11)
    const keys = spriteData.filter(s => s.type === 11);
    if (keys.length === 0) return;
    
    // Find all Locked Doors (tile id 7)
    const doors = [];
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (mapData[y][x] === 7) {
                doors.push({ x: x + 0.5, y: y + 0.5 });
            }
        }
    }
    
    if (doors.length === 0) return;
    
    // Draw lines from every Key to every Locked Door
    const pxSize = 12 + (currentZoomLevel * 4);
    
    keys.forEach(k => {
        doors.forEach(d => {
            const startX = Math.floor(k.x);
            const startY = Math.floor(k.y);
            const endX = Math.floor(d.x);
            const endY = Math.floor(d.y);
            
            const path = findPath(startX, startY, endX, endY);
            
            if (path) {
                const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
                const points = path.map(p => {
                    const px = p.x * (pxSize + 1) + (pxSize / 2);
                    const py = p.y * (pxSize + 1) + (pxSize / 2);
                    return `${px},${py}`;
                }).join(' ');
                
                polyline.setAttribute('points', points);
                polyline.setAttribute('stroke', '#ffd700'); // Gold color
                polyline.setAttribute('stroke-width', '2');
                polyline.setAttribute('stroke-dasharray', '5,5');
                polyline.setAttribute('fill', 'none');
                polyline.style.opacity = '0.8';
                svg.appendChild(polyline);
            } else {
                // Unreachable: draw a red dashed line
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                const kPx = startX * (pxSize + 1) + (pxSize / 2);
                const kPy = startY * (pxSize + 1) + (pxSize / 2);
                const dPx = endX * (pxSize + 1) + (pxSize / 2);
                const dPy = endY * (pxSize + 1) + (pxSize / 2);
                
                line.setAttribute('x1', kPx);
                line.setAttribute('y1', kPy);
                line.setAttribute('x2', dPx);
                line.setAttribute('y2', dPy);
                line.setAttribute('stroke', '#ff3333'); // Red color
                line.setAttribute('stroke-width', '2');
                line.setAttribute('stroke-dasharray', '5,5');
                line.style.opacity = '0.8';
                svg.appendChild(line);
            }
        });
    });
}

function findPath(startX, startY, endX, endY) {
    const openList = [];
    const closedList = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false));
    const nodes = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
    
    function createNode(x, y, parent = null) {
        return { x, y, parent, g: 0, h: 0, f: 0 };
    }
    
    const startNode = createNode(startX, startY);
    const endNode = createNode(endX, endY);
    
    openList.push(startNode);
    nodes[startY][startX] = startNode;
    
    const isPassable = (x, y) => {
        if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return false;
        const tile = mapData[y][x];
        // 0=Empty, 6=Door, 7=Locked, 8=Exit, 9=Elev, 31=Secret
        return tile === 0 || tile === 6 || tile === 7 || tile === 8 || tile === 9 || tile === 31;
    };
    
    while (openList.length > 0) {
        let currentIndex = 0;
        for (let i = 1; i < openList.length; i++) {
            if (openList[i].f < openList[currentIndex].f) {
                currentIndex = i;
            }
        }
        
        let currentNode = openList[currentIndex];
        
        if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
            let path = [];
            let curr = currentNode;
            while (curr) {
                path.push({ x: curr.x, y: curr.y });
                curr = curr.parent;
            }
            return path.reverse();
        }
        
        openList.splice(currentIndex, 1);
        closedList[currentNode.y][currentNode.x] = true;
        
        const neighbors = [
            {x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0},
            {x: -1, y: -1}, {x: 1, y: -1}, {x: -1, y: 1}, {x: 1, y: 1}
        ];
        
        for (let offset of neighbors) {
            const nx = currentNode.x + offset.x;
            const ny = currentNode.y + offset.y;
            
            if (!isPassable(nx, ny) || closedList[ny][nx]) continue;
            
            // Prevent diagonal squeezing
            if (Math.abs(offset.x) === 1 && Math.abs(offset.y) === 1) {
                if (!isPassable(currentNode.x, ny) && !isPassable(nx, currentNode.y)) {
                    continue; 
                }
            }
            
            let gCost = currentNode.g + (offset.x === 0 || offset.y === 0 ? 10 : 14);
            let neighborNode = nodes[ny][nx];
            
            if (!neighborNode) {
                neighborNode = createNode(nx, ny, currentNode);
                nodes[ny][nx] = neighborNode;
                neighborNode.g = gCost;
                // Manhattan heuristic
                neighborNode.h = (Math.abs(nx - endNode.x) + Math.abs(ny - endNode.y)) * 10;
                neighborNode.f = neighborNode.g + neighborNode.h;
                openList.push(neighborNode);
            } else if (gCost < neighborNode.g) {
                neighborNode.parent = currentNode;
                neighborNode.g = gCost;
                neighborNode.f = neighborNode.g + neighborNode.h;
                if (!openList.includes(neighborNode)) {
                    openList.push(neighborNode);
                }
            }
        }
    }
    
    return null;
}

function updateFilenameDisplay() {
    const el = document.getElementById('current-filename');
    if (el) el.innerText = currentFileName;
}

async function onNewLevel() {
    if (confirm("Clear current level and start fresh?")) {
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                mapData[y][x] = 0; // Empty
            }
        }
        spriteData = [];
        playerStart = { x: 4.5, y: 28.5, dir: 'N' };
        currentFileHandle = null;
        currentFileName = "NEW-LEVEL.h";
        updateFilenameDisplay();
        document.getElementById('btn-save').disabled = true;
        buildGrid();
        drawMinimap();
        updateLinks();
        pushState();
    }
}

async function onLoadLevel() {
    try {
        if (window.showOpenFilePicker) {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [{ description: 'C++ Header', accept: {'text/plain': ['.h']} }]
            });
            currentFileHandle = fileHandle;
            currentFileName = fileHandle.name;
            updateFilenameDisplay();
            
            const file = await fileHandle.getFile();
            const contents = await file.text();
            
            parseImportCodeText(contents);
            document.getElementById('btn-save').disabled = false;
            updateLinks();
            pushState();
        } else {
            // Fallback for file:// protocol or unsupported browsers
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.h';
            input.onchange = e => {
                const file = e.target.files[0];
                if (!file) return;
                currentFileName = file.name;
                updateFilenameDisplay();
                
                const reader = new FileReader();
                reader.onload = ev => {
                    parseImportCodeText(ev.target.result);
                    document.getElementById('btn-save').disabled = false;
                    updateLinks();
                    pushState();
                };
                reader.readAsText(file);
            };
            input.click();
        }
    } catch (err) {
        console.error("Load failed:", err);
    }
}

async function onSaveLevel() {
    try {
        if (currentFileHandle && window.showSaveFilePicker) {
            const writable = await currentFileHandle.createWritable();
            const cppCode = generateCppCodeString();
            await writable.write(cppCode);
            await writable.close();
            alert("Level saved successfully!");
        } else {
            // Fallback
            onSaveAsLevel();
        }
    } catch (err) {
        console.error("Save failed:", err);
        alert("Could not save. Ensure you have granted permission.");
    }
}

async function onSaveAsLevel() {
    try {
        if (window.showSaveFilePicker) {
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: currentFileName,
                types: [{ description: 'C++ Header', accept: {'text/plain': ['.h']} }]
            });
            currentFileHandle = fileHandle;
            currentFileName = fileHandle.name;
            updateFilenameDisplay();
            
            const writable = await fileHandle.createWritable();
            const cppCode = generateCppCodeString();
            await writable.write(cppCode);
            await writable.close();
            
            document.getElementById('btn-save').disabled = false;
            alert("Level saved successfully!");
        } else {
            // Fallback for file:// protocol
            const cppCode = generateCppCodeString();
            const blob = new Blob([cppCode], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = currentFileName || "NEW-LEVEL.h";
            a.click();
            URL.revokeObjectURL(url);
            document.getElementById('btn-save').disabled = false;
            alert("Level downloaded (Save As fallback).");
        }
    } catch (err) {
        console.error("Save As failed:", err);
    }
}

// --- Logic ---
function selectAction(type, id) {
    currentAction = { type, id };
    
    if (type === 'tile' && id !== null) lastUsedTile = id;
    if (type === 'sprite' && id !== null) lastUsedSprite = id;
    
    updatePaletteSelection();

    // Update image preview box
    const previewBox = document.getElementById('image-preview-box');
    const previewName = document.getElementById('image-preview-name');
    
    if (!previewBox) return; // If DOM not loaded yet

    let img = null;
    let name = "No selection";
    
    if (type === 'tile') {
        const t = TILES.find(x => x.id === id);
        if (t) { img = t.img; name = t.name; }
    } else if (type === 'sprite') {
        const s = SPRITES.find(x => x.id === id);
        if (s) { img = s.img; name = s.name; }
    } else if (type === 'player') {
        img = 'player.bmp';
        name = 'Player Start';
    }
    
    if (img) {
        previewBox.style.backgroundImage = `url('../../sd_card_files/doom/${img}')`;
        previewName.innerText = name;
    } else {
        previewBox.style.backgroundImage = 'none';
        if (type === 'erase') previewName.innerText = 'Eraser';
        else previewName.innerText = 'No selection';
    }
    
    // Toggle erase-mode class for red hover effect
    if (type === 'erase') {
        gridContainer.classList.add('erase-mode');
    } else {
        gridContainer.classList.remove('erase-mode');
    }
}

function updatePaletteSelection() {
    document.querySelectorAll('.palette-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.type === currentAction.type && (currentAction.id === null || parseInt(item.dataset.id) === currentAction.id)) {
            item.classList.add('active');
        }
        if (item.dataset.action === currentAction.type) {
            item.classList.add('active');
        }
    });
}

function handleCellInteraction(x, y) {
    if (currentAction.type === 'tile') {
        mapData[y][x] = currentAction.id;
    } 
    else if (currentAction.type === 'sprite') {
        // Remove existing sprite at this cell if any
        spriteData = spriteData.filter(s => Math.floor(s.x) !== x || Math.floor(s.y) !== y);
        // Add new sprite (center of cell)
        spriteData.push({ x: x + 0.5, y: y + 0.5, type: currentAction.id });
    }
    else if (currentAction.type === 'player') {
        const oldX = Math.floor(playerStart.x);
        const oldY = Math.floor(playerStart.y);
        
        if (oldX === x && oldY === y) {
            // Clicked on same cell, rotate player
            const dirs = ['N', 'E', 'S', 'W'];
            let idx = dirs.indexOf(playerStart.dir);
            playerStart.dir = dirs[(idx + 1) % 4];
        } else {
            // Move player
            playerStart.x = x + 0.5;
            playerStart.y = y + 0.5;
            // Retain existing direction
        }
        // Update old cell visually to remove old player marker
        updateCellVisuals(oldX, oldY);
    }
    else if (currentAction.type === 'erase') {
        // Erase sprite
        spriteData = spriteData.filter(s => Math.floor(s.x) !== x || Math.floor(s.y) !== y);
        // Erase tile
        mapData[y][x] = 0;
    }

    updateCellVisuals(x, y);
    drawMinimap();
    updateLinks();
}

function updateCellVisuals(x, y) {
    const index = y * GRID_SIZE + x;
    const cell = gridContainer.children[index];
    if (!cell) return;

    // Tile
    const tileId = mapData[y][x];
    const tileData = TILES.find(t => t.id === tileId);
    cell.style.backgroundColor = getTileColor(tileId);
    
    if (tileData && tileData.img) {
        cell.style.backgroundImage = `url('../../sd_card_files/doom/${tileData.img}')`;
        cell.style.backgroundSize = 'cover';
        cell.style.backgroundPosition = 'center';
        cell.style.imageRendering = 'pixelated';
    } else {
        cell.style.backgroundImage = 'none';
    }
    
    let tooltip = tileData ? `Tile: ${tileData.name}` : "Tile: Empty";

    // Clear previous sprites
    cell.innerHTML = '';

    // Player
    if (Math.floor(playerStart.x) === x && Math.floor(playerStart.y) === y) {
        const p = document.createElement('div');
        p.className = 'sprite player-start';
        p.dataset.dir = playerStart.dir || 'N';
        cell.appendChild(p);
        tooltip += `\nEntity: Player Start (${playerStart.dir})`;
    }

    // Sprite
    const sprite = spriteData.find(s => Math.floor(s.x) === x && Math.floor(s.y) === y);
    if (sprite) {
        const sData = SPRITES.find(sp => sp.id === sprite.type);
        const sEl = document.createElement('div');
        sEl.className = 'sprite';
        sEl.style.backgroundColor = getSpriteColor(sprite.type);
        if (sData && sData.short) sEl.innerText = sData.short;
        cell.appendChild(sEl);
        tooltip += `\nEntity: ${sData ? sData.name : 'Unknown'}`;
    }
    
    cell.title = tooltip;
}

function getTileColor(id) {
    const t = TILES.find(t => t.id === id);
    return t ? t.color : 'var(--c-empty)';
}

function getSpriteColor(id) {
    const s = SPRITES.find(s => s.id === id);
    return s ? s.color : '#fff';
}

// --- Code Export ---
function generateCppCodeString() {
    // Derive base name from currentFileName (e.g. E1-HANGAR.h -> E1_HANGAR)
    let funcName = currentFileName.replace('.h', '').toUpperCase().replace(/[^A-Z0-9]/g, '_');
    
    let out = `#pragma once\n\n`;
    out += `#include "../Config.h"\n\n`;
    
    // Map Array
    out += `const uint8_t MAP_${funcName}[MH][MW] = {\n`;
    for (let y = 0; y < GRID_SIZE; y++) {
        out += `{`;
        out += mapData[y].join(',');
        out += (y < GRID_SIZE - 1) ? `},\n` : `}\n`;
    }
    out += `};\n\n`;

    // loadLevel Snippet
    out += `\ninline void loadLevel_${funcName}() {\n`;
    
    // Output player direction variables
    let dX = 0, dY = -1, pX = 0.66, pY = 0;
    if (playerStart.dir === 'E') { dX = 1; dY = 0; pX = 0; pY = 0.66; }
    else if (playerStart.dir === 'S') { dX = 0; dY = 1; pX = -0.66; pY = 0; }
    else if (playerStart.dir === 'W') { dX = -1; dY = 0; pX = 0; pY = -0.66; }
    
    out += `    px = ${playerStart.x}; py = ${playerStart.y}; dirX = ${dX}; dirY = ${dY}; planeX = ${pX}; planeY = ${pY};\n\n`;
    
    spriteData.forEach((s, idx) => {
        let typeStr = s.type;
        // Use constants for decorations as per Config.h
        const revStMap = {
            50: 'ST_LAMP', 51: 'ST_PILLAR', 52: 'ST_CORPSE', 53: 'ST_CBRA', 54: 'ST_SKULLS'
        };
        if (revStMap[s.type]) typeStr = revStMap[s.type];
        
        let stateVal = s.state !== undefined ? s.state : 1;
        out += `    initSprite(${idx}, ${s.x}, ${s.y}, ${typeStr}, ${stateVal});\n`;
    });
    
    out += `\n    for (int y = 0; y < MH; y++) {\n`;
    out += `        for (int x = 0; x < MW; x++) {\n`;
    out += `            MAP[y][x] = MAP_${funcName}[y][x];\n`;
    out += `        }\n    }\n`;
    out += `}\n`;

    return out;
}

// --- Code Import ---
function parseImportCodeText(text) {
    // Parse Player Start: px = 4.5; py = 28.5; dirX = 0; dirY = -1;
    const playerRegex = /px\s*=\s*([0-9.]+);\s*py\s*=\s*([0-9.]+);/;
    const playerMatch = playerRegex.exec(text);
    if (playerMatch) {
        playerStart.x = parseFloat(playerMatch[1]);
        playerStart.y = parseFloat(playerMatch[2]);
    }
    const dirRegex = /dirX\s*=\s*([-0-9.]+);\s*dirY\s*=\s*([-0-9.]+);/;
    const dirMatch = dirRegex.exec(text);
    if (dirMatch) {
        const dirX = parseFloat(dirMatch[1]);
        const dirY = parseFloat(dirMatch[2]);
        if (dirY < 0) playerStart.dir = 'N';
        else if (dirY > 0) playerStart.dir = 'S';
        else if (dirX > 0) playerStart.dir = 'E';
        else if (dirX < 0) playerStart.dir = 'W';
    } else {
        playerStart.dir = 'N';
    }

    // Parse array data
    // Example: {1,1,1,1,...},
    const arrayRegex = /\{([0-9\s,]+)\}/g;
    let match;
    let rowIdx = 0;
    while ((match = arrayRegex.exec(text)) !== null) {
        if (rowIdx >= GRID_SIZE) break; // Might be multi-level array in text, we only take first 32 rows

        const items = match[1].split(',').map(s => s.trim()).filter(s => s !== '');
        
        // If it looks like a full row of grid size
        if (items.length >= GRID_SIZE) { // Ensure at least 32 elements
            for (let x = 0; x < GRID_SIZE; x++) {
                mapData[rowIdx][x] = parseInt(items[x], 10);
            }
            rowIdx++;
        }
    }

    // Parse Sprites: initSprite(0, 6.5, 25.5, 5, 1);
    const spriteRegex = /initSprite\s*\(\s*\d+\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([a-zA-Z0-9_]+)\s*,\s*([-0-9]+)\s*\)/g;
    let spriteMatch;
    spriteData = [];
    while ((spriteMatch = spriteRegex.exec(text)) !== null) {
        let typeVal = spriteMatch[3];
        // Convert constant like ST_ZOMBIE to number if necessary, but the pasted code might have raw numbers
        // E-OS seems to use a mix of ST_XXX and direct numbers. 
        if (typeVal.startsWith('ST_')) {
            const stMap = {
                'ST_ZOMBIE': 5, 'ST_AMMO': 9, 'ST_HEALTH': 10, 'ST_KEY': 11,
                'ST_BARON': 14, 'ST_BARREL': 15, 'ST_PINKY': 17, 'ST_ARMOR': 43,
                'ST_LAMP': 50, 'ST_PILLAR': 51, 'ST_CORPSE': 52, 'ST_CBRA': 53, 'ST_SKULLS': 54
            };
            typeVal = stMap[typeVal] || parseInt(typeVal, 10) || 50;
        } else {
            typeVal = parseInt(typeVal, 10);
        }

        spriteData.push({
            x: parseFloat(spriteMatch[1]),
            y: parseFloat(spriteMatch[2]),
            type: typeVal,
            state: parseInt(spriteMatch[4], 10)
        });
    }

    buildGrid(); // Re-render grid with new mapData and spriteData
}

// --- Undo / Redo System ---
function pushState() {
    if (historyIndex < historyStack.length - 1) {
        historyStack = historyStack.slice(0, historyIndex + 1);
    }
    historyStack.push({
        mapData: JSON.parse(JSON.stringify(mapData)),
        spriteData: JSON.parse(JSON.stringify(spriteData)),
        playerStart: JSON.parse(JSON.stringify(playerStart))
    });
    
    if (historyStack.length > 50) {
        historyStack.shift();
    } else {
        historyIndex++;
    }
}

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        restoreState(historyStack[historyIndex]);
    }
}

function redo() {
    if (historyIndex < historyStack.length - 1) {
        historyIndex++;
        restoreState(historyStack[historyIndex]);
    }
}

function restoreState(state) {
    mapData = JSON.parse(JSON.stringify(state.mapData));
    spriteData = JSON.parse(JSON.stringify(state.spriteData));
    playerStart = JSON.parse(JSON.stringify(state.playerStart));
    
    buildGrid();
    drawMinimap();
    updateLinks();
    
    document.getElementById('btn-save').disabled = false;
}

// --- Run ---
init();

