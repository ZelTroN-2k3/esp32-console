// E-OS Dungeon Maker - Campaign Orchestrator
#pragma once
#include <Arduino.h>

// Generated Includes
#include "LEVEL_1.h"
#include "LEVEL_2.h"
#include "LEVEL_BOSS.h"

// Tiles Dispatcher
inline const uint8_t (*getCustomTiles(int floor))[32] {
    switch (floor) {
        case 1: return LEVEL_1_TILES;
        case 2: return LEVEL_2_TILES;
        case 3: return LEVEL_BOSS_TILES;
        default: return nullptr;
    }
}

// Entities Dispatcher
inline const uint8_t (*getCustomEntities(int floor))[32] {
    switch (floor) {
        case 1: return LEVEL_1_ENTITIES;
        case 2: return LEVEL_2_ENTITIES;
        case 3: return LEVEL_BOSS_ENTITIES;
        default: return nullptr;
    }
}
