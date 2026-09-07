const MAP_W = 40, MAP_H = 16;
let levelData = Array.from({length: MAP_H}, () => Array(MAP_W).fill(0));

let currentBrush = 1;
let isDrawing = false;
let lastCell = null;
let currentFileHandle = null;

const tileClasses = ['t-air','t-ground','t-brick','t-spike','t-coin','t-flag','t-enemy'];

const gridEl = document.getElementById('grid');
const cells = [];

for (let r = 0; r < MAP_H; r++) {
    for (let c = 0; c < MAP_W; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell t-air';
        cell.dataset.r = r;
        cell.dataset.c = c;

        cell.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDrawing = true;
            paint(r, c);
        });
        cell.addEventListener('mouseenter', () => {
            document.getElementById('coordDisplay').textContent = `R:${r} C:${c}`;
            if (isDrawing) paint(r, c);
        });
        cell.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            levelData[r][c] = 0;
            updateCell(r, c);
            updateStats();
            drawPreview();
            updateSaveState();
        });

        gridEl.appendChild(cell);
        cells.push(cell);
    }
}

document.addEventListener('mouseup', () => { isDrawing = false; lastCell = null; });

function paint(r, c) {
    const key = `${r},${c}`;
    if (lastCell === key) return;
    lastCell = key;
    levelData[r][c] = currentBrush;
    updateCell(r, c);
    updateStats();
    drawPreview();
    updateSaveState();
}

function updateCell(r, c) {
    const idx = r * MAP_W + c;
    const val = levelData[r][c];
    cells[idx].className = 'cell ' + tileClasses[val];
}

function updateAllCells() {
    for (let r = 0; r < MAP_H; r++) {
        for (let c = 0; c < MAP_W; c++) {
            updateCell(r, c);
        }
    }
    updateStats();
    drawPreview();
}

// ===== TOOLBAR =====
document.querySelectorAll('.brush-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.brush-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentBrush = parseInt(btn.dataset.val);
    });
});

let clearPending = false;
document.getElementById('clearBtn').addEventListener('click', () => {
    if (!clearPending) {
        clearPending = true;
        document.getElementById('clearBtn').textContent = '⚠️ ARE YOU SURE? (click again)';
        document.getElementById('clearBtn').style.background = 'rgba(255,60,60,0.2)';
        setTimeout(() => {
            clearPending = false;
            document.getElementById('clearBtn').textContent = '🗑️ Clear Level';
            document.getElementById('clearBtn').style.background = '';
        }, 3000);
        return;
    }
    clearPending = false;
    document.getElementById('clearBtn').textContent = '🗑️ Clear Level';
    document.getElementById('clearBtn').style.background = '';
    for (let r = 0; r < MAP_H; r++)
        for (let c = 0; c < MAP_W; c++)
            levelData[r][c] = 0;
    updateAllCells();
    updateSaveState();
});

document.getElementById('fillGroundBtn').addEventListener('click', () => {
    for (let c = 0; c < MAP_W; c++)
        levelData[MAP_H - 1][c] = 1;
    updateAllCells();
    updateSaveState();
});

// ===== STATS & PREVIEW =====
function updateStats() {
    let coins = 0, enemies = 0, flags = 0, ground = 0;
    for (let r = 0; r < MAP_H; r++) {
        for (let c = 0; c < MAP_W; c++) {
            const v = levelData[r][c];
            if (v === 4) coins++;
            if (v === 6) enemies++;
            if (v === 5) flags++;
            if (v === 1 || v === 2) ground++;
        }
    }
    document.getElementById('statCoins').textContent = coins;
    document.getElementById('statEnemies').textContent = enemies;
    document.getElementById('statFlags').textContent = flags;
    document.getElementById('statGround').textContent = ground;
}

const pvCanvas = document.getElementById('previewCanvas');
const pvCtx = pvCanvas.getContext('2d');
const TILE_PV = 8; 

function drawPreview() {
    const w = pvCanvas.width;
    const h = pvCanvas.height;
    pvCtx.fillStyle = '#191433';
    pvCtx.fillRect(0, 0, w, h);

    for (let r = 0; r < MAP_H; r++) {
        for (let c = 0; c < MAP_W; c++) {
            const v = levelData[r][c];
            if (v === 0) continue;

            const x = c * TILE_PV;
            const y = r * TILE_PV;

            switch (v) {
                case 1: 
                    pvCtx.fillStyle = '#2d8c37';
                    pvCtx.fillRect(x, y, TILE_PV, TILE_PV);
                    pvCtx.fillStyle = '#5dda6a';
                    pvCtx.fillRect(x, y, TILE_PV, 2);
                    break;
                case 2: 
                    pvCtx.fillStyle = '#b84332';
                    pvCtx.fillRect(x, y, TILE_PV, TILE_PV);
                    pvCtx.fillStyle = '#933428';
                    pvCtx.fillRect(x, y + 3, TILE_PV, 1);
                    break;
                case 3: 
                    pvCtx.fillStyle = '#c0c0d0';
                    pvCtx.beginPath();
                    pvCtx.moveTo(x + TILE_PV/2, y);
                    pvCtx.lineTo(x, y + TILE_PV);
                    pvCtx.lineTo(x + TILE_PV, y + TILE_PV);
                    pvCtx.fill();
                    break;
                case 4: 
                    pvCtx.fillStyle = '#ffd700';
                    pvCtx.beginPath();
                    pvCtx.arc(x + TILE_PV/2, y + TILE_PV/2, 3, 0, Math.PI * 2);
                    pvCtx.fill();
                    break;
                case 5: 
                    pvCtx.fillStyle = '#aaa';
                    pvCtx.fillRect(x + 1, y, 1, TILE_PV);
                    pvCtx.fillStyle = '#ff3333';
                    pvCtx.fillRect(x + 2, y + 1, 5, 3);
                    break;
                case 6: 
                    pvCtx.fillStyle = '#dd4444';
                    pvCtx.fillRect(x + 1, y + 1, TILE_PV - 2, TILE_PV - 2);
                    pvCtx.fillStyle = '#fff';
                    pvCtx.fillRect(x + 2, y + 3, 2, 2);
                    pvCtx.fillRect(x + 5, y + 3, 2, 2);
                    break;
            }
        }
    }

    pvCtx.fillStyle = '#50c8ff';
    pvCtx.fillRect(2 * TILE_PV, 14 * TILE_PV - 7, 6, 7);
    pvCtx.fillStyle = '#fff';
    pvCtx.fillRect(2 * TILE_PV + 3, 14 * TILE_PV - 5, 2, 2);

    pvCtx.strokeStyle = 'rgba(80, 200, 255, 0.3)';
    pvCtx.setLineDash([2, 2]);
    const spawnX = 2 * TILE_PV + 3;
    const spawnY = 14 * TILE_PV - 7;
    pvCtx.beginPath();
    pvCtx.ellipse(spawnX, spawnY, 4.5 * TILE_PV, 3.5 * TILE_PV, 0, -Math.PI, 0);
    pvCtx.stroke();
    pvCtx.setLineDash([]);
}

// ===== FILE SYSTEM API =====
document.getElementById('btn-new').addEventListener('click', () => {
    for(let r=0; r<MAP_H; r++) levelData[r].fill(0);
    currentFileHandle = null;
    updateAllCells();
    updateSaveState();
    document.getElementById('current-filename').textContent = "Untitled.h";
});

document.getElementById('btn-load').addEventListener('click', async () => {
    try {
        const [fileHandle] = await window.showOpenFilePicker({
            types: [{ description: 'C++ Header File', accept: {'text/plain': ['.h']} }]
        });
        currentFileHandle = fileHandle;
        const file = await fileHandle.getFile();
        const text = await file.text();
        
        const startIndex = text.indexOf('{');
        const endIndex = text.lastIndexOf('}');
        
        if (startIndex === -1 || endIndex === -1) {
            alert("Could not find array data in the file.");
            return;
        }
        
        const arrayData = text.substring(startIndex, endIndex);
        const matches = arrayData.match(/[0-6]/g);
        if (matches && matches.length >= MAP_H * MAP_W) {
            let i = 0;
            for (let r = 0; r < MAP_H; r++) {
                for (let c = 0; c < MAP_W; c++) {
                    levelData[r][c] = parseInt(matches[i++]);
                }
            }
            updateAllCells();
            document.getElementById('current-filename').textContent = file.name;
            updateSaveState();
        } else {
            alert("File does not contain valid platformer map data (expected 40x16 items).");
        }
    } catch (err) {
        console.error(err);
    }
});

async function saveFile(fileHandle) {
    try {
        const writable = await fileHandle.createWritable();
        const arrayName = fileHandle.name.replace('.h', '').toUpperCase().replace('-', '_');
        
        let code = `#pragma once\n\nconst uint8_t MAP_${arrayName}[MAP_H * MAP_W] PROGMEM = {\n`;
        
        for (let r = 0; r < MAP_H; r++) {
            code += `  `;
            for (let c = 0; c < MAP_W; c++) {
                code += levelData[r][c];
                if (c < MAP_W - 1 || r < MAP_H - 1) code += `,`;
            }
            code += `\n`;
        }
        code += `};\n`;
        
        await writable.write(code);
        await writable.close();
        
        currentFileHandle = fileHandle;
        document.getElementById('current-filename').textContent = fileHandle.name;
        updateSaveState(true);
    } catch (err) {
        console.error(err);
        alert("Error saving file!");
    }
}

document.getElementById('btn-save').addEventListener('click', async () => {
    if (currentFileHandle) await saveFile(currentFileHandle);
});

document.getElementById('btn-save-as').addEventListener('click', async () => {
    try {
        const fileHandle = await window.showSaveFilePicker({
            suggestedName: 'Level-1.h',
            types: [{ description: 'C++ Header File', accept: {'text/plain': ['.h']} }]
        });
        await saveFile(fileHandle);
    } catch (err) {
        console.error(err);
    }
});

function updateSaveState(justSaved = false) {
    const saveBtn = document.getElementById('btn-save');
    if (currentFileHandle) {
        saveBtn.disabled = false;
        if (justSaved) {
            document.getElementById('current-filename').style.color = '#4caf50';
            setTimeout(() => document.getElementById('current-filename').style.color = 'var(--text)', 1500);
        } else {
            document.getElementById('current-filename').style.color = '#ff9800';
        }
    } else {
        saveBtn.disabled = true;
    }
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key >= '0' && key <= '6') {
        currentBrush = parseInt(key);
        document.querySelectorAll('.brush-btn').forEach(b => {
            b.classList.toggle('active', parseInt(b.dataset.val) === currentBrush);
        });
    }
});

updateAllCells();
