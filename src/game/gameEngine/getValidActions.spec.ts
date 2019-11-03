import BoardState, { PlayerState } from "../BoardState";
import { getValidActions } from '../gameEngine';
import { b1 } from './mock-boards.spec';
import { AvailableAction, ActionType } from '../actions';

describe("getValidActions:GiveTreasureCard", () => {

  it("should be unavailable when no other player on tile", () => {
    let board = b1;
    let actions:AvailableAction[] = getValidActions(board)[0];
    expect(actions.find(ac => ac.type === ActionType.GiveTreasureCard)).toBeUndefined();
  });

  it("should be unavailable when player has no cards", () => {
    let board = { ...b1, currentPlayer: 2 };
    let actions:AvailableAction[] = getValidActions(board)[2];
    expect(actions.find(ac => ac.type === ActionType.GiveTreasureCard)).toBeUndefined();
  });

  it("should be available when other player on same tile and player has cards", () => {
    let board = { ...b1, currentPlayer: 1 };
    let actions:AvailableAction[] = getValidActions(board)[1];
    expect(actions.find(ac => ac.type === ActionType.GiveTreasureCard)).toBeDefined();
  });

  it("should be have pickCard true", () => {
    let board = { ...b1, currentPlayer: 1 };
    let actions:AvailableAction[] = getValidActions(board)[1];
    expect(actions.find(ac => ac.type === ActionType.GiveTreasureCard).pickCard).toBe(true);
  });

  it("should include id of other player on same tile", () => {
    let board = { ...b1, currentPlayer: 1 };
    let actions:AvailableAction[] = getValidActions(board)[1];
    expect(actions.find(ac => ac.type === ActionType.GiveTreasureCard).players).toEqual([2]);
  });

  it("should include ids of all other player on same tile", () => {
    let board = { ...b1, players: [
      { id: 0, name: "Player 1", role: 5, location: 10, cards: [19, 6] },
      { id: 1, name: "Player 2", role: 2, location: 10, cards: [23, 14] },
      { id: 2, name: "Player 3", role: 1, location: 10, cards: [] }
    ] };
    let actions:AvailableAction[] = getValidActions(board)[0];
    expect(actions.find(ac => ac.type === ActionType.GiveTreasureCard).players).toEqual([1, 2]);
  });

});

describe("getValidActions:CaptureTreasure", () => {

  it("should be available when player has cards and on correct treasure tile", () => {
    let board = { ...b1, players: [
      { id: 0, name: "Player 1", role: 5, location: 10, cards: [10, 11, 12, 13] },
      { id: 1, name: "Player 2", role: 2, location: 19, cards: [23, 14] }
    ]}; 
    let actions:AvailableAction[] = getValidActions(board)[0];
    expect(actions.find(ac => ac.type === ActionType.CaptureTreasure)).toBeDefined();
  });

  it("should be available even when an extra card", () => {
    let board = { ...b1, players: [
      { id: 0, name: "Player 1", role: 5, location: 10, cards: [12, 10, 0, 11, 14] },
      { id: 1, name: "Player 2", role: 2, location: 19, cards: [23, 14] }
    ]}; 
    let actions:AvailableAction[] = getValidActions(board)[0];
    expect(actions.find(ac => ac.type === ActionType.CaptureTreasure)).toBeDefined();
  });

  it("should be available even when an extra special card", () => {
    let board = { ...b1, players: [
      { id: 0, name: "Player 1", role: 5, location: 10, cards: [12, 10, 24, 11, 14] },
      { id: 1, name: "Player 2", role: 2, location: 19, cards: [23, 14] }
    ]}; 
    let actions:AvailableAction[] = getValidActions(board)[0];
    expect(actions.find(ac => ac.type === ActionType.CaptureTreasure)).toBeDefined();
  });

  it("should be unavailable when player not on any treasure tile", () => {
    let board = b1;
    let actions:AvailableAction[] = getValidActions(board)[0];
    expect(actions.find(ac => ac.type === ActionType.CaptureTreasure)).toBeUndefined();
  });

  it("should be unavailable when player on treasure tile but without enough cards", () => {
    let board = { ...b1, players: [
      { id: 0, name: "Player 1", role: 5, location: 18, cards: [19, 6] },
      { id: 1, name: "Player 2", role: 2, location: 19, cards: [23, 14] }
    ]}; 
    let actions:AvailableAction[] = getValidActions(board)[0];
    expect(actions.find(ac => ac.type === ActionType.CaptureTreasure)).toBeUndefined();
  });

  it("should be unavailable when player has cards but not on any treasure tile", () => {
    let board = { ...b1, players: [
      { id: 0, name: "Player 1", role: 5, location: 19, cards: [10, 11, 12, 13] },
      { id: 1, name: "Player 2", role: 2, location: 18, cards: [23, 14] }
    ]}; 
    let actions:AvailableAction[] = getValidActions(board)[0];
    expect(actions.find(ac => ac.type === ActionType.CaptureTreasure)).toBeUndefined();
  });

  it("should be unavailable when player has cards but not on correct treasure tile", () => {
    let board = { ...b1, players: [
      { id: 0, name: "Player 1", role: 5, location: 18, cards: [10, 11, 12, 13] },
      { id: 1, name: "Player 2", role: 2, location: 19, cards: [23, 14] }
    ]}; 
    let actions:AvailableAction[] = getValidActions(board)[0];
    expect(actions.find(ac => ac.type === ActionType.CaptureTreasure)).toBeUndefined();
  });

  it("should be unavailable when the same treasure already captured", () => {
    // treasure 2
    let board:BoardState = { ...b1, players: [
      { id: 0, name: "Player 1", role: 5, location: 10, cards: [10, 11, 12, 13] },
      { id: 1, name: "Player 2", role: 2, location: 19, cards: [23, 14] }
    ], treasuresCaptured: [false, false, true, false]}; 
    let actions:AvailableAction[] = getValidActions(board)[0];
    expect(actions.find(ac => ac.type === ActionType.CaptureTreasure)).toBeUndefined();
  });

  it("should be available when all other treasures captured", () => {
    let board:BoardState = { ...b1, players: [
      { id: 0, name: "Player 1", role: 5, location: 10, cards: [10, 11, 12, 13] },
      { id: 1, name: "Player 2", role: 2, location: 19, cards: [23, 14] }
    ], treasuresCaptured: [true, true, false, true]}; 
    let actions:AvailableAction[] = getValidActions(board)[0];
    expect(actions.find(ac => ac.type === ActionType.CaptureTreasure)).toBeDefined();
  });

});