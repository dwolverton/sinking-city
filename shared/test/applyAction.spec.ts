import BoardState, { Outcome } from "../game/BoardState";
import applyAction from '../game/gameEngine/applyAction';
import { ActionType } from '../game/actions';
import { b1, mockTiles, EXIT_LOCATION, HELICOPTER_LIFT_CARD } from './mock-boards';
import { Role } from '../game/boardElements';

const WATERS_RISE_CARD:number = 20;

describe("applyAction:DrawTreasureCard", () => {

  it("should remove a treasure card from the deck", () => {
    let board = { ...b1, treasureCardsToDraw: 1, treasureStack: [ 1, 2, 3 ]};
    board = applyAction(board, { type: ActionType.DrawTreasureCard}, 0);
    expect(board.treasureStack).toEqual([ 1, 2]);
  });

  it("should add card to player hand", () => {
    let board = { ...b1, treasureCardsToDraw: 2, treasureStack: [ 1, 2, 3 ]};
    board = applyAction(board, { type: ActionType.DrawTreasureCard}, 0);
    expect(board.players[0].cards).toEqual([19, 6, 3]);
  });

  it("should reduce cards left to draw", () => {
    let board = { ...b1, treasureCardsToDraw: 2, treasureStack: [ 1, 2, 3 ]};
    board = applyAction(board, { type: ActionType.DrawTreasureCard}, 0);
    expect(board.treasureCardsToDraw).toEqual(1);
  });

  it("waters rise... do not add card to player hand", () => {
    let board = { ...b1, treasureCardsToDraw: 2, treasureStack: [ 1, 2, WATERS_RISE_CARD ]};
    board = applyAction(board, { type: ActionType.DrawTreasureCard}, 0);
    expect(board.players[0].cards).toEqual(b1.players[0].cards);
  });

  it("waters rise... add card to treasure discard", () => {
    let board = { ...b1, treasureCardsToDraw: 2, treasureStack: [ 1, 2, WATERS_RISE_CARD ], treasureDiscard: [ 5 ]};
    board = applyAction(board, { type: ActionType.DrawTreasureCard}, 0);
    expect(board.treasureStack).toEqual([ 1, 2 ]);
    expect(board.treasureDiscard).toEqual([ 5, WATERS_RISE_CARD ]);
  });

  it("waters rise... add card to treasure discard (first discard)", () => {
    let board = { ...b1, treasureCardsToDraw: 2, treasureStack: [ 1, 2, WATERS_RISE_CARD ], treasureDiscard: []};
    board = applyAction(board, { type: ActionType.DrawTreasureCard}, 0);
    expect(board.treasureStack).toEqual([ 1, 2 ]);
    expect(board.treasureDiscard).toEqual([ WATERS_RISE_CARD ]);
  });

  it("waters rise... should increase water level by one", () => {
    let board = { ...b1, treasureCardsToDraw: 2, treasureStack: [ 1, 2, WATERS_RISE_CARD ], waterLevel: 3};
    board = applyAction(board, { type: ActionType.DrawTreasureCard}, 0);
    expect(board.waterLevel).toEqual(4);
  });

  it("waters rise... should reduce cards left to draw", () => {
    let board = { ...b1, treasureCardsToDraw: 2, treasureStack: [ 1, 2, WATERS_RISE_CARD ]};
    board = applyAction(board, { type: ActionType.DrawTreasureCard}, 0);
    expect(board.treasureCardsToDraw).toEqual(1);
  });

  it("waters rise... should shuffle flood discard and add to stack", () => {
    let board = { ...b1, treasureCardsToDraw: 2, treasureStack: [ 1, 2, WATERS_RISE_CARD ],
      floodStack: [ 1 , 2 ], floodDiscard: [ 3 , 4 ]};
    board = applyAction(board, { type: ActionType.DrawTreasureCard}, 0);
    expect(board.floodDiscard).toEqual([]);
    expect(board.floodStack.length).toBe(4);
    if (board.floodStack[3] === 4) {
      expect(board.floodStack).toEqual([ 1, 2, 3, 4]);
    } else {
      expect(board.floodStack).toEqual([ 1, 2, 4, 3]);
    }
  });

  it("should shuffle deck first if stack empty", () => {
    let board = { ...b1, treasureCardsToDraw: 1, treasureStack: [ ], treasureDiscard: [ 1, 2 ]};
    board = applyAction(board, { type: ActionType.DrawTreasureCard}, 0);
    expect(board.treasureStack.length).toBe(1);
    if (board.treasureStack[0] === 1) {
      // Note: after shuffling, a card was drawn.
      expect(board.treasureStack).toEqual([ 1 ]);
      expect(board.players[0].cards).toEqual([19, 6, 2]);
    } else {
      expect(board.treasureStack).toEqual([ 2 ]);
      expect(board.players[0].cards).toEqual([19, 6, 1]);
    }
    expect(board.treasureDiscard).toEqual([ ]);
  });
});

describe("applyAction:DrawFloodCard", () => {

  it("should remove a flood card from the deck", () => {
    let board = { ...b1, floodCardsToDraw: 1, floodStack: [ 1, 2, 3 ]};
    board = applyAction(board, { type: ActionType.DrawFloodCard}, 0);
    expect(board.floodStack).toEqual([ 1, 2 ]);
  });

  it("should add a flood card to discard", () => {
    let board = { ...b1, floodCardsToDraw: 1, floodStack: [ 1, 2, 3 ], floodDiscard: []};
    board = applyAction(board, { type: ActionType.DrawFloodCard}, 0);
    expect(board.floodDiscard).toEqual([ 3 ]);
  });

  it("should add a flood card to discard (first discard)", () => {
    let board = { ...b1, floodCardsToDraw: 1, floodStack: [ 1, 2, 3 ], floodDiscard: [ 4, 5 ]};
    board = applyAction(board, { type: ActionType.DrawFloodCard}, 0);
    expect(board.floodDiscard).toEqual([ 4, 5, 3 ]);
  });

  it("should flood tile if not flooded", () => {
    let board = { ...b1, floodCardsToDraw: 1, floodStack: [ 1, 2, 10 ],
      tiles: [null, null, { id: 10, flooded: false }, { id: 11, flooded: true } ]
    };
    board = applyAction(board, { type: ActionType.DrawFloodCard}, 0);
    expect(board.tiles).toEqual([null, null, { id: 10, flooded: true }, { id: 11, flooded: true } ]);
  });

  it("should remove tile if flooded", () => {
    let board = { ...b1, floodCardsToDraw: 1, floodStack: [ 1, 2, 11 ],
      tiles: [null, null, { id: 10, flooded: false }, { id: 11, flooded: true } ]
    };
    board = applyAction(board, { type: ActionType.DrawFloodCard}, 0);
    expect(board.tiles).toEqual([null, null, { id: 10, flooded: false }, null ]);
  });

  it("should remove card if flooded", () => {
    let board = { ...b1, floodCardsToDraw: 1, floodStack: [ 1, 2, 11 ], floodDiscard: [ 3, 4 ],
      tiles: [null, null, { id: 10, flooded: false }, { id: 11, flooded: true } ]
    };
    board = applyAction(board, { type: ActionType.DrawFloodCard}, 0);
    expect(board.floodStack).toEqual([ 1, 2 ]);
    expect(board.floodDiscard).toEqual([ 3, 4 ]);
  });

  it("should shuffle deck first if stack empty", () => {
    let board = { ...b1, floodCardsToDraw: 1, floodStack: [ ], floodDiscard: [ 1, 2 ]};
    board = applyAction(board, { type: ActionType.DrawFloodCard}, 0);
    expect(board.floodStack.length).toBe(1);
    if (board.floodStack[0] === 1) {
      // Note: after shuffling, a card was drawn.
      expect(board.floodStack).toEqual([ 1 ]);
      expect(board.floodDiscard).toEqual([ 2 ]);
    } else {
      expect(board.floodStack).toEqual([ 2 ]);
      expect(board.floodDiscard).toEqual([ 1 ]);
    }
  });

});

describe("applyAction:GiveTreasureCard", () => {

  it("should remove card from current player", () => {
    let board = { ...b1, currentPlayer: 1, players: [
      { id: 0, role: 5, location: 19, cards: [19, 6] },
      { id: 1, role: 2, location: 18, cards: [9, 23, 14] },
      { id: 2, role: 1, location: 18, cards: [5, 6] }
    ]};
    board = applyAction(board, { type: ActionType.GiveTreasureCard, player: 2, card: 23 }, 1);
    expect(board.players[1].cards).toEqual([ 9, 14 ]);
  });

  it("should add card to receiving player", () => {
    let board = { ...b1, currentPlayer: 1, players: [
      { id: 0, role: 5, location: 19, cards: [19, 6] },
      { id: 1, role: 2, location: 18, cards: [9, 23, 14] },
      { id: 2, role: 1, location: 18, cards: [5, 6] }
    ]};
    board = applyAction(board, { type: ActionType.GiveTreasureCard, player: 2, card: 23 }, 1);
    expect(board.players[2].cards).toEqual([ 5, 6, 23 ]);
  });

  it("should take an action", () => {
    let board = { ...b1, currentPlayer: 1, actionsRemaining: 3, players: [
      { id: 0, role: 5, location: 19, cards: [19, 6] },
      { id: 1, role: 2, location: 18, cards: [9, 23, 14] },
      { id: 2, role: 1, location: 18, cards: [5, 6] }
    ]};
    board = applyAction(board, { type: ActionType.GiveTreasureCard, player: 2, card: 23 }, 1);
    expect(board.actionsRemaining).toEqual(2);
  });

});

describe("applyAction:CaptureTreasure", () => {

  it("should set correct treasure to true", () => {
    // treasure 2
    let board:BoardState = { ...b1, players: [
      { id: 0, role: 5, location: 10, cards: [10, 11, 12, 13] },
      { id: 1, role: 2, location: 19, cards: [23, 14] }
    ], treasuresCaptured: [true, false, false, true]}; 
    board = applyAction(board, { type: ActionType.CaptureTreasure }, 0);
    expect(board.treasuresCaptured).toEqual([true, false, true, true]);
  });

  it("should remove four cards of same treasure type and add them to discard pile", () => {
    let board:BoardState = { ...b1, players: [
      { id: 0, role: 5, location: 10, cards: [10, 11, 12, 13] },
      { id: 1, role: 2, location: 19, cards: [23, 14] }
    ], treasureDiscard: [3]}; 
    board = applyAction(board, { type: ActionType.CaptureTreasure }, 0);
    expect(board.players[0].cards).toEqual([]);
    expect(board.treasureDiscard).toEqual([3, 10, 11, 12, 13]);
  });

  it("should remove four cards of same treasure type and add them to discard pile (mixed w/ other card)", () => {
    let board:BoardState = { ...b1, players: [
      { id: 0, role: 5, location: 10, cards: [10, 13, 11, 0, 14] },
      { id: 1, role: 2, location: 19, cards: [23, 14] }
    ], treasureDiscard: [3]}; 
    board = applyAction(board, { type: ActionType.CaptureTreasure }, 0);
    expect(board.players[0].cards).toEqual([0]);
    expect(board.treasureDiscard).toEqual([3, 10, 13, 11, 14]);
  });

  it("should remove four cards of same treasure type and add them to discard pile (mixed with special card)", () => {
    let board:BoardState = { ...b1, players: [
      { id: 0, role: 5, location: 10, cards: [24, 12, 13, 11, 14] },
      { id: 1, role: 2, location: 19, cards: [23, 14] }
    ], treasureDiscard: []}; 
    board = applyAction(board, { type: ActionType.CaptureTreasure }, 0);
    expect(board.players[0].cards).toEqual([24]);
    expect(board.treasureDiscard).toEqual([12, 13, 11, 14]);
  });

  it("should remove ONLY four cards of same treasure type and add them to discard pile", () => {
    let board:BoardState = { ...b1, players: [
      { id: 0, role: 5, location: 10, cards: [10, 11, 12, 13, 14] },
      { id: 1, role: 2, location: 19, cards: [23, 14] }
    ], treasureDiscard: [3]}; 
    board = applyAction(board, { type: ActionType.CaptureTreasure }, 0);
    expect(board.players[0].cards).toEqual([14]);
    expect(board.treasureDiscard).toEqual([3, 10, 11, 12, 13]);
  });

  it("should take an action", () => {
    // treasure 2
    let board:BoardState = { ...b1, players: [
      { id: 0, role: 5, location: 10, cards: [10, 11, 12, 13] },
      { id: 1, role: 2, location: 19, cards: [23, 14] }
    ], actionsRemaining: 2}; 
    board = applyAction(board, { type: ActionType.CaptureTreasure }, 0);
    expect(board.actionsRemaining).toEqual(1);
  });

});

describe("applyAction indicates loss", () => {

  it("LOSS when water level too high", () => {
    let board = { ...b1, floodCardsToDraw: 2, waterLevel: 9};
    board = applyAction(board, { type: ActionType.DrawFloodCard}, 0);
    expect(board.outcome).toEqual(Outcome.LOSE);
  });

  it("NOT LOSS when water level okay", () => {
    let board = { ...b1, floodCardsToDraw: 2, waterLevel: 8};
    board = applyAction(board, { type: ActionType.DrawFloodCard}, 0);
    expect(board.outcome).toEqual(Outcome.NONE);
  });

  it("LOSS when exit sunk", () => {
    let board = { ...b1, floodCardsToDraw: 2,
    tiles: b1.tiles.filter((_, i) => i !== 14)}; // remove exit tile
    board = applyAction(board, { type: ActionType.DrawFloodCard}, 0);
    expect(board.outcome).toEqual(Outcome.LOSE);
  });

  it("LOSS when no tiles left for uncaptured treasure", () => {
    let board = { ...b1, floodCardsToDraw: 2, treasuresCaptured: [true, true, false, true],
    tiles: b1.tiles.filter((_, i) => i !== 10 && i !== 21)}; // remove both coffee tiles
    board = applyAction(board, { type: ActionType.DrawFloodCard}, 0);
    expect(board.outcome).toEqual(Outcome.LOSE);
  });

  it("NOT LOSS when one tile left for uncaptured treasure", () => {
    let board = { ...b1, floodCardsToDraw: 2, treasuresCaptured: [true, true, false, true],
    tiles: b1.tiles.filter((_, i) => i !== 10)}; // remove both coffee tiles
    board = applyAction(board, { type: ActionType.DrawFloodCard}, 0);
    expect(board.outcome).toEqual(Outcome.NONE);
  });

  it("NOT LOSS when no tiles left for captured treasure", () => {
    let board = { ...b1, floodCardsToDraw: 2, treasuresCaptured: [true, false, true, true],
    tiles: b1.tiles.filter((_, i) => i !== 10 && i !== 21)}; // remove both coffee tiles
    board = applyAction(board, { type: ActionType.DrawFloodCard}, 0);
    expect(board.outcome).toEqual(Outcome.NONE);
  });

  it("LOSS when player in water and can't move", () => {
    let board = { ...b1, floodCardsToDraw: 2,
      players: [ ...b1.players.slice(0, 1), { ...b1.players[2], location: 0 } ]
    };
    board = applyAction(board, { type: ActionType.DrawFloodCard}, 0);
    expect(board.outcome).toEqual(Outcome.LOSE);
  });

  it("NOT LOSS when player in water and can move", () => {
    let board = { ...b1, floodCardsToDraw: 2,
      players: [ ...b1.players.slice(0, 1), { ...b1.players[2], location: 1 } ]
    };
    board = applyAction(board, { type: ActionType.DrawFloodCard}, 0);
    expect(board.outcome).toEqual(Outcome.NONE);
  });

  it("LOSS when player in water and cannot move diagonally, swim, or fly", () => {
    let tiles = mockTiles(`
      **
     ---.
    ***...
    ..**..
     -...
      ..
    `);
    let board = { ...b1, tiles, floodCardsToDraw: 2, floodStack: [ 1, 2, 9 ],
      players: [ ...b1.players.slice(0, 1), { ...b1.players[2], location: 16, role: Role.NAVIGATOR } ]
    };
    board = applyAction(board, { type: ActionType.DrawFloodCard}, 0);
    expect(board.outcome).toEqual(Outcome.LOSE);
  });

  it("NOT LOSS when explorer in water and can move diagonally", () => {
    let tiles = mockTiles(`
      **
     ---.
    ***...
    ..**..
     -...
      ..
    `);
    let board = { ...b1, tiles, floodCardsToDraw: 2, floodStack: [ 1, 2, 9 ],
      players: [ ...b1.players.slice(0, 1), { ...b1.players[2], location: 16, role: Role.EXPLORER } ]
    };
    board = applyAction(board, { type: ActionType.DrawFloodCard}, 0);
    expect(board.outcome).toEqual(Outcome.NONE);
  });

  it("LOSS when explorer in water and cannot move diagonally", () => {
    let tiles = mockTiles(`
      **
     ---.
    ***...
    ..**..
     -...
      ..
    `);
    let board = { ...b1, tiles, floodCardsToDraw: 2, floodStack: [ 1, 2, 9 ],
      players: [ ...b1.players.slice(0, 1), { ...b1.players[2], location: 17, role: Role.EXPLORER } ]
    };
    board = applyAction(board, { type: ActionType.DrawFloodCard}, 0);
    expect(board.outcome).toEqual(Outcome.LOSE);
  });

  it("NOT LOSS when diver in water and can swim to safety", () => {
    let tiles = mockTiles(`
      **
     ---.
    ***...
    ..**..
     -...
      ..
    `);
    let board = { ...b1, tiles, floodCardsToDraw: 2, floodStack: [ 1, 2, 9 ],
      players: [ ...b1.players.slice(0, 1), { ...b1.players[2], location: 17, role: Role.DIVER } ]
    };
    board = applyAction(board, { type: ActionType.DrawFloodCard}, 0);
    expect(board.outcome).toEqual(Outcome.NONE);
  });

  it("NOT LOSS when pilot in water", () => {
    let tiles = mockTiles(`
      **
     ---.
    ***...
    .-**..
     ....
      ..
    `);
    let board = { ...b1, tiles, floodCardsToDraw: 2, floodStack: [ 1, 2, 9 ],
      players: [ ...b1.players.slice(0, 1), { ...b1.players[2], location: 28, role: Role.PILOT } ]
    };
    board = applyAction(board, { type: ActionType.DrawFloodCard}, 0);
    expect(board.outcome).toEqual(Outcome.NONE);
  });

});

describe("applyAction:Win", () => {

  it("should be available when player has Helicopter lift card & all players on exit & all treasures captured", () => {
    let board:BoardState = { ...b1, players: [
      { id: 0, role: 5, location: EXIT_LOCATION, cards: [10, HELICOPTER_LIFT_CARD, 11, 13] },
      { id: 1, role: 2, location: EXIT_LOCATION, cards: [19, 14] }
    ], treasuresCaptured: [ true, true, true, true ]}; 
    board = applyAction(board, { type: ActionType.Win}, 0);
    expect(board.outcome).toEqual(Outcome.WIN);
  });
});

describe("applyAction:Fly", () => {

  it("should set location and special", () => {
    let board:BoardState = { ...b1, players: [
      { id: 0, role: Role.PILOT, location: 19, cards: [19, 6] },
      { id: 1, role: 2, location: 18, cards: [9, 23, 14] }
    ]};
    board = applyAction(board, { type: ActionType.Fly, location: 2 }, 0);
    expect(board.players[0].location).toBe(2);
    expect(board.roleSpecial).toBe(true);
  });

  it("should set location but not special when escaping sunk tile", () => {
    let board:BoardState = { ...b1, players: [
      { id: 0, role: Role.PILOT, location: 15, cards: [19, 6] },
      { id: 1, role: 2, location: 18, cards: [9, 23, 14] }
    ]};
    board = applyAction(board, { type: ActionType.Fly, location: 2 }, 0);
    expect(board.players[0].location).toBe(2);
    expect(board.roleSpecial).toBeUndefined();
  });

});

describe("applyAction special", () => {

  it("should clear special for diver at end of turn", () => {
    let board:BoardState = { ...b1, players: [
      { id: 0, role: Role.DIVER, location: 20, cards: [10, 13] },
      { id: 1, role: Role.NAVIGATOR, location: EXIT_LOCATION, cards: [19, 14] }
    ], actionsRemaining: 1, roleSpecial: true}; 
    board = applyAction(board, { type: ActionType.Move, location: 21}, 0);
    expect(board.roleSpecial).toBeUndefined();
  });

  it("should clear special for engineer for any action", () => {
    let board:BoardState = { ...b1, players: [
      { id: 0, role: Role.ENGINEER, location: 20, cards: [10, 13] },
      { id: 1, role: Role.NAVIGATOR, location: EXIT_LOCATION, cards: [19, 14] }
    ], actionsRemaining: 2, roleSpecial: true}; 
    board = applyAction(board, { type: ActionType.Move, location: 21}, 0);
    expect(board.roleSpecial).toBeUndefined();
  });

  it("should not clear special for diver for any action", () => {
    let board:BoardState = { ...b1, players: [
      { id: 0, role: Role.DIVER, location: 20, cards: [10, 13] },
      { id: 1, role: Role.NAVIGATOR, location: EXIT_LOCATION, cards: [19, 14] }
    ], actionsRemaining: 2, roleSpecial: true}; 
    board = applyAction(board, { type: ActionType.Move, location: 21}, 0);
    expect(board.roleSpecial).toBe(true);
  });
});

describe("applyAction:ShoreUp for Engineer", () => {

  it("should flip tile & use action", () => {
    let board:BoardState = { ...b1, actionsRemaining: 2 };
    expect(board.tiles[19].flooded).toBe(true);
    board = applyAction(board, { type: ActionType.ShoreUp, location: 19}, 0);
    expect(board.tiles[19].flooded).toBe(false);
    expect(board.actionsRemaining).toBe(1);
    expect(board.roleSpecial).toBeUndefined();
  });

  it("should flip tile & use last action", () => {
    let board:BoardState = { ...b1, actionsRemaining: 1 };
    expect(board.tiles[19].flooded).toBe(true);
    board = applyAction(board, { type: ActionType.ShoreUp, location: 19}, 0);
    expect(board.tiles[19].flooded).toBe(false);
    expect(board.actionsRemaining).toBe(0);
    expect(board.treasureCardsToDraw).toBe(2);
    expect(board.roleSpecial).toBeUndefined();
  });

  it("should flip tile, use action, and set special for Engineer", () => {
    let board:BoardState = { ...b1, actionsRemaining: 2, currentPlayer: 2 };
    expect(board.tiles[19].flooded).toBe(true);
    board = applyAction(board, { type: ActionType.ShoreUp, location: 19}, 2);
    expect(board.tiles[19].flooded).toBe(false);
    expect(board.actionsRemaining).toBe(1);
    expect(board.roleSpecial).toBe(true);
  });

  it("should flip tile, unset special, but not use action for Engineer's free second shore up", () => {
    let board:BoardState = { ...b1, actionsRemaining: 2, currentPlayer: 2, roleSpecial: true };
    expect(board.tiles[19].flooded).toBe(true);
    board = applyAction(board, { type: ActionType.ShoreUp, location: 19}, 2);
    expect(board.tiles[19].flooded).toBe(false);
    expect(board.actionsRemaining).toBe(2); // still 2
    expect(board.roleSpecial).toBeUndefined(); // unset
  });

  it("should flip tile, unset special, but not use action near end for Engineer", () => {
    let board:BoardState = { ...b1, actionsRemaining: 1, currentPlayer: 2, roleSpecial: true };
    expect(board.tiles[19].flooded).toBe(true);
    board = applyAction(board, { type: ActionType.ShoreUp, location: 19}, 2);
    expect(board.tiles[19].flooded).toBe(false);
    expect(board.actionsRemaining).toBe(1);
    expect(board.treasureCardsToDraw).toBe(0);
    expect(board.roleSpecial).toBeUndefined();
  });

  it("should flip tile, use action, and set special, but not end turn for Engineer", () => {
    let board:BoardState = { ...b1, actionsRemaining: 1, currentPlayer: 2 };
    expect(board.tiles[19].flooded).toBe(true);
    board = applyAction(board, { type: ActionType.ShoreUp, location: 19}, 2);
    expect(board.tiles[19].flooded).toBe(false);
    expect(board.actionsRemaining).toBe(0);
    expect(board.treasureCardsToDraw).toBe(0); // not over yet
    expect(board.roleSpecial).toBe(true);
  });

  it("should flip tile, unset special and end turn at end for Engineer", () => {
    let board:BoardState = { ...b1, actionsRemaining: 0, currentPlayer: 2, roleSpecial: true };
    expect(board.tiles[19].flooded).toBe(true);
    board = applyAction(board, { type: ActionType.ShoreUp, location: 19}, 2);
    expect(board.tiles[19].flooded).toBe(false);
    expect(board.actionsRemaining).toBe(0);
    expect(board.treasureCardsToDraw).toBe(2); // over
    expect(board.roleSpecial).toBeUndefined();
  });
});