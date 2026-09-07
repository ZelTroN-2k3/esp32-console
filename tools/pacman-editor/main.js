const COLS = 20;
const ROWS = 14;

// 0: Empty, 1: Wall, 2: Dot, 3: Power
let currentTool = 1;
let isDrawing = false;
let isErasing = false; // Right click
let currentFileHandle = null;

// Map data
let mapData = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 3, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 2, 1, 1, 0, 5, 5, 5, 0, 0, 1, 1, 2, 1, 1, 1, 1],
    [0, 0, 0, 1, 2, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 2, 1, 0, 0, 0],
    [1, 1, 1, 1, 2, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 2, 1, 1, 1, 1],
    [0, 0, 0, 0, 2, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 2, 0, 0, 0, 0],
    [1, 1, 1, 1, 2, 1, 1, 0, 0, 4, 0, 0, 0, 1, 1, 2, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const paletteItems = [
    { id: 0, label: 'Empty', className: 'empty' },
    { id: 1, label: 'Wall', className: 'wall' },
    { id: 2, label: 'Dot', className: 'dot' },
    { id: 3, label: 'Power Pellet', className: 'power' },
    { id: 4, label: 'Pacman Start', className: 'pacman-spawn' },
    { id: 5, label: 'Ghost Start', className: 'ghost-spawn' }
];

document.addEventListener('DOMContentLoaded', () => {
    initPalette();
    initGrid();
    initControls();
    updateUI();
});

function initPalette() {
    const paletteContainer = document.getElementById('palette');

    paletteItems.forEach(item => {
        const el = document.createElement('div');
        el.className = `palette-item ${item.id === currentTool ? 'active' : ''}`;
        el.dataset.id = item.id;

        el.innerHTML = `
            <div class="preview ${item.className}"></div>
            <div class="label">${item.label}</div>
        `;

        el.addEventListener('click', () => {
            currentTool = item.id;
            document.querySelectorAll('.palette-item').forEach(i => i.classList.remove('active'));
            el.classList.add('active');
        });

        paletteContainer.appendChild(el);
    });
}

function initGrid() {
    const gridContainer = document.getElementById('grid');
    gridContainer.innerHTML = '';

    // Prevent context menu on grid
    gridContainer.addEventListener('contextmenu', e => e.preventDefault());

    // Global mouse up to stop drawing
    document.addEventListener('mouseup', () => {
        isDrawing = false;
        isErasing = false;
    });

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.r = r;
            cell.dataset.c = c;
            cell.dataset.type = mapData[r][c];

            cell.addEventListener('mousedown', (e) => {
                if (e.button === 0) { // Left click
                    isDrawing = true;
                    setCell(r, c, currentTool);
                } else if (e.button === 2) { // Right click
                    isErasing = true;
                    setCell(r, c, 0); // Force erase
                }
            });

            cell.addEventListener('mouseenter', () => {
                if (isDrawing) {
                    setCell(r, c, currentTool);
                } else if (isErasing) {
                    setCell(r, c, 0);
                }
            });

            gridContainer.appendChild(cell);
        }
    }
}

function setCell(r, c, type) {
    mapData[r][c] = type;
    const cell = document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
    if (cell) {
        cell.dataset.type = type;
    }
}

function initControls() {
    document.getElementById('btn-new').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the entire map?')) {
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    setCell(r, c, 0);
                }
            }
            currentFileHandle = null;
            updateUI();
        }
    });

    document.getElementById('btn-load').addEventListener('click', async () => {
        if (!window.showOpenFilePicker) {
            alert("Your browser does not support the File System Access API. Please use Chrome or Edge.");
            return;
        }
        try {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [{
                    description: 'C/C++ Header Files',
                    accept: { 'text/x-c': ['.h', '.c', '.cpp'] },
                }],
            });
            const file = await fileHandle.getFile();
            const text = await file.text();
            const startIndex = text.indexOf('{');
            const endIndex = text.lastIndexOf('}');

            if (startIndex === -1 || endIndex === -1) {
                alert("Could not find array data in the file.");
                return;
            }

            const arrayData = text.substring(startIndex, endIndex);
            const matches = arrayData.match(/[0-5]/g);
            if (matches && matches.length >= ROWS * COLS) {
                let i = 0;
                for (let r = 0; r < ROWS; r++) {
                    for (let c = 0; c < COLS; c++) {
                        setCell(r, c, parseInt(matches[i], 10));
                        i++;
                    }
                }
                currentFileHandle = fileHandle;
                updateUI();
                showToast("Level loaded!");
            } else {
                alert("The file does not contain a valid 20x14 matrix for Pacman.");
            }
        } catch (err) {
            console.error(err);
        }
    });

    document.getElementById('btn-save').addEventListener('click', async () => {
        if (currentFileHandle) {
            await saveMapToFile(currentFileHandle);
        }
    });

    document.getElementById('btn-save-as').addEventListener('click', async () => {
        if (!window.showSaveFilePicker) return;
        try {
            const handle = await window.showSaveFilePicker({
                types: [{
                    description: 'C/C++ Header',
                    accept: { 'text/x-c': ['.h'] },
                }],
                suggestedName: 'Level-X.h'
            });
            await saveMapToFile(handle);
            currentFileHandle = handle;
            updateUI();
        } catch (err) {
            console.error(err);
        }
    });
}

function updateUI() {
    const filenameLabel = document.getElementById('current-filename');
    const saveBtn = document.getElementById('btn-save');

    if (currentFileHandle) {
        filenameLabel.textContent = currentFileHandle.name;
        saveBtn.disabled = false;
    } else {
        filenameLabel.textContent = "New Level";
        saveBtn.disabled = true;
    }
}

async function saveMapToFile(fileHandle) {
    try {
        const writable = await fileHandle.createWritable();
        const arrayName = fileHandle.name.replace('.h', '').toUpperCase().replace('-', '_');

        let code = `#pragma once\n\nconst uint8_t MAP_${arrayName}[ROWS][COLS] = {\n`;

        for (let r = 0; r < ROWS; r++) {
            code += `  {`;
            for (let c = 0; c < COLS; c++) {
                code += mapData[r][c];
                if (c < COLS - 1) code += `,`;
            }
            code += `}`;
            if (r < ROWS - 1) code += `,`;
            code += `\n`;
        }
        code += `};\n`;

        await writable.write(code);
        await writable.close();
        showToast("File saved!");
    } catch (err) {
        console.error(err);
        alert("Error while saving.");
    }
}

function showToast(message = "Done!") {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}
