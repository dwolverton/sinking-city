import BoardState, { Outcome, TileState } from '../BoardState';
import { createBlankMap } from './getInitialBoard';
import { Role } from '../boardElements';

export const b_start:BoardState = {
  players: [
    { id: 0, name: "Player 1", role: 5, location: 19, cards: [19, 6] },
    { id: 1, name: "Player 2", role: 2, location: 18, cards: [23, 14] }
  ],
  tiles: [
    null,
    null,
    { id: 12, flooded: false },
    { id: 15, flooded: false },
    null,
    null,
    null,
    { id: 21, flooded: false },
    { id: 10, flooded: false },
    { id: 22, flooded: false },
    { id: 5, flooded: false },
    null,
    { id: 17, flooded: false },
    { id: 16, flooded: false },
    { id: 0, flooded: false },
    { id: 23, flooded: false },
    { id: 11, flooded: false },
    { id: 3, flooded: false },
    { id: 4, flooded: false },
    { id: 20, flooded: false },
    { id: 2, flooded: false },
    { id: 6, flooded: false },
    { id: 1, flooded: false },
    { id: 18, flooded: false },
    null,
    { id: 7, flooded: false },
    { id: 8, flooded: false },
    { id: 19, flooded: false },
    { id: 14, flooded: false },
    null,
    null,
    null,
    { id: 13, flooded: false },
    { id: 9, flooded: false },
    null,
    null
  ],
  currentPlayer: null,
  actionsRemaining: null,
  waterLevel: 0,
  treasureStack: [
    1,
    12,
    26,
    4,
    10,
    3,
    25,
    8,
    24,
    20,
    21,
    22,
    18,
    7,
    11,
    13,
    0,
    15,
    16,
    2,
    5,
    9,
    27,
    17
  ],
  treasureDiscard: [],
  treasureCardsToDraw: 0,
  floodStack: [
    7,
    15,
    3,
    18,
    12,
    16,
    8,
    22,
    6,
    13,
    21,
    5,
    2,
    19,
    14,
    17,
    11,
    4,
    20,
    9,
    0,
    10,
    1,
    23
  ],
  floodDiscard: [],
  floodCardsToDraw: 6,
  outcome: Outcome.NONE,
  treasuresCaptured: [ false, false, false, false ],
  undo: null
};

export const HELICOPTER_LIFT_CARD = 24; // 23 - 25
export const EXIT_LOCATION = 14;

export const b1:BoardState = {
  players: [
    { id: 0, name: "Player 1", role: Role.NAVIGATOR, location: 19, cards: [19, 6] },
    { id: 1, name: "Player 2", role: Role.PILOT, location: 18, cards: [23, 14, 3] },
    { id: 2, name: "Player 3", role: Role.ENGINEER, location: 18, cards: [] }
  ],
  tiles: [ // [10, 11, 21, 12, 22, 5, 17, 16, 0, 23, 15]
    null,
    null,
    { id: 10, flooded: false },
    { id: 11, flooded: true },
    null,
    null,
    null,
    { id: 21, flooded: false },
    { id: 12, flooded: false },
    { id: 22, flooded: false },
    { id: 5, flooded: false }, // 10 - Cafe 1923 (2 coffee)
    null,
    { id: 17, flooded: false },
    { id: 16, flooded: false },
    { id: 0, flooded: false }, // 14 - Exit 55
    null, // 15 - Sunk 23
    null, // 16 - sunk 15
    { id: 3, flooded: false },  // 17 (1 meal)
    { id: 4, flooded: false },  // 18 - Aladdin Sweets & Cafe (1 meal)
    { id: 20, flooded: true }, // 19
    { id: 2, flooded: false },  // 20 (0 treat)
    { id: 6, flooded: true },  // 21 (2 coffee)
    { id: 1, flooded: false },  // 22 (0 treat)
    { id: 18, flooded: false },
    null,
    { id: 7, flooded: false }, // 25
    { id: 8, flooded: true },
    { id: 19, flooded: false },
    { id: 14, flooded: false },
    null,
    null,
    null,
    { id: 13, flooded: true },
    { id: 9, flooded: false },
    null,
    null
  ],
  currentPlayer: 0,
  actionsRemaining: 3,
  waterLevel: 0,
  treasureStack: [
    1,
    12,
    26,
    4,
    10,
    3,
    25,
    8,
    24,
    20,
    21,
    22,
    18,
    7,
    11,
    13,
    0,
    15,
    16,
    2,
    5,
    9,
    27,
    17
  ],
  treasureDiscard: [],
  treasureCardsToDraw: 0,
  floodStack: [ 
    7,
    3,
    18,
    12,
    0,
    8,
    22,
    6,
    13,
    21,
    5,
    2,
    19,
    14,
    17,
    1,
    20,
    9,
    16,
    4,
    10,
    11
  ],
  floodDiscard: [],
  floodCardsToDraw: 0,
  outcome: Outcome.NONE,
  treasuresCaptured: [ false, false, false, true ],
  undo: null
};

export function mockTiles(string: string): TileState[] {
  let locations = createBlankMap();
  let nextTile = 0;
  let tiles = string
    .replace(/\s/g, "")
    .split("")
    .map(char => {
      if (char === ".") {
        return null;
      } else {
        return {
          id: nextTile++,
          flooded: char === "-"
        };
      }
    });
  let tileI = 0;
  for (let i = 0; i < locations.length; i++) {
    if (locations[i] !== null) {
      locations[i] = tiles[tileI++];
    }
  }
  return locations;
}