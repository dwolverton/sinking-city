import BoardState, { PlayerState } from "../BoardState";
import getInitialBoard from "./getInitialBoard";
import applyAction from './applyAction';
import { ActionType } from '../actions';
import { b1 } from './mock-boards.spec';
import { WATER_LEVELS } from '../boardElements';

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